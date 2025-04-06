import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Validate URL format
function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

async function analyzeUrl(url: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `Analyze this URL for security risks and provide a detailed assessment. Consider:

1. Domain Analysis:
   - Check for typosquatting or URL manipulation
   - Identify if it's a known legitimate domain
   - Look for suspicious subdomains

2. URL Structure:
   - Presence of URL shorteners
   - Unusual character encodings
   - Presence of multiple redirects
   - Use of IP addresses instead of domain names

3. Security Indicators:
   - SSL/TLS usage
   - Presence in known blocklists
   - Common phishing patterns
   - Suspicious URL parameters

4. Risk Assessment:
   - Evaluate overall threat level
   - Identify potential malicious intent
   - Consider common attack patterns

Provide a JSON response with:
{
  "isSafe": boolean,
  "info": "detailed explanation of findings",
  "riskLevel": "low|medium|high",
  "threats": ["list", "of", "specific", "threats"],
  "recommendations": ["list", "of", "security", "recommendations"]
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    const parsedResponse = JSON.parse(text);
    return {
      isSafe: parsedResponse.isSafe ?? false,
      info: parsedResponse.info ?? 'Unable to analyze URL security. Please be cautious.',
      riskLevel: parsedResponse.riskLevel ?? 'high',
      threats: parsedResponse.threats ?? [],
      recommendations: parsedResponse.recommendations ?? []
    };
  } catch (e) {
    console.error('Failed to analyze URL:', e);
    return {
      isSafe: false,
      info: 'Unable to analyze URL security. Please be cautious.',
      riskLevel: 'high',
      threats: ['Unable to complete security analysis'],
      recommendations: ['Exercise caution', 'Verify the URL source', 'Check with the intended website directly']
    };
  }
}

async function unshortenUrl(url: string): Promise<{ url: string; redirectCount: number }> {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
    });

    // Count redirects by comparing final and initial URLs
    const redirectCount = response.redirected ? 1 : 0;

    return {
      url: response.url,
      redirectCount
    };
  } catch (error) {
    console.error('Error unshortening URL:', error);
    return {
      url,
      redirectCount: 0
    };
  }
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    if (!isValidUrl(url)) {
      return NextResponse.json(
        { error: 'Invalid URL format. Please provide a valid HTTP or HTTPS URL.' },
        { status: 400 }
      );
    }

    // First unshorten the URL if it's shortened
    const { url: unshortenedUrl, redirectCount } = await unshortenUrl(url);
    
    // Analyze the unshortened URL
    const analysis = await analyzeUrl(unshortenedUrl);

    // Add redirect information to the analysis
    const finalInfo = redirectCount > 0 
      ? `${analysis.info}\n\nThis URL involves ${redirectCount} redirect(s), which could indicate URL shortening or redirection services.`
      : analysis.info;

    return NextResponse.json({
      originalUrl: url,
      output: unshortenedUrl,
      info: finalInfo,
      isSafe: analysis.isSafe,
      riskLevel: analysis.riskLevel,
      threats: analysis.threats,
      recommendations: analysis.recommendations,
      redirectCount
    });
  } catch (error) {
    console.error('Error processing URL:', error);
    return NextResponse.json(
      { error: 'Failed to process URL. Please try again.' },
      { status: 500 }
    );
  }
} 
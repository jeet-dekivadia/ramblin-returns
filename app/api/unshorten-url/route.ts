import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function analyzeUrl(url: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `Analyze this URL for potential security risks: ${url}
  Consider the following:
  1. Domain reputation and age
  2. Use of URL shorteners or redirects
  3. Suspicious patterns (e.g., misspellings, numbers replacing letters)
  4. SSL certificate status
  5. Known phishing patterns

  Respond in JSON format with:
  {
    "isSafe": boolean,
    "info": "detailed explanation of findings",
    "riskLevel": "low|medium|high"
  }`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('Failed to parse Gemini response:', e);
    return {
      isSafe: false,
      info: 'Unable to analyze URL security. Please be cautious.',
      riskLevel: 'high'
    };
  }
}

async function unshortenUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow'
    });
    return response.url;
  } catch (error) {
    console.error('Error unshortening URL:', error);
    return url;
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

    // First unshorten the URL if it's shortened
    const unshortenedUrl = await unshortenUrl(url);
    
    // Analyze the unshortened URL
    const analysis = await analyzeUrl(unshortenedUrl);

    return NextResponse.json({
      originalUrl: url,
      output: unshortenedUrl,
      info: analysis.info,
      isSafe: analysis.isSafe,
      riskLevel: analysis.riskLevel
    });
  } catch (error) {
    console.error('Error processing URL:', error);
    return NextResponse.json(
      { error: 'Failed to process URL' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getUnshortened(url: string): Promise<string> {
  try {
    // Add user agent to avoid being blocked
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      redirect: 'follow'
    });
    
    // Get the final URL after all redirects
    const finalUrl = response.url;
    
    // If the URL hasn't changed, return it as is
    if (finalUrl === url) {
      return url;
    }
    
    return finalUrl;
  } catch (error) {
    console.error('Error unshortening URL:', error);
    return url; // Return original URL if unshortening fails
  }
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key is not configured' }, { status: 500 });
    }

    const { url } = await req.json();
    
    if (!url) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }

    // Get the unshortened URL
    const unshortenedUrl = await getUnshortened(url);

    // Analyze the URL using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        {
          role: "system",
          content: `You are a URL security analyzer. Analyze the given URL for potential security risks.
Consider:
- Domain reputation and age
- Presence of suspicious patterns (e.g., typosquatting)
- SSL/HTTPS usage
- Similarity to known legitimate domains
- Presence of suspicious URL patterns

Provide:
1. A security score (1-100)
2. Three specific reasons for the score
Format response as JSON with fields: score (number), reasons (array of 3 strings)`
        },
        {
          role: "user",
          content: `Analyze this URL for security: ${unshortenedUrl}`
        }
      ],
      temperature: 0.3,
      max_tokens: 250,
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(completion.choices[0]?.message?.content || '{"score": 0, "reasons": ["Analysis failed"]}');

    return NextResponse.json({
      originalUrl: url,
      unshortenedUrl,
      score: analysis.score,
      reasons: analysis.reasons
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      error: 'Failed to analyze URL',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 
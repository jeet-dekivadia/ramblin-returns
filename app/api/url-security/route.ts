import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getUnshortened(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
    });
    return response.url;
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

    // Analyze URL using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        {
          role: "system",
          content: "You are a URL security analyst. Analyze the given URL and provide a security assessment with a confidence score (1-100) and top 3 reasons for the score. Format your response as JSON with the following structure: { confidenceScore: number, reasons: string[] }"
        },
        {
          role: "user",
          content: `Analyze this URL for security: ${unshortenedUrl}`
        }
      ],
      temperature: 0.3,
      max_tokens: 250
    });

    const analysis = JSON.parse(completion.choices[0]?.message?.content || '{"confidenceScore": 0, "reasons": ["Analysis failed"]}');

    return NextResponse.json({
      originalUrl: url,
      unshortenedUrl,
      confidenceScore: analysis.confidenceScore,
      reasons: analysis.reasons
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to analyze URL' }, { status: 500 });
  }
} 
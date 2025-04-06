import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { merchants } = await req.json();
    
    if (!merchants || !Array.isArray(merchants)) {
      return NextResponse.json(
        { error: 'Invalid merchants data' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a financial advisor. For each company provided, give a brief analysis of their stock performance, market position, and investment potential. Format the response as a JSON array of objects with company name, analysis, and recommendation (buy/hold/sell)."
        },
        {
          role: "user",
          content: JSON.stringify(merchants)
        }
      ],
      temperature: 0.5,
      max_tokens: 1000,
    });

    const recommendations = JSON.parse(completion.choices[0].message.content || '[]');

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Error generating investment recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to generate investment recommendations' },
      { status: 500 }
    );
  }
} 
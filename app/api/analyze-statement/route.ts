import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    
    if (!text) {
      return NextResponse.json(
        { error: 'No text provided' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a financial analyst. Analyze the bank statement and provide insights about spending patterns, recurring expenses, and potential areas for savings. Also identify merchants that might be publicly traded companies."
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const analysis = completion.choices[0].message.content;

    // Extract merchants for investment recommendations
    const merchantCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Extract a list of merchants from the bank statement that are likely to be publicly traded companies. Return only the company names in a JSON array."
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const merchants = JSON.parse(merchantCompletion.choices[0].message.content || '[]');

    return NextResponse.json({
      analysis,
      merchants
    });
  } catch (error) {
    console.error('Error analyzing bank statement:', error);
    return NextResponse.json(
      { error: 'Failed to analyze bank statement' },
      { status: 500 }
    );
  }
} 
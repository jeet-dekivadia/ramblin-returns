import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'No valid text provided' },
        { status: 400 }
      );
    }

    // First, analyze the statement structure
    const structureCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a financial data analyst. First, determine if the provided text appears to be a valid bank statement. Look for typical bank statement elements like transaction dates, amounts, balances, etc. Respond with a JSON object containing { isValid: boolean, reason: string }"
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const structureCheck = JSON.parse(structureCompletion.choices[0].message.content || '{"isValid": false, "reason": "Could not analyze text"}');
    
    if (!structureCheck.isValid) {
      return NextResponse.json(
        { error: `Invalid bank statement: ${structureCheck.reason}` },
        { status: 400 }
      );
    }

    // Analyze spending patterns and categories
    const analysisCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a financial analyst. Analyze the bank statement and provide a structured analysis in JSON format with the following structure:
          {
            "spendingByCategory": [{ "category": string, "amount": number }],
            "monthlySpending": [{ "month": string, "amount": number }],
            "topMerchants": [{ "merchant": string, "amount": number }],
            "insights": string,
            "savingsSuggestions": string[]
          }`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const analysis = JSON.parse(analysisCompletion.choices[0].message.content || '{}');

    // Extract merchants for investment recommendations
    const merchantCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Extract a list of merchants from the bank statement that are likely to be publicly traded companies. Return a JSON array of company names."
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
      { error: error instanceof Error ? error.message : 'Failed to analyze bank statement' },
      { status: 500 }
    );
  }
} 
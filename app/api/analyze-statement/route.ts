import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is not configured');
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    const { text } = await req.json();
    console.log('Received text length:', text?.length || 0);
    
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      console.error('Invalid or empty text provided');
      return NextResponse.json(
        { error: 'No valid text provided' },
        { status: 400 }
      );
    }

    // First, analyze the statement structure
    try {
      const structureCompletion = await openai.chat.completions.create({
        model: "gpt-4o-mini-2024-07-18",
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

      console.log('Structure check response:', structureCompletion.choices[0]?.message?.content);
      const structureCheck = JSON.parse(structureCompletion.choices[0]?.message?.content || '{"isValid": false, "reason": "Could not analyze text"}');
      
      if (!structureCheck.isValid) {
        console.error('Invalid bank statement structure:', structureCheck.reason);
        return NextResponse.json(
          { error: `Invalid bank statement: ${structureCheck.reason}` },
          { status: 400 }
        );
      }

      // Analyze spending patterns and categories
      const analysisCompletion = await openai.chat.completions.create({
        model: "gpt-4o-mini-2024-07-18",
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

      console.log('Analysis response:', analysisCompletion.choices[0]?.message?.content);
      const analysis = JSON.parse(analysisCompletion.choices[0]?.message?.content || '{}');

      // Extract merchants for investment recommendations
      const merchantCompletion = await openai.chat.completions.create({
        model: "gpt-4o-mini-2024-07-18",
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

      console.log('Merchant extraction response:', merchantCompletion.choices[0]?.message?.content);
      const merchants = JSON.parse(merchantCompletion.choices[0]?.message?.content || '[]');

      return NextResponse.json({
        analysis,
        merchants
      });
    } catch (apiError) {
      console.error('OpenAI API error:', apiError);
      return NextResponse.json(
        { error: 'Error communicating with OpenAI API: ' + (apiError instanceof Error ? apiError.message : 'Unknown error') },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error analyzing bank statement:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze bank statement: ' + (error instanceof Error ? error.message : 'Unknown error'),
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 
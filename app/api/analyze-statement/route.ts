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
            content: "You are a financial data analyst. First, determine if the provided text appears to be a valid bank statement. Return a JSON object (without markdown formatting or code blocks) containing { isValid: boolean, reason: string }"
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
        response_format: { type: "json_object" }
      });

      const structureResponse = structureCompletion.choices[0]?.message?.content;
      if (!structureResponse) {
        throw new Error('Empty response from OpenAI');
      }

      const structureCheck = JSON.parse(structureResponse);
      
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
            content: `You are a financial analyst. Analyze the bank statement and provide a JSON object (without markdown formatting or code blocks) with the following structure:
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
        response_format: { type: "json_object" }
      });

      const analysisResponse = analysisCompletion.choices[0]?.message?.content;
      if (!analysisResponse) {
        throw new Error('Empty response from OpenAI');
      }

      const analysis = JSON.parse(analysisResponse);

      // Extract merchants for investment recommendations
      const merchantCompletion = await openai.chat.completions.create({
        model: "gpt-4o-mini-2024-07-18",
        messages: [
          {
            role: "system",
            content: "Extract a list of merchants from the bank statement that are likely to be publicly traded companies. Return a JSON array (without markdown formatting or code blocks) of company names."
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
        response_format: { type: "json_object" }
      });

      const merchantResponse = merchantCompletion.choices[0]?.message?.content;
      if (!merchantResponse) {
        throw new Error('Empty response from OpenAI');
      }

      const merchants = JSON.parse(merchantResponse);

      return NextResponse.json({
        analysis,
        merchants: Array.isArray(merchants) ? merchants : merchants.companies || []
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
      { error: 'Failed to analyze bank statement: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to clean OpenAI response and parse JSON
function parseOpenAIResponse(response: string | null | undefined): any {
  if (!response) {
    throw new Error('Empty response from OpenAI');
  }

  // Remove markdown code blocks if present
  let cleanResponse = response.replace(/```json\n?|\n?```/g, '');
  
  // Remove any leading/trailing whitespace
  cleanResponse = cleanResponse.trim();
  
  try {
    return JSON.parse(cleanResponse);
  } catch (error) {
    console.error('Failed to parse response:', cleanResponse);
    throw new Error('Invalid JSON response from OpenAI');
  }
}

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
            content: "You are a financial data analyst. First, determine if the provided text appears to be a valid bank statement. Return a JSON object containing { isValid: boolean, reason: string }"
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      });

      const structureCheck = parseOpenAIResponse(structureCompletion.choices[0]?.message?.content);
      
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
            content: `You are a financial analyst. Analyze the bank statement and provide a detailed analysis with the following data points:
            1. Spending by category (with specific amounts)
            2. Monthly spending trends
            3. Top merchants by transaction volume
            4. Detailed transaction patterns
            5. Weekly spending averages
            6. Income vs expenses
            7. Recurring payments
            
            Return the analysis as a JSON object with this structure:
            {
              "spendingByCategory": [{ "category": string, "amount": number }],
              "monthlySpending": [{ "month": string, "amount": number }],
              "weeklyAverages": [{ "week": string, "amount": number }],
              "topMerchants": [{ "merchant": string, "amount": number, "frequency": number }],
              "recurringPayments": [{ "merchant": string, "amount": number, "frequency": string }],
              "incomeVsExpenses": { "totalIncome": number, "totalExpenses": number, "savings": number },
              "transactionPatterns": [{ "pattern": string, "frequency": number }],
              "insights": string[],
              "savingsSuggestions": string[]
            }`
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      });

      const analysis = parseOpenAIResponse(analysisCompletion.choices[0]?.message?.content);

      // Extract merchants for investment recommendations
      const merchantCompletion = await openai.chat.completions.create({
        model: "gpt-4o-mini-2024-07-18",
        messages: [
          {
            role: "system",
            content: "Extract a list of merchants from the bank statement that are likely to be publicly traded companies. Return a JSON object with format: { \"companies\": string[] }"
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      });

      const merchantData = parseOpenAIResponse(merchantCompletion.choices[0]?.message?.content);
      const merchants = Array.isArray(merchantData) ? merchantData : merchantData.companies || [];

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
      { error: 'Failed to analyze bank statement: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
} 
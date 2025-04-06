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
    // Try to parse as JSON first
    return JSON.parse(cleanResponse);
  } catch (error) {
    console.error('Failed to parse response:', cleanResponse);
    // If JSON parsing fails, try to extract JSON from the text
    const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.error('Failed to parse extracted JSON:', e);
      }
    }
    // If all parsing attempts fail, return a default structure
    return {
      isValid: false,
      reason: "Could not parse the analysis results"
    };
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
            content: "You are a financial data analyst. First, determine if the provided text appears to be a valid bank statement. Return ONLY a JSON object with this exact format, nothing else: { \"isValid\": boolean, \"reason\": string }"
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
            content: `You are a financial analyst. Analyze the bank statement and provide a detailed analysis. Return ONLY a JSON object with this exact format, nothing else:
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
        max_tokens: 1500,
        response_format: { type: "json_object" }
      });

      const analysis = parseOpenAIResponse(analysisCompletion.choices[0]?.message?.content);

      // Extract merchants for investment recommendations
      const merchantCompletion = await openai.chat.completions.create({
        model: "gpt-4o-mini-2024-07-18",
        messages: [
          {
            role: "system",
            content: "Extract a list of merchants from the bank statement that are likely to be publicly traded companies. Return ONLY a JSON object with this exact format, nothing else: { \"companies\": string[] }"
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

      const merchantData = parseOpenAIResponse(merchantCompletion.choices[0]?.message?.content);
      const merchants = Array.isArray(merchantData) ? merchantData : merchantData.companies || [];

      return NextResponse.json({
        analysis,
        merchants
      });
    } catch (apiError) {
      console.error('OpenAI API error:', apiError);
      return NextResponse.json(
        { error: 'Error analyzing bank statement: ' + (apiError instanceof Error ? apiError.message : 'Unknown error') },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in bank statement analysis:', error);
    return NextResponse.json(
      { error: 'Failed to process bank statement: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
} 
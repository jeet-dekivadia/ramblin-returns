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
    throw new Error('Could not parse the analysis results');
  }
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is not configured');
      return new Response('OpenAI API key is not configured', { status: 500 });
    }

    const { text } = await req.json();
    
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      console.error('Invalid or empty text provided');
      return new Response('No valid text provided', { status: 400 });
    }

    try {
      // Single API call for both validation and analysis
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini-2024-07-18",
        messages: [
          {
            role: "system",
            content: `You are a financial data analyst. Analyze the provided text and return a JSON object with this exact format:
            {
              "isValid": boolean,
              "reason": string,
              "analysis": {
                "spendingByCategory": [{ "category": string, "amount": number }],
                "monthlySpending": [{ "month": string, "amount": number }],
                "weeklyAverages": [{ "week": string, "amount": number }],
                "topMerchants": [{ "merchant": string, "amount": number, "frequency": number }],
                "recurringPayments": [{ "merchant": string, "amount": number, "frequency": string }],
                "incomeVsExpenses": { "totalIncome": number, "totalExpenses": number, "savings": number },
                "insights": string[],
                "savingsSuggestions": string[]
              },
              "companies": string[]
            }

            If the text is not a valid bank statement, set isValid to false with an appropriate reason and leave other fields empty.
            If it is valid, set isValid to true, provide the analysis, and include publicly traded companies from the merchants in the companies array.`
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.5,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      });

      const result = parseOpenAIResponse(completion.choices[0]?.message?.content);
      
      if (!result.isValid) {
        console.error('Invalid bank statement structure:', result.reason);
        return new Response(`Invalid bank statement: ${result.reason}`, { status: 400 });
      }

      return NextResponse.json({
        analysis: result.analysis,
        merchants: result.companies
      });
    } catch (apiError) {
      console.error('OpenAI API error:', apiError);
      return new Response(
        'Error analyzing bank statement: ' + (apiError instanceof Error ? apiError.message : 'Unknown error'),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in bank statement analysis:', error);
    return new Response(
      'Failed to process bank statement: ' + (error instanceof Error ? error.message : 'Unknown error'),
      { status: 500 }
    );
  }
} 
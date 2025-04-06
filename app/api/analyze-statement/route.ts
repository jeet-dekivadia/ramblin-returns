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
    throw new Error('Could not parse the analysis results');
  }
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return new Response('OpenAI API key is not configured', { status: 500 });
    }

    const { text } = await req.json();
    
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return new Response('No valid text provided', { status: 400 });
    }

    try {
      // Simplified analysis with reduced fields
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini-2024-07-18",
        messages: [
          {
            role: "system",
            content: `Analyze this bank statement and return a JSON object with this exact format:
            {
              "spendingByCategory": [{ "category": string, "amount": number }],
              "monthlySpending": [{ "month": string, "amount": number }],
              "topMerchants": [{ "merchant": string, "amount": number }],
              "incomeVsExpenses": { "totalIncome": number, "totalExpenses": number },
              "insights": string[]
            }`
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.3,
        max_tokens: 800,
        response_format: { type: "json_object" }
      });

      const analysis = parseOpenAIResponse(completion.choices[0]?.message?.content);

      // Extract potential investment companies from top merchants
      const companies = analysis.topMerchants
        .filter(m => m.amount > 100) // Only consider significant transactions
        .map(m => m.merchant)
        .slice(0, 5); // Limit to top 5 merchants

      return NextResponse.json({
        analysis: {
          ...analysis,
          savingsSuggestions: [], // Add empty array for frontend compatibility
          weeklyAverages: [], // Add empty array for frontend compatibility
          recurringPayments: [] // Add empty array for frontend compatibility
        },
        merchants: companies
      });
    } catch (apiError) {
      console.error('OpenAI API error:', apiError);
      return new Response(
        'Error analyzing statement: ' + (apiError instanceof Error ? apiError.message : 'Unknown error'),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      'Failed to process request: ' + (error instanceof Error ? error.message : 'Unknown error'),
      { status: 500 }
    );
  }
} 
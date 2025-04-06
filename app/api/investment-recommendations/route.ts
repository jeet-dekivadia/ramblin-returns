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
    throw new Error('Could not parse the recommendations');
  }
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return new Response('OpenAI API key is not configured', { status: 500 });
    }

    const { merchants } = await req.json();
    
    if (!merchants || !Array.isArray(merchants) || merchants.length === 0) {
      return new Response('No valid merchants provided', { status: 400 });
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini-2024-07-18",
        messages: [
          {
            role: "system",
            content: `Analyze these companies and return a JSON array with this exact format:
            [
              {
                "company": string,
                "analysis": string,
                "recommendation": "buy" | "hold" | "sell"
              }
            ]
            Keep each analysis brief (max 2 sentences) and focus on key business metrics.`
          },
          {
            role: "user",
            content: JSON.stringify(merchants)
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
        response_format: { type: "json_object" }
      });

      const recommendations = parseOpenAIResponse(completion.choices[0]?.message?.content);

      if (!Array.isArray(recommendations)) {
        throw new Error('Invalid recommendations format');
      }

      return NextResponse.json({ recommendations });
    } catch (apiError) {
      console.error('OpenAI API error:', apiError);
      return new Response(
        'Error generating recommendations: ' + (apiError instanceof Error ? apiError.message : 'Unknown error'),
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
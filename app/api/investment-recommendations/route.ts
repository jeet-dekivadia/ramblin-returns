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

    // Take only the first merchant to minimize processing
    const mainMerchant = merchants[0];

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini-2024-07-18",
        messages: [
          {
            role: "system",
            content: "You are a financial advisor. Provide a one-sentence investment insight."
          },
          {
            role: "user",
            content: `Quick investment insight for ${mainMerchant}:`
          }
        ],
        temperature: 0.3,
        max_tokens: 100
      });

      const content = completion.choices[0]?.message?.content || 'No insights available.';

      return new Response(content, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    } catch (apiError) {
      console.error('OpenAI API error:', apiError);
      return new Response('Brief analysis unavailable at the moment', { status: 500 });
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response('Unable to process request', { status: 500 });
  }
} 
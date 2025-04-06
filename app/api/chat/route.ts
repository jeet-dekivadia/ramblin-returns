import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to clean OpenAI response
function cleanResponse(response: string | null | undefined): string {
  if (!response) {
    throw new Error('Empty response from OpenAI');
  }

  // Remove any markdown code blocks
  let cleanedResponse = response.replace(/```(?:json)?\n?([\s\S]*?)\n?```/g, '$1');
  
  // Remove any leading/trailing whitespace
  cleanedResponse = cleanedResponse.trim();
  
  return cleanedResponse;
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is not configured');
      return new Response('OpenAI API key is not configured', { status: 500 });
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid messages format', { status: 400 });
    }

    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: "gpt-4o-mini-2024-07-18",
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      });
    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError);
      return new Response(
        'OpenAI API error: ' + (openaiError instanceof Error ? openaiError.message : 'Unknown error'),
        { status: 500 }
      );
    }

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      return new Response('Empty response from OpenAI', { status: 500 });
    }

    // Return the raw response content
    return new Response(responseContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response(
      'Failed to process request: ' + (error instanceof Error ? error.message : 'Unknown error'),
      { status: 500 }
    );
  }
} 
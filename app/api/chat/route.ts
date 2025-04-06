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
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
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
      // Ensure we return a properly formatted JSON response even for errors
      return NextResponse.json(
        { error: 'OpenAI API error: ' + (openaiError instanceof Error ? openaiError.message : 'Unknown error') },
        { status: 500 }
      );
    }

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      return NextResponse.json(
        { error: 'Empty response from OpenAI' },
        { status: 500 }
      );
    }

    try {
      const cleanedContent = cleanResponse(responseContent);
      
      // Always return a properly formatted JSON response
      return NextResponse.json({
        content: cleanedContent
      });
    } catch (error) {
      console.error('Error processing response:', error);
      return NextResponse.json(
        { error: 'Failed to process response: ' + (error instanceof Error ? error.message : 'Unknown error') },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in chat API:', error);
    // Ensure we return a properly formatted JSON response for any unhandled errors
    return NextResponse.json(
      { error: 'Failed to process request: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
} 
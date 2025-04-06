import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    
    if (!url) {
      return NextResponse.json(
        { error: 'No URL provided' },
        { status: 400 }
      );
    }

    let output = "";
    let info = "";

    try {
      const response = await fetch(url, {
        method: 'HEAD',
        redirect: 'follow'
      });
      output = response.url;
    } catch (err) {
      console.error(err);
      return NextResponse.json(
        { error: "Error occurred while fetching the URL." },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Tell me info about this link: ${output}`;

    const result = await model.generateContent({ prompt });
    info = result.response.text() || "No information available.";

    return NextResponse.json({
      message: 'Your destination link is:',
      output,
      info
    });
  } catch (error) {
    console.error('Error unshortening URL:', error);
    return NextResponse.json(
      { error: 'Failed to unshorten URL' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    
    if (!text) {
      return NextResponse.json(
        { error: 'No text provided' },
        { status: 400 }
      );
    }

    // First, analyze the statement structure
    const structureCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a financial data analyst. Extract and structure the following bank statement data into categories: transactions, recurring payments, income, and spending by category. Return the data in a structured format."
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const structuredData = JSON.parse(structureCompletion.choices[0].message.content || '{}');

    // Then, analyze the merchants for investment opportunities
    const merchantCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Extract a list of merchants from the bank statement that are likely to be publicly traded companies. Return only the company names in a JSON array."
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const merchants = JSON.parse(merchantCompletion.choices[0].message.content || '[]');

    // Format the data for visualization
    const spendingByCategory = Object.entries(structuredData.spending || {}).map(([category, amount]) => ({
      category,
      amount: Number(amount)
    }));

    const monthlySpending = structuredData.monthlySpending || [];
    const topMerchants = structuredData.topMerchants || [];

    return NextResponse.json({
      analysis: {
        spendingByCategory,
        monthlySpending,
        topMerchants
      },
      merchants,
      summary: structuredData.summary || 'Analysis completed successfully.'
    });
  } catch (error) {
    console.error('Error analyzing bank statement:', error);
    return NextResponse.json(
      { error: 'Failed to analyze bank statement. Please ensure the PDF is readable and try again.' },
      { status: 500 }
    );
  }
} 
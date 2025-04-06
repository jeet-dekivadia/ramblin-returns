import { NextResponse } from 'next/server';
import PDFParser from 'pdf2json';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'Please upload a PDF file' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const text = await new Promise((resolve, reject) => {
      const pdfParser = new PDFParser(null, 1);
      let extractedText = '';

      pdfParser.on('pdfParser_dataReady', (pdfData) => {
        try {
          pdfData.Pages.forEach((page) => {
            page.Texts.forEach((textObj) => {
              extractedText += decodeURIComponent(textObj.R[0].T) + ' ';
            });
            extractedText += '\n';
          });
          resolve(extractedText.trim());
        } catch (error) {
          reject(new Error('Failed to parse PDF content'));
        }
      });

      pdfParser.on('pdfParser_dataError', (error) => {
        reject(new Error('Failed to parse PDF file'));
      });

      try {
        pdfParser.parseBuffer(buffer);
      } catch (error) {
        reject(new Error('Failed to read PDF file'));
      }
    });

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Could not extract text from PDF' },
        { status: 400 }
      );
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error('Error extracting PDF:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to extract text from PDF' },
      { status: 500 }
    );
  }
} 
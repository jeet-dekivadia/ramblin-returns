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

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
      const pdfParser = new PDFParser();
      let text = '';

      pdfParser.on('pdfParser_dataReady', (pdfData) => {
        try {
          // Extract text from all pages
          pdfData.Pages.forEach((page) => {
            page.Texts.forEach((textObj) => {
              text += decodeURIComponent(textObj.R[0].T) + ' ';
            });
          });
          resolve(NextResponse.json({ text: text.trim() }));
        } catch (error) {
          reject(error);
        }
      });

      pdfParser.on('pdfParser_dataError', (error) => {
        reject(error);
      });

      // Parse the PDF buffer
      pdfParser.parseBuffer(buffer);
    });
  } catch (error) {
    console.error('Error extracting PDF:', error);
    return NextResponse.json(
      { error: 'Failed to extract text from PDF' },
      { status: 500 }
    );
  }
} 
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const extractTextFromPDF = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/extract-pdf', {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Failed to extract text from PDF');
  }
  
  const data = await response.json();
  return data.text;
};

export const analyzeBankStatement = async (text: string) => {
  const response = await fetch('/api/analyze-statement', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to analyze bank statement');
  }
  
  const data = await response.json();
  
  if (!data.analysis || typeof data.analysis !== 'object') {
    throw new Error('Invalid analysis response from server');
  }

  return data;
};

export const getInvestmentRecommendations = async (merchants: string[]) => {
  const response = await fetch('/api/investment-recommendations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ merchants }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to get investment recommendations');
  }
  
  return response.json();
};

export const unshortenUrl = async (url: string) => {
  const response = await fetch('/api/unshorten-url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to unshorten URL');
  }
  
  return response.json();
};

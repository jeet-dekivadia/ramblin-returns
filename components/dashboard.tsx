"use client";

import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Chatbot } from './chatbot';
import { extractTextFromPDF, analyzeBankStatement, getInvestmentRecommendations } from '@/lib/utils';

type Analysis = {
  spendingByCategory: { category: string; amount: number }[];
  monthlySpending: { month: string; amount: number }[];
  topMerchants: { merchant: string; amount: number }[];
};

type InvestmentRecommendation = {
  company: string;
  analysis: string;
  recommendation: 'buy' | 'hold' | 'sell';
};

export function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [recommendations, setRecommendations] = useState<InvestmentRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsLoading(true);
    setError(null);

    try {
      const text = await extractTextFromPDF(selectedFile);
      const { analysis: statementAnalysis, merchants } = await analyzeBankStatement(text);
      setAnalysis(statementAnalysis);

      if (merchants.length > 0) {
        const investmentRecs = await getInvestmentRecommendations(merchants);
        setRecommendations(investmentRecs.recommendations);
      }
    } catch (err) {
      setError('Failed to analyze bank statement. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Bank Statement Analysis</h1>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Upload Bank Statement
          </label>
          {file && <span className="text-gray-600">{file.name}</span>}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : analysis ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Tabs defaultValue="spending">
              <TabsList>
                <TabsTrigger value="spending">Spending Analysis</TabsTrigger>
                <TabsTrigger value="investments">Investment Opportunities</TabsTrigger>
              </TabsList>
              <TabsContent value="spending">
                <Card>
                  <CardHeader>
                    <CardTitle>Spending by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analysis.spendingByCategory}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="category" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="amount" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="investments">
                <Card>
                  <CardHeader>
                    <CardTitle>Investment Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recommendations.map((rec, index) => (
                        <Card key={index}>
                          <CardHeader>
                            <CardTitle>{rec.company}</CardTitle>
                            <CardDescription>
                              Recommendation: {rec.recommendation.toUpperCase()}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p>{rec.analysis}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          <div>
            <Chatbot context="You are a financial analyst assistant. Help the user understand their bank statement analysis and provide insights about their spending patterns and potential investment opportunities." />
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500">
          <p>Upload your bank statement to get started with the analysis.</p>
        </div>
      )}

      <Chatbot isFloating />
    </div>
  );
} 
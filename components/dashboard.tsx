"use client";

import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Chatbot } from './chatbot';
import { extractTextFromPDF, analyzeBankStatement, getInvestmentRecommendations } from '@/lib/utils';

// Custom colors for charts
const COLORS = ['#FFB547', '#FF7847', '#FF478B', '#8B47FF', '#478BFF', '#47FFB5'];

type Analysis = {
  spendingByCategory: { category: string; amount: number }[];
  monthlySpending: { month: string; amount: number }[];
  weeklyAverages: { week: string; amount: number }[];
  topMerchants: { merchant: string; amount: number; frequency: number }[];
  recurringPayments: { merchant: string; amount: number; frequency: string }[];
  incomeVsExpenses: { totalIncome: number; totalExpenses: number; savings: number };
  transactionPatterns: { pattern: string; frequency: number }[];
  insights: string[];
  savingsSuggestions: string[];
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
        try {
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

          const recommendationsText = await response.text();
          setRecommendations([{
            company: 'Investment Insights',
            analysis: recommendationsText,
            recommendation: 'info'
          }]);
        } catch (recError) {
          console.error('Error getting recommendations:', recError);
          setError('Failed to get investment recommendations');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze bank statement. Please try again.');
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
            <Tabs defaultValue="overview">
              <TabsList className="grid grid-cols-3 gap-4 mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="spending">Spending Analysis</TabsTrigger>
                <TabsTrigger value="investments">Investment Opportunities</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Income vs Expenses Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Income vs Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Income', value: analysis.incomeVsExpenses.totalIncome },
                                { name: 'Expenses', value: analysis.incomeVsExpenses.totalExpenses },
                                { name: 'Savings', value: analysis.incomeVsExpenses.savings }
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {COLORS.map((color, index) => (
                                <Cell key={`cell-${index}`} fill={color} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Monthly Trend Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Monthly Spending Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={analysis.monthlySpending}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="amount" stroke="#8884d8" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Weekly Averages Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Weekly Spending</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={analysis.weeklyAverages}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="week" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="amount" stroke="#82ca9d" fill="#82ca9d" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top Merchants Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Merchants</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={analysis.topMerchants.slice(0, 5)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="merchant" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="amount" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="spending">
                <div className="grid grid-cols-1 gap-4">
                  {/* Category Breakdown */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Spending by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={analysis.spendingByCategory}
                              cx="50%"
                              cy="50%"
                              outerRadius={120}
                              dataKey="amount"
                              nameKey="category"
                              label
                            >
                              {analysis.spendingByCategory.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recurring Payments */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recurring Payments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analysis.recurringPayments.map((payment, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                            <div>
                              <p className="font-medium">{payment.merchant}</p>
                              <p className="text-sm text-gray-500">{payment.frequency}</p>
                            </div>
                            <p className="font-bold">${payment.amount.toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Insights and Suggestions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Spending Insights</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-4 space-y-2">
                          {analysis.insights.map((insight, index) => (
                            <li key={index}>{insight}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Savings Suggestions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-4 space-y-2">
                          {analysis.savingsSuggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="investments">
                <Card>
                  <CardHeader>
                    <CardTitle>Investment Recommendations</CardTitle>
                    <CardDescription>Based on your spending patterns</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recommendations.map((rec, index) => (
                        <Card key={index}>
                          <CardHeader>
                            <CardTitle>{rec.company}</CardTitle>
                            <CardDescription>
                              Recommendation: <span className={`font-bold ${
                                rec.recommendation === 'buy' ? 'text-green-500' :
                                rec.recommendation === 'sell' ? 'text-red-500' :
                                'text-yellow-500'
                              }`}>
                                {rec.recommendation.toUpperCase()}
                              </span>
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
            <Chatbot 
              context="You are a financial analyst assistant. Help the user understand their bank statement analysis and provide insights about their spending patterns and potential investment opportunities." 
              analysis={analysis}
            />
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500">
          <p>Upload your bank statement to get started with the analysis.</p>
        </div>
      )}

      <Chatbot isFloating analysis={analysis} />
    </div>
  );
} 
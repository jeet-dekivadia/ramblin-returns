"use client";

import { useState, useEffect } from 'react';
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
  incomeVsExpenses: { totalIncome: number; totalExpenses: number; savings: number };
  topMerchants: { merchant: string; amount: number }[];
  recurringPayments: { merchant: string; amount: number; frequency: string }[];
  insights: string[];
  savingsSuggestions: string[];
};

export function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [shouldAutoProcess, setShouldAutoProcess] = useState(false);

  // Listen for file-processed event from HeroSection component
  useEffect(() => {
    const dashboardElement = document.getElementById('dashboard');
    
    if (dashboardElement) {
      const handleFileProcessed = (event: Event) => {
        const customEvent = event as CustomEvent;
        // Create a simulated analysis without actual file
        setIsLoading(true);
        setShouldAutoProcess(true);
        
        setTimeout(() => {
          const simulatedAnalysis = generateSimulatedAnalysis();
          setAnalysis(simulatedAnalysis);
          setIsLoading(false);
          
          // Also get investment recommendations
          setIsLoadingRecommendations(true);
          setTimeout(() => {
            setRecommendations(
              "Based on your spending patterns, we recommend investing in companies that match your consumer behavior: 35% in Starbucks (SBUX), 25% in Amazon (AMZN), 20% in Apple (AAPL), and 20% in diversified ETFs like VOO."
            );
            setIsLoadingRecommendations(false);
          }, 2000);
        }, 2000);
      };
      
      // Listen for the custom event
      dashboardElement.addEventListener('file-processed', handleFileProcessed);
      
      // Cleanup function
      return () => {
        dashboardElement.removeEventListener('file-processed', handleFileProcessed);
      };
    }
  }, []);

  // Function to generate simulated analysis data for demo purposes
  const generateSimulatedAnalysis = (): Analysis => {
    return {
      spendingByCategory: [
        { category: "Food & Dining", amount: 850 },
        { category: "Shopping", amount: 620 },
        { category: "Transportation", amount: 450 },
        { category: "Entertainment", amount: 320 },
        { category: "Utilities", amount: 280 },
        { category: "Other", amount: 150 }
      ],
      monthlySpending: [
        { month: "Jan", amount: 2450 },
        { month: "Feb", amount: 2380 },
        { month: "Mar", amount: 2520 },
        { month: "Apr", amount: 2650 },
        { month: "May", amount: 2400 },
        { month: "Jun", amount: 2480 }
      ],
      weeklyAverages: [
        { week: "Week 1", amount: 620 },
        { week: "Week 2", amount: 580 },
        { week: "Week 3", amount: 640 },
        { week: "Week 4", amount: 610 }
      ],
      incomeVsExpenses: {
        totalIncome: 5000,
        totalExpenses: 2670,
        savings: 2330
      },
      topMerchants: [
        { merchant: "Starbucks", amount: 185 },
        { merchant: "Amazon", amount: 320 },
        { merchant: "Uber", amount: 275 },
        { merchant: "Target", amount: 220 },
        { merchant: "Kroger", amount: 195 }
      ],
      recurringPayments: [
        { merchant: "Netflix", amount: 15.99, frequency: "Monthly" },
        { merchant: "Spotify", amount: 9.99, frequency: "Monthly" },
        { merchant: "Gym Membership", amount: 45, frequency: "Monthly" },
        { merchant: "Rent", amount: 1500, frequency: "Monthly" }
      ],
      insights: [
        "You spent 15% more on coffee this month compared to your average.",
        "Your spending on transportation has decreased by 20% since you started using public transit.",
        "Recurring subscriptions make up 12% of your monthly expenses.",
        "Your savings rate is 46%, which is excellent compared to the average of 20%."
      ],
      savingsSuggestions: [
        "Consider making coffee at home to save approximately $120 per month.",
        "Batch cooking meals could reduce your food expenses by up to $200 monthly.",
        "Review your streaming subscriptions - you have 3 services with overlapping content.",
        "Setting up automatic transfers to your investment account could increase your returns by 8% annually."
      ]
    };
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError(null);
    setAnalysis(null);
    setRecommendations(null);
    setIsLoading(true);

    try {
      // For demo purposes, we'll just simulate the analysis after a delay
      setTimeout(() => {
        const simulatedAnalysis = generateSimulatedAnalysis();
        setAnalysis(simulatedAnalysis);
        setIsLoading(false);
        
        // Also simulate getting investment recommendations
        setIsLoadingRecommendations(true);
        setTimeout(() => {
          setRecommendations(
            "Based on your spending patterns, we recommend investing in companies that match your consumer behavior: 35% in Starbucks (SBUX), 25% in Amazon (AMZN), 20% in Apple (AAPL), and 20% in diversified ETFs like VOO."
          );
          setIsLoadingRecommendations(false);
        }, 2000);
      }, 2000);
      
    } catch (error) {
      setError("Failed to analyze your statement. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div id="dashboard" className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Financial Dashboard</h2>

      {!analysis && !shouldAutoProcess && !isLoading && (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-900 rounded-lg mb-8">
          <h3 className="text-xl font-semibold mb-4">Upload your bank statement to get started</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-lg text-center">
            We'll analyze your spending patterns and provide personalized insights and investment opportunities.
          </p>
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
      )}

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
          <div className="lg:col-span-1">
            <Chatbot />
          </div>
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
                    <CardTitle>Investment Insights</CardTitle>
                    <CardDescription>Based on your spending patterns</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingRecommendations ? (
                      <div className="flex justify-center items-center h-24">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    ) : recommendations ? (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-800">{recommendations}</p>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center">No investment insights available yet.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      ) : null}
    </div>
  );
}
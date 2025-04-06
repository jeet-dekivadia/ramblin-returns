"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Chatbot } from "@/components/chatbot";
import {
  PieChart, Pie, LineChart, Line, AreaChart, Area,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, Cell
} from 'recharts';

// Sample data for visualization
const monthlySpending = [
  { month: 'Jan', amount: 1200 },
  { month: 'Feb', amount: 1500 },
  { month: 'Mar', amount: 1800 },
  { month: 'Apr', amount: 1600 },
  { month: 'May', amount: 2000 },
  { month: 'Jun', amount: 2200 }
];

const spendingByCategory = [
  { name: 'Food & Dining', value: 800 },
  { name: 'Transportation', value: 400 },
  { name: 'Shopping', value: 600 },
  { name: 'Entertainment', value: 300 },
  { name: 'Bills', value: 500 }
];

const weeklySpending = [
  { week: 'Week 1', amount: 400 },
  { week: 'Week 2', amount: 450 },
  { week: 'Week 3', amount: 500 },
  { week: 'Week 4', amount: 550 }
];

const topMerchants = [
  { name: 'Amazon', amount: 300 },
  { name: 'Uber', amount: 200 },
  { name: 'Netflix', amount: 15 },
  { name: 'Spotify', amount: 10 },
  { name: 'Gym', amount: 50 }
];

const investmentRecommendations = [
  {
    merchant: 'Amazon',
    amount: 300,
    stock: 'AMZN',
    currentPrice: 180.50,
    recommendation: 'Buy',
    reason: 'Strong market position and consistent growth'
  },
  {
    merchant: 'Uber',
    amount: 200,
    stock: 'UBER',
    currentPrice: 45.20,
    recommendation: 'Hold',
    reason: 'Stable performance in ride-sharing market'
  }
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

// Analysis data structure
const analysis = {
  monthlySpending,
  spendingByCategory,
  weeklySpending,
  topMerchants,
  insights: [
    'Food & Dining is your largest expense category',
    'You spend more on weekends',
    'Transportation costs have increased by 15%'
  ],
  recurringPayments: [
    { name: 'Netflix', amount: 15 },
    { name: 'Spotify', amount: 10 },
    { name: 'Gym Membership', amount: 50 }
  ]
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Your Financial Dashboard
          </h1>
          <p className="text-gray-400 mt-2">Analyze your spending patterns and discover investment opportunities</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-800 p-1 rounded-lg">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-md"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="spending" 
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-md"
                >
                  Spending Analysis
                </TabsTrigger>
                <TabsTrigger 
                  value="investments" 
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-md"
                >
                  Investment Opportunities
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <motion.div variants={itemVariants}>
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-xl font-semibold text-white">Monthly Spending Trend</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={monthlySpending}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="month" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#1F2937',
                                border: '1px solid #374151',
                                color: '#F3F4F6'
                              }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="amount" 
                              stroke="#3B82F6" 
                              strokeWidth={2}
                              dot={{ fill: '#3B82F6', r: 4 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-xl font-semibold text-white">Spending by Category</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={spendingByCategory}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {spendingByCategory.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#1F2937',
                                border: '1px solid #374151',
                                color: '#F3F4F6'
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-xl font-semibold text-white">Weekly Spending</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <AreaChart data={weeklySpending}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="week" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#1F2937',
                                border: '1px solid #374151',
                                color: '#F3F4F6'
                              }}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="amount" 
                              stroke="#3B82F6" 
                              fill="#3B82F6" 
                              fillOpacity={0.2}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-xl font-semibold text-white">Top Merchants</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={topMerchants}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="name" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#1F2937',
                                border: '1px solid #374151',
                                color: '#F3F4F6'
                              }}
                            />
                            <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              </TabsContent>

              <TabsContent value="spending">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 gap-6"
                >
                  <motion.div variants={itemVariants}>
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-xl font-semibold text-white">Detailed Spending Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white">Recurring Payments</h3>
                            <div className="space-y-2">
                              {analysis.recurringPayments.map((payment, index) => (
                                <div 
                                  key={index}
                                  className="flex justify-between items-center p-3 bg-gray-700 rounded-lg"
                                >
                                  <span className="text-gray-300">{payment.name}</span>
                                  <span className="text-blue-400">${payment.amount}/month</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white">Key Insights</h3>
                            <div className="space-y-2">
                              {analysis.insights.map((insight, index) => (
                                <div 
                                  key={index}
                                  className="p-3 bg-gray-700 rounded-lg text-gray-300"
                                >
                                  {insight}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              </TabsContent>

              <TabsContent value="investments">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 gap-6"
                >
                  <motion.div variants={itemVariants}>
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-xl font-semibold text-white">Investment Recommendations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {investmentRecommendations.map((rec, index) => (
                            <motion.div
                              key={index}
                              variants={itemVariants}
                              className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <h3 className="font-semibold text-white">{rec.merchant}</h3>
                                  <p className="text-sm text-gray-400">Monthly spending: ${rec.amount}</p>
                                </div>
                                <Button 
                                  variant="outline" 
                                  className="bg-blue-500 text-white border-none hover:bg-blue-600"
                                >
                                  Invest ${rec.amount} in {rec.stock}
                                </Button>
                              </div>
                              <div className="mt-2">
                                <p className="text-sm text-gray-300">
                                  {rec.stock} - ${rec.currentPrice} ({rec.recommendation})
                                </p>
                                <p className="text-sm text-gray-400">{rec.reason}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <Chatbot analysis={analysis} />
          </div>
        </div>
      </div>
    </div>
  );
} 
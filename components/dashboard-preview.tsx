"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { ArrowRight, Coffee, ShoppingBag, Car, CreditCard, TrendingUp, Shield, ChevronRight } from "lucide-react"

export function DashboardPreview() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })
  const [activeTab, setActiveTab] = useState("overview")

  // Sample data for the dashboard
  const spendingData = [
    { category: "Coffee", amount: 120, color: "#B3A369" },
    { category: "Shopping", amount: 450, color: "#0033A0" },
    { category: "Transport", amount: 200, color: "#003057" },
    { category: "Food", amount: 350, color: "#10B981" },
    { category: "Entertainment", amount: 180, color: "#8B5CF6" },
  ]

  const monthlyData = [
    { month: "Jan", spending: 1200, investment: 150 },
    { month: "Feb", spending: 1350, investment: 180 },
    { month: "Mar", spending: 1100, investment: 200 },
    { month: "Apr", spending: 1450, investment: 250 },
    { month: "May", spending: 1300, investment: 280 },
    { month: "Jun", spending: 1200, investment: 320 },
  ]

  const investmentOpportunities = [
    {
      company: "Starbucks",
      ticker: "SBUX",
      match: "High",
      potential: "+12.4%",
      logo: <Coffee className="h-8 w-8 text-gt-gold" />,
    },
    {
      company: "Amazon",
      ticker: "AMZN",
      match: "Medium",
      potential: "+8.7%",
      logo: <ShoppingBag className="h-8 w-8 text-gs-blue" />,
    },
    {
      company: "Uber",
      ticker: "UBER",
      match: "High",
      potential: "+15.2%",
      logo: <Car className="h-8 w-8 text-green-500" />,
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section
      id="dashboard"
      ref={ref}
      className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gt-gold to-gs-blue animate-text-shimmer">
            Your Financial Command Center
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Upload your bank statement and get instant access to powerful insights and investment opportunities
          </p>
        </motion.div>

        <motion.div variants={container} initial="hidden" animate={isInView ? "show" : "hidden"} className="relative">
          {/* Dashboard Preview Frame */}
          <motion.div
            variants={item}
            className="relative z-10 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800"
          >
            {/* Dashboard Header */}
            <div className="bg-gradient-to-r from-gt-navy to-gs-blue p-4 text-white flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-2 rounded-full">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold">Ramblin' Returns Dashboard</h3>
                  <p className="text-sm text-white/80">Welcome back, Jeet</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-white/10 px-3 py-1 rounded-full text-sm">Last updated: Today</div>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Refresh
                </Button>
              </div>
            </div>

            {/* Dashboard Tabs */}
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b border-gray-200 dark:border-gray-800">
                <TabsList className="p-0 bg-transparent h-auto">
                  {["overview", "spending", "investments", "security"].map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="capitalize py-4 px-6 border-b-2 border-transparent data-[state=active]:border-gt-gold data-[state=active]:text-gt-gold rounded-none bg-transparent"
                    >
                      {tab}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <div className="p-6">
                <TabsContent value="overview" className="mt-0">
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <Card className="bg-gradient-to-br from-gt-gold/10 to-gt-gold/5">
                      <CardContent className="p-6">
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total Spending</h4>
                        <div className="text-3xl font-bold">$2,450</div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Last 30 days</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-gs-blue/10 to-gs-blue/5">
                      <CardContent className="p-6">
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Investments</h4>
                        <div className="text-3xl font-bold">$380</div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Last 30 days</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5">
                      <CardContent className="p-6">
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Potential Returns</h4>
                        <div className="text-3xl font-bold text-green-500">+$42.50</div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Projected monthly</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardContent className="p-6">
                        <h4 className="font-medium mb-4">Monthly Overview</h4>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="spending" fill="#003057" name="Spending" />
                              <Bar dataKey="investment" fill="#B3A369" name="Investment" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <h4 className="font-medium mb-4">Top Investment Matches</h4>
                        <div className="space-y-4">
                          {investmentOpportunities.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            >
                              <div className="mr-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-full">{item.logo}</div>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <h5 className="font-medium">{item.company}</h5>
                                  <span className="text-green-500 font-medium">{item.potential}</span>
                                </div>
                                <div className="flex justify-between mt-1">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">{item.ticker}</span>
                                  <span
                                    className={`text-sm ${item.match === "High" ? "text-gt-gold" : "text-gs-blue"}`}
                                  >
                                    {item.match} match
                                  </span>
                                </div>
                              </div>
                              <ChevronRight className="h-5 w-5 text-gray-400 ml-2" />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="spending" className="mt-0">
                  <div className="text-center py-12">
                    <TrendingUp className="h-16 w-16 mx-auto text-gt-gold mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Detailed Spending Analysis</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                      Upload your bank statement to see a complete breakdown of your spending habits
                    </p>
                    <Button className="bg-gt-gold hover:bg-gt-gold/90 text-white">Upload Statement</Button>
                  </div>
                </TabsContent>

                <TabsContent value="investments" className="mt-0">
                  <div className="text-center py-12">
                    <CreditCard className="h-16 w-16 mx-auto text-gs-blue mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Smart Investment Recommendations</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                      Connect your accounts to get personalized investment recommendations based on your spending
                    </p>
                    <Button className="bg-gs-blue hover:bg-gs-blue/90 text-white">Connect Accounts</Button>
                  </div>
                </TabsContent>

                <TabsContent value="security" className="mt-0">
                  <div className="text-center py-12">
                    <Shield className="h-16 w-16 mx-auto text-gt-navy mb-4" />
                    <h3 className="text-2xl font-bold mb-2">URL Security Checker</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                      Paste any suspicious URL to check if it's safe before clicking
                    </p>
                    <div className="flex max-w-md mx-auto">
                      <input
                        type="text"
                        placeholder="https://example.com"
                        className="flex-1 px-4 py-2 rounded-l-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-gt-gold dark:bg-gray-800"
                      />
                      <Button className="bg-gt-navy hover:bg-gt-navy/90 text-white rounded-l-none">Check URL</Button>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-gt-gold/10 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gs-blue/10 rounded-full filter blur-3xl"></div>
        </motion.div>

        <div className="text-center mt-12">
          <Button className="bg-gradient-to-r from-gt-gold to-gs-blue hover:from-gt-gold/90 hover:to-gs-blue/90 text-white px-8 py-6 text-lg">
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}


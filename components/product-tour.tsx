"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChartIcon, TrendingUp, Shield, Bot, Coffee, ShoppingBag, Car } from "lucide-react"

export function ProductTour() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })
  const [aiQuestion, setAiQuestion] = useState("")
  const [isAskingAi, setIsAskingAi] = useState(false)
  const [aiResponses, setAiResponses] = useState<string[]>([])
  
  // Sample data for display
  const spendingData = [
    { name: "Coffee", value: 120, color: "#B3A369" },
    { name: "Shopping", value: 450, color: "#0033A0" },
    { name: "Transport", value: 200, color: "#003057" },
    { name: "Food", value: 350, color: "#10B981" },
    { name: "Entertainment", value: 180, color: "#8B5CF6" },
  ]

  const investmentData = [
    { company: "Starbucks", ticker: "SBUX", spend: 120, growth: "+12.4%" },
    { company: "Amazon", ticker: "AMZN", spend: 320, growth: "+8.7%" },
    { company: "Uber", ticker: "UBER", spend: 175, growth: "+15.2%" },
  ]

  const fraudData = [
    { url: "paypa1-secure.net", status: "Risky", safety: 25 },
    { url: "www.amazon.com", status: "Safe", safety: 95 },
    { url: "bit.ly/3xR5tY7", status: "Risky", safety: 30 },
  ]

  const aiTips = [
    "Your coffee spending is 20% higher than last month. Consider using a reusable mug for discounts.",
    "Based on your shopping patterns, investing 10% in AMZN could yield 12% annual returns.",
    "You're spending more on ride-sharing than 80% of users. Consider public transit to save $45/month.",
  ]

  // Scroll to section functionality
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  // Handle AI chat question
  const handleAiQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!aiQuestion.trim()) return;
    
    setIsAskingAi(true);
    
    // Simulate AI response
    setTimeout(() => {
      // Generate a contextual response based on the question
      let response = "";
      
      const lowerQuestion = aiQuestion.toLowerCase();
      if (lowerQuestion.includes("invest") || lowerQuestion.includes("stock") || lowerQuestion.includes("market")) {
        response = "Based on your spending at Starbucks, I recommend considering their stock (SBUX). Their consistent growth and your frequent purchases show you value their products.";
      } else if (lowerQuestion.includes("save") || lowerQuestion.includes("saving") || lowerQuestion.includes("budget")) {
        response = "Looking at your transaction history, reducing food delivery services could save you approximately $85/month, which could be automatically invested in your custom portfolio.";
      } else if (lowerQuestion.includes("scam") || lowerQuestion.includes("phishing") || lowerQuestion.includes("fraud")) {
        response = "Always verify URLs before entering credentials. Our security scan shows you've encountered 3 potential phishing attempts this month, all successfully blocked.";
      } else {
        response = "Great question! Based on your financial profile, I recommend focusing on growth stocks that match your spending patterns. Would you like specific recommendations?";
      }
      
      setAiResponses(prev => [...prev, response]);
      setAiQuestion("");
      setIsAskingAi(false);
    }, 1500);
  };

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
    <section id="product-tour" ref={ref} className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Smart Features for Smarter Investing</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover how Ramblin&apos; Returns transforms your financial journey with cutting-edge AI and intuitive
            tools.
          </p>
        </motion.div>

        <Tabs defaultValue="spending" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <TabsTrigger value="spending" className="data-[state=active]:bg-gt-gold data-[state=active]:text-white">
                <PieChartIcon className="mr-2 h-4 w-4" />
                Spending Breakdown
              </TabsTrigger>
              <TabsTrigger value="invest" className="data-[state=active]:bg-gt-gold data-[state=active]:text-white">
                <TrendingUp className="mr-2 h-4 w-4" />
                Spend-to-Invest
              </TabsTrigger>
              <TabsTrigger value="fraud" className="data-[state=active]:bg-gt-gold data-[state=active]:text-white">
                <Shield className="mr-2 h-4 w-4" />
                Fraud Detection
              </TabsTrigger>
              <TabsTrigger value="ai" className="data-[state=active]:bg-gt-gold data-[state=active]:text-white">
                <Bot className="mr-2 h-4 w-4" />
                AI Financial Coach
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="spending" className="mt-0">
            <motion.div
              variants={container}
              initial="hidden"
              animate={isInView ? "show" : "hidden"}
              className="grid md:grid-cols-2 gap-8 items-center"
            >
              <motion.div variants={item} className="order-2 md:order-1">
                <h3 className="text-2xl font-bold mb-4">Visualize Your Spending Habits</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Get a clear picture of where your money goes with interactive charts and breakdowns. Identify spending
                  patterns and opportunities to invest smarter.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gt-gold flex items-center justify-center text-white">
                      <span className="text-sm font-medium">1</span>
                    </div>
                    <span className="ml-3 text-gray-700 dark:text-gray-200">Categorized spending visualization</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gt-gold flex items-center justify-center text-white">
                      <span className="text-sm font-medium">2</span>
                    </div>
                    <span className="ml-3 text-gray-700 dark:text-gray-200">Monthly trend analysis</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gt-gold flex items-center justify-center text-white">
                      <span className="text-sm font-medium">3</span>
                    </div>
                    <span className="ml-3 text-gray-700 dark:text-gray-200">Personalized saving recommendations</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div variants={item} className="order-1 md:order-2">
                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold mb-4">Your Monthly Spending</h4>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={spendingData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            animationBegin={200}
                            animationDuration={1000}
                          >
                            {spendingData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {spendingData.map((item, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                          <span className="text-sm">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent value="invest" className="mt-0">
            <motion.div
              variants={container}
              initial="hidden"
              animate={isInView ? "show" : "hidden"}
              className="grid md:grid-cols-2 gap-8 items-center"
            >
              <motion.div variants={item}>
                <h3 className="text-2xl font-bold mb-4">Spend-to-Invest Engine</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Our innovative engine automatically converts your everyday purchases into investments in the companies
                  you love. Spend at Starbucks, own a piece of Starbucks.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gt-gold flex items-center justify-center text-white">
                      <span className="text-sm font-medium">1</span>
                    </div>
                    <span className="ml-3 text-gray-700 dark:text-gray-200">Automatic round-ups on purchases</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gt-gold flex items-center justify-center text-white">
                      <span className="text-sm font-medium">2</span>
                    </div>
                    <span className="ml-3 text-gray-700 dark:text-gray-200">Invest in brands you regularly use</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gt-gold flex items-center justify-center text-white">
                      <span className="text-sm font-medium">3</span>
                    </div>
                    <span className="ml-3 text-gray-700 dark:text-gray-200">Customizable investment rules</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div variants={item}>
                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold mb-4">Your Spend-to-Invest Portfolio</h4>
                    <div className="space-y-4">
                      {investmentData.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center p-4 border rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="mr-4">
                            {index === 0 && <Coffee className="h-10 w-10 text-gt-gold" />}
                            {index === 1 && <ShoppingBag className="h-10 w-10 text-blue-500" />}
                            {index === 2 && <Car className="h-10 w-10 text-green-500" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h5 className="font-medium">{item.company}</h5>
                              <span className="text-sm text-gray-500">${item.spend} spent</span>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-sm text-gray-600 dark:text-gray-300">{item.ticker}</span>
                              <span className="text-sm text-green-600">{item.growth}</span>
                            </div>
                            <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${item.spend / 3}%` }}
                                transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                                className="h-full bg-gt-gold"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6">
                      <button 
                        onClick={() => scrollToSection("dashboard")}
                        className="w-full py-2 bg-gt-gold text-white rounded-md hover:bg-gt-gold/90 transition-colors"
                      >
                        Try Spend-to-Invest
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent value="fraud" className="mt-0">
            <motion.div
              variants={container}
              initial="hidden"
              animate={isInView ? "show" : "hidden"}
              className="grid md:grid-cols-2 gap-8 items-center"
            >
              <motion.div variants={item} className="order-2 md:order-1">
                <h3 className="text-2xl font-bold mb-4">Advanced Fraud Protection</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Our AI-powered fraud detection system monitors your transactions and online activity to keep your
                  finances safe from scams and fraud attempts.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gt-gold flex items-center justify-center text-white">
                      <span className="text-sm font-medium">1</span>
                    </div>
                    <span className="ml-3 text-gray-700 dark:text-gray-200">Real-time transaction monitoring</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gt-gold flex items-center justify-center text-white">
                      <span className="text-sm font-medium">2</span>
                    </div>
                    <span className="ml-3 text-gray-700 dark:text-gray-200">Phishing URL detection</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gt-gold flex items-center justify-center text-white">
                      <span className="text-sm font-medium">3</span>
                    </div>
                    <span className="ml-3 text-gray-700 dark:text-gray-200">Instant fraud alerts</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div variants={item} className="order-1 md:order-2">
                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold mb-4">URL Safety Meter</h4>
                    <div className="space-y-6">
                      {fraudData.map((item, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{item.url}</span>
                            <span className={`text-sm ${item.safety > 70 ? "text-green-600" : "text-red-600"}`}>
                              {item.status}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${item.safety}%` }}
                              transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                              className={`h-full ${item.safety > 70 ? "bg-green-500" : "bg-red-500"}`}
                            />
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.safety > 70
                              ? "This is a legitimate website."
                              : "This appears to be a phishing attempt. Avoid entering credentials."}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6">
                      <button 
                        onClick={() => scrollToSection("url-security")}
                        className="w-full py-2 bg-gt-navy text-white rounded-md hover:bg-gt-navy/90 transition-colors"
                      >
                        Check URL Safety
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent value="ai" className="mt-0">
            <motion.div
              variants={container}
              initial="hidden"
              animate={isInView ? "show" : "hidden"}
              className="grid md:grid-cols-2 gap-8 items-center"
            >
              <motion.div variants={item}>
                <h3 className="text-2xl font-bold mb-4">AI Financial Coach</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Meet your personal financial advisor powered by advanced AI. Get personalized tips, insights, and
                  guidance to optimize your spending and investing habits.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gt-gold flex items-center justify-center text-white">
                      <span className="text-sm font-medium">1</span>
                    </div>
                    <span className="ml-3 text-gray-700 dark:text-gray-200">Personalized financial advice</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gt-gold flex items-center justify-center text-white">
                      <span className="text-sm font-medium">2</span>
                    </div>
                    <span className="ml-3 text-gray-700 dark:text-gray-200">Spending pattern analysis</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gt-gold flex items-center justify-center text-white">
                      <span className="text-sm font-medium">3</span>
                    </div>
                    <span className="ml-3 text-gray-700 dark:text-gray-200">Goal-based recommendations</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div variants={item}>
                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold mb-4">AI Coach Insights</h4>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                      {aiTips.map((tip, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.5 + index * 0.3 }}
                          className={`p-4 rounded-lg ${
                            index % 2 === 0
                              ? "bg-gt-gold/10 border-l-4 border-gt-gold"
                              : "bg-gray-100 dark:bg-gray-800 border-l-4 border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          <p className="text-sm">{tip}</p>
                        </motion.div>
                      ))}
                      
                      {aiResponses.map((response, index) => (
                        <motion.div
                          key={`response-${index}`}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5 }}
                          className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500"
                        >
                          <p className="text-sm">{response}</p>
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="pt-4">
                      <form onSubmit={handleAiQuestion} className="flex items-center">
                        <input
                          type="text"
                          placeholder="Ask your AI coach a question..."
                          value={aiQuestion}
                          onChange={(e) => setAiQuestion(e.target.value)}
                          className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-gt-gold dark:bg-gray-800 dark:border-gray-700"
                          disabled={isAskingAi}
                        />
                        <button 
                          type="submit"
                          className="bg-gt-gold text-white p-2 rounded-r-md hover:bg-gt-gold/90 disabled:bg-gray-400"
                          disabled={isAskingAi || !aiQuestion.trim()}
                        >
                          {isAskingAi ? "..." : 
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5"
                          >
                            <path d="m22 2-7 20-4-9-9-4Z" />
                            <path d="M22 2 11 13" />
                          </svg>}
                        </button>
                      </form>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}


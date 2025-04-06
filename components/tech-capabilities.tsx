"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Shield, Bot, Lock, BarChart4, Zap, Database, LineChart, Cpu } from "lucide-react"

export function TechCapabilities() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  const features = [
    {
      icon: <TrendingUp className="h-10 w-10 text-gt-gold" />,
      title: "Wall Street-grade Algorithms",
      description: "Turn your coffee runs into stock wins—automatically.",
    },
    {
      icon: <Bot className="h-10 w-10 text-gt-gold" />,
      title: "Real-time AI Coaching",
      description: "From ramblin' spender to savvy investor—zero effort required.",
    },
    {
      icon: <Shield className="h-10 w-10 text-gt-gold" />,
      title: "Secure Banking Integrations",
      description: "SECURE: Blocks scams better than CRC WiFi blocks connections.",
    },
    {
      icon: <BarChart4 className="h-10 w-10 text-gt-gold" />,
      title: "Advanced Analytics",
      description: "Your Chipotle habit just became an investment strategy.",
    },
    {
      icon: <Database className="h-10 w-10 text-gt-gold" />,
      title: "Transaction Categorization",
      description: "No budgeting. Just spend normally and watch your portfolio grow.",
    },
    {
      icon: <Lock className="h-10 w-10 text-gt-gold" />,
      title: "Fraud Detection System",
      description: "Goldman-grade investing meets FanDuel-style rewards.",
    },
    {
      icon: <LineChart className="h-10 w-10 text-gt-gold" />,
      title: "Portfolio Optimization",
      description: "Out-invest your classmates on the BuzzBuck leaderboard.",
    },
    {
      icon: <Zap className="h-10 w-10 text-gt-gold" />,
      title: "Real-time Market Data",
      description: "The only app that turns your dining dollars into Wall Street gains.",
    },
    {
      icon: <Cpu className="h-10 w-10 text-gt-gold" />,
      title: "Excel Integration",
      description: "Microsoft Excel integration: Your portfolio updates itself.",
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
    <section id="technology" ref={ref} className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">The Tech Behind the Magic</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Georgia Tech&apos;s first AI-powered spend-to-invest engine
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={item}>
              <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden group">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="mb-4 relative">
                    <div className="absolute -inset-1 bg-gt-gold/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative">{feature.icon}</div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-gt-gold transition-colors">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 flex-grow">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}


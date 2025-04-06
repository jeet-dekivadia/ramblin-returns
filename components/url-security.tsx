"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Shield, CheckCircle, AlertTriangle, Link } from "lucide-react"

type SecurityResult = {
  originalUrl: string;
  unshortenedUrl: string;
  confidenceScore: number;
  reasons: string[];
};

export function URLSecurity() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<SecurityResult | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/url-security", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze URL")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="url-security" className="py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="inline-block bg-gt-navy/10 dark:bg-gt-navy/20 p-4 rounded-full mb-6"
            >
              <Shield className="h-12 w-12 text-gt-navy" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Protect Yourself from Phishing</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Advanced security that blocks scams and protects your financial data
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>URL Security Checker</CardTitle>
              <CardDescription>
                Enter a URL to check its security and get detailed analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="url"
                    placeholder="Enter URL to analyze..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Analyzing..." : "Analyze"}
                  </Button>
                </div>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                {result && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Original URL:</h3>
                      <div className="bg-gray-100 p-3 rounded-lg break-all">
                        {result.originalUrl}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Unshortened URL:</h3>
                      <div className="bg-gray-100 p-3 rounded-lg break-all">
                        {result.unshortenedUrl}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Security Score:</h3>
                      <div className="flex items-center gap-2">
                        <div
                          className={`text-2xl font-bold ${
                            result.confidenceScore >= 70
                              ? "text-green-600"
                              : result.confidenceScore >= 40
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {result.confidenceScore}/100
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-sm ${
                            result.confidenceScore >= 70
                              ? "bg-green-100 text-green-800"
                              : result.confidenceScore >= 40
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {result.confidenceScore >= 70
                            ? "Safe"
                            : result.confidenceScore >= 40
                            ? "Caution"
                            : "Unsafe"}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Analysis:</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        {result.reasons.map((reason, index) => (
                          <li key={index}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}


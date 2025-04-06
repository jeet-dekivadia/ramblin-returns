"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Shield, AlertTriangle, Link as LinkIcon } from "lucide-react"
import Image from "next/image"

export function UrlSecurity() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    originalUrl: string
    unshortenedUrl: string
    info: string
    isSafe: boolean
    riskLevel: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!url.trim() || isLoading) return

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/unshorten-url", {
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
      setResult({
        originalUrl: url,
        unshortenedUrl: data.output,
        info: data.info,
        isSafe: data.isSafe,
        riskLevel: data.riskLevel
      })
    } catch (err) {
      setError("Failed to analyze URL. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low':
        return 'text-green-600'
      case 'medium':
        return 'text-yellow-600'
      case 'high':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <section id="url-security" className="py-16 px-4 md:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <Shield className="w-16 h-16 mx-auto mb-4 text-blue-500" />
          <h2 className="text-3xl font-bold mb-4">Protect Yourself from Phishing</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Advanced security that blocks scams and protects your financial data
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Enter a URL to check</CardTitle>
            <CardDescription>
              We'll analyze the URL and show you where it really leads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-4">
              <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://shorturl.at/wBDCy"
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Analyzing..." : "Check URL"}
              </Button>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {result && (
              <div className="mt-6 space-y-4">
                <div className={`p-4 rounded-lg ${
                  result.isSafe ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {result.isSafe ? (
                      <Shield className="w-5 h-5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5" />
                    )}
                    <span className="font-semibold">
                      {result.isSafe ? 'URL is safe' : 'Warning: Potentially unsafe URL'}
                    </span>
                    <span className={`ml-auto ${getRiskLevelColor(result.riskLevel)}`}>
                      Risk Level: {result.riskLevel.toUpperCase()}
                    </span>
                  </div>
                  <p>{result.info}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <LinkIcon className="w-5 h-5 mt-1 text-gray-500" />
                    <div>
                      <p className="font-medium">Original URL:</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 break-all">
                        {result.originalUrl}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <LinkIcon className="w-5 h-5 mt-1 text-gray-500" />
                    <div>
                      <p className="font-medium">Unshortened URL:</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 break-all">
                        {result.unshortenedUrl}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}


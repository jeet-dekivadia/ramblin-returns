"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Shield, AlertTriangle, Link as LinkIcon } from "lucide-react"

const iframeStyles = {
  container: {
    width: "500px",
    height: "300px",
    overflow: "hidden",
    border: "1px solid #ccc",
  },
  iframe: {
    width: "100%",
    height: "100%",
    border: "none",
  },
}

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
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-6xl">
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

                <div className="flex flex-col md:flex-row gap-6">
                  {result.isSafe && (
                    <div style={iframeStyles.container} className="flex-1">
                      <iframe 
                        src={result.unshortenedUrl} 
                        style={iframeStyles.iframe} 
                        title="Website Preview"
                        sandbox="allow-scripts allow-same-origin"
                      />
                    </div>
                  )}

                  <div className="flex-1 space-y-4">
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
                          <a
                            href={result.unshortenedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline break-all"
                          >
                            {result.unshortenedUrl}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 p-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-4">What are Phishing Links?</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg">
              <strong className="text-red-600">Phishing scams</strong> are a prevalent form of cybercrime where attackers trick individuals into revealing sensitive information like <span className="text-blue-600">passwords</span> or <span className="text-blue-600">credit card details</span> by posing as legitimate entities.
            </p>
            <p className="mt-4">
              According to the FBI's 2022 Internet Crime Report, phishing accounted for over <span className="text-blue-600">323,000 complaints</span> in the U.S., leading to losses of over <span className="text-blue-600">$52 million</span>.
            </p>
            <p className="mt-4">
              To protect yourself from phishing:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Always verify the source of communications</li>
              <li>Use <strong className="text-red-600">two-factor authentication</strong></li>
              <li>Keep your software updated</li>
              <li>Be cautious of <span className="text-blue-600">urgent language</span></li>
              <li>Check for <strong>suspicious URLs</strong></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}


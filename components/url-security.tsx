"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Shield, AlertTriangle, Link as LinkIcon, AlertCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function UrlSecurity() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    originalUrl: string
    unshortenedUrl: string
    info: string
    isSafe: boolean
    riskLevel: string
    threats: string[]
    recommendations: string[]
    redirectCount: number
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
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to analyze URL")
      }

      const data = await response.json()
      setResult({
        originalUrl: url,
        unshortenedUrl: data.output,
        info: data.info,
        isSafe: data.isSafe,
        riskLevel: data.riskLevel,
        threats: data.threats || [],
        recommendations: data.recommendations || [],
        redirectCount: data.redirectCount || 0
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze URL. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low':
        return 'text-green-600 dark:text-green-400'
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'high':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
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
              <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {result && (
              <div className="mt-6 space-y-6">
                <div className={`p-4 rounded-lg ${
                  result.isSafe ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
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
                  <p className="whitespace-pre-wrap">{result.info}</p>
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
                      {result.redirectCount > 0 && (
                        <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                          This URL involves {result.redirectCount} redirect(s)
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {(result.threats.length > 0 || result.recommendations.length > 0) && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      {result.threats.length > 0 && (
                        <div>
                          <h3 className="font-medium mb-2 text-red-600 dark:text-red-400 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Potential Threats
                          </h3>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                            {result.threats.map((threat, index) => (
                              <li key={index}>{threat}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {result.recommendations.length > 0 && (
                        <div>
                          <h3 className="font-medium mb-2 text-blue-600 dark:text-blue-400 flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Security Recommendations
                          </h3>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                            {result.recommendations.map((rec, index) => (
                              <li key={index}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}


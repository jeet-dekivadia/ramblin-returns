"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Shield, CheckCircle, AlertTriangle, Link } from "lucide-react"

export function UrlSecurity() {
  const [url, setUrl] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<null | { safe: boolean; original?: string; message: string }>(null)

  const checkUrl = () => {
    if (!url) return

    setIsChecking(true)

    // Simulate API call to check URL
    setTimeout(() => {
      if (url.includes("amaz0n") || url.includes("paypa1")) {
        setResult({
          safe: false,
          original: url,
          message:
            "This appears to be a phishing attempt. The domain is suspicious and doesn't match the official website.",
        })
      } else if (url.includes("bit.ly") || url.includes("tinyurl")) {
        setResult({
          safe: true,
          original: "https://www.example.com/legitimate-page",
          message: "This shortened URL redirects to a legitimate website.",
        })
      } else {
        setResult({
          safe: true,
          message: "This URL appears to be safe.",
        })
      }

      setIsChecking(false)
    }, 1500)
  }

  return (
    <section className="py-20 bg-white dark:bg-gray-950">
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
              Check if a URL is safe before clicking. Our tool unshortens URLs and detects potential phishing attempts.
            </p>
          </div>

          <Card className="overflow-hidden border-2 border-gray-200 dark:border-gray-800">
            <CardContent className="p-6">
              <div className="mb-6">
                <label htmlFor="url-input" className="block text-sm font-medium mb-2">
                  Enter a URL to check
                </label>
                <div className="flex gap-2">
                  <Input
                    id="url-input"
                    type="url"
                    placeholder="https://example.com or shortened URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={checkUrl}
                    disabled={!url || isChecking}
                    className="bg-gt-navy hover:bg-gt-navy/90 text-white"
                  >
                    {isChecking ? "Checking..." : "Check URL"}
                  </Button>
                </div>
              </div>

              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg ${
                    result.safe
                      ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900"
                      : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900"
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      {result.safe ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div className="ml-3">
                      <h3
                        className={`text-sm font-medium ${
                          result.safe ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"
                        }`}
                      >
                        {result.safe ? "URL is safe" : "Potential security risk"}
                      </h3>
                      <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        <p>{result.message}</p>

                        {result.original && (
                          <div className="mt-2 flex items-center">
                            <Link className="h-4 w-4 mr-1 text-gray-500" />
                            <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                              {result.original}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="mt-6 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Try these examples:</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setUrl("https://amaz0n-secure.net/login")}
                    className="text-sm text-gt-gold hover:underline block"
                  >
                    https://amaz0n-secure.net/login
                  </button>
                  <button
                    onClick={() => setUrl("https://bit.ly/3xR5tY7")}
                    className="text-sm text-gt-gold hover:underline block"
                  >
                    https://bit.ly/3xR5tY7
                  </button>
                  <button
                    onClick={() => setUrl("https://paypa1-verify.com/account")}
                    className="text-sm text-gt-gold hover:underline block"
                  >
                    https://paypa1-verify.com/account
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Powered by{" "}
              <a
                href="https://github.com/radhe098/Unshorten-URLs/tree/main"
                className="text-gt-gold hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Unshorten URLs
              </a>{" "}
              technology
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}


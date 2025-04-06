"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Shield, CheckCircle, AlertTriangle, Link } from "lucide-react"

export function UrlSecurity() {
  const [url, setUrl] = useState<string>("")
  const [result, setResult] = useState<null | {
    isSafe: boolean;
    score: number;
    message: string;
  }>(null)
  const [isChecking, setIsChecking] = useState<boolean>(false)

  const checkUrl = () => {
    if (!url) {
      alert("Please enter a URL to check");
      return;
    }
    
    setIsChecking(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      // Simple phishing detection logic
      const phishingKeywords = ['amaz0n', 'paypa1', 'secure', 'verify', 'login', 'bit.ly'];
      const isSuspicious = phishingKeywords.some(keyword => url.toLowerCase().includes(keyword));
      
      const isSafe = !isSuspicious;
      const score = isSafe ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 30) + 10;
      
      setResult({
        isSafe,
        score,
        message: isSafe 
          ? "This URL appears to be legitimate. You can proceed safely." 
          : "Warning! This URL shows signs of being a phishing attempt. Do not enter personal information."
      });
      
      setIsChecking(false);
    }, 1500);
  };

  return (
    <section id="url-security" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <Shield className="h-12 w-12 text-gt-gold mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Phishing URL Detector</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Check if a URL is legitimate or a phishing attempt before clicking on it. Protect your financial data from scams.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="overflow-hidden shadow-lg">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-2">URL Safety Check</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Enter a URL below to scan it for potential security threats.
                    </p>
                    <div className="flex space-x-2">
                      <Input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="flex-1"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && url) {
                            checkUrl();
                          }
                        }}
                      />
                      <Button onClick={checkUrl} disabled={isChecking || !url} className="bg-gt-navy hover:bg-gt-navy/90 text-white">
                        {isChecking ? "Checking..." : "Check"}
                      </Button>
                    </div>
                  </div>

                  {result && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`p-4 rounded-lg ${
                        result.isSafe ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        {result.isSafe ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                        )}
                        <h4 className="font-bold">
                          {result.isSafe ? "Safe URL" : "Suspicious URL"}
                        </h4>
                      </div>
                      <p className="text-sm">{result.message}</p>
                      <div className="mt-3">
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              result.isSafe ? "bg-green-500" : "bg-red-500"
                            }`}
                            style={{ width: `${result.score}%` }}
                          />
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                          <span>Unsafe</span>
                          <span>Safety Score: {result.score}%</span>
                          <span>Safe</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="overflow-hidden shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Common Phishing Examples</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Click on any of these examples to check their safety:
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setUrl("https://amaz0n-secure.net/login");
                      setTimeout(() => checkUrl(), 100);
                    }}
                    className="text-sm text-gt-gold hover:underline block"
                  >
                    https://amaz0n-secure.net/login
                  </button>
                  <button
                    onClick={() => {
                      setUrl("https://bit.ly/3xR5tY7");
                      setTimeout(() => checkUrl(), 100);
                    }}
                    className="text-sm text-gt-gold hover:underline block"
                  >
                    https://bit.ly/3xR5tY7
                  </button>
                  <button
                    onClick={() => {
                      setUrl("https://paypa1-verify.com/account");
                      setTimeout(() => checkUrl(), 100);
                    }}
                    className="text-sm text-gt-gold hover:underline block"
                  >
                    https://paypa1-verify.com/account
                  </button>
                  <button
                    onClick={() => {
                      setUrl("https://www.google.com");
                      setTimeout(() => checkUrl(), 100);
                    }}
                    className="text-sm text-gt-gold hover:underline block"
                  >
                    https://www.google.com
                  </button>
                  <button
                    onClick={() => {
                      setUrl("https://github.com");
                      setTimeout(() => checkUrl(), 100);
                    }}
                    className="text-sm text-gt-gold hover:underline block"
                  >
                    https://github.com
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}


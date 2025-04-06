"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { AlertCircle, CheckCircle, Shield, AlertTriangle } from 'lucide-react';

export function URLChecker() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    originalUrl: string;
    unshortenedUrl: string;
    score: number;
    reasons: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/check-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze URL');
      }

      const data = await response.json();
      console.log('Response data:', data); // Debug log
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze URL');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-6 w-6 text-green-600" />;
    if (score >= 60) return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
    return <AlertCircle className="h-6 w-6 text-red-600" />;
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            URL Security Checker
          </CardTitle>
          <CardDescription>
            Enter a URL to check its security and get detailed analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="Enter URL to analyze..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
                {isLoading ? 'Analyzing...' : 'Analyze'}
              </Button>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                {error}
              </div>
            )}

            {result && (
              <div className="space-y-6">
                {/* Original URL */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-500 mb-1">Original URL:</p>
                  <p className="font-mono text-sm break-all">{result.originalUrl}</p>
                </div>

                {/* Unshortened URL - with different styling to highlight the change */}
                {result.unshortenedUrl !== result.originalUrl && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-600 mb-1">Unshortened URL:</p>
                    <p className="font-mono text-sm break-all text-blue-800">{result.unshortenedUrl}</p>
                  </div>
                )}

                {/* Security Score with Icon */}
                <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                  <div className="flex items-center gap-4">
                    {getScoreIcon(result.score)}
                    <div>
                      <p className="text-sm font-medium text-gray-500">Security Score</p>
                      <div className="flex items-baseline gap-2">
                        <span className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
                          {result.score}
                        </span>
                        <span className="text-sm text-gray-500">out of 100</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analysis Results */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Analysis Results:</h4>
                  <ul className="space-y-2">
                    {result.reasons.map((reason, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-200"
                      >
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Example URLs */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Try these examples:</h4>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setUrl("https://amaz0n-secure.net/login")}
                  className="text-blue-600 hover:underline block text-sm"
                >
                  https://amaz0n-secure.net/login
                </button>
                <button
                  type="button"
                  onClick={() => setUrl("https://bit.ly/3xR5tY7")}
                  className="text-blue-600 hover:underline block text-sm"
                >
                  https://bit.ly/3xR5tY7
                </button>
                <button
                  type="button"
                  onClick={() => setUrl("https://paypa1-verify.com/account")}
                  className="text-blue-600 hover:underline block text-sm"
                >
                  https://paypa1-verify.com/account
                </button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 
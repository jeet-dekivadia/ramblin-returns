import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { AlertCircle, CheckCircle, Shield } from 'lucide-react';

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

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
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
              <div className="space-y-4">
                {/* Unshortened URL Box */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">Unshortened URL:</p>
                  <p className="font-mono text-sm break-all">{result.unshortenedUrl}</p>
                </div>

                {/* Security Score */}
                <div className="flex items-center gap-2">
                  <div className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
                    {result.score}
                  </div>
                  <div className="text-gray-600">
                    <div className="text-sm font-medium">Security Score</div>
                    <div className="text-xs">out of 100</div>
                  </div>
                </div>

                {/* Reasons */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Analysis Results:</h4>
                  <ul className="space-y-2">
                    {result.reasons.map((reason, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 bg-white p-3 rounded-lg border border-gray-100"
                      >
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 
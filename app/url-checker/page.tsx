import { URLChecker } from '@/components/url-checker';

export default function URLCheckerPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">URL Security Checker</h1>
        <URLChecker />
      </div>
    </div>
  );
} 
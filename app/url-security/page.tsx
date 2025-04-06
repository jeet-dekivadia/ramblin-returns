import { URLChecker } from '@/components/url-checker';

export default function URLSecurityPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <div className="inline-block bg-blue-50 p-4 rounded-full mb-4">
          <div className="w-16 h-16 flex items-center justify-center">
            <img src="/shield-icon.svg" alt="Security Shield" className="w-10 h-10" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">Protect Yourself from Phishing</h1>
        <p className="text-xl text-gray-600">
          Advanced security that blocks scams and protects your financial data
        </p>
      </div>
      <URLChecker />
    </div>
  );
} 
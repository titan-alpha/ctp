'use client';

import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useJwtGenerator } from '@/hooks/useJwtGenerator';

const FEATURES = [
  {
    title: 'HS256 Algorithm',
    description: 'Generate JWT tokens using the industry-standard HMAC SHA-256 signing algorithm for secure authentication.',
  },
  {
    title: 'Custom Claims',
    description: 'Add any custom payload data along with standard claims like expiration, issuer, and subject.',
  },
  {
    title: 'Client-Side Only',
    description: 'All token generation happens locally in your browser. Your secret key never leaves your device.',
  },
];

const FAQS = [
  {
    question: 'What is a JWT token?',
    answer: 'JWT (JSON Web Token) is a compact, URL-safe token format used for securely transmitting information between parties as a JSON object. It is commonly used for authentication and authorization.',
  },
  {
    question: 'What is HS256?',
    answer: 'HS256 (HMAC with SHA-256) is a symmetric signing algorithm that uses a shared secret key to both create and verify the signature of a JWT token.',
  },
  {
    question: 'Is my secret key secure?',
    answer: 'Yes, all JWT generation happens entirely in your browser using the Web Crypto API. Your secret key is never sent to any server.',
  },
  {
    question: 'What are standard JWT claims?',
    answer: 'Standard claims include: exp (expiration time), iat (issued at), iss (issuer), sub (subject), aud (audience), nbf (not before), and jti (JWT ID).',
  },
  {
    question: 'Can I use this token in production?',
    answer: 'This tool is great for development and testing. For production, ensure you use a strong, unique secret key and consider using asymmetric algorithms like RS256.',
  },
  {
    question: 'How do I decode a JWT?',
    answer: 'JWTs consist of three base64url-encoded parts separated by dots. You can decode the header and payload portions, but the signature requires the secret key to verify.',
  },
];

export function JwtGenerator() {
  const {
    options,
    setOptions,
    jwt,
    error,
    isGenerating,
    generate,
    reset,
    copied,
    copyToClipboard,
  } = useJwtGenerator();

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'JWT Generator',
    description: 'Generate JWT tokens with custom payload and HS256 algorithm. Configure expiration, issuer, subject, and custom claims.',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <SiteLayout toolName="JWT Generator" category="developer-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Generate JWT Token
          </h2>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Secret Key
              </label>
              <input
                type="text"
                value={options.secret}
                onChange={(e) => setOptions({ ...options, secret: e.target.value })}
                placeholder="Enter your secret key"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payload (JSON)
              </label>
              <textarea
                value={options.payload}
                onChange={(e) => setOptions({ ...options, payload: e.target.value })}
                placeholder='{"userId": "12345", "role": "admin"}'
                className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Expires In (seconds)
                </label>
                <input
                  type="number"
                  value={options.expiresIn}
                  onChange={(e) => setOptions({ ...options, expiresIn: parseInt(e.target.value) || 0 })}
                  placeholder="3600"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Issuer (iss)
                </label>
                <input
                  type="text"
                  value={options.issuer}
                  onChange={(e) => setOptions({ ...options, issuer: e.target.value })}
                  placeholder="Optional"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject (sub)
                </label>
                <input
                  type="text"
                  value={options.subject}
                  onChange={(e) => setOptions({ ...options, subject: e.target.value })}
                  placeholder="Optional"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={generate}
              disabled={isGenerating}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
            >
              {isGenerating ? 'Generating...' : 'Generate JWT'}
            </button>
            <button
              onClick={reset}
              className="px-6 py-2 text-red-600 hover:text-red-700 dark:text-red-400 font-medium transition-colors"
            >
              Reset
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}

          {jwt && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Generated JWT
                </label>
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-600">
                <code className="text-sm text-gray-900 dark:text-white break-all font-mono">
                  {jwt}
                </code>
              </div>
            </div>
          )}
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div
                key={index}
                className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

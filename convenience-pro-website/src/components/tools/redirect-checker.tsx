'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useRedirectChecker } from '@/hooks/useRedirectChecker';

const FEATURES = [
  {
    title: 'Redirect Chain Analysis',
    description: 'Visualize the complete redirect path from your original URL to the final destination.',
  },
  {
    title: 'Issue Detection',
    description: 'Identify common redirect problems like chain loops, HTTP links, and parameter vulnerabilities.',
  },
  {
    title: 'SEO Recommendations',
    description: 'Get actionable advice to optimize your redirect strategy and improve site performance.',
  },
];

const FAQS = [
  {
    question: 'What is a redirect?',
    answer: 'A redirect is a way to send both users and search engines to a different URL from the one they originally requested. Common types include 301 (permanent) and 302 (temporary) redirects.',
  },
  {
    question: 'Why are redirect chains bad for SEO?',
    answer: 'Redirect chains slow down page load times and can dilute link equity. Each redirect in a chain loses some SEO value, so minimizing chain length is important for rankings.',
  },
  {
    question: 'What is the difference between 301 and 302 redirects?',
    answer: 'A 301 redirect is permanent and passes most SEO value to the new URL. A 302 redirect is temporary and tells search engines the original URL may return, passing less SEO value.',
  },
  {
    question: 'How many redirects are too many?',
    answer: 'Ideally, you should have no more than one redirect between the original URL and the final destination. More than 2-3 redirects in a chain can significantly impact performance and SEO.',
  },
  {
    question: 'Should I use trailing slashes in URLs?',
    answer: 'The key is consistency. Choose either trailing slashes or no trailing slashes and stick with it across your entire site to avoid duplicate content issues.',
  },
  {
    question: 'How do I fix redirect loops?',
    answer: 'Redirect loops occur when URL A redirects to URL B, which redirects back to A. Fix them by reviewing your redirect rules in .htaccess, server config, or CMS settings to ensure a clear path.',
  },
];

function StatusBadge({ code }: { code: number }) {
  const getColor = () => {
    if (code === 200) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    if (code >= 300 && code < 400) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    if (code >= 400) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  return (
    <span className={`px-2 py-1 rounded text-sm font-medium ${getColor()}`}>
      {code}
    </span>
  );
}

function IssueBadge({ type }: { type: 'warning' | 'error' | 'info' }) {
  const colors = {
    error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${colors[type]}`}>
      {type.toUpperCase()}
    </span>
  );
}

export function RedirectChecker() {
  const { result, isLoading, error, analyze, reset } = useRedirectChecker();
  const [url, setUrl] = useState('');

  const handleAnalyze = () => {
    if (url.trim()) {
      analyze(url);
    }
  };

  const handleReset = () => {
    reset();
    setUrl('');
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Redirect Checker',
    description: 'Analyze URL redirects, detect redirect chains, and get SEO recommendations for optimal site performance.',
    applicationCategory: 'UtilityApplication',
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
    <SiteLayout toolName="Redirect Checker" category="seo-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Check URL Redirects
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter URL to Analyze
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              placeholder="e.g., http://example.com or https://example.com/page"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Enter a URL to check for redirects, chain issues, and SEO problems
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleAnalyze}
              disabled={!url.trim() || isLoading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
            >
              {isLoading ? 'Analyzing...' : 'Check Redirects'}
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {result && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                URL Information
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Protocol</span>
                  <p className="font-medium text-gray-900 dark:text-white">{result.urlInfo.protocol.toUpperCase()}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Domain</span>
                  <p className="font-medium text-gray-900 dark:text-white">{result.urlInfo.domain}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Redirect Type</span>
                  <p className="font-medium text-gray-900 dark:text-white">{result.redirectType}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Total Time</span>
                  <p className="font-medium text-gray-900 dark:text-white">{result.totalResponseTime}ms</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Redirect Chain Visualization
              </h3>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Note: This is a simulated redirect chain for demonstration. Real redirect checking requires server-side requests.
                </p>
              </div>
              <div className="space-y-4">
                {result.redirectChain.map((step, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-sm font-mono text-gray-900 dark:text-white truncate">
                          {step.url}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {step.type} - {step.responseTime}ms
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <StatusBadge code={step.statusCode} />
                      </div>
                    </div>
                    {index < result.redirectChain.length - 1 && (
                      <div className="absolute left-8 top-full h-4 w-0.5 bg-blue-300 dark:bg-blue-600 -translate-x-1/2" />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-400">
                  <strong>Final Destination:</strong> {result.finalUrl}
                </p>
              </div>
            </div>

            {result.issues.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Detected Issues
                </h3>
                <div className="space-y-3">
                  {result.issues.map((issue, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <IssueBadge type={issue.type} />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{issue.message}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{issue.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Recommendations
              </h3>
              <ul className="space-y-2">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">*</span>
                    <span className="text-gray-600 dark:text-gray-400">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

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

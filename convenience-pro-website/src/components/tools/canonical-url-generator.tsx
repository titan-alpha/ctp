'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useCanonicalUrlGenerator } from '@/hooks/useCanonicalUrlGenerator';

const FEATURES = [
  {
    title: 'URL Cleaning',
    description: 'Automatically remove query parameters, hash fragments, and normalize your URLs for proper canonicalization.',
  },
  {
    title: 'Flexible Options',
    description: 'Customize output with options for lowercase conversion, trailing slash removal, and parameter stripping.',
  },
  {
    title: 'Ready-to-Use Tags',
    description: 'Get properly formatted canonical link tags ready to copy and paste directly into your HTML head section.',
  },
];

const FAQS = [
  {
    question: 'What is a canonical URL?',
    answer: 'A canonical URL is the preferred version of a web page when multiple URLs can display the same or similar content. The canonical tag tells search engines which version to index and rank, preventing duplicate content issues.',
  },
  {
    question: 'Why are canonical tags important for SEO?',
    answer: 'Canonical tags help consolidate link equity to a single URL, prevent duplicate content penalties, and ensure search engines index the correct version of your pages. They are essential for sites with URL parameters, mobile versions, or syndicated content.',
  },
  {
    question: 'Should I remove query parameters from canonical URLs?',
    answer: 'Generally yes. Query parameters like tracking codes, session IDs, or sorting options create duplicate content. Remove parameters unless they change the actual page content significantly.',
  },
  {
    question: 'Should canonical URLs have trailing slashes?',
    answer: 'Consistency is key. Choose either with or without trailing slashes and stick to it across your site. Most SEO experts recommend removing trailing slashes for cleaner URLs, but the important thing is consistency.',
  },
  {
    question: 'Where do I place the canonical tag?',
    answer: 'Place the canonical tag in the <head> section of your HTML document. It should appear before any other tags that might affect indexing. In Next.js or React, you can use the Head component or metadata API.',
  },
  {
    question: 'Can I use canonical tags for cross-domain content?',
    answer: 'Yes, canonical tags can point to URLs on different domains. This is useful for syndicated content or when you republish content across multiple sites and want to credit the original source.',
  },
];

export function CanonicalUrlGenerator() {
  const { result, generate, reset } = useCanonicalUrlGenerator();
  const [url, setUrl] = useState('');
  const [removeParams, setRemoveParams] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [removeTrailingSlash, setRemoveTrailingSlash] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (url.trim()) {
      generate(url, { removeParams, lowercase, removeTrailingSlash });
    }
  };

  const handleReset = () => {
    reset();
    setUrl('');
    setCopied(false);
  };

  const handleCopy = async () => {
    if (result) {
      await navigator.clipboard.writeText(result.canonicalTag);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Canonical URL Generator',
    description: 'Generate canonical URL tags for SEO. Clean URLs by removing parameters, normalizing case, and handling trailing slashes.',
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
    <SiteLayout toolName="Canonical URL Generator" category="seo-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Generate Canonical Tag
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/page?param=value"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Enter the URL you want to generate a canonical tag for
            </p>
          </div>

          <div className="mb-6 space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Options
            </label>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="removeParams"
                checked={removeParams}
                onChange={(e) => setRemoveParams(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="removeParams" className="text-gray-700 dark:text-gray-300">
                Remove query parameters
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="lowercase"
                checked={lowercase}
                onChange={(e) => setLowercase(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="lowercase" className="text-gray-700 dark:text-gray-300">
                Convert to lowercase
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="removeTrailingSlash"
                checked={removeTrailingSlash}
                onChange={(e) => setRemoveTrailingSlash(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="removeTrailingSlash" className="text-gray-700 dark:text-gray-300">
                Remove trailing slash
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleGenerate}
              disabled={!url.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
            >
              Generate Tag
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Generated Canonical Tag
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Original URL
              </label>
              <p className="text-gray-600 dark:text-gray-400 break-all">{result.originalUrl}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cleaned URL
              </label>
              <p className="text-gray-600 dark:text-gray-400 break-all">{result.cleanedUrl}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Canonical Tag
              </label>
              <div className="relative">
                <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm text-gray-800 dark:text-gray-200">
                  <code>{result.canonicalTag}</code>
                </pre>
                <button
                  onClick={handleCopy}
                  className="absolute top-2 right-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
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

'use client';

import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useJsonToTypescript } from '@/hooks/useJsonToTypescript';
import { useState } from 'react';

const FEATURES = [
  {
    title: 'Nested Object Support',
    description: 'Automatically generates separate interfaces for nested objects and arrays with proper type references.',
  },
  {
    title: 'Smart Naming',
    description: 'Converts JSON keys to PascalCase interface names and handles special characters in property names.',
  },
  {
    title: 'Privacy First',
    description: 'All conversion happens locally in your browser. Your JSON data never leaves your device.',
  },
];

const FAQS = [
  {
    question: 'What is JSON to TypeScript conversion?',
    answer: 'JSON to TypeScript conversion automatically generates TypeScript interface definitions from JSON data, providing type safety for your JavaScript objects.',
  },
  {
    question: 'How are nested objects handled?',
    answer: 'Nested objects are automatically converted into separate interfaces with appropriate names derived from the property keys, then referenced in the parent interface.',
  },
  {
    question: 'What happens with arrays?',
    answer: 'Arrays are typed based on their first element. If the array contains objects, a separate interface is generated for the array items.',
  },
  {
    question: 'Can I customize the root interface name?',
    answer: 'Yes, you can specify a custom name for the root interface using the "Root Interface Name" option.',
  },
  {
    question: 'What does the export keyword option do?',
    answer: 'When enabled, all generated interfaces will include the "export" keyword, making them available for import in other TypeScript files.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. All processing happens locally in your browser. Your JSON data is never sent to any server.',
  },
];

export function JsonToTypescript() {
  const {
    jsonInput,
    setJsonInput,
    options,
    setOptions,
    typescript,
    error,
    convert,
    reset,
  } = useJsonToTypescript();

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (typescript) {
      await navigator.clipboard.writeText(typescript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'JSON to TypeScript Converter',
    description: 'Convert JSON to TypeScript interfaces online. Generate type definitions from JSON data with support for nested objects and arrays.',
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
    <SiteLayout toolName="JSON to TypeScript" category="developer-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Convert JSON to TypeScript Interfaces
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                JSON Input
              </label>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='{"name": "John", "age": 30, "address": {"city": "NYC"}}'
                className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  TypeScript Output
                </label>
                {typescript && (
                  <button
                    onClick={handleCopy}
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>
              <pre className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm overflow-auto">
                <code className="text-blue-600 dark:text-blue-400">{typescript || '// TypeScript interfaces will appear here'}</code>
              </pre>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Root Interface Name
              </label>
              <input
                type="text"
                value={options.rootName}
                onChange={(e) => setOptions({ ...options, rootName: e.target.value })}
                placeholder="Root"
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="useExport"
                checked={options.useExport}
                onChange={(e) => setOptions({ ...options, useExport: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="useExport" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Add export keyword
              </label>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={convert}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Convert
            </button>
            <button
              onClick={reset}
              className="px-6 py-2 text-red-600 hover:text-red-700 dark:text-red-400 font-medium transition-colors"
            >
              Reset
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
              {error}
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

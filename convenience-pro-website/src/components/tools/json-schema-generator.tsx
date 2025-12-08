'use client';

import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useJsonSchemaGenerator } from '@/hooks/useJsonSchemaGenerator';
import { useState } from 'react';

const FEATURES = [
  {
    title: 'Auto Type Detection',
    description: 'Automatically detects JSON types including strings, numbers, integers, booleans, arrays, and objects.',
  },
  {
    title: 'Format Recognition',
    description: 'Identifies common formats like email, date, URI, UUID, and IP addresses for better validation.',
  },
  {
    title: 'Nested Structure Support',
    description: 'Handles deeply nested objects and arrays, generating complete schemas for complex JSON structures.',
  },
];

const FAQS = [
  {
    question: 'What is JSON Schema?',
    answer: 'JSON Schema is a vocabulary that allows you to annotate and validate JSON documents. It describes the structure, content, and format of JSON data.',
  },
  {
    question: 'How does the generator detect types?',
    answer: 'The generator analyzes each value in your JSON and determines its type (string, number, integer, boolean, array, object, or null) automatically.',
  },
  {
    question: 'What formats are detected?',
    answer: 'The tool recognizes common formats including email addresses, dates, date-times, URIs, UUIDs, and IPv4 addresses.',
  },
  {
    question: 'How are required fields determined?',
    answer: 'All non-null properties present in the sample JSON are marked as required in the generated schema.',
  },
  {
    question: 'Can it handle nested objects?',
    answer: 'Yes, the generator recursively processes nested objects and arrays at any depth, creating a complete schema structure.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. All processing happens locally in your browser. Your JSON data is never sent to any server.',
  },
];

export function JsonSchemaGenerator() {
  const {
    jsonInput,
    setJsonInput,
    schemaString,
    error,
    isGenerating,
    generate,
    reset,
  } = useJsonSchemaGenerator();

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (schemaString) {
      await navigator.clipboard.writeText(schemaString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'JSON Schema Generator',
    description: 'Generate JSON Schema from sample JSON data. Automatically detects types, formats, required fields, and nested structures.',
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
    <SiteLayout toolName="JSON Schema Generator" category="developer-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Generate JSON Schema
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sample JSON
              </label>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='{"name": "John", "email": "john@example.com", "age": 30}'
                className="w-full h-80 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Generated Schema
                </label>
                {schemaString && (
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>
              <pre className="w-full h-80 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm overflow-auto">
                {schemaString || '// Schema will appear here'}
              </pre>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={generate}
              disabled={isGenerating}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
            >
              {isGenerating ? 'Generating...' : 'Generate Schema'}
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

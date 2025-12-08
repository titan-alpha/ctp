'use client';

import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useJsonDiff, DiffItem } from '@/hooks/useJsonDiff';

const FEATURES = [
  {
    title: 'Deep Comparison',
    description: 'Recursively compares nested objects and arrays at any depth to find all differences.',
  },
  {
    title: 'Color-Coded Results',
    description: 'Easily identify changes with green for additions, red for removals, and yellow for modifications.',
  },
  {
    title: 'Privacy First',
    description: 'All comparisons happen locally in your browser. Your data never leaves your device.',
  },
];

const FAQS = [
  {
    question: 'What is JSON Diff?',
    answer: 'JSON Diff is a tool that compares two JSON objects and highlights the differences between them, showing added, removed, and modified properties.',
  },
  {
    question: 'How does deep comparison work?',
    answer: 'The tool recursively traverses both JSON structures, comparing values at every level including nested objects and arrays, to find all differences.',
  },
  {
    question: 'What do the colors mean?',
    answer: 'Green indicates new properties added in the second JSON, red shows properties removed from the first JSON, and yellow highlights properties that exist in both but have different values.',
  },
  {
    question: 'Can it compare arrays?',
    answer: 'Yes, the tool compares arrays by index, identifying added, removed, or modified elements at each position.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. All processing happens locally in your browser. Your JSON data is never sent to any server.',
  },
  {
    question: 'What JSON formats are supported?',
    answer: 'Any valid JSON is supported, including objects, arrays, strings, numbers, booleans, and null values at any nesting level.',
  },
];

function formatValue(value: unknown): string {
  if (value === undefined) return 'undefined';
  return JSON.stringify(value, null, 2);
}

function DiffItemDisplay({ diff }: { diff: DiffItem }) {
  const bgColor = {
    added: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    removed: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    modified: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
  }[diff.type];

  const textColor = {
    added: 'text-green-700 dark:text-green-400',
    removed: 'text-red-700 dark:text-red-400',
    modified: 'text-yellow-700 dark:text-yellow-400',
  }[diff.type];

  const label = {
    added: 'Added',
    removed: 'Removed',
    modified: 'Modified',
  }[diff.type];

  return (
    <div className={`p-3 rounded-lg border ${bgColor}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className={`text-xs font-semibold uppercase ${textColor}`}>{label}</span>
        <span className="font-mono text-sm text-gray-900 dark:text-white">{diff.path || '(root)'}</span>
      </div>
      {diff.type === 'modified' ? (
        <div className="text-sm space-y-1">
          <div className="text-red-600 dark:text-red-400">
            <span className="font-medium">-</span> <code className="text-xs">{formatValue(diff.oldValue)}</code>
          </div>
          <div className="text-green-600 dark:text-green-400">
            <span className="font-medium">+</span> <code className="text-xs">{formatValue(diff.newValue)}</code>
          </div>
        </div>
      ) : (
        <div className={`text-sm ${textColor}`}>
          <code className="text-xs">{formatValue(diff.type === 'added' ? diff.newValue : diff.oldValue)}</code>
        </div>
      )}
    </div>
  );
}

export function JsonDiff() {
  const {
    json1,
    setJson1,
    json2,
    setJson2,
    diffs,
    stats,
    error,
    isComparing,
    compare,
    reset,
  } = useJsonDiff();

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'JSON Diff Tool',
    description: 'Compare two JSON objects and find differences. Deep comparison with color-coded results for added, removed, and modified properties.',
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
    <SiteLayout toolName="JSON Diff" category="developer-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Compare JSON Objects
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Original JSON
              </label>
              <textarea
                value={json1}
                onChange={(e) => setJson1(e.target.value)}
                placeholder='{"name": "John", "age": 30}'
                className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Modified JSON
              </label>
              <textarea
                value={json2}
                onChange={(e) => setJson2(e.target.value)}
                placeholder='{"name": "Jane", "age": 25}'
                className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={compare}
              disabled={isComparing}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
            >
              {isComparing ? 'Comparing...' : 'Compare'}
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

          {stats.total > 0 && (
            <div className="mb-6 flex flex-wrap gap-4">
              <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Total: </span>
                <span className="font-bold text-gray-900 dark:text-white">{stats.total}</span>
              </div>
              <div className="px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <span className="text-green-600 dark:text-green-400">Added: </span>
                <span className="font-bold text-green-700 dark:text-green-300">{stats.added}</span>
              </div>
              <div className="px-4 py-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <span className="text-red-600 dark:text-red-400">Removed: </span>
                <span className="font-bold text-red-700 dark:text-red-300">{stats.removed}</span>
              </div>
              <div className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <span className="text-yellow-600 dark:text-yellow-400">Modified: </span>
                <span className="font-bold text-yellow-700 dark:text-yellow-300">{stats.modified}</span>
              </div>
            </div>
          )}

          {diffs.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Differences
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {diffs.map((diff, index) => (
                  <DiffItemDisplay key={index} diff={diff} />
                ))}
              </div>
            </div>
          )}

          {stats.total === 0 && diffs.length === 0 && json1 && json2 && !error && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg">
              No differences found. The JSON objects are identical.
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

'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { usePercentileCalculator, parseDataSet } from '@/hooks/usePercentileCalculator';

const FEATURES = [
  {
    title: 'Find Percentile Rank',
    description: 'Enter a data set and a value to find what percentile that value falls at within the distribution.',
  },
  {
    title: 'Find Value at Percentile',
    description: 'Enter a data set and a percentile to find the corresponding value at that percentile position.',
  },
  {
    title: 'Statistical Summary',
    description: 'Get comprehensive statistics including mean, median, min, max, and standard deviation.',
  },
];

const FAQS = [
  {
    question: 'What is a percentile?',
    answer: 'A percentile indicates the value below which a given percentage of observations fall. For example, the 90th percentile means 90% of the data points are below that value.',
  },
  {
    question: 'How is percentile rank calculated?',
    answer: 'Percentile rank is calculated as: ((number of values below + 0.5 * number of equal values) / total count) * 100. This gives the percentage of values that fall at or below a given value.',
  },
  {
    question: 'What is the difference between percentile and percentile rank?',
    answer: 'Percentile rank tells you what percentage of scores fall below a given value. Finding the value at a percentile does the reverse - it tells you what value corresponds to a given percentage.',
  },
  {
    question: 'How do I enter my data set?',
    answer: 'Enter your numbers separated by commas or spaces. For example: 10, 20, 30, 40, 50 or 10 20 30 40 50. The calculator will automatically parse and sort the values.',
  },
  {
    question: 'What is the median percentile?',
    answer: 'The median is the 50th percentile, meaning half the values fall below it and half fall above it. It represents the middle value of a sorted data set.',
  },
  {
    question: 'Can percentiles be used for test scores?',
    answer: 'Yes, percentiles are commonly used for standardized tests. If you scored in the 85th percentile, it means you scored higher than 85% of test takers.',
  },
];

export function PercentileCalculator() {
  const { result, error, calculateRank, calculateValue, reset } = usePercentileCalculator();
  const [dataInput, setDataInput] = useState('');
  const [value, setValue] = useState('');
  const [percentile, setPercentile] = useState('');
  const [mode, setMode] = useState<'findRank' | 'findValue'>('findRank');

  const handleCalculate = () => {
    const data = parseDataSet(dataInput);
    if (mode === 'findRank') {
      calculateRank(data, parseFloat(value));
    } else {
      calculateValue(data, parseFloat(percentile));
    }
  };

  const handleReset = () => {
    reset();
    setDataInput('');
    setValue('');
    setPercentile('');
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Percentile Calculator',
    description: 'Calculate percentile rank from a data set or find the value at a given percentile. Free online percentile calculator with statistics.',
    applicationCategory: 'EducationalApplication',
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
    <SiteLayout toolName="Percentile Calculator" category="education-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Percentile
          </h2>

          {/* Mode Toggle */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setMode('findRank')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                mode === 'findRank'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Find Percentile Rank
            </button>
            <button
              onClick={() => setMode('findValue')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                mode === 'findValue'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Find Value at Percentile
            </button>
          </div>

          {/* Data Set Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data Set (comma or space separated)
            </label>
            <textarea
              value={dataInput}
              onChange={(e) => setDataInput(e.target.value)}
              placeholder="Enter numbers: 10, 20, 30, 40, 50, 60, 70, 80, 90, 100"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Value or Percentile Input */}
          {mode === 'findRank' ? (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Value to Find Rank For
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter a value"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ) : (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Percentile (0-100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={percentile}
                onChange={(e) => setPercentile(e.target.value)}
                placeholder="Enter a percentile (e.g., 75)"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleCalculate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Calculate
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Results
            </h3>

            {/* Main Result */}
            <div className="text-center mb-6 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              {result.mode === 'findRank' ? (
                <>
                  <div className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                    Value {result.inputValue} is at the
                  </div>
                  <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {result.percentileRank}th
                  </div>
                  <div className="text-lg text-gray-600 dark:text-gray-400">Percentile</div>
                </>
              ) : (
                <>
                  <div className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                    The {result.inputPercentile}th percentile value is
                  </div>
                  <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {result.valueAtPercentile}
                  </div>
                </>
              )}
            </div>

            {/* Statistics */}
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Data Statistics</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{result.stats.count}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Count</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{result.stats.min}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Min</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{result.stats.max}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Max</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(result.stats.mean * 100) / 100}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Mean</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{result.stats.median}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Median</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(result.stats.standardDeviation * 100) / 100}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Std Dev</div>
              </div>
            </div>

            {/* Sorted Data */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sorted Data:</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm break-all">
                {result.stats.sortedData.join(', ')}
              </div>
            </div>
          </div>
        )}

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

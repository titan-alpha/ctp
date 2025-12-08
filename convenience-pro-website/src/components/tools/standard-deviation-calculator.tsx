'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useStandardDeviationCalculator, parseDataSet } from '@/hooks/useStandardDeviationCalculator';

const FEATURES = [
  {
    title: 'Population & Sample',
    description: 'Calculate both population standard deviation (divide by n) and sample standard deviation (divide by n-1) for your data set.',
  },
  {
    title: 'Step-by-Step Solution',
    description: 'View detailed calculation steps including mean, deviations, squared deviations, variance, and final standard deviation.',
  },
  {
    title: 'Complete Statistics',
    description: 'Get comprehensive results including mean, variance, standard deviation, sum, and count for thorough data analysis.',
  },
];

const FAQS = [
  {
    question: 'What is standard deviation?',
    answer: 'Standard deviation is a measure of how spread out numbers are from the mean. A low standard deviation means data points are close to the mean, while a high standard deviation means data points are spread out over a wider range.',
  },
  {
    question: 'What is the difference between population and sample standard deviation?',
    answer: 'Population standard deviation divides by n (total count), used when you have data for an entire population. Sample standard deviation divides by n-1 (Bessel\'s correction), used when you have a sample from a larger population to provide an unbiased estimate.',
  },
  {
    question: 'How do I calculate standard deviation?',
    answer: 'Standard deviation is calculated by: 1) Finding the mean, 2) Subtracting the mean from each value, 3) Squaring each difference, 4) Finding the average of squared differences (variance), 5) Taking the square root of the variance.',
  },
  {
    question: 'What is variance?',
    answer: 'Variance is the average of squared deviations from the mean. It measures how far each number in the set is from the mean and from every other number. Standard deviation is the square root of variance.',
  },
  {
    question: 'When should I use sample vs population standard deviation?',
    answer: 'Use population standard deviation when your data represents the entire population. Use sample standard deviation when your data is a sample from a larger population - this is more common in statistics and research.',
  },
  {
    question: 'What is a good standard deviation?',
    answer: 'There is no universal "good" standard deviation - it depends on context. A lower standard deviation indicates data points are clustered close to the mean, while a higher value indicates more spread. Compare it relative to your mean and data range.',
  },
];

export function StandardDeviationCalculator() {
  const { result, error, calculate, reset } = useStandardDeviationCalculator();
  const [dataInput, setDataInput] = useState('');
  const [type, setType] = useState<'population' | 'sample'>('sample');

  const handleCalculate = () => {
    const data = parseDataSet(dataInput);
    calculate(data, type);
  };

  const handleReset = () => {
    reset();
    setDataInput('');
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Standard Deviation Calculator',
    description: 'Calculate population and sample standard deviation with step-by-step solutions. Free online statistics calculator with variance and mean.',
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
    <SiteLayout toolName="Standard Deviation Calculator" category="education-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Standard Deviation
          </h2>

          {/* Type Toggle */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setType('sample')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                type === 'sample'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Sample (n-1)
            </button>
            <button
              onClick={() => setType('population')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                type === 'population'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Population (n)
            </button>
          </div>

          {/* Data Set Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data Set (comma or space separated)
            </label>
            <textarea
              value={dataInput}
              onChange={(e) => setDataInput(e.target.value)}
              placeholder="Enter numbers: 10, 20, 30, 40, 50 or 10 20 30 40 50"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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
              Results ({result.type === 'sample' ? 'Sample' : 'Population'})
            </h3>

            {/* Main Result */}
            <div className="text-center mb-6 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                Standard Deviation
              </div>
              <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                {result.standardDeviation.toFixed(4)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {result.type === 'sample' ? 's = ' : 'sigma = '}
                sqrt(variance) = sqrt({result.variance.toFixed(4)})
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {result.mean.toFixed(4)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Mean</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {result.variance.toFixed(4)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Variance</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{result.count}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Count (n)</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {result.sum.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Sum</div>
              </div>
            </div>

            {/* Step-by-Step */}
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Step-by-Step Calculation</h4>
            <div className="space-y-3">
              {result.steps.map((step) => (
                <div key={step.step} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {step.step}
                    </span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">{step.description}</div>
                      {step.formula && (
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-mono">
                          {step.formula}
                        </div>
                      )}
                      {step.value && (
                        <div className="text-sm text-blue-600 dark:text-blue-400 mt-1 font-semibold">
                          = {step.value}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Formula Reference */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Formula</h4>
              <div className="font-mono text-sm text-gray-700 dark:text-gray-300">
                {result.type === 'sample' ? (
                  <span>s = sqrt( sum((x - mean)^2) / (n-1) )</span>
                ) : (
                  <span>sigma = sqrt( sum((x - mean)^2) / n )</span>
                )}
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

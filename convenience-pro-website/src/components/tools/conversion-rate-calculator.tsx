'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useConversionRateCalculator } from '@/hooks/useConversionRateCalculator';

const FEATURES = [
  {
    title: 'Instant Conversion Rates',
    description: 'Calculate conversion rates instantly from visitors and conversions with percentage display.',
  },
  {
    title: 'A/B Test Analysis',
    description: 'Compare control and variant performance with statistical significance testing.',
  },
  {
    title: 'Statistical Significance',
    description: 'Get p-values, z-scores, and confidence levels to make data-driven decisions.',
  },
];

const FAQS = [
  {
    question: 'What is a conversion rate?',
    answer: 'Conversion rate is the percentage of visitors who complete a desired action (conversion). It is calculated by dividing the number of conversions by the total number of visitors and multiplying by 100.',
  },
  {
    question: 'What is a good conversion rate?',
    answer: 'A good conversion rate varies by industry, but generally 2-5% is considered average for e-commerce. Landing pages can achieve 10%+ with strong optimization. Always benchmark against your own historical data.',
  },
  {
    question: 'What is statistical significance in A/B testing?',
    answer: 'Statistical significance indicates the probability that the difference between variants is not due to random chance. A 95% confidence level (p < 0.05) is the standard threshold for declaring a test significant.',
  },
  {
    question: 'What is lift in A/B testing?',
    answer: 'Lift measures the percentage improvement of the variant over the control. A 10% lift means the variant converts 10% better than the control. Positive lift indicates the variant outperforms the control.',
  },
  {
    question: 'How many visitors do I need for a valid A/B test?',
    answer: 'Sample size depends on your baseline conversion rate and minimum detectable effect. Generally, you need at least 1,000 visitors per variant, but larger samples provide more reliable results.',
  },
  {
    question: 'What is a p-value?',
    answer: 'P-value is the probability of observing results as extreme as the test results, assuming no real difference exists. A p-value below 0.05 means there is less than 5% chance the results are due to random variation.',
  },
];

export function ConversionRateCalculator() {
  const { result, abTestResult, error, calculateRate, calculateABTest, reset } = useConversionRateCalculator();
  const [mode, setMode] = useState<'simple' | 'abtest'>('simple');
  const [visitors, setVisitors] = useState('');
  const [conversions, setConversions] = useState('');
  const [controlVisitors, setControlVisitors] = useState('');
  const [controlConversions, setControlConversions] = useState('');
  const [variantVisitors, setVariantVisitors] = useState('');
  const [variantConversions, setVariantConversions] = useState('');

  const handleCalculate = () => {
    if (mode === 'simple') {
      calculateRate(parseInt(visitors) || 0, parseInt(conversions) || 0);
    } else {
      calculateABTest(
        parseInt(controlVisitors) || 0,
        parseInt(controlConversions) || 0,
        parseInt(variantVisitors) || 0,
        parseInt(variantConversions) || 0
      );
    }
  };

  const handleReset = () => {
    reset();
    setVisitors('');
    setConversions('');
    setControlVisitors('');
    setControlConversions('');
    setVariantVisitors('');
    setVariantConversions('');
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Conversion Rate Calculator',
    description: 'Calculate conversion rates and A/B test statistical significance for marketing optimization.',
    applicationCategory: 'BusinessApplication',
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
    <SiteLayout toolName="Conversion Rate Calculator" category="business-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Conversion Rate
          </h2>

          {/* Mode Toggle */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setMode('simple')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                mode === 'simple'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Simple Calculator
            </button>
            <button
              onClick={() => setMode('abtest')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                mode === 'abtest'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              A/B Test Mode
            </button>
          </div>

          {/* Simple Mode Inputs */}
          {mode === 'simple' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Total Visitors
                </label>
                <input
                  type="number"
                  value={visitors}
                  onChange={(e) => setVisitors(e.target.value)}
                  placeholder="10000"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Conversions
                </label>
                <input
                  type="number"
                  value={conversions}
                  onChange={(e) => setConversions(e.target.value)}
                  placeholder="250"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* A/B Test Mode Inputs */}
          {mode === 'abtest' && (
            <div className="space-y-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Control (A)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Visitors
                    </label>
                    <input
                      type="number"
                      value={controlVisitors}
                      onChange={(e) => setControlVisitors(e.target.value)}
                      placeholder="5000"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Conversions
                    </label>
                    <input
                      type="number"
                      value={controlConversions}
                      onChange={(e) => setControlConversions(e.target.value)}
                      placeholder="100"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Variant (B)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Visitors
                    </label>
                    <input
                      type="number"
                      value={variantVisitors}
                      onChange={(e) => setVariantVisitors(e.target.value)}
                      placeholder="5000"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Conversions
                    </label>
                    <input
                      type="number"
                      value={variantConversions}
                      onChange={(e) => setVariantConversions(e.target.value)}
                      placeholder="130"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
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

        {/* Simple Result */}
        {result && mode === 'simple' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Results
            </h3>
            <div className="text-center py-8">
              <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {result.ratePercentage}%
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Conversion Rate
              </div>
            </div>
          </div>
        )}

        {/* A/B Test Result */}
        {abTestResult && mode === 'abtest' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              A/B Test Results
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {(abTestResult.controlRate * 100).toFixed(2)}%
                </div>
                <div className="text-gray-600 dark:text-gray-400">Control Rate</div>
              </div>
              <div className="text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {(abTestResult.variantRate * 100).toFixed(2)}%
                </div>
                <div className="text-gray-600 dark:text-gray-400">Variant Rate</div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="py-3 text-gray-600 dark:text-gray-400 font-medium">Lift</td>
                    <td className={`py-3 font-semibold ${
                      abTestResult.lift >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {abTestResult.lift >= 0 ? '+' : ''}{abTestResult.liftPercentage}%
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-600 dark:text-gray-400 font-medium">Statistical Significance</td>
                    <td className={`py-3 font-semibold ${
                      abTestResult.isSignificant ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
                    }`}>
                      {abTestResult.isSignificant ? 'Yes (95% confidence)' : 'Not yet significant'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-600 dark:text-gray-400 font-medium">Confidence Level</td>
                    <td className="py-3 text-gray-900 dark:text-white">{abTestResult.confidenceLevel.toFixed(2)}%</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-600 dark:text-gray-400 font-medium">P-Value</td>
                    <td className="py-3 text-gray-900 dark:text-white font-mono">{abTestResult.pValue.toFixed(4)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-600 dark:text-gray-400 font-medium">Z-Score</td>
                    <td className="py-3 text-gray-900 dark:text-white font-mono">{abTestResult.zScore.toFixed(4)}</td>
                  </tr>
                </tbody>
              </table>
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

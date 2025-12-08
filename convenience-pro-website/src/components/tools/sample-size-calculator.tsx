'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useSampleSizeCalculator } from '@/hooks/useSampleSizeCalculator';

const FEATURES = [
  {
    title: 'Statistical Accuracy',
    description: 'Calculate the exact sample size needed using Cochran\'s formula with finite population correction for reliable survey results.',
  },
  {
    title: 'Flexible Confidence Levels',
    description: 'Choose from multiple confidence levels (80%, 85%, 90%, 95%, 99%) to match your research requirements.',
  },
  {
    title: 'Instant Explanation',
    description: 'Get a clear, plain-English explanation of what your sample size means and how it relates to your population.',
  },
];

const FAQS = [
  {
    question: 'What is sample size?',
    answer: 'Sample size is the number of observations or respondents you need to collect data from in order to make statistically valid conclusions about a larger population. A properly calculated sample size ensures your research results are reliable.',
  },
  {
    question: 'What is confidence level?',
    answer: 'Confidence level represents how certain you can be that your sample results reflect the true population. A 95% confidence level means if you repeated the survey 100 times, 95 of those surveys would capture the true population value.',
  },
  {
    question: 'What is margin of error?',
    answer: 'Margin of error indicates how much your sample results may differ from the true population value. A 5% margin of error means your results could be up to 5 percentage points higher or lower than the actual population value.',
  },
  {
    question: 'Why does population size matter?',
    answer: 'For smaller populations, you need to survey a larger percentage to achieve the same accuracy. The finite population correction factor adjusts the sample size calculation to account for this, potentially reducing the required sample size.',
  },
  {
    question: 'What confidence level should I use?',
    answer: '95% is the most commonly used confidence level in research. Use 99% for high-stakes decisions requiring more certainty, or 90% for preliminary research where slightly less precision is acceptable.',
  },
  {
    question: 'How can I reduce my required sample size?',
    answer: 'You can reduce sample size by accepting a larger margin of error or lower confidence level. However, this trades off statistical reliability. Consider your research goals and tolerance for uncertainty when making this decision.',
  },
];

const CONFIDENCE_LEVELS = [80, 85, 90, 95, 99];

export function SampleSizeCalculator() {
  const { result, error, calculate, reset } = useSampleSizeCalculator();
  const [population, setPopulation] = useState('');
  const [confidenceLevel, setConfidenceLevel] = useState(95);
  const [marginOfError, setMarginOfError] = useState(5);

  const handleCalculate = () => {
    calculate(parseInt(population), confidenceLevel, marginOfError);
  };

  const handleReset = () => {
    reset();
    setPopulation('');
    setConfidenceLevel(95);
    setMarginOfError(5);
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Sample Size Calculator',
    description: 'Calculate the required sample size for surveys and research studies. Determine how many respondents you need for statistically valid results.',
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
    <SiteLayout toolName="Sample Size Calculator" category="education-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Sample Size
          </h2>

          {/* Population Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Population Size
            </label>
            <input
              type="number"
              value={population}
              onChange={(e) => setPopulation(e.target.value)}
              placeholder="Enter total population (e.g., 10000)"
              min="1"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Confidence Level */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confidence Level
            </label>
            <div className="flex flex-wrap gap-2">
              {CONFIDENCE_LEVELS.map((level) => (
                <button
                  key={level}
                  onClick={() => setConfidenceLevel(level)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    confidenceLevel === level
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {level}%
                </button>
              ))}
            </div>
          </div>

          {/* Margin of Error Slider */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Margin of Error: {marginOfError}%
            </label>
            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={marginOfError}
              onChange={(e) => setMarginOfError(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>1%</span>
              <span>5%</span>
              <span>10%</span>
              <span>15%</span>
              <span>20%</span>
            </div>
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
              Results
            </h3>

            {/* Main Result */}
            <div className="text-center mb-6 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                Required Sample Size
              </div>
              <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {result.sampleSize.toLocaleString()}
              </div>
              <div className="text-lg text-gray-600 dark:text-gray-400">respondents</div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {result.population.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Population</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {result.confidenceLevel}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Confidence</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {result.marginOfError}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Margin of Error</div>
              </div>
            </div>

            {/* Explanation */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                Explanation
              </div>
              <p className="text-blue-700 dark:text-blue-200 text-sm">
                {result.explanation}
              </p>
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

'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useStairsCalculator } from '@/hooks/useStairsCalculator';

const FEATURES = [
  {
    title: 'Code Compliance Check',
    description: 'Automatically verify your stair dimensions meet IRC building code requirements for safe residential stairs.',
  },
  {
    title: 'Optimal Dimensions',
    description: 'Calculate the ideal number of risers and treads based on your total rise and preferred step dimensions.',
  },
  {
    title: 'Visual Diagram',
    description: 'See a clear visual representation of your stair dimensions including rise, run, and angle.',
  },
];

const FAQS = [
  {
    question: 'What is the ideal riser height for stairs?',
    answer: 'The ideal riser height is typically between 7 and 7.5 inches. Building codes (IRC) require risers to be no more than 7.75 inches and no less than 4 inches for residential stairs.',
  },
  {
    question: 'What is the minimum tread depth for stairs?',
    answer: 'According to the International Residential Code (IRC), the minimum tread depth for residential stairs is 10 inches, measured horizontally from the front to back of the step.',
  },
  {
    question: 'How do I calculate the number of stairs I need?',
    answer: 'Divide the total rise (floor-to-floor height) by your desired riser height. Round to the nearest whole number. For example, a 108-inch rise divided by 7.5-inch risers equals approximately 14 steps.',
  },
  {
    question: 'What is the 7-11 rule for stairs?',
    answer: 'The 7-11 rule is a guideline suggesting risers should be about 7 inches high and treads should be about 11 inches deep. This ratio provides comfortable and safe stairs for most people.',
  },
  {
    question: 'What angle should stairs be?',
    answer: 'Residential stairs should typically be between 30 and 42 degrees. Steeper angles can be uncomfortable and may not meet building codes. The optimal angle is around 37 degrees.',
  },
  {
    question: 'Why is uniform riser height important?',
    answer: 'Uniform riser heights prevent tripping hazards. Building codes typically require all risers in a staircase to be within 3/8 inch of each other. Inconsistent risers are a leading cause of stair accidents.',
  },
];

export function StairsCalculator() {
  const { result, calculate, reset } = useStairsCalculator();

  const [totalRise, setTotalRise] = useState('');
  const [preferredRiserHeight, setPreferredRiserHeight] = useState('7.5');
  const [preferredTreadDepth, setPreferredTreadDepth] = useState('11');

  const handleCalculate = () => {
    if (totalRise) {
      calculate({
        totalRise: parseFloat(totalRise) || 0,
        preferredRiserHeight: parseFloat(preferredRiserHeight) || 7.5,
        preferredTreadDepth: parseFloat(preferredTreadDepth) || 11,
      });
    }
  };

  const handleReset = () => {
    reset();
    setTotalRise('');
    setPreferredRiserHeight('7.5');
    setPreferredTreadDepth('11');
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Stairs Calculator',
    description: 'Calculate stair dimensions including riser count, tread depth, and check building code compliance.',
    applicationCategory: 'UtilitiesApplication',
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
    <SiteLayout toolName="Stairs Calculator" category="home-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Stair Dimensions
          </h2>

          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Total Rise (inches)
              </label>
              <input
                type="number"
                value={totalRise}
                onChange={(e) => setTotalRise(e.target.value)}
                placeholder="108"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Floor-to-floor height</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Preferred Riser Height (in)
              </label>
              <input
                type="number"
                value={preferredRiserHeight}
                onChange={(e) => setPreferredRiserHeight(e.target.value)}
                step="0.25"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Typical: 7-7.75"</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tread Depth (inches)
              </label>
              <input
                type="number"
                value={preferredTreadDepth}
                onChange={(e) => setPreferredTreadDepth(e.target.value)}
                step="0.5"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Minimum: 10"</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleCalculate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Calculate Stairs
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
              Stair Dimensions
            </h3>

            {/* Code Compliance */}
            <div className={`p-4 rounded-lg mb-6 ${
              result.isCodeCompliant
                ? 'bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700'
                : 'bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700'
            }`}>
              <div className={`font-semibold ${
                result.isCodeCompliant
                  ? 'text-green-700 dark:text-green-300'
                  : 'text-red-700 dark:text-red-300'
              }`}>
                {result.isCodeCompliant ? 'Meets Building Code' : 'Code Compliance Issues'}
              </div>
              {!result.isCodeCompliant && (
                <ul className="mt-2 text-sm text-red-600 dark:text-red-400 list-disc list-inside">
                  {result.complianceIssues.map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Dimension Results */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <div className="text-sm text-blue-600 dark:text-blue-400">Number of Risers</div>
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                  {result.riserCount}
                </div>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Riser Height</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {result.actualRiserHeight.toFixed(2)}"
                </div>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Tread Depth</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {result.treadDepth}"
                </div>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Stair Angle</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {result.stairAngle.toFixed(1)}°
                </div>
              </div>
            </div>

            {/* Total Run */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Total Run (horizontal distance)</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {result.totalRun.toFixed(1)}" ({(result.totalRun / 12).toFixed(2)} ft)
                </span>
              </div>
            </div>

            {/* Stair Diagram */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">Dimension Diagram</h4>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 flex justify-center">
                <svg viewBox="0 0 300 200" className="w-full max-w-md" style={{ maxHeight: '250px' }}>
                  {/* Stair profile */}
                  <path
                    d="M 50 180 L 50 140 L 90 140 L 90 100 L 130 100 L 130 60 L 170 60 L 170 20 L 250 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-blue-600 dark:text-blue-400"
                  />
                  {/* Rise arrow */}
                  <line x1="30" y1="180" x2="30" y2="20" stroke="currentColor" strokeWidth="1" className="text-gray-400" markerEnd="url(#arrowhead)" />
                  <line x1="28" y1="180" x2="32" y2="180" stroke="currentColor" strokeWidth="1" className="text-gray-400" />
                  <line x1="28" y1="20" x2="32" y2="20" stroke="currentColor" strokeWidth="1" className="text-gray-400" />
                  <text x="15" y="100" fontSize="10" className="fill-gray-600 dark:fill-gray-400" transform="rotate(-90, 15, 100)">Rise</text>
                  {/* Run arrow */}
                  <line x1="50" y1="195" x2="250" y2="195" stroke="currentColor" strokeWidth="1" className="text-gray-400" />
                  <line x1="50" y1="193" x2="50" y2="197" stroke="currentColor" strokeWidth="1" className="text-gray-400" />
                  <line x1="250" y1="193" x2="250" y2="197" stroke="currentColor" strokeWidth="1" className="text-gray-400" />
                  <text x="150" y="190" fontSize="10" textAnchor="middle" className="fill-gray-600 dark:fill-gray-400">Run</text>
                  {/* Riser dimension */}
                  <text x="60" y="165" fontSize="9" className="fill-blue-600 dark:fill-blue-400">{result.actualRiserHeight.toFixed(1)}"</text>
                  {/* Tread dimension */}
                  <text x="95" y="135" fontSize="9" className="fill-blue-600 dark:fill-blue-400">{result.treadDepth}"</text>
                </svg>
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

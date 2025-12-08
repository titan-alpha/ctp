'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useOneRepMaxCalculator } from '@/hooks/useOneRepMaxCalculator';

const FEATURES = [
  {
    title: 'Multiple Formulas',
    description: 'Compare Epley and Brzycki formulas to get the most accurate estimate of your one-rep max.',
  },
  {
    title: 'Training Load Chart',
    description: 'See recommended weights for different rep ranges to optimize your training program.',
  },
  {
    title: 'Instant Calculations',
    description: 'Get your results immediately with no signup required. Calculate as many times as needed.',
  },
];

const FAQS = [
  {
    question: 'What is a one-rep max (1RM)?',
    answer: 'A one-rep max is the maximum amount of weight you can lift for a single repetition with proper form. It is used to measure strength and program training intensity.',
  },
  {
    question: 'How accurate are 1RM calculators?',
    answer: 'Calculators are most accurate with 2-10 reps. Beyond 10 reps, accuracy decreases. For best results, test with a weight you can lift 3-5 times.',
  },
  {
    question: 'What is the Epley formula?',
    answer: 'The Epley formula calculates 1RM as: weight x (1 + reps/30). It tends to give slightly higher estimates for higher rep ranges.',
  },
  {
    question: 'What is the Brzycki formula?',
    answer: 'The Brzycki formula calculates 1RM as: weight x 36/(37-reps). It is often considered more accurate for lower rep ranges (under 10 reps).',
  },
  {
    question: 'How should I use the training load percentages?',
    answer: 'Use 85-100% for strength work (1-6 reps), 70-85% for hypertrophy (6-12 reps), and 50-70% for endurance or warm-up sets.',
  },
  {
    question: 'Should I actually attempt my calculated 1RM?',
    answer: 'Only attempt true 1RM lifts with proper warm-up, a spotter, and good technique. The calculated value is an estimate to guide your training, not a guaranteed lift.',
  },
];

export function OneRepMaxCalculator() {
  const { result, calculate, reset } = useOneRepMaxCalculator();

  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');

  const handleCalculate = () => {
    const weightVal = parseFloat(weight);
    const repsVal = parseInt(reps);
    if (weightVal > 0 && repsVal > 0 && repsVal <= 30) {
      calculate(weightVal, repsVal);
    }
  };

  const handleReset = () => {
    reset();
    setWeight('');
    setReps('');
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'One Rep Max Calculator',
    description: 'Calculate your one-rep max using Epley and Brzycki formulas with training load percentages.',
    applicationCategory: 'HealthApplication',
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
    <SiteLayout toolName="One Rep Max Calculator" category="health">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Your One Rep Max
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Weight Lifted
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="135"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">lbs or kg</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reps Performed
              </label>
              <input
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder="5"
                min="1"
                max="30"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">1-30 reps</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleCalculate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Calculate 1RM
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
              Your Estimated One Rep Max
            </h3>

            {/* Average 1RM Display */}
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <div className="text-sm text-blue-600 dark:text-blue-400">Estimated 1RM (Average)</div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white">{result.average}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">lbs/kg</div>
            </div>

            {/* Formula Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                  {result.epley.name} Formula
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {result.epley.oneRepMax}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {result.epley.formula}
                </div>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500">
                <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                  {result.brzycki.name} Formula
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {result.brzycki.oneRepMax}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {result.brzycki.formula}
                </div>
              </div>
            </div>

            {/* Training Load Table */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Training Load Chart
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">% of 1RM</th>
                      <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Weight</th>
                      <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Rep Range</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.trainingLoads.map((load) => (
                      <tr
                        key={load.percentage}
                        className="border-b border-gray-200 dark:border-gray-700"
                      >
                        <td className="px-4 py-2 text-gray-900 dark:text-white font-medium">
                          {load.percentage}%
                        </td>
                        <td className="px-4 py-2 text-gray-900 dark:text-white">
                          {load.weight}
                        </td>
                        <td className="px-4 py-2 text-gray-500 dark:text-gray-400">
                          {load.reps} reps
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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

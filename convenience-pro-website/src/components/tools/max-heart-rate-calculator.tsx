'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useMaxHeartRateCalculator, Gender } from '@/hooks/useMaxHeartRateCalculator';

const FEATURES = [
  {
    title: 'Multiple Formulas',
    description: 'Compare results from Traditional (220-age), Tanaka, and Gulati formulas to get a more accurate estimate.',
  },
  {
    title: 'Gender-Specific',
    description: 'The Gulati formula provides more accurate results specifically designed for women.',
  },
  {
    title: 'Target Heart Rate Zones',
    description: 'Get personalized training zones from recovery to maximum intensity based on your calculated MHR.',
  },
];

const FAQS = [
  {
    question: 'What is maximum heart rate (MHR)?',
    answer: 'Maximum heart rate is the highest number of beats per minute your heart can achieve during maximum physical exertion. It\'s used to calculate target heart rate zones for training.',
  },
  {
    question: 'Which formula is most accurate?',
    answer: 'The Tanaka formula (208 - 0.7 x age) is generally considered more accurate for the general population. For women, the Gulati formula (206 - 0.88 x age) may provide better estimates.',
  },
  {
    question: 'Why does gender matter for MHR calculations?',
    answer: 'Research has shown that women tend to have different age-related MHR decline patterns than men. The Gulati formula was developed specifically from studies on women.',
  },
  {
    question: 'What are heart rate training zones?',
    answer: 'Training zones are ranges of heart rates that correspond to different exercise intensities. Each zone provides different benefits, from fat burning to maximum performance.',
  },
  {
    question: 'How do I use my target heart rate zones?',
    answer: 'Monitor your heart rate during exercise using a fitness tracker or chest strap. Stay within your target zone for the type of training you want - lower zones for endurance, higher zones for intensity.',
  },
  {
    question: 'Is MHR the same as resting heart rate?',
    answer: 'No, they are different. Resting heart rate is your pulse when completely at rest (typically 60-100 bpm). Maximum heart rate is achieved during intense exercise and decreases with age.',
  },
];

export function MaxHeartRateCalculator() {
  const { result, calculate, reset } = useMaxHeartRateCalculator();
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender>('male');

  const handleCalculate = () => {
    const ageValue = parseInt(age);
    if (ageValue > 0) {
      calculate(ageValue, gender);
    }
  };

  const handleReset = () => {
    reset();
    setAge('');
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Max Heart Rate Calculator',
    description: 'Calculate your maximum heart rate using multiple scientifically-backed formulas and get personalized target heart rate zones.',
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
    <SiteLayout toolName="Max Heart Rate Calculator" category="health">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Your Max Heart Rate
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter your age"
                min="1"
                max="120"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Gender (optional - for Gulati formula)
              </label>
              <div className="flex gap-4 mt-2">
                <button
                  onClick={() => setGender('male')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    gender === 'male'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Male
                </button>
                <button
                  onClick={() => setGender('female')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    gender === 'female'
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleCalculate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Calculate MHR
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
          <>
            {/* Formula Comparison */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Formula Comparison
              </h3>
              <div className={`grid gap-4 ${gender === 'female' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                  <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">Traditional (220-age)</div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {result.formulas.traditional} <span className="text-lg">bpm</span>
                  </div>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                  <div className="text-sm text-green-600 dark:text-green-400 font-medium">Tanaka (208-0.7xage)</div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {result.formulas.tanaka} <span className="text-lg">bpm</span>
                  </div>
                </div>
                {result.formulas.gulati !== null && (
                  <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border-l-4 border-pink-500">
                    <div className="text-sm text-pink-600 dark:text-pink-400 font-medium">Gulati (206-0.88xage)</div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {result.formulas.gulati} <span className="text-lg">bpm</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">Average Max Heart Rate</div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white">{result.average} bpm</div>
              </div>
            </div>

            {/* Target Zones */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Target Heart Rate Zones
              </h3>
              <div className="space-y-3">
                {result.targetZones.map((zone, index) => {
                  const colors = [
                    'bg-gray-100 border-gray-400',
                    'bg-blue-100 border-blue-500',
                    'bg-green-100 border-green-500',
                    'bg-orange-100 border-orange-500',
                    'bg-red-100 border-red-500',
                  ];
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-l-4 ${colors[index]} dark:bg-gray-700`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-gray-900 dark:text-white">{zone.name}</span>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          {zone.minBpm}-{zone.maxBpm} bpm
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>{zone.description}</span>
                        <span>{zone.minPercent}-{zone.maxPercent}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
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

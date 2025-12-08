'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useBraSizeCalculator, MeasurementUnit } from '@/hooks/useBraSizeCalculator';

const FEATURES = [
  {
    title: 'Multiple Size Systems',
    description: 'Get your bra size in US, UK, and EU sizing systems all at once for easy international shopping.',
  },
  {
    title: 'Flexible Measurements',
    description: 'Enter measurements in either inches or centimeters based on your preference.',
  },
  {
    title: 'Accurate Calculations',
    description: 'Uses standard industry formulas to calculate both band and cup sizes from your measurements.',
  },
];

const FAQS = [
  {
    question: 'How do I measure my band size?',
    answer: 'Measure around your ribcage, directly under your bust, where the band would sit. Keep the tape measure snug but comfortable. Round to the nearest whole number.',
  },
  {
    question: 'How do I measure my bust size?',
    answer: 'Measure around the fullest part of your bust while wearing a non-padded bra. Keep the tape measure level and not too tight. This measurement determines your cup size.',
  },
  {
    question: 'What is the difference between US and UK bra sizes?',
    answer: 'US and UK sizes share the same band numbers but differ in cup progression after D. UK uses DD, E, F, FF, G while US typically uses DD, DDD (or F), G, H.',
  },
  {
    question: 'How do EU bra sizes work?',
    answer: 'EU band sizes are roughly 50 more than US/UK (e.g., US 34 = EU 75). Cup letters are similar to UK sizing but may vary by country.',
  },
  {
    question: 'Why might my calculated size differ from what I wear?',
    answer: 'Bra sizing varies between brands and styles. This calculator provides a starting point - always try on bras and adjust based on fit and comfort.',
  },
  {
    question: 'Should the tape measure be tight when measuring?',
    answer: 'For band measurement, the tape should be snug against your body. For bust measurement, keep it level but not compressing. Both should allow you to breathe comfortably.',
  },
];

export function BraSizeCalculator() {
  const { result, calculate, reset } = useBraSizeCalculator();

  const [bandMeasurement, setBandMeasurement] = useState('');
  const [bustMeasurement, setBustMeasurement] = useState('');
  const [unit, setUnit] = useState<MeasurementUnit>('inches');

  const handleCalculate = () => {
    if (bandMeasurement && bustMeasurement) {
      calculate({
        bandMeasurement: parseFloat(bandMeasurement),
        bustMeasurement: parseFloat(bustMeasurement),
        unit,
      });
    }
  };

  const handleReset = () => {
    reset();
    setBandMeasurement('');
    setBustMeasurement('');
    setUnit('inches');
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Bra Size Calculator',
    description: 'Calculate your bra size from band and bust measurements. Get US, UK, and EU sizes.',
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
    <SiteLayout toolName="Bra Size Calculator" category="lifestyle-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Your Bra Size
          </h2>

          {/* Unit Toggle */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Measurement Unit
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setUnit('inches')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  unit === 'inches'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Inches
              </button>
              <button
                onClick={() => setUnit('cm')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  unit === 'cm'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Centimeters
              </button>
            </div>
          </div>

          {/* Measurement Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Band Measurement ({unit})
              </label>
              <input
                type="number"
                value={bandMeasurement}
                onChange={(e) => setBandMeasurement(e.target.value)}
                placeholder={unit === 'inches' ? 'e.g., 32' : 'e.g., 81'}
                step="0.5"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Measure under your bust
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bust Measurement ({unit})
              </label>
              <input
                type="number"
                value={bustMeasurement}
                onChange={(e) => setBustMeasurement(e.target.value)}
                placeholder={unit === 'inches' ? 'e.g., 36' : 'e.g., 91'}
                step="0.5"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Measure at the fullest point
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleCalculate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Calculate Size
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
              Your Bra Size
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-center">
                <div className="text-sm text-blue-600 dark:text-blue-400">US Size</div>
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                  {result.US}
                </div>
              </div>
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg text-center">
                <div className="text-sm text-green-600 dark:text-green-400">UK Size</div>
                <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                  {result.UK}
                </div>
              </div>
              <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-center">
                <div className="text-sm text-purple-600 dark:text-purple-400">EU Size</div>
                <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                  {result.EU}
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Band Size:</strong> {result.bandSize} | <strong>Cup Size:</strong> {result.cupSize}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                Note: Sizes may vary between brands. Use this as a starting point and try on for best fit.
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

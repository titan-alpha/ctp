'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useRingSizeConverter, RingSizeSystem, MeasurementType } from '@/hooks/useRingSizeConverter';

const FEATURES = [
  {
    title: 'Multi-System Conversion',
    description: 'Convert between US, UK, and EU ring sizing systems instantly with accurate mapping.',
  },
  {
    title: 'Measurement Input',
    description: 'Enter your finger circumference or diameter in millimeters to find your perfect ring size.',
  },
  {
    title: 'Complete Size Chart',
    description: 'View a comprehensive conversion table showing all sizes across different international standards.',
  },
];

const FAQS = [
  {
    question: 'How do I measure my ring size at home?',
    answer: 'Wrap a piece of string or paper strip around your finger, mark where it overlaps, then measure the length in millimeters. This is your circumference. Enter it in our converter for your ring size.',
  },
  {
    question: 'What is the difference between US and UK ring sizes?',
    answer: 'US sizes use numbers (3-13), while UK sizes use letters (F-Z). For example, US size 7 equals UK size N. Our converter handles both systems accurately.',
  },
  {
    question: 'How do EU ring sizes work?',
    answer: 'European ring sizes are based on the inner circumference in millimeters. A EU size 54 means the ring has approximately 54mm inner circumference.',
  },
  {
    question: 'Should I size up or down if between sizes?',
    answer: 'If between sizes, size up for comfort, especially for wider bands. Fingers swell throughout the day and in warm weather, so a slightly larger size is usually better.',
  },
  {
    question: 'Does ring width affect sizing?',
    answer: 'Yes, wider bands (over 6mm) feel tighter. Consider going up half a size for bands wider than 6mm and a full size for bands over 8mm wide.',
  },
  {
    question: 'When is the best time to measure my finger?',
    answer: 'Measure at the end of the day when fingers are largest. Avoid measuring when cold, as fingers shrink. Room temperature and normal conditions give the most accurate reading.',
  },
];

export function RingSizeConverter() {
  const { result, allSizes, convertFromSize, convertFromMeasurement, reset } = useRingSizeConverter();

  const [inputMode, setInputMode] = useState<'size' | 'measurement'>('size');
  const [sizeSystem, setSizeSystem] = useState<RingSizeSystem>('US');
  const [sizeValue, setSizeValue] = useState('');
  const [measurementType, setMeasurementType] = useState<MeasurementType>('circumference');
  const [measurementValue, setMeasurementValue] = useState('');

  const handleConvert = () => {
    if (inputMode === 'size' && sizeValue) {
      convertFromSize(sizeSystem === 'UK' ? sizeValue : parseFloat(sizeValue), sizeSystem);
    } else if (inputMode === 'measurement' && measurementValue) {
      convertFromMeasurement(parseFloat(measurementValue), measurementType);
    }
  };

  const handleReset = () => {
    reset();
    setSizeValue('');
    setMeasurementValue('');
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Ring Size Converter',
    description: 'Convert ring sizes between US, UK, and EU systems. Find your size from circumference or diameter measurements.',
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
    <SiteLayout toolName="Ring Size Converter" category="lifestyle-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Convert Ring Size
          </h2>

          {/* Input Mode Toggle */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Conversion Method
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setInputMode('size')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  inputMode === 'size'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                From Size
              </button>
              <button
                onClick={() => setInputMode('measurement')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  inputMode === 'measurement'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                From Measurement
              </button>
            </div>
          </div>

          {inputMode === 'size' ? (
            <>
              {/* Size System Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Size System
                </label>
                <select
                  value={sizeSystem}
                  onChange={(e) => setSizeSystem(e.target.value as RingSizeSystem)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="US">US (Numbers)</option>
                  <option value="UK">UK (Letters)</option>
                  <option value="EU">EU (Millimeters)</option>
                </select>
              </div>

              {/* Size Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enter {sizeSystem} Size
                </label>
                {sizeSystem === 'UK' ? (
                  <select
                    value={sizeValue}
                    onChange={(e) => setSizeValue(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select UK size</option>
                    {allSizes.map((size) => (
                      <option key={size.uk} value={size.uk}>
                        {size.uk}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="number"
                    value={sizeValue}
                    onChange={(e) => setSizeValue(e.target.value)}
                    placeholder={sizeSystem === 'US' ? 'e.g., 7' : 'e.g., 54'}
                    step={sizeSystem === 'US' ? '0.5' : '0.5'}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                )}
              </div>
            </>
          ) : (
            <>
              {/* Measurement Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Measurement Type
                </label>
                <select
                  value={measurementType}
                  onChange={(e) => setMeasurementType(e.target.value as MeasurementType)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="circumference">Circumference (wrap around finger)</option>
                  <option value="diameter">Diameter (across existing ring)</option>
                </select>
              </div>

              {/* Measurement Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {measurementType === 'circumference' ? 'Circumference' : 'Diameter'} (mm)
                </label>
                <input
                  type="number"
                  value={measurementValue}
                  onChange={(e) => setMeasurementValue(e.target.value)}
                  placeholder={measurementType === 'circumference' ? 'e.g., 54.4' : 'e.g., 17.3'}
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleConvert}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Convert
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
              Your Ring Size
              {!result.isExact && (
                <span className="text-sm font-normal text-yellow-600 dark:text-yellow-400 ml-2">
                  (Closest match)
                </span>
              )}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-center">
                <div className="text-sm text-blue-600 dark:text-blue-400">US Size</div>
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                  {result.us}
                </div>
              </div>
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg text-center">
                <div className="text-sm text-green-600 dark:text-green-400">UK Size</div>
                <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                  {result.uk}
                </div>
              </div>
              <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-center">
                <div className="text-sm text-purple-600 dark:text-purple-400">EU Size</div>
                <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                  {result.eu}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Measurements</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Circumference</span>
                  <span className="text-gray-900 dark:text-white font-medium">{result.circumference} mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Diameter</span>
                  <span className="text-gray-900 dark:text-white font-medium">{result.diameter} mm</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Conversion Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Ring Size Conversion Chart
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-3 py-2 text-left text-gray-600 dark:text-gray-400">US</th>
                  <th className="px-3 py-2 text-left text-gray-600 dark:text-gray-400">UK</th>
                  <th className="px-3 py-2 text-left text-gray-600 dark:text-gray-400">EU</th>
                  <th className="px-3 py-2 text-left text-gray-600 dark:text-gray-400">Circumference</th>
                  <th className="px-3 py-2 text-left text-gray-600 dark:text-gray-400">Diameter</th>
                </tr>
              </thead>
              <tbody>
                {allSizes.map((size) => (
                  <tr
                    key={size.us}
                    className={`border-b border-gray-100 dark:border-gray-700 ${
                      result?.us === size.us ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <td className="px-3 py-2 text-gray-900 dark:text-white">{size.us}</td>
                    <td className="px-3 py-2 text-gray-900 dark:text-white">{size.uk}</td>
                    <td className="px-3 py-2 text-gray-900 dark:text-white">{size.eu}</td>
                    <td className="px-3 py-2 text-gray-900 dark:text-white">{size.circumference} mm</td>
                    <td className="px-3 py-2 text-gray-900 dark:text-white">{size.diameter} mm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

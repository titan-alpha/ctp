'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useShoeSizeConverter, SizeSystem, Gender } from '@/hooks/useShoeSizeConverter';

const FEATURES = [
  {
    title: 'Multi-System Support',
    description: 'Convert between US, UK, EU, and CM sizing systems instantly with accurate calculations.',
  },
  {
    title: 'Gender-Specific Sizing',
    description: 'Separate conversion tables for men\'s and women\'s shoes ensure precise results.',
  },
  {
    title: 'All Conversions at Once',
    description: 'Enter one size and get equivalent sizes in all four measurement systems simultaneously.',
  },
];

const FAQS = [
  {
    question: 'What is the difference between men\'s and women\'s shoe sizes?',
    answer: 'Women\'s US shoe sizes are typically 1.5 to 2 sizes larger than men\'s for the same foot length. For example, a women\'s US 9 is roughly equivalent to a men\'s US 7.5.',
  },
  {
    question: 'How do I measure my foot size in CM?',
    answer: 'Place your foot on a piece of paper, mark the heel and longest toe, then measure the distance between marks in centimeters. Measure both feet and use the larger measurement.',
  },
  {
    question: 'Are shoe sizes the same across all brands?',
    answer: 'No, shoe sizes can vary between brands and even between different styles from the same brand. This converter provides standard sizing, but always try shoes on or check brand-specific size guides.',
  },
  {
    question: 'What is the EU shoe sizing system?',
    answer: 'EU (European) sizing uses Paris Points, where each size is 2/3 of a centimeter. EU sizes are the same for men and women, unlike US and UK systems.',
  },
  {
    question: 'How does UK sizing differ from US sizing?',
    answer: 'UK men\'s sizes are typically 0.5 sizes smaller than US men\'s sizes. UK women\'s sizes are about 2 sizes smaller than US women\'s sizes.',
  },
  {
    question: 'Should I size up or down if I\'m between sizes?',
    answer: 'It\'s generally recommended to size up if you\'re between sizes. A slightly larger shoe can be adjusted with insoles, while a tight shoe can cause discomfort and foot problems.',
  },
];

const SIZE_SYSTEMS: SizeSystem[] = ['US', 'UK', 'EU', 'CM'];

export function ShoeSizeConverter() {
  const { result, convert, reset } = useShoeSizeConverter();

  const [size, setSize] = useState('');
  const [system, setSystem] = useState<SizeSystem>('US');
  const [gender, setGender] = useState<Gender>('men');

  const handleConvert = () => {
    if (size) {
      convert({
        size: parseFloat(size),
        system,
        gender,
      });
    }
  };

  const handleReset = () => {
    reset();
    setSize('');
    setSystem('US');
    setGender('men');
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Shoe Size Converter',
    description: 'Convert shoe sizes between US, UK, EU, and CM for men and women.',
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
    <SiteLayout toolName="Shoe Size Converter" category="lifestyle-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Convert Shoe Sizes
          </h2>

          {/* Gender Toggle */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gender
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setGender('men')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  gender === 'men'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Men
              </button>
              <button
                onClick={() => setGender('women')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  gender === 'women'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Women
              </button>
            </div>
          </div>

          {/* Size Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter Size
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="e.g., 10"
                step="0.5"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <select
                value={system}
                onChange={(e) => setSystem(e.target.value as SizeSystem)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {SIZE_SYSTEMS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleConvert}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Convert Size
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
              Converted Sizes ({gender === 'men' ? "Men's" : "Women's"})
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-center">
                <div className="text-sm text-blue-600 dark:text-blue-400">US</div>
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                  {result.US}
                </div>
              </div>
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg text-center">
                <div className="text-sm text-green-600 dark:text-green-400">UK</div>
                <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                  {result.UK}
                </div>
              </div>
              <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-center">
                <div className="text-sm text-purple-600 dark:text-purple-400">EU</div>
                <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                  {result.EU}
                </div>
              </div>
              <div className="p-4 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-center">
                <div className="text-sm text-orange-600 dark:text-orange-400">CM</div>
                <div className="text-3xl font-bold text-orange-700 dark:text-orange-300">
                  {result.CM}
                </div>
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

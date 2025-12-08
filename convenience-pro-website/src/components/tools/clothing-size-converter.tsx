'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useClothingSizeConverter, ClothingSizeSystem, ClothingGender } from '@/hooks/useClothingSizeConverter';

const FEATURES = [
  {
    title: 'International Sizing',
    description: 'Convert between US, UK, and EU clothing sizes instantly with accurate mappings.',
  },
  {
    title: 'Gender-Specific Charts',
    description: "Separate conversion tables for men's and women's clothing ensure precise results.",
  },
  {
    title: 'Letter & Number Sizes',
    description: 'Support for both letter sizes (S, M, L) and numeric sizes for comprehensive coverage.',
  },
];

const FAQS = [
  {
    question: "What is the difference between US and UK women's clothing sizes?",
    answer: "US women's sizes are typically 4 numbers smaller than UK sizes. For example, a US size 8 is equivalent to a UK size 12.",
  },
  {
    question: 'How do EU clothing sizes work?',
    answer: 'EU sizes use a numeric system based on body measurements in centimeters. They are typically larger numbers than US sizes, with a US size 8 being approximately EU 40.',
  },
  {
    question: "Are men's sizes the same in US and UK?",
    answer: "Men's numeric sizes (like 38, 40, 42) are generally the same in US and UK. Letter sizes (S, M, L, XL) are also equivalent between these systems.",
  },
  {
    question: 'What size should I buy if I am between sizes?',
    answer: 'If you are between sizes, it is generally recommended to size up for a more comfortable fit. Consider the garment type as well - fitted items may require sizing up more than loose-fit styles.',
  },
  {
    question: 'Do clothing sizes vary between brands?',
    answer: 'Yes, sizing can vary significantly between brands due to different fit preferences and target markets. This converter provides standard size equivalents, but always check brand-specific size charts when possible.',
  },
  {
    question: 'How do I convert letter sizes to number sizes?',
    answer: "Letter sizes correspond to ranges of number sizes. For women's US sizes: XS=0-2, S=4-6, M=8-10, L=12-14, XL=16-18. Men's sizes follow similar patterns with different numeric ranges.",
  },
];

const SIZE_SYSTEMS: ClothingSizeSystem[] = ['US', 'UK', 'EU'];

const COMMON_SIZES = {
  women: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '0', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20'],
  men: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '34', '36', '38', '40', '42', '44', '46', '48', '50'],
};

export function ClothingSizeConverter() {
  const { result, convert, reset } = useClothingSizeConverter();

  const [size, setSize] = useState('');
  const [system, setSystem] = useState<ClothingSizeSystem>('US');
  const [gender, setGender] = useState<ClothingGender>('women');

  const handleConvert = () => {
    if (size) {
      convert({ size, system, gender });
    }
  };

  const handleReset = () => {
    reset();
    setSize('');
    setSystem('US');
    setGender('women');
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Clothing Size Converter',
    description: 'Convert clothing sizes between US, UK, and EU for men and women.',
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
    <SiteLayout toolName="Clothing Size Converter" category="lifestyle-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Convert Clothing Sizes
          </h2>

          {/* Gender Toggle */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gender
            </label>
            <div className="flex gap-4">
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
            </div>
          </div>

          {/* Size Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter Size
            </label>
            <div className="grid grid-cols-2 gap-4">
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select size...</option>
                {COMMON_SIZES[gender].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <select
                value={system}
                onChange={(e) => setSystem(e.target.value as ClothingSizeSystem)}
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
              disabled={!size}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
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

            <div className="grid grid-cols-3 gap-4">
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
            </div>
          </div>
        )}

        {result === null && size && (
          <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-4 mb-8">
            <p className="text-yellow-700 dark:text-yellow-300">
              Size not found. Please select a valid size from the dropdown.
            </p>
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

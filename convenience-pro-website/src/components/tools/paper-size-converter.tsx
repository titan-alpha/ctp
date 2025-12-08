'use client';

import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { usePaperSizeConverter, PaperSizeType } from '@/hooks/usePaperSizeConverter';

const FEATURES = [
  {
    title: 'Complete A Series',
    description: 'All ISO 216 A-series paper sizes from A0 to A8 with precise metric and imperial dimensions.',
  },
  {
    title: 'North American Sizes',
    description: 'Letter, Legal, Tabloid, Ledger, Executive, and Folio sizes commonly used in the US and Canada.',
  },
  {
    title: 'Dual Unit Display',
    description: 'View dimensions in both millimeters and inches for easy international use and printing.',
  },
];

const FAQS = [
  {
    question: 'What is the most common paper size?',
    answer: 'A4 (210 x 297 mm) is the most common paper size internationally. In the US and Canada, Letter size (8.5 x 11 inches or 216 x 279 mm) is the standard.',
  },
  {
    question: 'What is the difference between A4 and Letter size?',
    answer: 'A4 is slightly narrower and taller (210 x 297 mm) than Letter (216 x 279 mm). A4 is the international standard while Letter is the North American standard.',
  },
  {
    question: 'How does the A-series paper sizing work?',
    answer: 'The A-series follows ISO 216 standard where each smaller size is half the area of the previous size. A0 has an area of 1 square meter, and each subsequent size (A1, A2, etc.) is half of the previous.',
  },
  {
    question: 'What paper size should I use for posters?',
    answer: 'For small posters, A3 (297 x 420 mm) works well. For medium posters, use A2 (420 x 594 mm). For large posters and technical drawings, A1 or A0 are ideal.',
  },
  {
    question: 'What is the difference between Tabloid and Ledger?',
    answer: 'Tabloid and Ledger are the same paper size but with different orientations. Tabloid is portrait (11 x 17 inches) while Ledger is landscape (17 x 11 inches).',
  },
  {
    question: 'Which paper size is best for booklets?',
    answer: 'A5 (148 x 210 mm) is commonly used for booklets and small publications. It is exactly half the size of A4 and fits nicely when A4 sheets are folded in half.',
  },
];

const A_SERIES: PaperSizeType[] = ['A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8'];
const NA_SERIES: PaperSizeType[] = ['Letter', 'Legal', 'Tabloid', 'Ledger', 'Executive', 'Folio'];

export function PaperSizeConverter() {
  const { selectedSize, setSelectedSize, dimensions, allSizes } = usePaperSizeConverter();

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Paper Size Converter',
    description: 'Convert between paper sizes including A series, Letter, Legal, and Tabloid with dimensions in mm and inches.',
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
    <SiteLayout toolName="Paper Size Converter" category="design-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Select Paper Size
          </h2>

          {/* A Series */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              A Series (ISO 216)
            </label>
            <div className="flex flex-wrap gap-2">
              {A_SERIES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedSize === size
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* North American */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              North American Sizes
            </label>
            <div className="flex flex-wrap gap-2">
              {NA_SERIES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedSize === size
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dimensions Display */}
        {dimensions && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              {selectedSize} Dimensions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <div className="text-sm text-blue-600 dark:text-blue-400 mb-2">Millimeters (mm)</div>
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                  {dimensions.mm.width} x {dimensions.mm.height}
                </div>
              </div>
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <div className="text-sm text-green-600 dark:text-green-400 mb-2">Inches (in)</div>
                <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                  {dimensions.inches.width} x {dimensions.inches.height}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 overflow-x-auto">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Paper Size Comparison Table
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-3 text-gray-700 dark:text-gray-300">Size</th>
                <th className="text-left py-2 px-3 text-gray-700 dark:text-gray-300">Width (mm)</th>
                <th className="text-left py-2 px-3 text-gray-700 dark:text-gray-300">Height (mm)</th>
                <th className="text-left py-2 px-3 text-gray-700 dark:text-gray-300">Width (in)</th>
                <th className="text-left py-2 px-3 text-gray-700 dark:text-gray-300">Height (in)</th>
                <th className="text-left py-2 px-3 text-gray-700 dark:text-gray-300">Common Use</th>
              </tr>
            </thead>
            <tbody>
              {allSizes.map((size) => (
                <tr
                  key={size.name}
                  className={`border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                    selectedSize === size.name ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onClick={() => setSelectedSize(size.name)}
                >
                  <td className="py-2 px-3 font-medium text-gray-900 dark:text-white">{size.name}</td>
                  <td className="py-2 px-3 text-gray-600 dark:text-gray-400">{size.dimensions.mm.width}</td>
                  <td className="py-2 px-3 text-gray-600 dark:text-gray-400">{size.dimensions.mm.height}</td>
                  <td className="py-2 px-3 text-gray-600 dark:text-gray-400">{size.dimensions.inches.width}</td>
                  <td className="py-2 px-3 text-gray-600 dark:text-gray-400">{size.dimensions.inches.height}</td>
                  <td className="py-2 px-3 text-gray-600 dark:text-gray-400">{size.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
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

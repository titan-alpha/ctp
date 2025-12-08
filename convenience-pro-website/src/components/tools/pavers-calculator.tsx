'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { usePaversCalculator } from '@/hooks/usePaversCalculator';

const FEATURES = [
  {
    title: 'Accurate Estimation',
    description: 'Calculate exact paver quantities based on area dimensions and paver sizes for precise project planning.',
  },
  {
    title: 'Wastage Calculator',
    description: 'Account for cuts, breakage, and pattern alignment with adjustable wastage percentage from 5% to 20%.',
  },
  {
    title: 'Multiple Paver Sizes',
    description: 'Support for common paver sizes including brick pavers, concrete pavers, and flagstones.',
  },
];

const FAQS = [
  {
    question: 'How much wastage should I plan for pavers?',
    answer: 'For standard rectangular layouts, 5-10% wastage is typical. For herringbone or diagonal patterns, plan for 10-15%. Complex curved edges or circular patterns may need 15-20% extra.',
  },
  {
    question: 'How do I measure my patio area for pavers?',
    answer: 'Measure the length and width of your area in meters at the widest points. For irregular shapes, divide into rectangles and calculate each section separately, then add them together.',
  },
  {
    question: 'What size pavers should I use?',
    answer: 'Standard brick pavers (20x10cm) are versatile for most projects. Larger pavers (40x40cm or 60x40cm) cover areas faster but are heavier. Smaller pavers work better for curved designs.',
  },
  {
    question: 'Do I need a base layer under pavers?',
    answer: 'Yes, a proper base is essential. Typically you need 10-15cm of compacted gravel base and 2-5cm of sand bedding layer before laying pavers.',
  },
  {
    question: 'How do I calculate pavers for a driveway?',
    answer: 'Driveways need thicker pavers (60mm+) and a stronger base. Measure the area the same way, but choose heavy-duty pavers rated for vehicle traffic.',
  },
  {
    question: 'Should I buy extra pavers beyond the wastage calculation?',
    answer: 'Yes, buy 5% extra beyond your wastage estimate. This covers future repairs and ensures color matching from the same production batch.',
  },
];

export function PaversCalculator() {
  const { result, calculate, reset } = usePaversCalculator();

  const [areaLength, setAreaLength] = useState('');
  const [areaWidth, setAreaWidth] = useState('');
  const [paverLength, setPaverLength] = useState('20');
  const [paverWidth, setPaverWidth] = useState('10');
  const [wastagePercent, setWastagePercent] = useState(10);

  const handleCalculate = () => {
    if (areaLength && areaWidth && paverLength && paverWidth) {
      calculate({
        areaLength: parseFloat(areaLength),
        areaWidth: parseFloat(areaWidth),
        paverLength: parseFloat(paverLength),
        paverWidth: parseFloat(paverWidth),
        wastagePercent,
      });
    }
  };

  const handleReset = () => {
    reset();
    setAreaLength('');
    setAreaWidth('');
    setPaverLength('20');
    setPaverWidth('10');
    setWastagePercent(10);
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Pavers Calculator',
    description: 'Calculate how many paving stones you need for your patio, driveway, or walkway project with wastage estimation.',
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
    <SiteLayout toolName="Pavers Calculator" category="home-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Pavers Needed
          </h2>

          {/* Area Dimensions */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Area Dimensions (meters)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  value={areaLength}
                  onChange={(e) => setAreaLength(e.target.value)}
                  placeholder="Length"
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">Length (m)</span>
              </div>
              <div>
                <input
                  type="number"
                  value={areaWidth}
                  onChange={(e) => setAreaWidth(e.target.value)}
                  placeholder="Width"
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">Width (m)</span>
              </div>
            </div>
          </div>

          {/* Paver Dimensions */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Paver Size (centimeters)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  value={paverLength}
                  onChange={(e) => setPaverLength(e.target.value)}
                  placeholder="20"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">Length (cm)</span>
              </div>
              <div>
                <input
                  type="number"
                  value={paverWidth}
                  onChange={(e) => setPaverWidth(e.target.value)}
                  placeholder="10"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">Width (cm)</span>
              </div>
            </div>
          </div>

          {/* Wastage Slider */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Wastage Allowance: {wastagePercent}%
            </label>
            <input
              type="range"
              min="5"
              max="20"
              value={wastagePercent}
              onChange={(e) => setWastagePercent(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>5% (Simple)</span>
              <span>10% (Standard)</span>
              <span>20% (Complex)</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleCalculate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Calculate Pavers
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
              Your Results
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <div className="text-sm text-blue-600 dark:text-blue-400">Pavers Needed</div>
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                  {result.paversWithWastage}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">with wastage</div>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Exact Count</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {result.paversNeeded}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">without wastage</div>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Area</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {result.totalArea.toFixed(2)} m²
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">to cover</div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Breakdown</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Paver area</span>
                  <span className="text-gray-900 dark:text-white">{(result.paverArea * 10000).toFixed(0)} cm² ({result.paverArea.toFixed(4)} m²)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Pavers needed (exact)</span>
                  <span className="text-gray-900 dark:text-white">{result.paversNeeded} pavers</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">With {wastagePercent}% wastage</span>
                  <span className="text-gray-900 dark:text-white">{result.paversWithWastage} pavers</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Extra pavers</span>
                  <span className="text-green-600 dark:text-green-400">+{result.wastePavers} spare</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total coverage</span>
                  <span className="text-gray-900 dark:text-white">{result.coverage.toFixed(2)} m²</span>
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

'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useFlooringCalculator } from '@/hooks/useFlooringCalculator';

const FLOORING_TYPES = [
  { name: 'Hardwood', sqFtPerBox: 20 },
  { name: 'Laminate', sqFtPerBox: 25 },
  { name: 'Vinyl Plank', sqFtPerBox: 24 },
  { name: 'Engineered Wood', sqFtPerBox: 22 },
  { name: 'Bamboo', sqFtPerBox: 21 },
  { name: 'Custom', sqFtPerBox: 0 },
];

const FEATURES = [
  {
    title: 'Accurate Sq Ft Calculation',
    description: 'Calculate exact square footage needed for your room dimensions with precision for proper material ordering.',
  },
  {
    title: 'Wastage Estimation',
    description: 'Account for cuts, mistakes, and pattern matching with adjustable wastage percentage from 5% to 20%.',
  },
  {
    title: 'Box Count Calculator',
    description: 'Get the exact number of flooring boxes to purchase based on coverage per box for easy shopping.',
  },
];

const FAQS = [
  {
    question: 'How much flooring wastage should I plan for?',
    answer: 'For straight installations, 10% wastage is standard. Diagonal or herringbone patterns need 15-20%. Simple rectangular rooms with minimal cuts can use 5-10%.',
  },
  {
    question: 'How do I measure my room for flooring?',
    answer: 'Measure the length and width of your room in feet at the widest points. For L-shaped or irregular rooms, divide into rectangles and add the areas together.',
  },
  {
    question: 'What flooring type is best for high traffic areas?',
    answer: 'Laminate and luxury vinyl plank are most durable for high traffic. Hardwood works well but may show wear. Engineered wood offers a balance of durability and appearance.',
  },
  {
    question: 'How much flooring comes in a box?',
    answer: 'Coverage varies by product: hardwood typically covers 20 sq ft per box, laminate 20-25 sq ft, and vinyl plank 20-24 sq ft. Always check the product specifications.',
  },
  {
    question: 'Should I order extra flooring material?',
    answer: 'Yes, order 5-10% extra beyond wastage for future repairs and to ensure matching from the same production batch. Flooring colors can vary between batches.',
  },
  {
    question: 'How do I calculate flooring for multiple rooms?',
    answer: 'Calculate each room separately, then add the totals together. Apply wastage to the combined total, not to each room individually, for more accurate ordering.',
  },
];

export function FlooringCalculator() {
  const { result, calculate, reset } = useFlooringCalculator();

  const [roomLength, setRoomLength] = useState('');
  const [roomWidth, setRoomWidth] = useState('');
  const [flooringType, setFlooringType] = useState('Laminate');
  const [customSqFt, setCustomSqFt] = useState('25');
  const [wastagePercent, setWastagePercent] = useState(10);

  const getSqFtPerBox = () => {
    if (flooringType === 'Custom') {
      return parseFloat(customSqFt) || 25;
    }
    return FLOORING_TYPES.find((f) => f.name === flooringType)?.sqFtPerBox || 25;
  };

  const handleCalculate = () => {
    if (roomLength && roomWidth) {
      calculate({
        roomLength: parseFloat(roomLength),
        roomWidth: parseFloat(roomWidth),
        wastagePercent,
        sqFtPerBox: getSqFtPerBox(),
      });
    }
  };

  const handleReset = () => {
    reset();
    setRoomLength('');
    setRoomWidth('');
    setFlooringType('Laminate');
    setCustomSqFt('25');
    setWastagePercent(10);
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Flooring Calculator',
    description: 'Calculate how much flooring material you need for your project with wastage estimation and box count.',
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
    <SiteLayout toolName="Flooring Calculator" category="home-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Flooring Material
          </h2>

          {/* Room Dimensions */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Room Dimensions (feet)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  value={roomLength}
                  onChange={(e) => setRoomLength(e.target.value)}
                  placeholder="Length"
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">Length (ft)</span>
              </div>
              <div>
                <input
                  type="number"
                  value={roomWidth}
                  onChange={(e) => setRoomWidth(e.target.value)}
                  placeholder="Width"
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">Width (ft)</span>
              </div>
            </div>
          </div>

          {/* Flooring Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Flooring Type
            </label>
            <select
              value={flooringType}
              onChange={(e) => setFlooringType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {FLOORING_TYPES.map((type) => (
                <option key={type.name} value={type.name}>
                  {type.name} {type.sqFtPerBox > 0 ? `(~${type.sqFtPerBox} sq ft/box)` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Sq Ft Per Box */}
          {flooringType === 'Custom' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Square Feet Per Box
              </label>
              <input
                type="number"
                value={customSqFt}
                onChange={(e) => setCustomSqFt(e.target.value)}
                placeholder="25"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          )}

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
              Calculate Flooring
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
                <div className="text-sm text-blue-600 dark:text-blue-400">Boxes Needed</div>
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                  {result.boxesNeeded}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">boxes to purchase</div>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Room Area</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {result.roomAreaSqFt.toFixed(1)} sq ft
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">to cover</div>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Coverage</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {result.totalCoverage.toFixed(1)} sq ft
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">in boxes</div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Breakdown</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Room area</span>
                  <span className="text-gray-900 dark:text-white">{result.roomAreaSqFt.toFixed(1)} sq ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Wastage ({wastagePercent}%)</span>
                  <span className="text-gray-900 dark:text-white">+{result.wastageAmount.toFixed(1)} sq ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Area with wastage</span>
                  <span className="text-gray-900 dark:text-white">{result.areaWithWastage.toFixed(1)} sq ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Sq ft per box</span>
                  <span className="text-gray-900 dark:text-white">{getSqFtPerBox()} sq ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Extra coverage</span>
                  <span className="text-green-600 dark:text-green-400">+{result.extraCoverage.toFixed(1)} sq ft spare</span>
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

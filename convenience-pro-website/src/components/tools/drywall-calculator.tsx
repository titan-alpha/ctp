'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useDrywallCalculator } from '@/hooks/useDrywallCalculator';

const FEATURES = [
  {
    title: 'Accurate Sheet Count',
    description: 'Calculate the exact number of drywall sheets needed based on your wall dimensions, accounting for doors and windows.',
  },
  {
    title: 'Multiple Sheet Sizes',
    description: 'Choose from standard drywall sheet sizes including 4x8, 4x10, and 4x12 feet to match your project needs.',
  },
  {
    title: 'Wastage Calculation',
    description: 'Automatically includes wastage factor for cuts, corners, and mistakes to ensure you have enough material.',
  },
];

const FAQS = [
  {
    question: 'What is the standard size of a drywall sheet?',
    answer: 'The most common drywall sheet size is 4 feet by 8 feet (32 square feet). Longer sheets of 4x10 and 4x12 feet are also available and can reduce the number of seams in rooms with higher ceilings.',
  },
  {
    question: 'How much extra drywall should I buy for wastage?',
    answer: 'It is recommended to add 10-15% extra drywall for wastage due to cuts, mistakes, and irregular wall shapes. Complex rooms with many corners or angles may require up to 20% extra material.',
  },
  {
    question: 'Should I subtract doors and windows from my drywall calculation?',
    answer: 'Yes, subtracting door and window openings gives a more accurate estimate. Our calculator assumes standard door (21 sq ft) and window (12 sq ft) sizes, but the extra material often helps account for cuts around these openings.',
  },
  {
    question: 'How do I calculate drywall for a ceiling?',
    answer: 'For ceilings, multiply the room length by the room width to get the square footage. Divide by the sheet size (32 sq ft for 4x8 sheets) and add 10-15% for wastage. Consider using longer sheets to minimize seams.',
  },
  {
    question: 'What thickness of drywall should I use?',
    answer: 'Standard 1/2-inch drywall is suitable for most walls and ceilings. Use 5/8-inch for better soundproofing or fire resistance. Thinner 1/4-inch sheets are used for curved surfaces or covering existing walls.',
  },
  {
    question: 'How many screws do I need per drywall sheet?',
    answer: 'Plan for approximately 32 screws per 4x8 sheet when attaching to studs 16 inches apart. Screws should be placed every 8 inches along edges and every 12 inches in the field of the sheet.',
  },
];

const SHEET_SIZES = [
  { value: '4x8', width: 4, height: 8, label: '4 x 8 ft (32 sq ft)' },
  { value: '4x10', width: 4, height: 10, label: '4 x 10 ft (40 sq ft)' },
  { value: '4x12', width: 4, height: 12, label: '4 x 12 ft (48 sq ft)' },
];

export function DrywallCalculator() {
  const { result, calculate, reset } = useDrywallCalculator();

  const [wallLength, setWallLength] = useState('');
  const [wallHeight, setWallHeight] = useState('8');
  const [doorCount, setDoorCount] = useState('1');
  const [windowCount, setWindowCount] = useState('2');
  const [sheetSize, setSheetSize] = useState('4x8');
  const [wastagePercent, setWastagePercent] = useState('10');

  const handleCalculate = () => {
    if (wallLength && wallHeight) {
      const selectedSheet = SHEET_SIZES.find(s => s.value === sheetSize) || SHEET_SIZES[0];
      calculate({
        wallLength: parseFloat(wallLength) || 0,
        wallHeight: parseFloat(wallHeight) || 8,
        doorCount: parseInt(doorCount) || 0,
        windowCount: parseInt(windowCount) || 0,
        sheetWidth: selectedSheet.width,
        sheetHeight: selectedSheet.height,
        wastagePercent: parseFloat(wastagePercent) || 10,
      });
    }
  };

  const handleReset = () => {
    reset();
    setWallLength('');
    setWallHeight('8');
    setDoorCount('1');
    setWindowCount('2');
    setSheetSize('4x8');
    setWastagePercent('10');
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Drywall Calculator',
    description: 'Calculate how many drywall sheets you need for your project based on wall dimensions, doors, windows, and wastage factor.',
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
    <SiteLayout toolName="Drywall Calculator" category="home-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Drywall Sheets Needed
          </h2>

          {/* Wall Dimensions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Total Wall Length (ft)
              </label>
              <input
                type="number"
                value={wallLength}
                onChange={(e) => setWallLength(e.target.value)}
                placeholder="e.g., 44 (perimeter of room)"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Add up all wall lengths or enter room perimeter
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Wall Height (ft)
              </label>
              <input
                type="number"
                value={wallHeight}
                onChange={(e) => setWallHeight(e.target.value)}
                placeholder="8"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Doors, Windows, Sheet Size, Wastage */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Number of Doors
              </label>
              <input
                type="number"
                value={doorCount}
                onChange={(e) => setDoorCount(e.target.value)}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Number of Windows
              </label>
              <input
                type="number"
                value={windowCount}
                onChange={(e) => setWindowCount(e.target.value)}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sheet Size
              </label>
              <select
                value={sheetSize}
                onChange={(e) => setSheetSize(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {SHEET_SIZES.map((size) => (
                  <option key={size.value} value={size.value}>
                    {size.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Wastage (%)
              </label>
              <select
                value={wastagePercent}
                onChange={(e) => setWastagePercent(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="5">5%</option>
                <option value="10">10%</option>
                <option value="15">15%</option>
                <option value="20">20%</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleCalculate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Calculate Sheets Needed
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
              Drywall Estimate
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <div className="text-sm text-blue-600 dark:text-blue-400">Sheets Needed</div>
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                  {result.sheetsNeeded}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  ({result.sheetsExact.toFixed(2)} exact + {wastagePercent}% wastage)
                </div>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Net Area to Cover</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {result.netArea.toFixed(0)} sq ft
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Sheet size: {result.sheetArea} sq ft each
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Area Breakdown</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Wall Area</span>
                  <span className="font-medium text-gray-900 dark:text-white">{result.totalWallArea.toFixed(0)} sq ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Door Area Subtracted</span>
                  <span className="font-medium text-gray-900 dark:text-white">-{result.doorArea} sq ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Window Area Subtracted</span>
                  <span className="font-medium text-gray-900 dark:text-white">-{result.windowArea} sq ft</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2">
                  <span className="text-gray-600 dark:text-gray-400">Extra Sheets for Wastage</span>
                  <span className="font-medium text-gray-900 dark:text-white">{result.wastageSheets} sheets</span>
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

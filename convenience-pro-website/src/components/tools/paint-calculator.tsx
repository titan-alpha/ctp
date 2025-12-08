'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { usePaintCalculator } from '@/hooks/usePaintCalculator';

const FEATURES = [
  {
    title: 'Accurate Wall Coverage',
    description: 'Calculate exact wall area by accounting for room dimensions, automatically subtracting doors and windows.',
  },
  {
    title: 'Multi-Coat Support',
    description: 'Select the number of coats you plan to apply and get accurate paint quantities for complete coverage.',
  },
  {
    title: 'Customizable Coverage',
    description: 'Adjust paint coverage per gallon based on paint quality, wall texture, and surface conditions.',
  },
];

const FAQS = [
  {
    question: 'How much wall area does a gallon of paint cover?',
    answer: 'A gallon of paint typically covers 350-400 square feet of smooth wall surface. Textured walls or porous surfaces may require more paint, reducing coverage to 250-300 square feet per gallon.',
  },
  {
    question: 'How many coats of paint do I need?',
    answer: 'Most walls need 2 coats for proper coverage, especially when changing colors. A single coat may suffice for touch-ups or when painting the same color. Dark to light color changes may need a primer plus 2 coats.',
  },
  {
    question: 'Should I subtract doors and windows from my calculation?',
    answer: 'Yes, subtracting doors and windows gives a more accurate estimate and prevents buying excess paint. Our calculator automatically accounts for standard door (21 sq ft) and window (12 sq ft) sizes.',
  },
  {
    question: 'How do I measure my room for painting?',
    answer: 'Measure the length and width of your room at floor level, and the height from floor to ceiling. For irregularly shaped rooms, break them into rectangular sections and calculate each separately.',
  },
  {
    question: 'What factors affect paint coverage?',
    answer: 'Paint coverage is affected by wall texture, porosity, color change, paint quality, and application method. Rough textures, bare drywall, and dramatic color changes all reduce coverage.',
  },
  {
    question: 'Should I buy extra paint?',
    answer: 'It is wise to buy 10-15% extra paint for touch-ups and to account for waste. Keep leftover paint for future repairs, ensuring it is stored properly in a cool, dry place.',
  },
];

export function PaintCalculator() {
  const { result, calculate, reset } = usePaintCalculator();

  const [roomLength, setRoomLength] = useState('');
  const [roomWidth, setRoomWidth] = useState('');
  const [roomHeight, setRoomHeight] = useState('8');
  const [doorCount, setDoorCount] = useState('1');
  const [windowCount, setWindowCount] = useState('2');
  const [coats, setCoats] = useState('2');
  const [coveragePerGallon, setCoveragePerGallon] = useState('350');

  const handleCalculate = () => {
    if (roomLength && roomWidth && roomHeight) {
      calculate({
        roomLength: parseFloat(roomLength) || 0,
        roomWidth: parseFloat(roomWidth) || 0,
        roomHeight: parseFloat(roomHeight) || 8,
        doorCount: parseInt(doorCount) || 0,
        windowCount: parseInt(windowCount) || 0,
        coats: parseInt(coats) || 1,
        coveragePerGallon: parseFloat(coveragePerGallon) || 350,
      });
    }
  };

  const handleReset = () => {
    reset();
    setRoomLength('');
    setRoomWidth('');
    setRoomHeight('8');
    setDoorCount('1');
    setWindowCount('2');
    setCoats('2');
    setCoveragePerGallon('350');
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Paint Calculator',
    description: 'Calculate how much paint you need for your room based on dimensions, doors, windows, and number of coats.',
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
    <SiteLayout toolName="Paint Calculator" category="home-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Paint Needed
          </h2>

          {/* Room Dimensions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Room Length (ft)
              </label>
              <input
                type="number"
                value={roomLength}
                onChange={(e) => setRoomLength(e.target.value)}
                placeholder="12"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Room Width (ft)
              </label>
              <input
                type="number"
                value={roomWidth}
                onChange={(e) => setRoomWidth(e.target.value)}
                placeholder="10"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ceiling Height (ft)
              </label>
              <input
                type="number"
                value={roomHeight}
                onChange={(e) => setRoomHeight(e.target.value)}
                placeholder="8"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Doors, Windows, Coats */}
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
                Number of Coats
              </label>
              <select
                value={coats}
                onChange={(e) => setCoats(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="1">1 Coat</option>
                <option value="2">2 Coats</option>
                <option value="3">3 Coats</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Coverage (sq ft/gal)
              </label>
              <input
                type="number"
                value={coveragePerGallon}
                onChange={(e) => setCoveragePerGallon(e.target.value)}
                placeholder="350"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleCalculate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Calculate Paint Needed
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
              Paint Estimate
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <div className="text-sm text-blue-600 dark:text-blue-400">Gallons Needed</div>
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                  {result.gallonsRounded}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  ({result.gallonsNeeded.toFixed(2)} exact)
                </div>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Paintable Area</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {result.paintableArea.toFixed(0)} sq ft
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  x {coats} coat{parseInt(coats) > 1 ? 's' : ''} = {(result.paintableArea * parseInt(coats)).toFixed(0)} sq ft total
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

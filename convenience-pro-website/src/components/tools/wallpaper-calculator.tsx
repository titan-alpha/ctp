'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useWallpaperCalculator } from '@/hooks/useWallpaperCalculator';

const FEATURES = [
  {
    title: 'Pattern Repeat Calculation',
    description: 'Accounts for pattern repeat to ensure seamless matching between strips, preventing wastage from misaligned designs.',
  },
  {
    title: 'Accurate Roll Estimation',
    description: 'Calculates exact number of rolls needed based on wall dimensions, roll size, and standard deductions for doors and windows.',
  },
  {
    title: 'Built-in Wastage Allowance',
    description: 'Automatically adds 10% wastage allowance to account for cutting, trimming, and pattern matching waste.',
  },
];

const FAQS = [
  {
    question: 'How do I measure my wall for wallpaper?',
    answer: 'Measure the height from floor to ceiling and the total width of all walls you want to cover. For best results, measure in multiple spots as walls may not be perfectly even.',
  },
  {
    question: 'What is pattern repeat and why does it matter?',
    answer: 'Pattern repeat is the vertical distance between where the pattern starts again. Larger pattern repeats require more wallpaper because you need extra length to match patterns between strips.',
  },
  {
    question: 'How much extra wallpaper should I buy?',
    answer: 'We recommend adding 10-15% extra to account for cutting waste, pattern matching, and future repairs. Our calculator automatically includes a 10% wastage allowance.',
  },
  {
    question: 'What is a standard wallpaper roll size?',
    answer: 'American single rolls are typically 27 inches wide and 27 feet long (about 60 sq ft). European rolls are often 21 inches wide and 33 feet long (about 57 sq ft). Double rolls are twice the length.',
  },
  {
    question: 'Should I subtract doors and windows?',
    answer: 'Yes, subtracting doors and windows provides a more accurate estimate. Our calculator uses standard sizes (doors: 21 sq ft, windows: 12 sq ft) but you may still want extra for complex cuts around these areas.',
  },
  {
    question: 'How do I handle corners and obstacles?',
    answer: 'Always plan to have seams at inside corners rather than wrapping around them. For outlets, switches, and other obstacles, cut an X pattern and trim carefully. Factor in extra material for these areas.',
  },
];

export function WallpaperCalculator() {
  const { result, calculate, reset } = useWallpaperCalculator();

  const [wallHeight, setWallHeight] = useState('8');
  const [wallWidth, setWallWidth] = useState('');
  const [rollLength, setRollLength] = useState('27');
  const [rollWidth, setRollWidth] = useState('27');
  const [patternRepeat, setPatternRepeat] = useState('0');
  const [doorCount, setDoorCount] = useState('1');
  const [windowCount, setWindowCount] = useState('2');

  const handleCalculate = () => {
    if (wallHeight && wallWidth) {
      calculate({
        wallHeight: parseFloat(wallHeight) || 8,
        wallWidth: parseFloat(wallWidth) || 0,
        rollLength: parseFloat(rollLength) || 27,
        rollWidth: parseFloat(rollWidth) || 27,
        patternRepeat: parseFloat(patternRepeat) || 0,
        doorCount: parseInt(doorCount) || 0,
        windowCount: parseInt(windowCount) || 0,
      });
    }
  };

  const handleReset = () => {
    reset();
    setWallHeight('8');
    setWallWidth('');
    setRollLength('27');
    setRollWidth('27');
    setPatternRepeat('0');
    setDoorCount('1');
    setWindowCount('2');
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Wallpaper Calculator',
    description: 'Calculate how many wallpaper rolls you need based on wall dimensions, roll size, and pattern repeat.',
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
    <SiteLayout toolName="Wallpaper Calculator" category="home-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Wallpaper Rolls Needed
          </h2>

          {/* Wall Dimensions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Total Wall Width (ft)
              </label>
              <input
                type="number"
                value={wallWidth}
                onChange={(e) => setWallWidth(e.target.value)}
                placeholder="40"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Roll Dimensions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Roll Length (ft)
              </label>
              <input
                type="number"
                value={rollLength}
                onChange={(e) => setRollLength(e.target.value)}
                placeholder="27"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Roll Width (inches)
              </label>
              <input
                type="number"
                value={rollWidth}
                onChange={(e) => setRollWidth(e.target.value)}
                placeholder="27"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pattern Repeat (inches)
              </label>
              <input
                type="number"
                value={patternRepeat}
                onChange={(e) => setPatternRepeat(e.target.value)}
                placeholder="0"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Doors and Windows */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleCalculate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Calculate Rolls Needed
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
              Wallpaper Estimate
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <div className="text-sm text-blue-600 dark:text-blue-400">Rolls Needed (with wastage)</div>
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                  {result.rollsWithWastage}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  ({result.rollsNeeded} exact + 10% wastage)
                </div>
              </div>
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <div className="text-sm text-green-600 dark:text-green-400">Net Wall Area</div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {result.netWallArea.toFixed(0)} sq ft
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  After subtracting doors/windows
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Calculation Details</h4>
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
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Strips Needed</span>
                  <span className="font-medium text-gray-900 dark:text-white">{result.stripsNeeded}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Usable Strips Per Roll</span>
                  <span className="font-medium text-gray-900 dark:text-white">{result.usableStripsPerRoll}</span>
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

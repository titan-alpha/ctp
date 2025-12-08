'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useGravelCalculator } from '@/hooks/useGravelCalculator';

const FEATURES = [
  {
    title: 'Accurate Volume Calculation',
    description: 'Calculate precise gravel volume in cubic yards and cubic meters for driveways, pathways, and landscaping projects.',
  },
  {
    title: 'Weight Estimation',
    description: 'Get accurate weight estimates in tons and pounds based on standard gravel density to plan for delivery and costs.',
  },
  {
    title: 'Cost Planning',
    description: 'Estimate material costs with customizable price per ton to budget your project accurately before purchasing.',
  },
];

const FAQS = [
  {
    question: 'How do I calculate gravel volume for my project?',
    answer: 'Multiply the length by the width by the depth of your area. For imperial units, enter length and width in feet and depth in inches. The calculator converts everything to cubic yards automatically.',
  },
  {
    question: 'How much does gravel weigh per cubic yard?',
    answer: 'Gravel typically weighs between 2,400 and 3,000 pounds per cubic yard depending on the type. This calculator uses 2,800 lbs/cubic yard as an average estimate for common gravel types.',
  },
  {
    question: 'How deep should gravel be for a driveway?',
    answer: 'For a standard residential driveway, gravel should be 4-6 inches deep. Use 4 inches minimum for light traffic and 6 inches or more for heavier vehicles or poor soil conditions.',
  },
  {
    question: 'What is the difference between cubic yards and tons of gravel?',
    answer: 'Cubic yards measure volume while tons measure weight. One cubic yard of gravel typically weighs about 1.4 tons (2,800 lbs). Suppliers often sell by the ton, so knowing both measurements helps with ordering.',
  },
  {
    question: 'How much gravel do I need for a walkway?',
    answer: 'For walkways, use 2-3 inches of gravel depth. Calculate the length times width times depth, then convert to cubic yards. A typical 3-foot wide, 20-foot long walkway at 2 inches deep needs about 0.37 cubic yards.',
  },
  {
    question: 'Should I order extra gravel?',
    answer: 'Yes, order 5-10% extra gravel to account for compaction, spillage, and uneven ground. Gravel compacts by about 10% when settled, so having extra ensures complete coverage.',
  },
];

export function GravelCalculator() {
  const { result, calculate, reset } = useGravelCalculator();

  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [depth, setDepth] = useState('');
  const [unit, setUnit] = useState<'imperial' | 'metric'>('imperial');
  const [pricePerTon, setPricePerTon] = useState('50');

  const handleCalculate = () => {
    if (length && width && depth) {
      calculate({
        length: parseFloat(length) || 0,
        width: parseFloat(width) || 0,
        depth: parseFloat(depth) || 0,
        unit,
      });
    }
  };

  const handleReset = () => {
    reset();
    setLength('');
    setWidth('');
    setDepth('');
  };

  const estimatedCost = result ? result.tons * (parseFloat(pricePerTon) || 0) : 0;

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Gravel Calculator',
    description: 'Calculate how much gravel you need in cubic yards and tons for driveways, pathways, and landscaping projects.',
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
    <SiteLayout toolName="Gravel Calculator" category="home-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Gravel Volume & Weight
          </h2>

          {/* Unit Toggle */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Unit System
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setUnit('imperial')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  unit === 'imperial'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Imperial (ft/in)
              </button>
              <button
                onClick={() => setUnit('metric')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  unit === 'metric'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Metric (m)
              </button>
            </div>
          </div>

          {/* Dimension Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Length ({unit === 'imperial' ? 'feet' : 'meters'})
              </label>
              <input
                type="number"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder={unit === 'imperial' ? '20' : '6'}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Width ({unit === 'imperial' ? 'feet' : 'meters'})
              </label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder={unit === 'imperial' ? '10' : '3'}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Depth ({unit === 'imperial' ? 'inches' : 'meters'})
              </label>
              <input
                type="number"
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
                placeholder={unit === 'imperial' ? '4' : '0.1'}
                step={unit === 'metric' ? '0.01' : '1'}
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
              Calculate Gravel
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
              Gravel Needed
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <div className="text-sm text-blue-600 dark:text-blue-400">Cubic Yards</div>
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                  {result.cubicYards.toFixed(2)}
                </div>
              </div>
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <div className="text-sm text-green-600 dark:text-green-400">Tons</div>
                <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                  {result.tons.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Cubic Feet</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {result.cubicFeet.toFixed(2)}
                </div>
              </div>
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Pounds</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {result.pounds.toFixed(0).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Cost Estimate */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Cost Estimate</h4>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Price per ton ($)
                  </label>
                  <input
                    type="number"
                    value={pricePerTon}
                    onChange={(e) => setPricePerTon(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="flex-1 p-4 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <div className="text-sm text-amber-600 dark:text-amber-400">Estimated Cost</div>
                  <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                    ${estimatedCost.toFixed(2)}
                  </div>
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

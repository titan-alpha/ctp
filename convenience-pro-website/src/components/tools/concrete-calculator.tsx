'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useConcreteCalculator } from '@/hooks/useConcreteCalculator';

const FEATURES = [
  {
    title: 'Accurate Volume Calculation',
    description: 'Calculate precise concrete volume needed for slabs, footings, and foundations using length, width, and depth measurements.',
  },
  {
    title: 'Imperial & Metric Units',
    description: 'Easily switch between feet/inches and meters to match your project specifications and local measurement standards.',
  },
  {
    title: 'Bag Estimates Included',
    description: 'Get estimates for 40lb, 60lb, and 80lb concrete bags for smaller DIY projects that do not require ready-mix delivery.',
  },
];

const FAQS = [
  {
    question: 'How do I calculate concrete volume for a slab?',
    answer: 'Multiply the length by the width by the depth (thickness) of your slab. For imperial units, convert depth from inches to feet by dividing by 12. The result is cubic feet, which can be converted to cubic yards by dividing by 27.',
  },
  {
    question: 'How much concrete do I need per cubic yard?',
    answer: 'One cubic yard of concrete covers approximately 81 square feet at 4 inches thick, 65 square feet at 5 inches thick, or 54 square feet at 6 inches thick. Always order 5-10% extra to account for spillage and variations.',
  },
  {
    question: 'Should I use ready-mix concrete or bags?',
    answer: 'For projects requiring more than 1 cubic yard, ready-mix concrete is more economical and ensures consistent quality. Bagged concrete is suitable for small projects like fence posts, small pads, or repairs.',
  },
  {
    question: 'How thick should a concrete slab be?',
    answer: 'Standard residential slabs are 4 inches thick. Driveways should be 5-6 inches, and garage floors at least 4 inches. Heavy load areas may require 6 inches or more with reinforcement.',
  },
  {
    question: 'How many 80lb bags of concrete make a yard?',
    answer: 'Approximately 45 bags of 80lb concrete mix are needed to make one cubic yard. For 60lb bags, you need about 60 bags, and for 40lb bags, approximately 90 bags per cubic yard.',
  },
  {
    question: 'How do I convert cubic feet to cubic yards?',
    answer: 'Divide cubic feet by 27 to get cubic yards. There are 27 cubic feet in one cubic yard (3 feet x 3 feet x 3 feet = 27 cubic feet).',
  },
];

export function ConcreteCalculator() {
  const { result, calculate, reset } = useConcreteCalculator();

  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [depth, setDepth] = useState('');
  const [unit, setUnit] = useState<'imperial' | 'metric'>('imperial');

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

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Concrete Calculator',
    description: 'Calculate how much concrete you need in cubic yards or cubic meters for slabs, footings, and foundations.',
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
    <SiteLayout toolName="Concrete Calculator" category="home-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Concrete Volume
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
                placeholder={unit === 'imperial' ? '10' : '3'}
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
              Calculate Concrete
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
              Concrete Volume Needed
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <div className="text-sm text-blue-600 dark:text-blue-400">Cubic Yards</div>
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                  {result.cubicYards.toFixed(2)}
                </div>
              </div>
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <div className="text-sm text-green-600 dark:text-green-400">Cubic Meters</div>
                <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                  {result.cubicMeters.toFixed(2)}
                </div>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Cubic Feet</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {result.cubicFeet.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Bag Estimates (for DIY projects)</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{result.bags40lb}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">40 lb bags</div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{result.bags60lb}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">60 lb bags</div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{result.bags80lb}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">80 lb bags</div>
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

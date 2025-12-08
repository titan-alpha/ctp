'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { usePoolVolumeCalculator, PoolShape } from '@/hooks/usePoolVolumeCalculator';

const FEATURES = [
  {
    title: 'Multiple Pool Shapes',
    description: 'Calculate volume for rectangular, oval, and kidney-shaped pools with accurate formulas for each shape.',
  },
  {
    title: 'Variable Depth Support',
    description: 'Enter shallow and deep end depths to automatically calculate average depth for accurate volume.',
  },
  {
    title: 'Dual Unit Output',
    description: 'Get results in both US gallons and liters to match your preferred measurement system.',
  },
];

const FAQS = [
  {
    question: 'How do I calculate pool volume for a rectangular pool?',
    answer: 'For rectangular pools, multiply length x width x average depth. The average depth is calculated by adding the shallow and deep end depths and dividing by 2. Then multiply by 7.48 to convert cubic feet to gallons.',
  },
  {
    question: 'What formula is used for oval pools?',
    answer: 'Oval pools use the formula: length x width x average depth x 0.89. The 0.89 factor accounts for the curved shape reducing the total volume compared to a rectangle.',
  },
  {
    question: 'How is kidney pool volume calculated?',
    answer: 'Kidney-shaped pools use the formula: length x width x average depth x 0.45. The width should be the average of both ends of the kidney shape.',
  },
  {
    question: 'Why do I need to know my pool volume?',
    answer: 'Knowing your pool volume is essential for proper chemical dosing, calculating fill time, estimating heating costs, and purchasing the right size equipment like pumps and filters.',
  },
  {
    question: 'How many gallons are in a typical residential pool?',
    answer: 'Most residential in-ground pools hold between 10,000 and 30,000 gallons. A typical 16x32 foot pool with an average depth of 5 feet holds approximately 19,000 gallons.',
  },
  {
    question: 'How do I measure pool depth for variable depth pools?',
    answer: 'Measure the depth at the shallowest point (usually 3-4 feet) and the deepest point (usually 6-8 feet). Enter both values and the calculator will compute the average depth.',
  },
];

export function PoolVolumeCalculator() {
  const { result, calculate, reset } = usePoolVolumeCalculator();

  const [shape, setShape] = useState<PoolShape>('rectangle');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [shallowDepth, setShallowDepth] = useState('3');
  const [deepDepth, setDeepDepth] = useState('8');

  const handleCalculate = () => {
    if (length && width) {
      calculate({
        shape,
        length: parseFloat(length) || 0,
        width: parseFloat(width) || 0,
        shallowDepth: parseFloat(shallowDepth) || 3,
        deepDepth: parseFloat(deepDepth) || 8,
      });
    }
  };

  const handleReset = () => {
    reset();
    setShape('rectangle');
    setLength('');
    setWidth('');
    setShallowDepth('3');
    setDeepDepth('8');
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Pool Volume Calculator',
    description: 'Calculate swimming pool water volume in gallons and liters for rectangular, oval, and kidney-shaped pools.',
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
    <SiteLayout toolName="Pool Volume Calculator" category="home-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Pool Volume
          </h2>

          {/* Pool Shape Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pool Shape
            </label>
            <div className="grid grid-cols-3 gap-4">
              {(['rectangle', 'oval', 'kidney'] as PoolShape[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setShape(s)}
                  className={`px-4 py-3 rounded-lg border-2 font-medium transition-colors capitalize ${
                    shape === s
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Dimensions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Length (ft)
              </label>
              <input
                type="number"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="32"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Width (ft)
              </label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="16"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Depth */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Shallow End Depth (ft)
              </label>
              <input
                type="number"
                value={shallowDepth}
                onChange={(e) => setShallowDepth(e.target.value)}
                placeholder="3"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Deep End Depth (ft)
              </label>
              <input
                type="number"
                value={deepDepth}
                onChange={(e) => setDeepDepth(e.target.value)}
                placeholder="8"
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
              Calculate Volume
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
              Pool Volume Results
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <div className="text-sm text-blue-600 dark:text-blue-400">Volume (Gallons)</div>
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                  {result.gallons.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  US gallons
                </div>
              </div>
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <div className="text-sm text-green-600 dark:text-green-400">Volume (Liters)</div>
                <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                  {result.liters.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  liters
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Calculation Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Pool Shape</span>
                  <span className="font-medium text-gray-900 dark:text-white capitalize">{shape}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Average Depth</span>
                  <span className="font-medium text-gray-900 dark:text-white">{result.averageDepth.toFixed(1)} ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Cubic Feet</span>
                  <span className="font-medium text-gray-900 dark:text-white">{result.cubicFeet.toLocaleString(undefined, { maximumFractionDigits: 0 })} cu ft</span>
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

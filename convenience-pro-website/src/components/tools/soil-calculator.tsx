'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useSoilCalculator, ShapeType } from '@/hooks/useSoilCalculator';

const FEATURES = [
  {
    title: 'Multiple Shape Support',
    description: 'Calculate soil for rectangular garden beds, circular planters, or any shaped area with accurate volume estimates.',
  },
  {
    title: 'Bag Size Calculator',
    description: 'Get the number of bags needed in common sizes (1, 2, and 3 cubic feet) for easy shopping.',
  },
  {
    title: 'Cubic Yard Estimates',
    description: 'Perfect for bulk orders, see your soil needs in cubic yards for delivery from landscaping suppliers.',
  },
];

const FAQS = [
  {
    question: 'How deep should garden soil be?',
    answer: 'Most vegetables and flowers need 6-12 inches of soil depth. Root vegetables like carrots need at least 12 inches. For raised beds, 6 inches is minimum but 12 inches is ideal for healthy root development.',
  },
  {
    question: 'How many cubic feet are in a cubic yard?',
    answer: 'There are 27 cubic feet in one cubic yard. When ordering bulk soil, suppliers typically sell by the cubic yard, making this conversion essential for proper ordering.',
  },
  {
    question: 'What size bags does soil come in?',
    answer: 'Garden soil commonly comes in bags of 1 cubic foot (about 40 lbs), 2 cubic feet (about 80 lbs), and 3 cubic feet (about 120 lbs). The calculator shows all three options.',
  },
  {
    question: 'Should I order extra soil?',
    answer: 'Yes, order 5-10% extra soil to account for settling and compaction. Soil will compress over time, especially after watering, so having extra ensures proper depth.',
  },
  {
    question: 'What is the difference between topsoil and garden soil?',
    answer: 'Topsoil is natural surface soil that varies in quality. Garden soil is topsoil enriched with compost and nutrients, better for planting. For garden beds, enriched garden soil is recommended.',
  },
  {
    question: 'How do I calculate soil for irregular shapes?',
    answer: 'Break irregular shapes into rectangles and circles, calculate each section separately, then add the results together for the total volume needed.',
  },
];

export function SoilCalculator() {
  const { result, calculate, reset } = useSoilCalculator();

  const [shape, setShape] = useState<ShapeType>('rectangle');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [diameter, setDiameter] = useState('');
  const [depth, setDepth] = useState('6');

  const handleCalculate = () => {
    if (shape === 'rectangle' && length && width && depth) {
      calculate({
        shape,
        length: parseFloat(length) || 0,
        width: parseFloat(width) || 0,
        diameter: 0,
        depth: parseFloat(depth) || 6,
      });
    } else if (shape === 'circle' && diameter && depth) {
      calculate({
        shape,
        length: 0,
        width: 0,
        diameter: parseFloat(diameter) || 0,
        depth: parseFloat(depth) || 6,
      });
    }
  };

  const handleReset = () => {
    reset();
    setLength('');
    setWidth('');
    setDiameter('');
    setDepth('6');
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Soil Calculator',
    description: 'Calculate how much soil you need for your garden beds in cubic yards and bags.',
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
    <SiteLayout toolName="Soil Calculator" category="home-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Soil Volume
          </h2>

          {/* Shape Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Garden Shape
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setShape('rectangle')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  shape === 'rectangle'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Rectangle
              </button>
              <button
                onClick={() => setShape('circle')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  shape === 'circle'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Circle
              </button>
            </div>
          </div>

          {/* Dimension Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {shape === 'rectangle' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Length (ft)
                  </label>
                  <input
                    type="number"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    placeholder="10"
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
                    placeholder="4"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Diameter (ft)
                </label>
                <input
                  type="number"
                  value={diameter}
                  onChange={(e) => setDiameter(e.target.value)}
                  placeholder="6"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Depth (inches)
              </label>
              <input
                type="number"
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
                placeholder="6"
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
              Calculate Soil Needed
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
              Soil Estimate
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <div className="text-sm text-green-600 dark:text-green-400">Cubic Yards</div>
                <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                  {result.cubicYards.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  For bulk orders
                </div>
              </div>
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <div className="text-sm text-blue-600 dark:text-blue-400">Cubic Feet</div>
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                  {result.cubicFeet.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total volume
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Bags Needed</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">1 cubic foot bags</span>
                  <span className="font-medium text-gray-900 dark:text-white">{result.bags1CubicFoot} bags</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">2 cubic foot bags</span>
                  <span className="font-medium text-gray-900 dark:text-white">{result.bags2CubicFoot} bags</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">3 cubic foot bags</span>
                  <span className="font-medium text-gray-900 dark:text-white">{result.bags3CubicFoot} bags</span>
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

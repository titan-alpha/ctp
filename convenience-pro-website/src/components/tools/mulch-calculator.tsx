'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useMulchCalculator } from '@/hooks/useMulchCalculator';

const FEATURES = [
  {
    title: 'Accurate Volume Calculation',
    description: 'Calculate the exact amount of mulch needed based on your garden bed area and desired depth.',
  },
  {
    title: 'Multiple Unit Options',
    description: 'Get results in cubic yards for bulk delivery or bag counts for store purchases.',
  },
  {
    title: 'Easy Bag Estimates',
    description: 'Know exactly how many 2 or 3 cubic foot bags to buy from your local garden center.',
  },
];

const FAQS = [
  {
    question: 'How deep should I apply mulch?',
    answer: 'For most landscaping purposes, 2-4 inches of mulch is recommended. Use 2-3 inches around plants and flowers, and up to 4 inches for pathways and areas without plants. Avoid piling mulch against tree trunks or plant stems.',
  },
  {
    question: 'How much area does a cubic yard of mulch cover?',
    answer: 'One cubic yard of mulch covers approximately 162 square feet at 2 inches deep, 108 square feet at 3 inches deep, or 81 square feet at 4 inches deep.',
  },
  {
    question: 'Should I buy bagged or bulk mulch?',
    answer: 'For small projects under 3 cubic yards, bagged mulch is often more convenient. For larger projects, bulk delivery is more cost-effective, typically costing 40-50% less per cubic yard than bags.',
  },
  {
    question: 'How often should I replace mulch?',
    answer: 'Organic mulch should be replenished annually or when it breaks down to less than 2 inches deep. Inorganic mulches like stone or rubber last much longer and may only need occasional top-ups.',
  },
  {
    question: 'What type of mulch should I use?',
    answer: 'Hardwood mulch is best for flower beds and around trees. Pine bark works well for acid-loving plants. Cedar and cypress naturally repel insects. Rubber mulch is ideal for playgrounds and high-traffic areas.',
  },
  {
    question: 'How do I measure my garden bed area?',
    answer: 'For rectangular beds, multiply length by width. For circular beds, measure the radius and use the formula: area = 3.14 x radius x radius. For irregular shapes, divide into smaller sections and add them together.',
  },
];

export function MulchCalculator() {
  const { result, calculate, reset } = useMulchCalculator();

  const [area, setArea] = useState('');
  const [depth, setDepth] = useState('3');

  const handleCalculate = () => {
    if (area && depth) {
      calculate({
        area: parseFloat(area) || 0,
        depth: parseFloat(depth) || 3,
      });
    }
  };

  const handleReset = () => {
    reset();
    setArea('');
    setDepth('3');
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Mulch Calculator',
    description: 'Calculate how much mulch you need for your garden beds in cubic yards or bags.',
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
    <SiteLayout toolName="Mulch Calculator" category="home-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Mulch Needed
          </h2>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Area (sq ft)
              </label>
              <input
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="100"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Depth (inches)
              </label>
              <select
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="1">1 inch</option>
                <option value="2">2 inches</option>
                <option value="3">3 inches</option>
                <option value="4">4 inches</option>
                <option value="5">5 inches</option>
                <option value="6">6 inches</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleCalculate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Calculate Mulch Needed
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
              Mulch Estimate
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <div className="text-sm text-green-600 dark:text-green-400">Cubic Yards</div>
                <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                  {result.cubicYards.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  For bulk delivery
                </div>
              </div>
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <div className="text-sm text-blue-600 dark:text-blue-400">Cubic Feet</div>
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                  {result.cubicFeet.toFixed(1)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total volume
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Bags Needed</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">2 Cu Ft Bags</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {result.bagsNeeded2CuFt} bags
                  </div>
                </div>
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">3 Cu Ft Bags</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {result.bagsNeeded3CuFt} bags
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

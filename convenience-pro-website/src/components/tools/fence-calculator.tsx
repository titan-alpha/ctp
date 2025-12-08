'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useFenceCalculator } from '@/hooks/useFenceCalculator';

const FEATURES = [
  {
    title: 'Complete Material List',
    description: 'Get accurate counts for posts, rails, and boards based on your fence dimensions and spacing preferences.',
  },
  {
    title: 'Customizable Spacing',
    description: 'Adjust post spacing, board width, and gap size to match your design and local building codes.',
  },
  {
    title: 'Cost Estimation',
    description: 'Add material prices to estimate total project cost and plan your budget effectively.',
  },
];

const FAQS = [
  {
    question: 'How far apart should fence posts be?',
    answer: 'Fence posts are typically spaced 6 to 8 feet apart. Six feet is standard for most residential fences and provides good stability. Eight feet may work for lighter fence styles but requires sturdier posts and rails.',
  },
  {
    question: 'How many rails do I need per fence section?',
    answer: 'Most fences use 2 to 3 horizontal rails per section. For fences under 5 feet, two rails are usually sufficient. Taller fences (6 feet or more) benefit from three rails for added stability and to prevent warping.',
  },
  {
    question: 'What is the standard fence board width?',
    answer: 'Standard fence pickets are typically 3.5 to 5.5 inches wide. The most common width is 5.5 inches (nominal 6-inch boards). Narrower boards create a more refined look while wider boards provide more privacy.',
  },
  {
    question: 'How deep should fence posts be set?',
    answer: 'Fence posts should be buried at least 1/3 of their total length. For a 6-foot fence with 8-foot posts, set them 24-30 inches deep. In areas with frost, posts should extend below the frost line.',
  },
  {
    question: 'Should I leave gaps between fence boards?',
    answer: 'For privacy fences, boards are typically butted together with no gap. For semi-privacy or decorative fences, gaps of 0.5 to 1 inch are common. Gaps allow airflow and can extend the life of the wood.',
  },
  {
    question: 'How do I calculate fence perimeter?',
    answer: 'Measure each side of the area to be fenced and add them together. For a rectangular yard, use the formula: perimeter = 2 x (length + width). Subtract the width of any gates from the total.',
  },
];

export function FenceCalculator() {
  const { result, calculate, reset } = useFenceCalculator();

  const [perimeter, setPerimeter] = useState('');
  const [height, setHeight] = useState('6');
  const [postSpacing, setPostSpacing] = useState('8');
  const [railsPerSection, setRailsPerSection] = useState('2');
  const [boardWidth, setBoardWidth] = useState('5.5');
  const [boardGap, setBoardGap] = useState('0');

  const [showCost, setShowCost] = useState(false);
  const [postCost, setPostCost] = useState('15');
  const [railCost, setRailCost] = useState('8');
  const [boardCost, setBoardCost] = useState('3');

  const handleCalculate = () => {
    if (perimeter) {
      calculate({
        perimeter: parseFloat(perimeter) || 0,
        height: parseFloat(height) || 6,
        postSpacing: parseFloat(postSpacing) || 8,
        railsPerSection: parseInt(railsPerSection) || 2,
        boardWidth: parseFloat(boardWidth) || 5.5,
        boardGap: parseFloat(boardGap) || 0,
      });
    }
  };

  const handleReset = () => {
    reset();
    setPerimeter('');
    setHeight('6');
    setPostSpacing('8');
    setRailsPerSection('2');
    setBoardWidth('5.5');
    setBoardGap('0');
  };

  const totalCost = result
    ? result.posts * parseFloat(postCost || '0') +
      result.rails * parseFloat(railCost || '0') +
      result.boards * parseFloat(boardCost || '0')
    : 0;

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Fence Calculator',
    description: 'Calculate fencing materials needed including posts, rails, and boards based on perimeter, height, and spacing.',
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
    <SiteLayout toolName="Fence Calculator" category="home-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Fencing Materials
          </h2>

          {/* Dimension Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Total Perimeter (ft)
              </label>
              <input
                type="number"
                value={perimeter}
                onChange={(e) => setPerimeter(e.target.value)}
                placeholder="100"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fence Height (ft)
              </label>
              <select
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="4">4 ft</option>
                <option value="5">5 ft</option>
                <option value="6">6 ft</option>
                <option value="8">8 ft</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Post Spacing (ft)
              </label>
              <select
                value={postSpacing}
                onChange={(e) => setPostSpacing(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="6">6 ft</option>
                <option value="8">8 ft</option>
                <option value="10">10 ft</option>
              </select>
            </div>
          </div>

          {/* Board Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Rails Per Section
              </label>
              <select
                value={railsPerSection}
                onChange={(e) => setRailsPerSection(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="2">2 Rails</option>
                <option value="3">3 Rails</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Board Width (inches)
              </label>
              <input
                type="number"
                value={boardWidth}
                onChange={(e) => setBoardWidth(e.target.value)}
                step="0.5"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Board Gap (inches)
              </label>
              <input
                type="number"
                value={boardGap}
                onChange={(e) => setBoardGap(e.target.value)}
                step="0.25"
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
              Calculate Materials
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
              Materials Needed
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <div className="text-sm text-blue-600 dark:text-blue-400">Posts</div>
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                  {result.posts}
                </div>
              </div>
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <div className="text-sm text-green-600 dark:text-green-400">Rails</div>
                <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                  {result.rails}
                </div>
              </div>
              <div className="p-4 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <div className="text-sm text-amber-600 dark:text-amber-400">Boards</div>
                <div className="text-3xl font-bold text-amber-700 dark:text-amber-300">
                  {result.boards}
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Total fence sections: {result.sections} | Total linear feet of boards: {result.totalBoardWidth.toFixed(0)} ft
            </div>

            {/* Cost Estimate Option */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <button
                onClick={() => setShowCost(!showCost)}
                className="text-blue-600 dark:text-blue-400 font-medium mb-4"
              >
                {showCost ? 'Hide Cost Estimate' : 'Add Cost Estimate'}
              </button>

              {showCost && (
                <div className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Cost Per Post ($)
                      </label>
                      <input
                        type="number"
                        value={postCost}
                        onChange={(e) => setPostCost(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Cost Per Rail ($)
                      </label>
                      <input
                        type="number"
                        value={railCost}
                        onChange={(e) => setRailCost(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Cost Per Board ($)
                      </label>
                      <input
                        type="number"
                        value={boardCost}
                        onChange={(e) => setBoardCost(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <div className="text-sm text-purple-600 dark:text-purple-400">Estimated Total Cost</div>
                    <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                      ${totalCost.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Posts: ${(result.posts * parseFloat(postCost || '0')).toFixed(2)} |
                      Rails: ${(result.rails * parseFloat(railCost || '0')).toFixed(2)} |
                      Boards: ${(result.boards * parseFloat(boardCost || '0')).toFixed(2)}
                    </div>
                  </div>
                </div>
              )}
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

'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useInventoryTurnoverCalculator } from '@/hooks/useInventoryTurnoverCalculator';

const INDUSTRY_BENCHMARKS = [
  { industry: 'Grocery & Supermarkets', turnover: '14-20', dsi: '18-26 days' },
  { industry: 'Apparel & Fashion', turnover: '4-6', dsi: '60-90 days' },
  { industry: 'Electronics', turnover: '6-8', dsi: '45-60 days' },
  { industry: 'Automotive Parts', turnover: '4-6', dsi: '60-90 days' },
  { industry: 'Furniture', turnover: '5-7', dsi: '52-73 days' },
  { industry: 'Pharmaceuticals', turnover: '8-12', dsi: '30-45 days' },
];

const FEATURES = [
  {
    title: 'Turnover Ratio Analysis',
    description: 'Calculate how many times your inventory is sold and replaced over a period, indicating sales efficiency.',
  },
  {
    title: 'Days Sales of Inventory',
    description: 'Understand how many days it takes on average to sell your entire inventory stock.',
  },
  {
    title: 'Industry Benchmarks',
    description: 'Compare your inventory performance against industry standards to identify improvement opportunities.',
  },
];

const FAQS = [
  {
    question: 'What is inventory turnover ratio?',
    answer: 'Inventory turnover ratio measures how many times a company sells and replaces its inventory during a period. It is calculated by dividing Cost of Goods Sold (COGS) by average inventory.',
  },
  {
    question: 'What is a good inventory turnover ratio?',
    answer: 'A good ratio varies by industry. Generally, 5-10 is considered healthy for most retail businesses. Higher ratios indicate efficient inventory management, while lower ratios may suggest overstocking.',
  },
  {
    question: 'What is Days Sales of Inventory (DSI)?',
    answer: 'DSI measures the average number of days it takes to sell your inventory. It is calculated as 365 divided by the inventory turnover ratio. Lower DSI means faster-moving inventory.',
  },
  {
    question: 'How can I improve my inventory turnover?',
    answer: 'Strategies include better demand forecasting, reducing lead times, eliminating slow-moving items, implementing just-in-time inventory, and optimizing pricing strategies.',
  },
  {
    question: 'What does a low inventory turnover mean?',
    answer: 'A low turnover ratio suggests slow sales, overstocking, or obsolete inventory. This ties up capital and increases storage costs and risk of product obsolescence.',
  },
  {
    question: 'How do I calculate average inventory?',
    answer: 'Average inventory is calculated by adding beginning inventory and ending inventory, then dividing by 2. This provides a more accurate representation than using a single point in time.',
  },
];

export function InventoryTurnoverCalculator() {
  const { result, calculate, reset } = useInventoryTurnoverCalculator();

  const [cogs, setCogs] = useState('');
  const [beginningInventory, setBeginningInventory] = useState('');
  const [endingInventory, setEndingInventory] = useState('');

  const handleCalculate = () => {
    const cogsValue = parseFloat(cogs);
    const beginningValue = parseFloat(beginningInventory);
    const endingValue = parseFloat(endingInventory);

    if (cogsValue > 0 && beginningValue >= 0 && endingValue >= 0) {
      calculate({
        cogs: cogsValue,
        beginningInventory: beginningValue,
        endingInventory: endingValue,
      });
    }
  };

  const handleReset = () => {
    reset();
    setCogs('');
    setBeginningInventory('');
    setEndingInventory('');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'average': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Inventory Turnover Calculator',
    description: 'Calculate inventory turnover ratio and days sales of inventory to optimize your inventory management.',
    applicationCategory: 'BusinessApplication',
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
    <SiteLayout toolName="Inventory Turnover Calculator" category="business-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Inventory Turnover
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cost of Goods Sold (COGS) ($)
              </label>
              <input
                type="number"
                value={cogs}
                onChange={(e) => setCogs(e.target.value)}
                placeholder="500000"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Beginning Inventory ($)
              </label>
              <input
                type="number"
                value={beginningInventory}
                onChange={(e) => setBeginningInventory(e.target.value)}
                placeholder="80000"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ending Inventory ($)
              </label>
              <input
                type="number"
                value={endingInventory}
                onChange={(e) => setEndingInventory(e.target.value)}
                placeholder="100000"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleCalculate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Calculate Turnover
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
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Average Inventory</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(result.averageInventory)}
                </div>
              </div>
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <div className="text-sm text-blue-600 dark:text-blue-400">Turnover Ratio</div>
                <div className={`text-2xl font-bold ${getRatingColor(result.rating)}`}>
                  {result.turnoverRatio.toFixed(2)}x
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  {result.rating}
                </div>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Days Sales of Inventory</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {result.daysSalesOfInventory.toFixed(1)} days
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">{result.interpretation}</p>
            </div>
          </div>
        )}

        {/* Industry Benchmarks */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Industry Benchmarks
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-2 text-gray-700 dark:text-gray-300">Industry</th>
                  <th className="py-2 text-gray-700 dark:text-gray-300">Turnover Ratio</th>
                  <th className="py-2 text-gray-700 dark:text-gray-300">DSI</th>
                </tr>
              </thead>
              <tbody>
                {INDUSTRY_BENCHMARKS.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-2 text-gray-600 dark:text-gray-400">{item.industry}</td>
                    <td className="py-2 text-gray-900 dark:text-white">{item.turnover}</td>
                    <td className="py-2 text-gray-600 dark:text-gray-400">{item.dsi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

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

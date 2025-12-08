'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useEbayFeeCalculator, EbayCategory } from '@/hooks/useEbayFeeCalculator';

const CATEGORIES: { value: EbayCategory; label: string }[] = [
  { value: 'most_categories', label: 'Most Categories' },
  { value: 'books_movies_music', label: 'Books, Movies & Music' },
  { value: 'clothing_shoes', label: 'Clothing & Shoes' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'business_industrial', label: 'Business & Industrial' },
  { value: 'collectibles', label: 'Collectibles & Art' },
];

const FEATURES = [
  {
    title: 'Accurate Fee Calculation',
    description: 'Calculate eBay final value fees and payment processing fees based on current 2024 rates for accurate profit estimates.',
  },
  {
    title: 'Category-Specific Rates',
    description: 'Different eBay categories have different fee structures. Select your category to get precise fee calculations.',
  },
  {
    title: 'Store Subscriber Discounts',
    description: 'eBay store subscribers enjoy reduced fees. Toggle the store option to see your actual costs as a store owner.',
  },
];

const FAQS = [
  {
    question: 'What fees does eBay charge sellers?',
    answer: 'eBay charges two main fees: a final value fee (percentage of total sale including shipping) and a payment processing fee (2.9% + $0.30 per transaction).',
  },
  {
    question: 'What is the final value fee on eBay?',
    answer: 'The final value fee is a percentage of the total sale amount (item price + shipping) that eBay charges when your item sells. Rates vary by category, typically ranging from 9.35% to 14.55%.',
  },
  {
    question: 'Do eBay fees include shipping?',
    answer: 'Yes, eBay calculates the final value fee on the total amount paid by the buyer, which includes both the item price and shipping charges.',
  },
  {
    question: 'How much can I save with an eBay store subscription?',
    answer: 'eBay store subscribers typically save 1-4% on final value fees depending on the category. For high-volume sellers, this can result in significant savings.',
  },
  {
    question: 'Are there any other eBay seller fees?',
    answer: 'Beyond final value and payment processing fees, sellers may pay insertion fees (for listings beyond free monthly allowance), promoted listing fees, and international fees for cross-border sales.',
  },
  {
    question: 'How do I reduce my eBay selling fees?',
    answer: 'Consider getting an eBay store subscription for reduced rates, qualify for Top Rated Seller discounts, avoid promoted listings when possible, and price items to account for fees.',
  },
];

export function EbayFeeCalculator() {
  const { result, calculate, reset } = useEbayFeeCalculator();

  const [salePrice, setSalePrice] = useState('');
  const [shippingCharged, setShippingCharged] = useState('');
  const [category, setCategory] = useState<EbayCategory>('most_categories');
  const [isStore, setIsStore] = useState(false);

  const handleCalculate = () => {
    if (salePrice) {
      calculate({
        salePrice: parseFloat(salePrice) || 0,
        shippingCharged: parseFloat(shippingCharged) || 0,
        category,
        isStore,
      });
    }
  };

  const handleReset = () => {
    reset();
    setSalePrice('');
    setShippingCharged('');
    setCategory('most_categories');
    setIsStore(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'eBay Fee Calculator',
    description: 'Calculate eBay selling fees, final value fees, payment processing fees, and estimate your net profit.',
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
    <SiteLayout toolName="eBay Fee Calculator" category="ecommerce-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Your eBay Selling Fees
          </h2>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sale Price ($)
              </label>
              <input
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="49.99"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Shipping Charged to Buyer ($)
              </label>
              <input
                type="number"
                value={shippingCharged}
                onChange={(e) => setShippingCharged(e.target.value)}
                placeholder="5.99"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EbayCategory)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isStore}
                  onChange={(e) => setIsStore(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  eBay Store Subscriber
                </span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleCalculate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Calculate Fees
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
              Fee Breakdown
            </h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Total Sale Amount</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(result.totalSale)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">
                  Final Value Fee ({(result.finalValueFeeRate * 100).toFixed(2)}%)
                </span>
                <span className="font-medium text-red-600">
                  -{formatCurrency(result.finalValueFee)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">
                  Payment Processing (2.9% + $0.30)
                </span>
                <span className="font-medium text-red-600">
                  -{formatCurrency(result.paymentProcessingFee)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Total Fees</span>
                <span className="font-bold text-red-600">
                  -{formatCurrency(result.totalFees)} ({result.feePercentage.toFixed(1)}%)
                </span>
              </div>
            </div>

            <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <div className="text-sm text-green-600 dark:text-green-400">Net Profit (After Fees)</div>
              <div className="text-3xl font-bold text-green-700 dark:text-green-400">
                {formatCurrency(result.netProfit)}
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

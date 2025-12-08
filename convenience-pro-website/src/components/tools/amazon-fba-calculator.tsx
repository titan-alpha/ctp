'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useAmazonFbaCalculator } from '@/hooks/useAmazonFbaCalculator';

const FEATURES = [
  {
    title: 'Accurate Fee Breakdown',
    description: 'Get detailed breakdowns of referral fees, fulfillment fees, and storage costs based on Amazon\'s current fee structure.',
  },
  {
    title: 'Profit Margin Analysis',
    description: 'Calculate your net profit, profit margin percentage, and ROI to make informed product sourcing decisions.',
  },
  {
    title: 'Size Tier Detection',
    description: 'Automatically determines your product\'s size tier (small, large, or oversize) based on dimensions and weight.',
  },
];

const FAQS = [
  {
    question: 'What is Amazon FBA?',
    answer: 'Amazon FBA (Fulfillment by Amazon) is a service where Amazon stores, picks, packs, and ships your products. They also handle customer service and returns for FBA orders.',
  },
  {
    question: 'How are FBA fees calculated?',
    answer: 'FBA fees consist of referral fees (typically 8-15% of the sale price), fulfillment fees (based on size and weight), and monthly storage fees (based on cubic footage).',
  },
  {
    question: 'What is a good profit margin for Amazon FBA?',
    answer: 'Most successful Amazon sellers aim for a profit margin of 15-30% after all fees. Margins below 10% leave little room for error or price competition.',
  },
  {
    question: 'What is dimensional weight?',
    answer: 'Dimensional weight is calculated by dividing the product\'s volume (L x W x H) by 139. Amazon uses the greater of actual weight or dimensional weight for fee calculations.',
  },
  {
    question: 'How accurate is this calculator?',
    answer: 'This calculator uses Amazon\'s published fee structure and provides accurate estimates. Actual fees may vary slightly based on category-specific rates and seasonal storage fees.',
  },
  {
    question: 'What is ROI in Amazon FBA?',
    answer: 'ROI (Return on Investment) measures your profit relative to your product cost. An ROI of 100% means you doubled your money. Most sellers target at least 50-100% ROI.',
  },
];

export function AmazonFbaCalculator() {
  const { result, calculate, reset } = useAmazonFbaCalculator();

  const [sellingPrice, setSellingPrice] = useState('');
  const [productCost, setProductCost] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [referralFeePercent, setReferralFeePercent] = useState('15');

  const handleCalculate = () => {
    if (sellingPrice && productCost && length && width && height && weight) {
      calculate({
        sellingPrice: parseFloat(sellingPrice),
        productCost: parseFloat(productCost),
        length: parseFloat(length),
        width: parseFloat(width),
        height: parseFloat(height),
        weight: parseFloat(weight),
        referralFeePercent: parseFloat(referralFeePercent) || 15,
      });
    }
  };

  const handleReset = () => {
    reset();
    setSellingPrice('');
    setProductCost('');
    setLength('');
    setWidth('');
    setHeight('');
    setWeight('');
    setReferralFeePercent('15');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getProfitColor = (profit: number) => {
    if (profit > 0) return 'text-green-600';
    if (profit < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Amazon FBA Calculator',
    description: 'Calculate Amazon FBA fees, profit margins, and ROI for your products.',
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
    <SiteLayout toolName="Amazon FBA Calculator" category="ecommerce-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate FBA Fees & Profit
          </h2>

          {/* Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Selling Price ($)
              </label>
              <input
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                placeholder="29.99"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Product Cost ($)
              </label>
              <input
                type="number"
                value={productCost}
                onChange={(e) => setProductCost(e.target.value)}
                placeholder="8.50"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Dimensions */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Product Dimensions (inches)
            </label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <input
                  type="number"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  placeholder="Length"
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  placeholder="Width"
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="Height"
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Weight & Referral Fee */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Weight (lbs)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="1.5"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Referral Fee (%)
              </label>
              <input
                type="number"
                value={referralFeePercent}
                onChange={(e) => setReferralFeePercent(e.target.value)}
                placeholder="15"
                min="1"
                max="45"
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
              Fee Breakdown & Profit Analysis
            </h3>

            {/* Main Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <div className="text-sm text-blue-600 dark:text-blue-400">Net Profit</div>
                <div className={`text-2xl font-bold ${getProfitColor(result.netProfit)}`}>
                  {formatCurrency(result.netProfit)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">per unit</div>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Profit Margin</div>
                <div className={`text-2xl font-bold ${getProfitColor(result.profitMargin)}`}>
                  {result.profitMargin.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">of sale price</div>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">ROI</div>
                <div className={`text-2xl font-bold ${getProfitColor(result.roi)}`}>
                  {result.roi.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">return on investment</div>
              </div>
            </div>

            {/* Fee Breakdown */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Fee Breakdown</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Referral Fee</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(result.referralFee)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Fulfillment Fee</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(result.fulfillmentFee)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Storage Fee (monthly)</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(result.storageFee)}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                  <span className="font-medium text-gray-900 dark:text-white">Total Fees</span>
                  <span className="font-bold text-red-600">
                    {formatCurrency(result.totalFees)}
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-gray-500 dark:text-gray-400">Size Tier</div>
                <div className="font-medium text-gray-900 dark:text-white capitalize">
                  {result.productSize}
                </div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-gray-500 dark:text-gray-400">Dim. Weight</div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {result.dimensionalWeight} lbs
                </div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-gray-500 dark:text-gray-400">Break-Even Price</div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(result.breakEvenPrice)}
                </div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-gray-500 dark:text-gray-400">Total Fees %</div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {((result.totalFees / parseFloat(sellingPrice)) * 100).toFixed(1)}%
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

'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useEtsyFeeCalculator } from '@/hooks/useEtsyFeeCalculator';

const FEATURES = [
  {
    title: 'Complete Fee Breakdown',
    description: 'See all Etsy fees including listing, transaction, payment processing, and offsite ad fees in one place.',
  },
  {
    title: 'Profit Calculation',
    description: 'Factor in your product and shipping costs to calculate your actual net profit and profit margin.',
  },
  {
    title: 'Up-to-Date Rates',
    description: 'Uses current Etsy fee rates including the 6.5% transaction fee and payment processing fees.',
  },
];

const FAQS = [
  {
    question: 'What fees does Etsy charge sellers?',
    answer: 'Etsy charges a $0.20 listing fee, 6.5% transaction fee on the sale price (including shipping), payment processing fees (3% + $0.25 if using Etsy Payments), and a 0.3% regulatory operating fee.',
  },
  {
    question: 'What is the Etsy offsite ads fee?',
    answer: 'If a buyer finds your listing through an Etsy offsite ad and makes a purchase, you pay a 15% fee (or 12% if your shop makes over $10,000/year). This only applies to sales from offsite ads.',
  },
  {
    question: 'How much does it cost to list on Etsy?',
    answer: 'Each listing costs $0.20 and stays active for 4 months or until the item sells. When you sell an item, you pay the listing fee again for automatic renewal.',
  },
  {
    question: 'What is the Etsy transaction fee?',
    answer: 'Etsy charges a 6.5% transaction fee on the total sale price, which includes the item price and shipping. This fee applies to all sales.',
  },
  {
    question: 'How are Etsy payment processing fees calculated?',
    answer: 'If you use Etsy Payments, you pay 3% of the total sale plus $0.25 per transaction. These fees vary slightly by country.',
  },
  {
    question: 'How can I maximize profit on Etsy?',
    answer: 'Price your items to cover all fees (typically 15-20% of sale price), optimize listings for organic search to avoid offsite ad fees, and consider shipping costs in your pricing strategy.',
  },
];

export function EtsyFeeCalculator() {
  const { result, calculate, reset } = useEtsyFeeCalculator();

  const [itemPrice, setItemPrice] = useState('');
  const [shippingPrice, setShippingPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [itemCost, setItemCost] = useState('');
  const [shippingCost, setShippingCost] = useState('');
  const [isEtsyPayments, setIsEtsyPayments] = useState(true);
  const [isOffSiteAd, setIsOffSiteAd] = useState(false);

  const handleCalculate = () => {
    if (itemPrice) {
      calculate({
        itemPrice: parseFloat(itemPrice) || 0,
        shippingPrice: parseFloat(shippingPrice) || 0,
        quantity: parseInt(quantity) || 1,
        itemCost: parseFloat(itemCost) || 0,
        shippingCost: parseFloat(shippingCost) || 0,
        isEtsyPayments,
        isOffSiteAd,
      });
    }
  };

  const handleReset = () => {
    reset();
    setItemPrice('');
    setShippingPrice('');
    setQuantity('1');
    setItemCost('');
    setShippingCost('');
    setIsEtsyPayments(true);
    setIsOffSiteAd(false);
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
    name: 'Etsy Fee Calculator',
    description: 'Calculate Etsy seller fees including listing, transaction, and payment processing fees. Determine your profit margin.',
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
    <SiteLayout toolName="Etsy Fee Calculator" category="ecommerce-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Your Etsy Fees
          </h2>

          {/* Sale Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Item Price ($)
              </label>
              <input
                type="number"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
                placeholder="25.00"
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Shipping Price ($)
              </label>
              <input
                type="number"
                value={shippingPrice}
                onChange={(e) => setShippingPrice(e.target.value)}
                placeholder="5.00"
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="1"
                min="1"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Your Costs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Your Item Cost ($)
              </label>
              <input
                type="number"
                value={itemCost}
                onChange={(e) => setItemCost(e.target.value)}
                placeholder="10.00"
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Your Shipping Cost ($)
              </label>
              <input
                type="number"
                value={shippingCost}
                onChange={(e) => setShippingCost(e.target.value)}
                placeholder="3.00"
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Options */}
          <div className="flex flex-wrap gap-6 mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isEtsyPayments}
                onChange={(e) => setIsEtsyPayments(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-gray-700 dark:text-gray-300">Using Etsy Payments</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isOffSiteAd}
                onChange={(e) => setIsOffSiteAd(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-gray-700 dark:text-gray-300">Sale from Offsite Ad</span>
            </label>
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

            {/* Fee Details */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Listing Fee ($0.20 x {quantity})</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(result.listingFee)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Transaction Fee (6.5%)</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(result.transactionFee)}</span>
              </div>
              {result.paymentProcessingFee > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Payment Processing (3% + $0.25)</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(result.paymentProcessingFee)}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Regulatory Operating Fee (0.3%)</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(result.regulatoryFee)}</span>
              </div>
              {result.offSiteAdFee > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Offsite Ads Fee (15%)</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(result.offSiteAdFee)}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2 bg-gray-100 dark:bg-gray-700 px-3 rounded-lg">
                <span className="font-semibold text-gray-900 dark:text-white">Total Etsy Fees</span>
                <span className="font-bold text-red-600">{formatCurrency(result.totalFees)}</span>
              </div>
            </div>

            {/* Profit Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Gross Revenue</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(result.grossRevenue)}
                </div>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Costs + Fees</div>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(result.totalFees + result.totalCosts)}
                </div>
              </div>
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <div className="text-sm text-blue-600 dark:text-blue-400">Net Profit</div>
                <div className={`text-2xl font-bold ${result.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(result.netProfit)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {result.profitMargin.toFixed(1)}% margin
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

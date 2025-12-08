'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useClosingCostCalculator } from '@/hooks/useClosingCostCalculator';

const LOCATIONS = [
  'California',
  'Texas',
  'Florida',
  'New York',
  'Illinois',
  'Pennsylvania',
  'Ohio',
  'Georgia',
  'North Carolina',
  'Michigan',
  'Other',
];

const CATEGORY_LABELS: Record<string, string> = {
  lender: 'Lender Fees',
  title: 'Title & Settlement',
  government: 'Government Fees',
  prepaid: 'Prepaid Items',
  other: 'Other Costs',
};

const FEATURES = [
  {
    title: 'Itemized Cost Breakdown',
    description: 'See every fee and cost itemized with descriptions, so you know exactly where your money is going at closing.',
  },
  {
    title: 'Buyer & Seller Estimates',
    description: 'Toggle between buyer and seller closing costs to understand the full picture for either side of the transaction.',
  },
  {
    title: 'Location-Based Estimates',
    description: 'Get more accurate estimates based on your state, accounting for varying transfer taxes and regional costs.',
  },
];

const FAQS = [
  {
    question: 'What are closing costs?',
    answer: 'Closing costs are fees and expenses paid at the closing of a real estate transaction, beyond the property price. They typically include lender fees, title insurance, government taxes, and prepaid items like insurance and property taxes.',
  },
  {
    question: 'How much are typical closing costs for buyers?',
    answer: 'Buyer closing costs typically range from 2-5% of the home purchase price. On a $400,000 home, expect to pay $8,000-$20,000 in closing costs, though this varies by location and loan type.',
  },
  {
    question: 'What closing costs do sellers pay?',
    answer: 'Sellers typically pay 6-10% of the sale price in closing costs, with the largest expense being real estate agent commissions (typically 5-6%). Other seller costs include transfer taxes, title insurance, and prorated property taxes.',
  },
  {
    question: 'Can closing costs be negotiated?',
    answer: 'Yes, many closing costs are negotiable. You can shop around for title insurance and settlement services, negotiate lender fees, and even ask the seller to contribute to closing costs as part of your purchase offer.',
  },
  {
    question: 'Can closing costs be rolled into the mortgage?',
    answer: 'Some closing costs can be financed into your mortgage through "no-closing-cost" loans, though this typically results in a higher interest rate. FHA and VA loans also allow some costs to be financed.',
  },
  {
    question: 'When are closing costs paid?',
    answer: 'Closing costs are typically paid at the closing table when you sign the final paperwork. You will receive a Closing Disclosure at least 3 business days before closing that details all costs.',
  },
];

export function ClosingCostCalculator() {
  const { result, calculate, reset } = useClosingCostCalculator();

  const [homePrice, setHomePrice] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [location, setLocation] = useState('California');
  const [isBuyer, setIsBuyer] = useState(true);

  const handleCalculate = () => {
    const price = parseFloat(homePrice) || 0;
    const loan = parseFloat(loanAmount) || 0;
    if (price > 0) {
      calculate({
        homePrice: price,
        loanAmount: loan,
        location,
        isBuyer,
      });
    }
  };

  const handleReset = () => {
    reset();
    setHomePrice('');
    setLoanAmount('');
    setLocation('California');
    setIsBuyer(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Closing Cost Calculator',
    description: 'Estimate home buying and selling closing costs with itemized breakdown.',
    applicationCategory: 'FinanceApplication',
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
    <SiteLayout toolName="Closing Cost Calculator" category="real-estate-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Estimate Your Closing Costs
          </h2>

          {/* Buyer/Seller Toggle */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              I am a:
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setIsBuyer(true)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  isBuyer
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Buyer
              </button>
              <button
                onClick={() => setIsBuyer(false)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  !isBuyer
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Seller
              </button>
            </div>
          </div>

          {/* Price and Loan Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Home Price ($)
              </label>
              <input
                type="number"
                value={homePrice}
                onChange={(e) => setHomePrice(e.target.value)}
                placeholder="400000"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            {isBuyer && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Loan Amount ($)
                </label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="320000"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location (State)
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleCalculate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Calculate Closing Costs
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
              Estimated {isBuyer ? 'Buyer' : 'Seller'} Closing Costs
            </h3>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <div className="text-sm text-blue-600 dark:text-blue-400">Total Closing Costs</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(result.totalClosingCosts)}
                </div>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">% of Home Price</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {result.percentOfHomePrice.toFixed(2)}%
                </div>
              </div>
              {isBuyer && result.percentOfLoanAmount > 0 && (
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">% of Loan Amount</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {result.percentOfLoanAmount.toFixed(2)}%
                  </div>
                </div>
              )}
            </div>

            {/* Costs by Category */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Costs by Category</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(result.costsByCategory).map(([category, amount]) => (
                  <div key={category} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {CATEGORY_LABELS[category] || category}
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(amount)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Itemized Breakdown */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Itemized Breakdown</h4>
              <div className="space-y-2">
                {result.itemizedCosts.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-start py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                  >
                    <div>
                      <div className="text-gray-900 dark:text-white">{item.name}</div>
                      {item.description && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {item.description}
                        </div>
                      )}
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(item.amount)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                <div className="font-bold text-gray-900 dark:text-white">Total</div>
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(result.totalClosingCosts)}
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

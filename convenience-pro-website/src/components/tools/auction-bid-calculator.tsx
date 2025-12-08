'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useAuctionBidCalculator } from '@/hooks/useAuctionBidCalculator';

const FEATURES = [
  {
    title: 'Smart Budget Planning',
    description: 'Enter your maximum budget and instantly know the highest bid you can place while staying within your spending limit.',
  },
  {
    title: 'Fee-Inclusive Calculation',
    description: 'Accounts for buyer premium percentages charged by auction houses to give you accurate total cost estimates.',
  },
  {
    title: 'Avoid Overbidding',
    description: 'Never exceed your budget at auction by knowing your true maximum bid before the bidding starts.',
  },
];

const FAQS = [
  {
    question: 'What is a buyer premium at auctions?',
    answer: 'A buyer premium is an additional fee charged by auction houses on top of the winning bid. It is typically a percentage of the hammer price (winning bid) and ranges from 10% to 30% depending on the auction house.',
  },
  {
    question: 'How is the maximum bid calculated?',
    answer: 'The maximum bid is calculated by dividing your total budget by (1 + buyer premium rate). For example, with a $1,000 budget and 20% premium, your max bid would be $1,000 / 1.20 = $833.33.',
  },
  {
    question: 'What are typical buyer premium rates?',
    answer: 'Buyer premiums vary by auction house and item type. Common rates range from 10% to 25% for general auctions, while high-end art and collectibles auctions may charge 25% or more.',
  },
  {
    question: 'Does this calculator include sales tax?',
    answer: 'This calculator focuses on the buyer premium only. Sales tax varies by location and should be considered separately when planning your total budget.',
  },
  {
    question: 'Can I use this for online auctions?',
    answer: 'Yes, this calculator works for any auction format including online auctions, live auctions, and silent auctions that charge a buyer premium.',
  },
  {
    question: 'Should I always bid my maximum amount?',
    answer: 'Not necessarily. While knowing your maximum helps set a ceiling, strategic bidding often starts lower. Use your calculated max as an absolute limit you should not exceed.',
  },
];

export function AuctionBidCalculator() {
  const { result, calculate, reset } = useAuctionBidCalculator();

  const [maxBudget, setMaxBudget] = useState('');
  const [buyerPremiumPercent, setBuyerPremiumPercent] = useState('20');

  const handleCalculate = () => {
    if (maxBudget && buyerPremiumPercent) {
      calculate({
        maxBudget: parseFloat(maxBudget) || 0,
        buyerPremiumPercent: parseFloat(buyerPremiumPercent) || 0,
      });
    }
  };

  const handleReset = () => {
    reset();
    setMaxBudget('');
    setBuyerPremiumPercent('20');
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
    name: 'Auction Bid Calculator',
    description: 'Calculate your maximum auction bid based on your budget and buyer premium percentage to avoid overbidding.',
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
    <SiteLayout toolName="Auction Bid Calculator" category="lifestyle-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Your Maximum Auction Bid
          </h2>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Maximum Budget ($)
              </label>
              <input
                type="number"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                placeholder="1000"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Buyer Premium (%)
              </label>
              <input
                type="number"
                value={buyerPremiumPercent}
                onChange={(e) => setBuyerPremiumPercent(e.target.value)}
                placeholder="20"
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
              Calculate Max Bid
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
              Bid Calculation Results
            </h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Your Budget</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(result.totalCost)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">
                  Buyer Premium ({result.effectivePremiumRate.toFixed(1)}%)
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(result.buyerPremiumAmount)}
                </span>
              </div>
            </div>

            <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <div className="text-sm text-green-600 dark:text-green-400">Maximum Bid Amount</div>
              <div className="text-3xl font-bold text-green-700 dark:text-green-400">
                {formatCurrency(result.maxBidAmount)}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                Bid up to this amount to stay within your budget
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

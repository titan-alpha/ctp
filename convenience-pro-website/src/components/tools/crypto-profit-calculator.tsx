'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useCryptoProfitCalculator } from '@/hooks/useCryptoProfitCalculator';

const FEATURES = [
  {
    title: 'Instant Profit Calculation',
    description: 'Calculate your crypto trading profit or loss instantly with buy price, sell price, and amount.',
  },
  {
    title: 'Fee Accounting',
    description: 'Factor in exchange fees for both buying and selling to get accurate net profit calculations.',
  },
  {
    title: 'ROI Analysis',
    description: 'See your return on investment percentage to evaluate trade performance and strategy.',
  },
];

const FAQS = [
  {
    question: 'How is crypto profit calculated?',
    answer: 'Crypto profit is calculated by subtracting your total investment (buy price x amount + buy fees) from your net sale value (sell price x amount - sell fees). The result shows your actual profit or loss.',
  },
  {
    question: 'What fees should I include?',
    answer: 'Include all exchange trading fees, which typically range from 0.1% to 1% per trade. Some exchanges charge different fees for makers and takers. Check your exchange fee schedule for accurate calculations.',
  },
  {
    question: 'What is ROI in crypto trading?',
    answer: 'ROI (Return on Investment) measures the percentage gain or loss relative to your initial investment. A 50% ROI means you earned half of your initial investment as profit. Negative ROI indicates a loss.',
  },
  {
    question: 'Does this calculator account for taxes?',
    answer: 'No, this calculator shows gross profit/loss before taxes. Cryptocurrency gains are taxable in most jurisdictions. Consult a tax professional for accurate tax calculations based on your location.',
  },
  {
    question: 'How do I calculate profit for multiple trades?',
    answer: 'Calculate each trade separately using this tool. For portfolio tracking across multiple trades, consider using dedicated crypto portfolio management tools that track your complete trading history.',
  },
  {
    question: 'What if I bought at different prices?',
    answer: 'If you purchased at different prices, calculate the average buy price by dividing total investment by total coins purchased. Use this average as your buy price for accurate profit calculations.',
  },
];

export function CryptoProfitCalculator() {
  const { result, error, calculate, reset } = useCryptoProfitCalculator();
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [buyFee, setBuyFee] = useState('0.1');
  const [sellFee, setSellFee] = useState('0.1');

  const handleCalculate = () => {
    calculate(
      parseFloat(buyPrice) || 0,
      parseFloat(sellPrice) || 0,
      parseFloat(amount) || 0,
      parseFloat(buyFee) || 0,
      parseFloat(sellFee) || 0
    );
  };

  const handleReset = () => {
    reset();
    setBuyPrice('');
    setSellPrice('');
    setAmount('');
    setBuyFee('0.1');
    setSellFee('0.1');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Crypto Profit Calculator',
    description: 'Calculate cryptocurrency trading profit and loss with fee accounting and ROI analysis.',
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
    <SiteLayout toolName="Crypto Profit Calculator" category="crypto-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Crypto Profit/Loss
          </h2>

          {/* Price Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Buy Price (USD)
              </label>
              <input
                type="number"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                placeholder="30000"
                min="0"
                step="any"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sell Price (USD)
              </label>
              <input
                type="number"
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
                placeholder="45000"
                min="0"
                step="any"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Amount Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount (Coins/Tokens)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1.5"
              min="0"
              step="any"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Fee Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Buy Fee (%)
              </label>
              <input
                type="number"
                value={buyFee}
                onChange={(e) => setBuyFee(e.target.value)}
                placeholder="0.1"
                min="0"
                max="100"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sell Fee (%)
              </label>
              <input
                type="number"
                value={sellFee}
                onChange={(e) => setSellFee(e.target.value)}
                placeholder="0.1"
                min="0"
                max="100"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleCalculate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Calculate
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
              Results
            </h3>

            <div className="text-center py-6 mb-6">
              <div className={`text-5xl font-bold mb-2 ${
                result.isProfit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {result.isProfit ? '+' : ''}{formatCurrency(result.profit)}
              </div>
              <div className={`text-xl ${
                result.isProfit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {result.isProfit ? '+' : ''}{result.roiPercentage}% ROI
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="py-3 text-gray-600 dark:text-gray-400 font-medium">Total Investment</td>
                    <td className="py-3 text-gray-900 dark:text-white">{formatCurrency(result.investment)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-600 dark:text-gray-400 font-medium">Net Sale Value</td>
                    <td className="py-3 text-gray-900 dark:text-white">{formatCurrency(result.saleValue)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-600 dark:text-gray-400 font-medium">Buy Fee</td>
                    <td className="py-3 text-gray-900 dark:text-white">{formatCurrency(result.buyFeeAmount)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-600 dark:text-gray-400 font-medium">Sell Fee</td>
                    <td className="py-3 text-gray-900 dark:text-white">{formatCurrency(result.sellFeeAmount)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-600 dark:text-gray-400 font-medium">Total Fees</td>
                    <td className="py-3 text-gray-900 dark:text-white">{formatCurrency(result.totalFees)}</td>
                  </tr>
                </tbody>
              </table>
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

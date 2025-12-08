'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useCryptoStakingCalculator } from '@/hooks/useCryptoStakingCalculator';

const COMPOUND_OPTIONS = [
  { value: 'none', label: 'No Compounding (Simple)' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
] as const;

const DURATION_PRESETS = [
  { months: 1, label: '1 Month' },
  { months: 3, label: '3 Months' },
  { months: 6, label: '6 Months' },
  { months: 12, label: '1 Year' },
  { months: 24, label: '2 Years' },
  { months: 60, label: '5 Years' },
];

const FEATURES = [
  {
    title: 'Compound vs Simple Interest',
    description: 'Compare staking rewards with different compounding frequencies including daily, weekly, monthly, or no compounding.',
  },
  {
    title: 'Projected Earnings',
    description: 'See your total rewards and final balance based on your staking amount, APY, and chosen duration.',
  },
  {
    title: 'Monthly Breakdown',
    description: 'Track your earnings growth month by month with a detailed breakdown of accumulated rewards.',
  },
];

const FAQS = [
  {
    question: 'What is crypto staking?',
    answer: 'Crypto staking is the process of locking up cryptocurrency to support blockchain operations like validating transactions. In return, stakers earn rewards, similar to earning interest on savings.',
  },
  {
    question: 'What is APY in crypto staking?',
    answer: 'APY (Annual Percentage Yield) represents the yearly return on your staked cryptocurrency, including compound interest. It shows the total return you can expect if rewards are reinvested.',
  },
  {
    question: 'What is the difference between simple and compound interest?',
    answer: 'Simple interest is calculated only on the original amount staked. Compound interest is calculated on both the principal and accumulated rewards, leading to higher returns over time.',
  },
  {
    question: 'How often should I compound my staking rewards?',
    answer: 'More frequent compounding (daily vs monthly) yields higher returns. However, consider gas fees when claiming rewards - frequent compounding may not be cost-effective for small amounts.',
  },
  {
    question: 'Are staking rewards guaranteed?',
    answer: 'No, staking rewards are not guaranteed. APY rates can fluctuate based on network conditions, total staked amount, and protocol changes. Always research before staking.',
  },
  {
    question: 'What are the risks of crypto staking?',
    answer: 'Risks include price volatility, lock-up periods where you cannot access funds, slashing penalties for validator misbehavior, and smart contract vulnerabilities.',
  },
];

export function CryptoStakingCalculator() {
  const { result, calculate, reset } = useCryptoStakingCalculator();

  const [amount, setAmount] = useState('');
  const [apy, setApy] = useState('');
  const [durationMonths, setDurationMonths] = useState('12');
  const [compoundFrequency, setCompoundFrequency] = useState<'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  const handleCalculate = () => {
    if (amount && apy && durationMonths) {
      calculate({
        amount: parseFloat(amount),
        apy: parseFloat(apy),
        durationMonths: parseInt(durationMonths),
        compoundFrequency,
      });
    }
  };

  const handleReset = () => {
    reset();
    setAmount('');
    setApy('');
    setDurationMonths('12');
    setCompoundFrequency('monthly');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Crypto Staking Calculator',
    description: 'Calculate cryptocurrency staking rewards with compound and simple interest options.',
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
    <SiteLayout toolName="Crypto Staking Calculator" category="crypto-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Staking Rewards
          </h2>

          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Staking Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1000"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                APY (%)
              </label>
              <input
                type="number"
                value={apy}
                onChange={(e) => setApy(e.target.value)}
                placeholder="5.0"
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Duration */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Staking Duration
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {DURATION_PRESETS.map((preset) => (
                <button
                  key={preset.months}
                  onClick={() => setDurationMonths(preset.months.toString())}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    durationMonths === preset.months.toString()
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <input
              type="number"
              value={durationMonths}
              onChange={(e) => setDurationMonths(e.target.value)}
              placeholder="Custom months"
              min="1"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Compound Frequency */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Compound Frequency
            </label>
            <select
              value={compoundFrequency}
              onChange={(e) => setCompoundFrequency(e.target.value as typeof compoundFrequency)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {COMPOUND_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleCalculate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Calculate Rewards
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
              Projected Earnings
            </h3>

            {/* Main Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Rewards</div>
                <div className="text-2xl font-bold text-green-600">
                  +{formatCurrency(result.totalRewards)}
                </div>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Final Balance</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(result.finalBalance)}
                </div>
              </div>
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <div className="text-sm text-blue-600 dark:text-blue-400">Effective APY</div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {result.effectiveApy.toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Monthly Breakdown */}
            {result.monthlyBreakdown.length <= 24 && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Monthly Breakdown</h4>
                <div className="max-h-64 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="text-gray-600 dark:text-gray-400">
                      <tr>
                        <th className="text-left py-2">Month</th>
                        <th className="text-right py-2">Balance</th>
                        <th className="text-right py-2">Total Rewards</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.monthlyBreakdown.map((row) => (
                        <tr key={row.month} className="border-t border-gray-100 dark:border-gray-700">
                          <td className="py-2 text-gray-900 dark:text-white">{row.month}</td>
                          <td className="py-2 text-right text-gray-900 dark:text-white">
                            {formatCurrency(row.balance)}
                          </td>
                          <td className="py-2 text-right text-green-600">
                            +{formatCurrency(row.rewards)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
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

'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useRentalYieldCalculator } from '@/hooks/useRentalYieldCalculator';

const FEATURES = [
  {
    title: 'Gross & Net Yield',
    description: 'Calculate both gross rental yield (before expenses) and net yield (after expenses) for accurate property analysis.',
  },
  {
    title: 'Cash-on-Cash Return',
    description: 'See your actual return on invested capital based on your down payment, essential for leveraged investments.',
  },
  {
    title: 'Expense Tracking',
    description: 'Factor in maintenance, insurance, property taxes, and management fees for realistic profit projections.',
  },
];

const FAQS = [
  {
    question: 'What is rental yield?',
    answer: 'Rental yield is a measure of how much income a property generates relative to its price. It\'s expressed as a percentage and helps investors compare different properties.',
  },
  {
    question: 'What is the difference between gross and net rental yield?',
    answer: 'Gross yield is calculated using only the rental income and property price. Net yield subtracts expenses like maintenance, insurance, taxes, and management fees for a more accurate picture.',
  },
  {
    question: 'What is a good rental yield?',
    answer: 'A gross yield of 5-8% is generally considered good, while net yields of 4-6% are typical. Higher yields often come with higher risk or lower capital appreciation potential.',
  },
  {
    question: 'What is cash-on-cash return?',
    answer: 'Cash-on-cash return measures the annual pre-tax cash flow relative to the actual cash invested (down payment). It\'s crucial for investors using mortgages to leverage their investment.',
  },
  {
    question: 'What expenses should I include?',
    answer: 'Include property taxes, insurance, maintenance (typically 1% of property value), vacancy allowance (5-10% of rent), property management fees (8-12% of rent), and HOA fees if applicable.',
  },
  {
    question: 'How do I improve my rental yield?',
    answer: 'Increase rent to market rates, reduce vacancies, minimize expenses through preventive maintenance, refinance for better rates, or add value through renovations that justify higher rent.',
  },
];

export function RentalYieldCalculator() {
  const { result, calculate, reset } = useRentalYieldCalculator();

  const [propertyPrice, setPropertyPrice] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [annualExpenses, setAnnualExpenses] = useState('');
  const [downPayment, setDownPayment] = useState('');

  const handleCalculate = () => {
    if (propertyPrice && monthlyRent) {
      calculate({
        propertyPrice: parseFloat(propertyPrice) || 0,
        monthlyRent: parseFloat(monthlyRent) || 0,
        annualExpenses: parseFloat(annualExpenses) || 0,
        downPayment: parseFloat(downPayment) || 0,
      });
    }
  };

  const handleReset = () => {
    reset();
    setPropertyPrice('');
    setMonthlyRent('');
    setAnnualExpenses('');
    setDownPayment('');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return value.toFixed(2) + '%';
  };

  const getYieldColor = (yield_: number) => {
    if (yield_ >= 8) return 'text-green-600';
    if (yield_ >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Rental Yield Calculator',
    description: 'Calculate gross and net rental yield, cash-on-cash return, and analyze investment property profitability.',
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
    <SiteLayout toolName="Rental Yield Calculator" category="real-estate-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Rental Yield
          </h2>

          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Property Price ($)
              </label>
              <input
                type="number"
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(e.target.value)}
                placeholder="300000"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Monthly Rent ($)
              </label>
              <input
                type="number"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                placeholder="2000"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Annual Expenses ($)
              </label>
              <input
                type="number"
                value={annualExpenses}
                onChange={(e) => setAnnualExpenses(e.target.value)}
                placeholder="6000"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Include taxes, insurance, maintenance, management fees
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Down Payment ($) - Optional
              </label>
              <input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
                placeholder="60000"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                For cash-on-cash return calculation
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleCalculate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Calculate Yield
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

            {/* Main Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Gross Yield</div>
                <div className={`text-2xl font-bold ${getYieldColor(result.grossYield)}`}>
                  {formatPercent(result.grossYield)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">before expenses</div>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Net Yield</div>
                <div className={`text-2xl font-bold ${getYieldColor(result.netYield)}`}>
                  {formatPercent(result.netYield)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">after expenses</div>
              </div>
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <div className="text-sm text-blue-600 dark:text-blue-400">Cash-on-Cash Return</div>
                <div className={`text-2xl font-bold ${getYieldColor(result.cashOnCashReturn)}`}>
                  {formatPercent(result.cashOnCashReturn)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">on invested capital</div>
              </div>
            </div>

            {/* Income Breakdown */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Income Breakdown</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Annual Rental Income</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(result.annualRent)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Annual Net Income</span>
                  <span className={`font-medium ${result.annualNetIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(result.annualNetIncome)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Monthly Net Income</span>
                  <span className={`font-medium ${result.monthlyNetIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(result.monthlyNetIncome)}
                  </span>
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

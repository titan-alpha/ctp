'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useCustomerLifetimeValue } from '@/hooks/useCustomerLifetimeValue';

const FEATURES = [
  {
    title: 'Simple & Traditional CLV',
    description: 'Calculate both simple lifetime value and margin-adjusted traditional CLV for comprehensive analysis.',
  },
  {
    title: '5-Year Projections',
    description: 'View projected cumulative revenue and profit over 5 years based on your churn rate.',
  },
  {
    title: 'Formula Breakdown',
    description: 'See the exact formulas used with your values to understand how CLV is calculated.',
  },
];

const FAQS = [
  {
    question: 'What is Customer Lifetime Value (CLV)?',
    answer: 'Customer Lifetime Value is the total revenue a business can expect from a single customer account throughout their relationship. It helps determine how much to spend on customer acquisition.',
  },
  {
    question: 'What is ARPU?',
    answer: 'ARPU (Average Revenue Per User) is the average monthly revenue generated per customer. Calculate it by dividing total monthly revenue by the number of active customers.',
  },
  {
    question: 'How is churn rate calculated?',
    answer: 'Monthly churn rate is the percentage of customers who cancel or stop using your service each month. Calculate it by dividing churned customers by total customers at the start of the period.',
  },
  {
    question: 'What is the difference between simple and traditional CLV?',
    answer: 'Simple CLV multiplies ARPU by customer lifespan. Traditional CLV factors in gross margin to show actual profit, not just revenue, over the customer lifetime.',
  },
  {
    question: 'Why is gross margin important for CLV?',
    answer: 'Gross margin accounts for the cost of serving customers. A $100/month customer with 20% margin generates less profit than a $50/month customer with 80% margin.',
  },
  {
    question: 'How can I improve my CLV?',
    answer: 'Improve CLV by increasing ARPU (upselling, price increases), improving margins (reducing costs), or reducing churn (better retention strategies, customer success).',
  },
];

export function CustomerLifetimeValueCalculator() {
  const { result, error, calculate, reset } = useCustomerLifetimeValue();
  const [arpu, setArpu] = useState('');
  const [margin, setMargin] = useState('');
  const [churnRate, setChurnRate] = useState('');

  const handleCalculate = () => {
    calculate(parseFloat(arpu), parseFloat(margin), parseFloat(churnRate));
  };

  const handleReset = () => {
    reset();
    setArpu('');
    setMargin('');
    setChurnRate('');
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Customer Lifetime Value Calculator',
    description: 'Calculate customer lifetime value (CLV) from ARPU, gross margin, and churn rate with projections.',
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
    <SiteLayout toolName="Customer Lifetime Value Calculator" category="business-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Customer Lifetime Value
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Monthly ARPU ($)
              </label>
              <input
                type="number"
                value={arpu}
                onChange={(e) => setArpu(e.target.value)}
                placeholder="100"
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Gross Margin (%)
              </label>
              <input
                type="number"
                value={margin}
                onChange={(e) => setMargin(e.target.value)}
                placeholder="70"
                min="0"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Monthly Churn Rate (%)
              </label>
              <input
                type="number"
                value={churnRate}
                onChange={(e) => setChurnRate(e.target.value)}
                placeholder="5"
                min="0.1"
                max="100"
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleCalculate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Calculate CLV
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {result && (
          <>
            {/* CLV Results */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Customer Lifetime Value Results
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">Simple CLV</div>
                  <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">${result.simpleCLV.toLocaleString()}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Revenue-based</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <div className="text-sm text-green-600 dark:text-green-400 font-medium">Traditional CLV</div>
                  <div className="text-3xl font-bold text-green-700 dark:text-green-300">${result.traditionalCLV.toLocaleString()}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Profit-based</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Monthly Revenue</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">${result.breakdown.monthlyRevenue}</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Annual Revenue</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">${result.breakdown.annualRevenue}</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Monthly Profit</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">${result.breakdown.grossProfit}</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Avg. Lifespan</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">{result.breakdown.customerLifespan} months</div>
                </div>
              </div>

              {/* Formula Explanation */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Formula Breakdown</h4>
                <div className="space-y-2 text-sm font-mono">
                  <p className="text-gray-600 dark:text-gray-400">{result.formula.simple}</p>
                  <p className="text-gray-600 dark:text-gray-400">{result.formula.traditional}</p>
                </div>
              </div>
            </div>

            {/* Projections Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                5-Year Projections (per 100 customers)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="py-2 text-gray-600 dark:text-gray-400 font-medium">Year</th>
                      <th className="py-2 text-gray-600 dark:text-gray-400 font-medium">Retained</th>
                      <th className="py-2 text-gray-600 dark:text-gray-400 font-medium">Cumulative Revenue</th>
                      <th className="py-2 text-gray-600 dark:text-gray-400 font-medium">Cumulative Profit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {result.projections.map((proj) => (
                      <tr key={proj.year}>
                        <td className="py-2 text-gray-900 dark:text-white">Year {proj.year}</td>
                        <td className="py-2 text-gray-900 dark:text-white">{proj.retainedCustomers}</td>
                        <td className="py-2 text-gray-900 dark:text-white">${proj.cumulativeRevenue.toLocaleString()}</td>
                        <td className="py-2 text-gray-900 dark:text-white">${proj.cumulativeProfit.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
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

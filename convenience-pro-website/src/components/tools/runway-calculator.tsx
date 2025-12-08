'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useRunwayCalculator } from '@/hooks/useRunwayCalculator';

const FEATURES = [
  {
    title: 'Dynamic Growth Modeling',
    description: 'Account for increasing burn rates with monthly growth percentage to model realistic startup scaling scenarios.',
  },
  {
    title: 'Visual Timeline',
    description: 'See your runway visualized on a timeline with key milestones at 6, 12, and 18 months for strategic planning.',
  },
  {
    title: 'Month-by-Month Projections',
    description: 'View detailed projections showing burn rate and remaining cash for each month until runway depletion.',
  },
];

const FAQS = [
  {
    question: 'What is startup runway?',
    answer: 'Startup runway is the amount of time a company can continue operating before running out of cash, typically measured in months. It is calculated by dividing your current cash balance by your monthly burn rate.',
  },
  {
    question: 'How does burn rate growth affect runway?',
    answer: 'If your burn rate increases each month (due to hiring, scaling, etc.), your runway will be shorter than a simple cash/burn calculation suggests. Our calculator models this growth to give you accurate projections.',
  },
  {
    question: 'What is a healthy runway for a startup?',
    answer: 'Most investors recommend maintaining 12-18 months of runway. Less than 6 months is considered critical and should trigger immediate fundraising or cost-cutting measures.',
  },
  {
    question: 'When should I start fundraising?',
    answer: 'Start fundraising when you have 9-12 months of runway remaining. The fundraising process typically takes 3-6 months, so this gives you buffer time before reaching critical runway levels.',
  },
  {
    question: 'How can I extend my runway?',
    answer: 'You can extend runway by reducing expenses, increasing revenue, raising additional capital, or a combination of these. Focus on reducing non-essential costs first while protecting growth-critical investments.',
  },
  {
    question: 'What milestones should I plan around runway?',
    answer: 'Key milestones include: 6 months (critical zone, immediate action needed), 12 months (begin fundraising preparation), 18 months (healthy buffer for growth initiatives), and 24+ months (strong position for strategic decisions).',
  },
];

const MILESTONES = [
  { months: 6, label: 'Critical', color: 'bg-red-500' },
  { months: 12, label: 'Fundraise', color: 'bg-yellow-500' },
  { months: 18, label: 'Healthy', color: 'bg-green-500' },
  { months: 24, label: 'Strong', color: 'bg-blue-500' },
];

export function RunwayCalculator() {
  const { result, calculate, reset } = useRunwayCalculator();

  const [cashBalance, setCashBalance] = useState('');
  const [monthlyBurn, setMonthlyBurn] = useState('');
  const [growthRate, setGrowthRate] = useState('0');

  const handleCalculate = () => {
    const cash = parseFloat(cashBalance);
    const burn = parseFloat(monthlyBurn);
    const growth = parseFloat(growthRate) || 0;

    if (cash > 0 && burn > 0) {
      calculate({ cashBalance: cash, monthlyBurn: burn, growthRate: growth });
    }
  };

  const handleReset = () => {
    reset();
    setCashBalance('');
    setMonthlyBurn('');
    setGrowthRate('0');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRunwayColor = (months: number) => {
    if (months >= 18) return 'text-green-600';
    if (months >= 12) return 'text-yellow-600';
    if (months >= 6) return 'text-orange-600';
    return 'text-red-600';
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Startup Runway Calculator',
    description: 'Calculate your startup runway in months based on cash balance, monthly burn rate, and growth projections.',
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
    <SiteLayout toolName="Startup Runway Calculator" category="business-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Your Runway
          </h2>

          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cash Balance ($)
              </label>
              <input
                type="number"
                value={cashBalance}
                onChange={(e) => setCashBalance(e.target.value)}
                placeholder="1000000"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Monthly Burn Rate ($)
              </label>
              <input
                type="number"
                value={monthlyBurn}
                onChange={(e) => setMonthlyBurn(e.target.value)}
                placeholder="50000"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Monthly Burn Growth (%)
              </label>
              <input
                type="number"
                value={growthRate}
                onChange={(e) => setGrowthRate(e.target.value)}
                placeholder="0"
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
              Calculate Runway
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
              Your Runway Results
            </h3>

            {/* Main Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <div className="text-sm text-blue-600 dark:text-blue-400">Runway</div>
                <div className={`text-3xl font-bold ${getRunwayColor(result.runwayMonths)}`}>
                  {result.runwayMonths} months
                </div>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">End Date</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {result.endDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </div>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Avg Monthly Burn</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(result.averageMonthlyBurn)}
                </div>
              </div>
            </div>

            {/* Timeline Visualization */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Runway Timeline</h4>
              <div className="relative h-12 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`absolute h-full transition-all ${
                    result.runwayMonths >= 18 ? 'bg-green-500' : result.runwayMonths >= 12 ? 'bg-yellow-500' : result.runwayMonths >= 6 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min((result.runwayMonths / 24) * 100, 100)}%` }}
                />
                {/* Milestone Markers */}
                {MILESTONES.map((milestone) => (
                  <div
                    key={milestone.months}
                    className="absolute top-0 bottom-0 w-0.5 bg-gray-900 dark:bg-white opacity-50"
                    style={{ left: `${(milestone.months / 24) * 100}%` }}
                  >
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {milestone.months}mo
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-8 text-xs">
                {MILESTONES.map((milestone) => (
                  <div key={milestone.months} className="flex items-center gap-1">
                    <div className={`w-3 h-3 rounded-full ${milestone.color}`} />
                    <span className="text-gray-600 dark:text-gray-400">{milestone.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Projections */}
            {result.monthlyProjections.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Monthly Projections</h4>
                <div className="max-h-64 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                      <tr>
                        <th className="text-left p-2 text-gray-600 dark:text-gray-400">Month</th>
                        <th className="text-left p-2 text-gray-600 dark:text-gray-400">Date</th>
                        <th className="text-right p-2 text-gray-600 dark:text-gray-400">Burn</th>
                        <th className="text-right p-2 text-gray-600 dark:text-gray-400">Remaining</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.monthlyProjections.slice(0, 24).map((proj) => (
                        <tr key={proj.month} className="border-b border-gray-100 dark:border-gray-700">
                          <td className="p-2 text-gray-900 dark:text-white">{proj.month}</td>
                          <td className="p-2 text-gray-600 dark:text-gray-400">
                            {proj.date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          </td>
                          <td className="p-2 text-right text-gray-900 dark:text-white">
                            {formatCurrency(proj.burn)}
                          </td>
                          <td className={`p-2 text-right font-medium ${proj.remainingCash <= 0 ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                            {formatCurrency(proj.remainingCash)}
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

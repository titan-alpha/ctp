'use client';

import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useChurnRateCalculator } from '@/hooks/useChurnRateCalculator';

const FEATURES = [
  {
    title: 'Accurate Churn Analysis',
    description: 'Calculate customer churn rate, retention rate, and net churn with precision for any time period.',
  },
  {
    title: 'Future Projections',
    description: 'Project your customer base 6 and 12 months ahead based on current churn trends.',
  },
  {
    title: 'Customer Lifetime Metrics',
    description: 'Understand average customer lifespan and lifetime value potential from your churn data.',
  },
];

const FAQS = [
  {
    question: 'What is customer churn rate?',
    answer: 'Customer churn rate is the percentage of customers who stop using your product or service during a given time period. It is calculated by dividing the number of lost customers by the starting customer count.',
  },
  {
    question: 'What is a good churn rate?',
    answer: 'A good churn rate varies by industry. For SaaS companies, 5-7% annual churn is excellent, while 10-15% is average. B2C businesses typically see higher churn rates of 20-30% annually.',
  },
  {
    question: 'How is annual churn rate calculated from monthly?',
    answer: 'Annual churn is calculated using compound probability: Annual Churn = 1 - (1 - Monthly Churn)^12. This accounts for the compounding effect of customer loss over time.',
  },
  {
    question: 'What is the difference between gross and net churn?',
    answer: 'Gross churn only considers customers lost, while net churn accounts for new customers gained. Net churn can be negative (net growth) when acquisitions exceed losses.',
  },
  {
    question: 'How does churn rate affect customer lifetime value?',
    answer: 'Churn rate directly impacts customer lifetime value (CLV). Lower churn means customers stay longer, increasing their lifetime value. Average customer lifespan equals 1 divided by churn rate.',
  },
  {
    question: 'How can I reduce my churn rate?',
    answer: 'Reduce churn by improving onboarding, providing excellent customer support, gathering feedback, offering loyalty incentives, and proactively reaching out to at-risk customers.',
  },
];

export function ChurnRateCalculator() {
  const { inputs, metrics, error, setInputs, calculate, reset } = useChurnRateCalculator();

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Churn Rate Calculator',
    description: 'Calculate customer churn rate, retention rate, and future projections for your business.',
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

  const formatPercent = (value: number) => {
    if (!isFinite(value)) return 'N/A';
    return `${value.toFixed(2)}%`;
  };

  const formatNumber = (value: number) => {
    if (!isFinite(value)) return 'N/A';
    return value.toLocaleString(undefined, { maximumFractionDigits: 1 });
  };

  return (
    <SiteLayout toolName="Churn Rate Calculator" category="business-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Customer Churn Rate
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Customers at Start of Period
              </label>
              <input
                type="number"
                value={inputs.customersStart || ''}
                onChange={(e) => setInputs({ customersStart: parseInt(e.target.value) || 0 })}
                placeholder="1000"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Customers Lost
              </label>
              <input
                type="number"
                value={inputs.customersLost || ''}
                onChange={(e) => setInputs({ customersLost: parseInt(e.target.value) || 0 })}
                placeholder="50"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Customers Gained
              </label>
              <input
                type="number"
                value={inputs.customersGained || ''}
                onChange={(e) => setInputs({ customersGained: parseInt(e.target.value) || 0 })}
                placeholder="75"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Time Period
              </label>
              <select
                value={inputs.timePeriod}
                onChange={(e) => setInputs({ timePeriod: e.target.value as 'monthly' | 'quarterly' | 'annual' })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annual">Annual</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={calculate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Calculate
            </button>
            <button
              onClick={reset}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {metrics && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Churn Rate Results
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {formatPercent(metrics.churnRate)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Churn Rate</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatPercent(metrics.retentionRate)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Retention Rate</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatPercent(metrics.monthlyChurnRate)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Monthly Churn</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {formatPercent(metrics.annualChurnRate)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Annual Churn</div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr>
                      <td className="py-3 text-gray-600 dark:text-gray-400 font-medium">Customers at End</td>
                      <td className="py-3 text-gray-900 dark:text-white">{metrics.customersEnd.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-gray-600 dark:text-gray-400 font-medium">Net Churn</td>
                      <td className="py-3 text-gray-900 dark:text-white">
                        {metrics.netChurn > 0 ? '+' : ''}{metrics.netChurn} ({formatPercent(metrics.netChurnRate)})
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 text-gray-600 dark:text-gray-400 font-medium">Avg Customer Lifespan</td>
                      <td className="py-3 text-gray-900 dark:text-white">{formatNumber(metrics.customerLifetimeMonths)} months</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-gray-600 dark:text-gray-400 font-medium">Projected Customers (6 mo)</td>
                      <td className="py-3 text-gray-900 dark:text-white">{metrics.projectedCustomers6Months.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-gray-600 dark:text-gray-400 font-medium">Projected Customers (12 mo)</td>
                      <td className="py-3 text-gray-900 dark:text-white">{metrics.projectedCustomers12Months.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Retention Analysis
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Retention Rate</span>
                    <span className="text-gray-900 dark:text-white font-medium">{formatPercent(metrics.retentionRate)}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all"
                      style={{ width: `${Math.min(metrics.retentionRate, 100)}%` }}
                    />
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {metrics.retentionRate >= 95
                    ? 'Excellent retention! Your customers are highly loyal.'
                    : metrics.retentionRate >= 90
                    ? 'Good retention rate. Focus on at-risk customers to improve further.'
                    : metrics.retentionRate >= 80
                    ? 'Average retention. Consider improving onboarding and customer success.'
                    : 'High churn detected. Prioritize understanding why customers are leaving.'}
                </p>
              </div>
            </div>
          </>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {FEATURES.map((feature, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
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

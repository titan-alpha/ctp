'use client';

import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useAgeDifferenceCalculator } from '@/hooks/useAgeDifferenceCalculator';

const FEATURES = [
  {
    title: 'Precise Calculation',
    description: 'Get exact age difference broken down into years, months, and days for complete accuracy.',
  },
  {
    title: 'Total Days & Months',
    description: 'View the total difference in days and months for alternative perspectives on the age gap.',
  },
  {
    title: 'Instant Results',
    description: 'Calculate age differences instantly with our fast, client-side processing.',
  },
];

const FAQS = [
  {
    question: 'How is the age difference calculated?',
    answer: 'The calculator computes the exact difference between two dates, accounting for varying month lengths and leap years to give you precise years, months, and days.',
  },
  {
    question: 'Can I use this for birthdates in the past?',
    answer: 'Yes, you can enter any valid dates from the past or future. The calculator works with any two dates you provide.',
  },
  {
    question: 'How accurate is this calculator?',
    answer: 'The calculator is highly accurate, accounting for calendar variations including different month lengths and leap years in its calculations.',
  },
  {
    question: 'What date format should I use?',
    answer: 'Use the date picker provided, which follows your browser\'s local date format. You can also type dates directly.',
  },
  {
    question: 'Can I calculate the age difference between siblings?',
    answer: 'Absolutely! This calculator is perfect for finding the age gap between siblings, partners, friends, or any two people.',
  },
  {
    question: 'Does the order of dates matter?',
    answer: 'No, the calculator automatically determines which date is earlier and calculates the positive difference between them.',
  },
];

export function AgeDifferenceCalculator() {
  const { result, date1, date2, setDate1, setDate2, calculate, reset } = useAgeDifferenceCalculator();

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Age Difference Calculator',
    description: 'Calculate the exact age difference between two people in years, months, and days.',
    applicationCategory: 'LifestyleApplication',
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
    <SiteLayout toolName="Age Difference Calculator" category="lifestyle-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Age Difference
          </h2>

          {/* Date Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                First Date of Birth
              </label>
              <input
                type="date"
                value={date1}
                onChange={(e) => setDate1(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Second Date of Birth
              </label>
              <input
                type="date"
                value={date2}
                onChange={(e) => setDate2(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Calculate Button */}
          <div className="flex gap-4">
            <button
              onClick={calculate}
              disabled={!date1 || !date2}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
            >
              Calculate Difference
            </button>
            <button
              onClick={reset}
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
              Age Difference
            </h3>

            {result.olderDate === 'same' ? (
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  Both dates are the same
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                      {result.years}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Years</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                      {result.months}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Months</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                      {result.days}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Days</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {result.totalMonths.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Months</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {result.totalDays.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Days</div>
                  </div>
                </div>
              </>
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

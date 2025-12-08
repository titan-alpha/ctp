'use client';

import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useWeddingBudgetCalculator } from '@/hooks/useWeddingBudgetCalculator';

const FEATURES = [
  {
    title: 'Industry-Standard Percentages',
    description: 'Pre-filled with recommended budget allocations based on wedding industry standards and expert advice.',
  },
  {
    title: 'Track Actual vs Planned',
    description: 'Monitor your spending in real-time by entering actual costs to see if you are over or under budget.',
  },
  {
    title: 'Customizable Categories',
    description: 'Adjust percentage allocations to match your priorities and wedding style preferences.',
  },
];

const FAQS = [
  {
    question: 'How much should I budget for my wedding?',
    answer: 'The average US wedding costs around $30,000-$35,000, but your budget should be based on what you can comfortably afford. Consider your savings, family contributions, and avoid going into debt for your wedding.',
  },
  {
    question: 'Why does venue and catering take 45% of the budget?',
    answer: 'Venue and catering typically include the reception space, food, beverages, and service staff, making it the largest expense. This percentage can vary based on your guest count and venue choice.',
  },
  {
    question: 'How can I reduce my wedding costs?',
    answer: 'Consider off-peak seasons (November-April), weekday weddings, smaller guest lists, DIY decorations, or all-inclusive venues. Prioritize what matters most to you and cut elsewhere.',
  },
  {
    question: 'Should I include a contingency in my budget?',
    answer: 'Yes, the miscellaneous category (10%) serves as a buffer for unexpected costs, last-minute additions, and tips. Many couples end up spending 5-10% more than initially planned.',
  },
  {
    question: 'How do I track wedding expenses effectively?',
    answer: 'Enter your actual spending as you make deposits and payments. Regularly compare actual vs planned amounts to stay on track and make adjustments as needed.',
  },
  {
    question: 'Can I customize the budget percentages?',
    answer: 'Absolutely! The default percentages are guidelines. Adjust them based on your priorities - if photography is most important, allocate more there and reduce elsewhere.',
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

export function WeddingBudgetCalculator() {
  const {
    result,
    totalBudget,
    categories,
    setTotalBudget,
    updateCategoryActual,
    calculate,
    reset,
  } = useWeddingBudgetCalculator();

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Wedding Budget Calculator',
    description: 'Plan your wedding budget by category with industry-standard percentages. Track actual vs planned spending.',
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
    <SiteLayout toolName="Wedding Budget Calculator" category="lifestyle-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Plan Your Wedding Budget
          </h2>

          {/* Total Budget Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Total Wedding Budget
            </label>
            <div className="relative">
              <span className="absolute left-4 top-2 text-gray-500 dark:text-gray-400">$</span>
              <input
                type="number"
                min="0"
                step="1000"
                value={totalBudget}
                onChange={(e) => setTotalBudget(parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter total budget"
              />
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Category Breakdown
            </h3>
            <div className="space-y-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white text-sm">
                      {category.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                      ({category.percentage}%)
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Planned: {formatCurrency(Math.round((totalBudget * category.percentage) / 100))}
                  </div>
                  <div className="md:col-span-2">
                    <label className="sr-only">Actual spending for {category.name}</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400 text-sm">$</span>
                      <input
                        type="number"
                        min="0"
                        value={category.actual || ''}
                        onChange={(e) => updateCategoryActual(category.id, parseFloat(e.target.value) || 0)}
                        className="w-full pl-7 pr-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Actual spent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={calculate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Calculate Budget
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
              Budget Summary
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Budget</div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(result.totalBudget)}
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Spent</div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {formatCurrency(result.totalActual)}
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Remaining</div>
                <div className={`text-2xl font-bold ${result.remainingBudget >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {formatCurrency(result.remainingBudget)}
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Over/Under Plan</div>
                <div className={`text-2xl font-bold ${result.overUnder <= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {result.overUnder > 0 ? '+' : ''}{formatCurrency(result.overUnder)}
                </div>
              </div>
            </div>

            {/* Category Details */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 text-gray-600 dark:text-gray-400">Category</th>
                    <th className="text-right py-2 text-gray-600 dark:text-gray-400">Planned</th>
                    <th className="text-right py-2 text-gray-600 dark:text-gray-400">Actual</th>
                    <th className="text-right py-2 text-gray-600 dark:text-gray-400">Difference</th>
                  </tr>
                </thead>
                <tbody>
                  {result.categories.map((cat) => {
                    const diff = cat.actual - cat.planned;
                    return (
                      <tr key={cat.id} className="border-b border-gray-100 dark:border-gray-700/50">
                        <td className="py-2 text-gray-900 dark:text-white">{cat.name}</td>
                        <td className="py-2 text-right text-gray-600 dark:text-gray-400">{formatCurrency(cat.planned)}</td>
                        <td className="py-2 text-right text-gray-900 dark:text-white">{formatCurrency(cat.actual)}</td>
                        <td className={`py-2 text-right ${diff <= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {diff > 0 ? '+' : ''}{formatCurrency(diff)}
                        </td>
                      </tr>
                    );
                  })}
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

'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { usePartyBudgetCalculator } from '@/hooks/usePartyBudgetCalculator';

const FEATURES = [
  {
    title: 'Category Breakdown',
    description: 'Allocate your budget across customizable categories like food, venue, decorations, and entertainment.',
  },
  {
    title: 'Per-Person Costs',
    description: 'See exactly how much you are spending per guest for each category and overall.',
  },
  {
    title: 'Flexible Planning',
    description: 'Add or remove categories and adjust percentages to match your specific party needs.',
  },
];

const FAQS = [
  {
    question: 'How do I use the party budget calculator?',
    answer: 'Enter your total budget and expected guest count, then adjust the percentage allocation for each category. The calculator shows real-time breakdowns per category and per person.',
  },
  {
    question: 'What budget categories are included?',
    answer: 'Default categories include Food & Drinks, Venue, Decorations, Entertainment, and Miscellaneous. You can add custom categories or remove existing ones.',
  },
  {
    question: 'How should I allocate my party budget?',
    answer: 'A common guideline is 40% for food and drinks, 25% for venue, 15% for decorations, 10% for entertainment, and 10% for miscellaneous expenses.',
  },
  {
    question: 'Can I add custom spending categories?',
    answer: 'Yes! Click "Add Category" to create custom categories for specific expenses like photography, party favors, or special activities.',
  },
  {
    question: 'What if my percentages exceed 100%?',
    answer: 'The calculator will show a warning if your total allocation exceeds 100%. Adjust your percentages to stay within budget.',
  },
  {
    question: 'How accurate is the per-person calculation?',
    answer: 'The per-person cost divides each category amount by your guest count. Keep in mind some costs (like venue) may not scale linearly with guests.',
  },
];

export function PartyBudgetCalculator() {
  const {
    guestCount,
    totalBudget,
    categories,
    totalAllocated,
    remainingBudget,
    perPersonTotal,
    setGuestCount,
    setTotalBudget,
    setCategoryPercentage,
    addCategory,
    removeCategory,
    reset,
  } = usePartyBudgetCalculator();

  const [newCategoryName, setNewCategoryName] = useState('');

  const totalPercentage = categories.reduce((sum, cat) => sum + cat.percentage, 0);

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Party Budget Calculator',
    description: 'Plan your party budget by category. Calculate per-person costs and allocate spending for food, venue, decorations, and more.',
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
    <SiteLayout toolName="Party Budget Calculator" category="lifestyle-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Plan Your Party Budget
          </h2>

          {/* Budget and Guest Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Total Budget ($)
              </label>
              <input
                type="number"
                min="0"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of Guests
              </label>
              <input
                type="number"
                min="1"
                value={guestCount}
                onChange={(e) => setGuestCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Summary Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">Per Person Total</p>
              <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">${perPersonTotal.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-300">Allocated</p>
              <p className="text-2xl font-bold text-green-800 dark:text-green-200">${totalAllocated.toFixed(2)}</p>
            </div>
            <div className={`p-4 rounded-lg ${remainingBudget < 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-700'}`}>
              <p className={`text-sm ${remainingBudget < 0 ? 'text-red-700 dark:text-red-300' : 'text-gray-700 dark:text-gray-300'}`}>
                {remainingBudget < 0 ? 'Over Budget' : 'Remaining'}
              </p>
              <p className={`text-2xl font-bold ${remainingBudget < 0 ? 'text-red-800 dark:text-red-200' : 'text-gray-800 dark:text-gray-200'}`}>
                ${Math.abs(remainingBudget).toFixed(2)}
              </p>
            </div>
          </div>

          {totalPercentage > 100 && (
            <div className="mb-6 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Warning: Total allocation is {totalPercentage}%. Consider reducing some categories to stay within budget.
              </p>
            </div>
          )}

          {/* Category Breakdown */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Category Allocation
            </h3>
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">{category.name}</span>
                    <button
                      onClick={() => removeCategory(category.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Percentage</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={category.percentage}
                        onChange={(e) => setCategoryPercentage(category.id, parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Amount</label>
                      <p className="px-3 py-1 bg-gray-100 dark:bg-gray-600 rounded text-gray-900 dark:text-white text-sm">
                        ${category.amount.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Per Person</label>
                      <p className="px-3 py-1 bg-gray-100 dark:bg-gray-600 rounded text-gray-900 dark:text-white text-sm">
                        ${category.perPerson.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Category */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="New category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={handleAddCategory}
              disabled={!newCategoryName.trim()}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
            >
              Add Category
            </button>
          </div>

          {/* Reset Button */}
          <button
            onClick={reset}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
          >
            Reset to Defaults
          </button>
        </div>

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

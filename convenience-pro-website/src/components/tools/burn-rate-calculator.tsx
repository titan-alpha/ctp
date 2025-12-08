'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useBurnRateCalculator, ExpenseItem } from '@/hooks/useBurnRateCalculator';

const EXPENSE_CATEGORIES = [
  { value: 'payroll', label: 'Payroll & Benefits' },
  { value: 'rent', label: 'Rent & Utilities' },
  { value: 'software', label: 'Software & Tools' },
  { value: 'marketing', label: 'Marketing & Ads' },
  { value: 'operations', label: 'Operations' },
  { value: 'other', label: 'Other' },
] as const;

const FEATURES = [
  {
    title: 'Gross & Net Burn Rate',
    description: 'Calculate both gross burn (total expenses) and net burn (expenses minus revenue) for complete financial visibility.',
  },
  {
    title: 'Runway Calculation',
    description: 'Instantly see how many months of runway you have based on your current cash balance and burn rate.',
  },
  {
    title: 'Expense Breakdown',
    description: 'Categorize expenses to understand where your money is going and identify areas for optimization.',
  },
];

const FAQS = [
  {
    question: 'What is burn rate?',
    answer: 'Burn rate is the rate at which a company spends its cash reserves. Gross burn rate is total monthly expenses, while net burn rate accounts for revenue (expenses minus revenue).',
  },
  {
    question: 'How is runway calculated?',
    answer: 'Runway is calculated by dividing your current cash balance by your net monthly burn rate. This gives you the number of months until you run out of cash.',
  },
  {
    question: 'What is a good burn rate?',
    answer: 'A "good" burn rate depends on your growth stage and funding. Generally, startups aim for 12-18 months of runway. If revenue is growing faster than burn, you may have a sustainable model.',
  },
  {
    question: 'What is the difference between gross and net burn rate?',
    answer: 'Gross burn rate is your total monthly expenses. Net burn rate subtracts your monthly revenue from expenses, showing how much cash you actually lose each month.',
  },
  {
    question: 'When should I be concerned about burn rate?',
    answer: 'Start planning for fundraising or cost reduction when you have less than 6 months of runway. Less than 3 months is critical and requires immediate action.',
  },
  {
    question: 'How can I reduce my burn rate?',
    answer: 'Common strategies include renegotiating contracts, reducing headcount, cutting non-essential software, optimizing marketing spend, and finding operational efficiencies.',
  },
];

export function BurnRateCalculator() {
  const { result, calculate, reset } = useBurnRateCalculator();

  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    { id: '1', name: '', amount: 0, category: 'payroll' },
  ]);
  const [monthlyRevenue, setMonthlyRevenue] = useState('');
  const [cashBalance, setCashBalance] = useState('');

  const addExpense = () => {
    setExpenses([
      ...expenses,
      { id: Date.now().toString(), name: '', amount: 0, category: 'other' },
    ]);
  };

  const removeExpense = (id: string) => {
    if (expenses.length > 1) {
      setExpenses(expenses.filter((e) => e.id !== id));
    }
  };

  const updateExpense = (id: string, field: keyof ExpenseItem, value: string | number) => {
    setExpenses(
      expenses.map((e) =>
        e.id === id ? { ...e, [field]: field === 'amount' ? parseFloat(value as string) || 0 : value } : e
      )
    );
  };

  const handleCalculate = () => {
    const validExpenses = expenses.filter((e) => e.amount > 0);
    if (validExpenses.length > 0 && cashBalance) {
      calculate({
        expenses: validExpenses,
        monthlyRevenue: parseFloat(monthlyRevenue) || 0,
        cashBalance: parseFloat(cashBalance) || 0,
      });
    }
  };

  const handleReset = () => {
    reset();
    setExpenses([{ id: '1', name: '', amount: 0, category: 'payroll' }]);
    setMonthlyRevenue('');
    setCashBalance('');
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
    if (months === Infinity) return 'text-green-600';
    if (months >= 12) return 'text-green-600';
    if (months >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Burn Rate Calculator',
    description: 'Calculate your startup burn rate, runway, and financial health metrics.',
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
    <SiteLayout toolName="Burn Rate Calculator" category="business-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Your Burn Rate
          </h2>

          {/* Cash Balance & Revenue */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Cash Balance ($)
              </label>
              <input
                type="number"
                value={cashBalance}
                onChange={(e) => setCashBalance(e.target.value)}
                placeholder="500000"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Monthly Revenue ($)
              </label>
              <input
                type="number"
                value={monthlyRevenue}
                onChange={(e) => setMonthlyRevenue(e.target.value)}
                placeholder="10000"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Monthly Expenses */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Monthly Expenses
            </label>
            <div className="space-y-3">
              {expenses.map((expense) => (
                <div key={expense.id} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={expense.name}
                    onChange={(e) => updateExpense(expense.id, 'name', e.target.value)}
                    placeholder="Expense name"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                  <select
                    value={expense.category}
                    onChange={(e) => updateExpense(expense.id, 'category', e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={expense.amount || ''}
                    onChange={(e) => updateExpense(expense.id, 'amount', e.target.value)}
                    placeholder="Amount"
                    className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                  <button
                    onClick={() => removeExpense(expense.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    disabled={expenses.length === 1}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addExpense}
              className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              + Add Expense
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleCalculate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Calculate Burn Rate
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
                <div className="text-sm text-gray-600 dark:text-gray-400">Gross Burn Rate</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(result.grossBurnRate)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">per month</div>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Net Burn Rate</div>
                <div className={`text-2xl font-bold ${result.isProfit ? 'text-green-600' : 'text-red-600'}`}>
                  {result.isProfit ? '+' : ''}{formatCurrency(Math.abs(result.netBurnRate))}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {result.isProfit ? 'profit/month' : 'loss/month'}
                </div>
              </div>
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <div className="text-sm text-blue-600 dark:text-blue-400">Cash Runway</div>
                <div className={`text-2xl font-bold ${getRunwayColor(result.runwayMonths)}`}>
                  {result.runwayMonths === Infinity ? 'Unlimited' : `${result.runwayMonths} months`}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {result.runwayMonths !== Infinity && !result.isProfit
                    ? `Until ${result.runwayDate.toLocaleDateString()}`
                    : 'Profitable'}
                </div>
              </div>
            </div>

            {/* Runway Visualization */}
            {!result.isProfit && result.runwayMonths !== Infinity && result.runwayMonths > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Runway Visualization</h4>
                <div className="relative h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`absolute h-full transition-all ${
                      result.runwayMonths >= 12 ? 'bg-green-500' : result.runwayMonths >= 6 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min((result.runwayMonths / 24) * 100, 100)}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-900 dark:text-white">
                    {result.runwayMonths} months runway
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>6 mo</span>
                  <span>12 mo</span>
                  <span>18 mo</span>
                  <span>24 mo</span>
                </div>
              </div>
            )}

            {/* Expense Breakdown */}
            {Object.keys(result.expensesByCategory).length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Expenses by Category</h4>
                <div className="space-y-2">
                  {Object.entries(result.expensesByCategory).map(([category, amount]) => (
                    <div key={category} className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400 capitalize">{category}</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(amount)}
                      </span>
                    </div>
                  ))}
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

'use client';

import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import {
  useCookingConversionCalculator,
  CookingUnit,
  UNIT_LABELS,
  UNIT_ABBREVIATIONS,
  INGREDIENT_CONVERSIONS,
} from '@/hooks/useCookingConversionCalculator';

const FEATURES = [
  {
    title: 'Volume Conversions',
    description: 'Convert between cups, tablespoons, teaspoons, milliliters, fluid ounces, pints, quarts, and gallons.',
  },
  {
    title: 'Instant Results',
    description: 'Get accurate conversions instantly with precise decimal values for all your cooking needs.',
  },
  {
    title: 'Ingredient Reference',
    description: 'Includes common ingredient cup-to-gram conversions for baking accuracy.',
  },
];

const FAQS = [
  {
    question: 'How many tablespoons are in a cup?',
    answer: 'There are 16 tablespoons in 1 cup. This is a standard US measurement commonly used in cooking and baking recipes.',
  },
  {
    question: 'How many teaspoons are in a tablespoon?',
    answer: 'There are 3 teaspoons in 1 tablespoon. This conversion is useful for measuring small amounts of ingredients.',
  },
  {
    question: 'How many ml are in a cup?',
    answer: 'A US cup contains approximately 236.588 ml. This conversion is essential when following recipes from different countries.',
  },
  {
    question: 'How many fluid ounces are in a cup?',
    answer: 'There are 8 fluid ounces in 1 US cup. This is a fundamental measurement for liquid ingredients.',
  },
  {
    question: 'Are cooking measurements the same worldwide?',
    answer: 'No, cup sizes vary by country. US cups are 236.588 ml, metric cups are 250 ml, and UK cups are 284 ml. This calculator uses US measurements.',
  },
  {
    question: 'Why do I need to convert cooking measurements?',
    answer: 'Converting measurements ensures recipe accuracy, especially when scaling recipes or using international cookbooks that may use different measurement systems.',
  },
];

const UNITS: CookingUnit[] = [
  'cup',
  'tablespoon',
  'teaspoon',
  'ml',
  'liter',
  'fl_oz',
  'pint',
  'quart',
  'gallon',
];

export function CookingConversionCalculator() {
  const {
    amount,
    fromUnit,
    toUnit,
    result,
    setAmount,
    setFromUnit,
    setToUnit,
    convert,
    swap,
    reset,
  } = useCookingConversionCalculator();

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Cooking Conversion Calculator',
    description: 'Convert cooking measurements between cups, tablespoons, teaspoons, milliliters, fluid ounces, and more.',
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
    <SiteLayout toolName="Cooking Conversion Calculator" category="lifestyle-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Convert Cooking Measurements
          </h2>

          {/* Amount Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter amount"
            />
          </div>

          {/* Unit Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                From
              </label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value as CookingUnit)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {UNIT_LABELS[unit]}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={swap}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              title="Swap units"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                To
              </label>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value as CookingUnit)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {UNIT_LABELS[unit]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={convert}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Convert
            </button>
            <button
              onClick={reset}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>

          {/* Result Display */}
          {result && (
            <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-green-600 dark:text-green-400 mb-1">Result</p>
              <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                {amount} {UNIT_ABBREVIATIONS[fromUnit]} = {result.formatted} {UNIT_ABBREVIATIONS[result.unit]}
              </p>
            </div>
          )}
        </div>

        {/* Ingredient Reference Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Common Ingredient Conversions (1 Cup to Grams)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {Object.entries(INGREDIENT_CONVERSIONS).map(([ingredient, grams]) => (
              <div
                key={ingredient}
                className="flex justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded"
              >
                <span className="text-gray-700 dark:text-gray-300">{ingredient}</span>
                <span className="font-medium text-gray-900 dark:text-white">{grams}g</span>
              </div>
            ))}
          </div>
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

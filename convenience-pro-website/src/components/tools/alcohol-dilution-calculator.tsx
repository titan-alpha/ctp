'use client';

import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useAlcoholDilutionCalculator } from '@/hooks/useAlcoholDilutionCalculator';

const FEATURES = [
  {
    title: 'Precise Calculations',
    description: 'Uses accurate dilution formulas to calculate exactly how much water you need to reach your target ABV.',
  },
  {
    title: 'Multiple Units',
    description: 'Works with milliliters, ounces, or liters - choose whichever measurement system you prefer.',
  },
  {
    title: 'Instant Results',
    description: 'Get immediate calculations showing water to add, final volume, and dilution ratio.',
  },
];

const FAQS = [
  {
    question: 'How does alcohol dilution work?',
    answer: 'Dilution works by adding water to reduce the alcohol concentration. The formula calculates the final volume needed to achieve your target ABV, then determines how much water to add.',
  },
  {
    question: 'Why would I want to dilute spirits?',
    answer: 'Common reasons include: reducing cask-strength whiskey to drinking strength, creating cocktail bases, making homemade liqueurs, or adjusting homebrew to desired ABV.',
  },
  {
    question: 'What water should I use for dilution?',
    answer: 'Use distilled or filtered water for best results. Tap water may contain minerals or chlorine that can affect taste.',
  },
  {
    question: 'Does temperature affect dilution?',
    answer: 'Yes, alcohol and water contract slightly when mixed. For most purposes this is negligible, but professional distillers account for temperature in precise measurements.',
  },
  {
    question: 'Can I use this for beer or wine?',
    answer: 'While the math works for any alcohol, diluting beer or wine is uncommon as it significantly affects flavor. This tool is primarily designed for spirits.',
  },
  {
    question: 'How accurate is this calculator?',
    answer: 'The calculations are mathematically precise. However, real-world results may vary slightly due to temperature effects and measurement precision.',
  },
];

export function AlcoholDilutionCalculator() {
  const {
    currentAbv,
    targetAbv,
    volume,
    volumeUnit,
    result,
    error,
    setCurrentAbv,
    setTargetAbv,
    setVolume,
    setVolumeUnit,
    calculate,
    reset,
  } = useAlcoholDilutionCalculator();

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Alcohol Dilution Calculator',
    description: 'Calculate how much water to add to dilute spirits to your desired ABV. Perfect for whiskey, vodka, and other spirits.',
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

  const unitLabels = { ml: 'ml', oz: 'oz', l: 'L' };

  return (
    <SiteLayout toolName="Alcohol Dilution Calculator" category="lifestyle-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Water for Dilution
          </h2>

          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current ABV (%)
              </label>
              <input
                type="number"
                min="0.1"
                max="100"
                step="0.1"
                value={currentAbv}
                onChange={(e) => setCurrentAbv(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target ABV (%)
              </label>
              <input
                type="number"
                min="0.1"
                max="100"
                step="0.1"
                value={targetAbv}
                onChange={(e) => setTargetAbv(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Volume
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Volume Unit
              </label>
              <select
                value={volumeUnit}
                onChange={(e) => setVolumeUnit(e.target.value as 'ml' | 'oz' | 'l')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="ml">Milliliters (ml)</option>
                <option value="oz">Fluid Ounces (oz)</option>
                <option value="l">Liters (L)</option>
              </select>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
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

        {/* Results */}
        {result && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Results
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Water to Add</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {result.waterToAdd} {unitLabels[volumeUnit]}
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Final Volume</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {result.finalVolume} {unitLabels[volumeUnit]}
                </p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Dilution Ratio</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {result.dilutionRatio}
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Add {result.waterToAdd} {unitLabels[volumeUnit]} of water to {volume} {unitLabels[volumeUnit]} of {currentAbv}% ABV spirit to achieve {targetAbv}% ABV.
            </p>
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

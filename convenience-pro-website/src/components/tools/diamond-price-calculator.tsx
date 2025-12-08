'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import {
  useDiamondPriceCalculator,
  CutGrade,
  ColorGrade,
  ClarityGrade,
} from '@/hooks/useDiamondPriceCalculator';

const CUT_OPTIONS: CutGrade[] = ['Ideal', 'Excellent', 'Very Good', 'Good', 'Fair'];
const COLOR_OPTIONS: ColorGrade[] = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
const CLARITY_OPTIONS: ClarityGrade[] = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2'];

const FEATURES = [
  {
    title: '4C Analysis',
    description: 'Calculate diamond value based on the industry-standard 4Cs: Carat, Cut, Color, and Clarity.',
  },
  {
    title: 'Price Range Estimate',
    description: 'Get a realistic price range reflecting current market variations and dealer pricing differences.',
  },
  {
    title: 'Educational Tool',
    description: 'Learn how each factor affects diamond pricing to make informed purchasing decisions.',
  },
];

const FAQS = [
  {
    question: 'How accurate is this diamond price calculator?',
    answer: 'This calculator provides estimates based on average market prices and the 4Cs. Actual prices vary significantly based on certification, shape, fluorescence, and market conditions. Use this as a starting reference point.',
  },
  {
    question: 'What are the 4Cs of diamonds?',
    answer: 'The 4Cs are Carat (weight), Cut (quality of proportions), Color (absence of color, D being colorless), and Clarity (absence of inclusions). Together they determine a diamond\'s quality and value.',
  },
  {
    question: 'Which C matters most for diamond value?',
    answer: 'Cut often has the biggest impact on a diamond\'s brilliance and appearance. However, carat weight significantly affects price due to rarity. The best balance depends on your priorities and budget.',
  },
  {
    question: 'What does diamond color grade mean?',
    answer: 'Diamond color grades range from D (colorless) to Z (light yellow). D-F are colorless and most valuable, G-J are near colorless and offer good value, while K-M show noticeable warmth.',
  },
  {
    question: 'What is the best clarity grade to buy?',
    answer: 'VS1-VS2 (Very Slightly Included) often offers the best value as inclusions are invisible to the naked eye. SI1 can also be eye-clean and more affordable. FL-IF are rare and command premium prices.',
  },
  {
    question: 'Why do diamond prices vary so much?',
    answer: 'Prices vary due to certification (GIA vs others), fluorescence, exact proportions, market demand, and retail markup. Two diamonds with identical 4Cs can differ by 20-40% in price.',
  },
];

export function DiamondPriceCalculator() {
  const { estimate, calculatePrice, reset } = useDiamondPriceCalculator();

  const [carat, setCarat] = useState('1.0');
  const [cut, setCut] = useState<CutGrade>('Very Good');
  const [color, setColor] = useState<ColorGrade>('G');
  const [clarity, setClarity] = useState<ClarityGrade>('VS1');

  const handleCalculate = () => {
    const caratValue = parseFloat(carat);
    if (caratValue > 0) {
      calculatePrice({ carat: caratValue, cut, color, clarity });
    }
  };

  const handleReset = () => {
    reset();
    setCarat('1.0');
    setCut('Very Good');
    setColor('G');
    setClarity('VS1');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Diamond Price Calculator',
    description: 'Estimate diamond prices based on the 4Cs: Carat, Cut, Color, and Clarity. Get price range estimates for your diamond purchase.',
    applicationCategory: 'UtilitiesApplication',
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
    <SiteLayout toolName="Diamond Price Calculator" category="lifestyle-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Estimate Diamond Value
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Carat */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Carat Weight
              </label>
              <input
                type="number"
                value={carat}
                onChange={(e) => setCarat(e.target.value)}
                placeholder="e.g., 1.0"
                step="0.01"
                min="0.1"
                max="10"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                1 carat = 0.2 grams
              </p>
            </div>

            {/* Cut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cut Grade
              </label>
              <select
                value={cut}
                onChange={(e) => setCut(e.target.value as CutGrade)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {CUT_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Affects brilliance and sparkle
              </p>
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color Grade
              </label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value as ColorGrade)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {COLOR_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option} {option <= 'F' ? '(Colorless)' : option <= 'J' ? '(Near Colorless)' : '(Faint)'}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                D is colorless, M has faint yellow
              </p>
            </div>

            {/* Clarity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Clarity Grade
              </label>
              <select
                value={clarity}
                onChange={(e) => setClarity(e.target.value as ClarityGrade)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {CLARITY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                FL is flawless, I2 has visible inclusions
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleCalculate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Calculate Price
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
        {estimate && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Estimated Price Range
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg text-center">
                <div className="text-sm text-green-600 dark:text-green-400">Low Estimate</div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {formatPrice(estimate.lowPrice)}
                </div>
              </div>
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-center">
                <div className="text-sm text-blue-600 dark:text-blue-400">Average</div>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {formatPrice(estimate.averagePrice)}
                </div>
              </div>
              <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-center">
                <div className="text-sm text-purple-600 dark:text-purple-400">High Estimate</div>
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {formatPrice(estimate.highPrice)}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Price per Carat</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {formatPrice(estimate.pricePerCarat)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-8">
          <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            Important Disclaimer
          </h4>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            These estimates are for educational purposes only and should not be used for appraisals,
            insurance valuations, or buying/selling decisions. Actual diamond prices depend on many
            factors including certification (GIA, AGS), shape, fluorescence, symmetry, polish, and
            current market conditions. Always consult a certified gemologist for accurate valuations.
          </p>
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

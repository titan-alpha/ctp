'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useInsulationCalculator, INSULATION_TYPES, InsulationType } from '@/hooks/useInsulationCalculator';

const FEATURES = [
  {
    title: 'R-Value Targeting',
    description: 'Enter your desired R-value and get precise insulation thickness and material quantities calculated automatically.',
  },
  {
    title: 'Multiple Material Types',
    description: 'Choose from fiberglass batts, rolls, blown-in, cellulose, spray foam, or rigid foam board options.',
  },
  {
    title: 'Accurate Quantities',
    description: 'Get exact counts for batts, rolls, bags, or sheets needed to insulate your space properly.',
  },
];

const FAQS = [
  {
    question: 'What R-value do I need for my home?',
    answer: 'R-value requirements vary by climate zone. Attics typically need R-38 to R-60, walls need R-13 to R-21, and floors need R-25 to R-30. Check your local building codes for specific requirements.',
  },
  {
    question: 'What is R-value?',
    answer: 'R-value measures insulation\'s resistance to heat flow. Higher R-values mean better insulating power. The required R-value depends on your climate, the part of the home being insulated, and local energy codes.',
  },
  {
    question: 'Which insulation type is best?',
    answer: 'It depends on your application. Fiberglass batts are economical for standard walls, blown-in works well for attics and hard-to-reach areas, and spray foam provides the highest R-value per inch with air sealing benefits.',
  },
  {
    question: 'How do I measure the area to insulate?',
    answer: 'Measure the length and width of each section to insulate and multiply them. For walls, measure height times width. Add up all sections for total square footage, subtracting for windows and doors.',
  },
  {
    question: 'Can I add insulation over existing insulation?',
    answer: 'Yes, you can add new insulation over existing insulation in most cases. Unfaced insulation should be used when adding layers. Ensure no moisture issues exist before adding more insulation.',
  },
  {
    question: 'How thick should my insulation be?',
    answer: 'Thickness depends on the insulation type and target R-value. Fiberglass needs about 12 inches for R-38, while spray foam needs only 6 inches for the same value due to its higher R-value per inch.',
  },
];

export function InsulationCalculator() {
  const { result, calculate, reset } = useInsulationCalculator();

  const [area, setArea] = useState('');
  const [targetRValue, setTargetRValue] = useState('38');
  const [insulationType, setInsulationType] = useState<InsulationType>('fiberglass_batt');

  const handleCalculate = () => {
    if (area && targetRValue) {
      calculate({
        area: parseFloat(area) || 0,
        targetRValue: parseFloat(targetRValue) || 38,
        insulationType,
      });
    }
  };

  const handleReset = () => {
    reset();
    setArea('');
    setTargetRValue('38');
    setInsulationType('fiberglass_batt');
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Insulation Calculator',
    description: 'Calculate how much insulation you need based on area, R-value target, and insulation type.',
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
    <SiteLayout toolName="Insulation Calculator" category="home-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Insulation Needed
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Area to Insulate (sq ft)
              </label>
              <input
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="500"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Target R-Value
              </label>
              <select
                value={targetRValue}
                onChange={(e) => setTargetRValue(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="13">R-13 (Walls - Mild Climate)</option>
                <option value="19">R-19 (Walls - Moderate)</option>
                <option value="21">R-21 (Walls - Cold Climate)</option>
                <option value="25">R-25 (Floors)</option>
                <option value="30">R-30 (Attic - Mild)</option>
                <option value="38">R-38 (Attic - Moderate)</option>
                <option value="49">R-49 (Attic - Cold)</option>
                <option value="60">R-60 (Attic - Very Cold)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Insulation Type
              </label>
              <select
                value={insulationType}
                onChange={(e) => setInsulationType(e.target.value as InsulationType)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {Object.entries(INSULATION_TYPES).map(([key, info]) => (
                  <option key={key} value={key}>
                    {info.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleCalculate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Calculate Insulation
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Insulation Estimate
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <div className="text-sm text-blue-600 dark:text-blue-400">Material Needed</div>
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                  {result.unitsNeeded} {result.unit}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {result.insulationName}
                </div>
              </div>
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <div className="text-sm text-green-600 dark:text-green-400">Thickness Required</div>
                <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                  {result.thicknessNeeded.toFixed(1)}"
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  to achieve R-{result.targetRValue}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Calculation Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Area to Insulate</span>
                  <span className="font-medium text-gray-900 dark:text-white">{result.area} sq ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">R-Value per Inch</span>
                  <span className="font-medium text-gray-900 dark:text-white">R-{result.rValuePerInch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Coverage per Unit</span>
                  <span className="font-medium text-gray-900 dark:text-white">{result.coveragePerUnit} sq ft</span>
                </div>
              </div>
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

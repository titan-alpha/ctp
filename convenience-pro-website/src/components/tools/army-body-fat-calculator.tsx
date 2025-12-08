'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useArmyBodyFatCalculator, Gender } from '@/hooks/useArmyBodyFatCalculator';

const FEATURES = [
  {
    title: 'Official Army Method',
    description: 'Uses the U.S. Army circumference-based body fat calculation method from AR 600-9.',
  },
  {
    title: 'Gender-Specific Formulas',
    description: 'Applies the correct formula for males (neck, waist) and females (neck, waist, hip).',
  },
  {
    title: 'Standards Comparison',
    description: 'Compare your results against Army body composition standards to see if you meet requirements.',
  },
];

const FAQS = [
  {
    question: 'How does the Army body fat calculator work?',
    answer: 'The Army uses a circumference-based method that measures specific body parts (neck, waist, and hip for women) along with height to estimate body fat percentage using logarithmic formulas.',
  },
  {
    question: 'What are the Army body fat standards?',
    answer: 'Standards vary by age and gender. Generally, males must be under 20-26% body fat and females under 30-36% body fat, with lower limits for younger age groups.',
  },
  {
    question: 'How should I take measurements?',
    answer: 'Measure neck at the narrowest point below the larynx. Measure waist at the navel level for men, at the narrowest point for women. Measure hips at the widest point.',
  },
  {
    question: 'Is this method accurate?',
    answer: 'The Army method provides a reasonable estimate for most people. It may be less accurate for very muscular individuals or those with unusual body proportions.',
  },
  {
    question: 'When is body fat testing required?',
    answer: 'Soldiers who exceed height/weight screening table standards are referred for body fat assessment using this tape test method.',
  },
  {
    question: 'Can civilians use this calculator?',
    answer: 'Yes, anyone can use this calculator to estimate body fat percentage. The Army method is a simple, equipment-free way to track body composition.',
  },
];

export function ArmyBodyFatCalculator() {
  const { result, calculate, reset } = useArmyBodyFatCalculator();

  const [gender, setGender] = useState<Gender>('male');
  const [height, setHeight] = useState('');
  const [neck, setNeck] = useState('');
  const [waist, setWaist] = useState('');
  const [hip, setHip] = useState('');

  const handleCalculate = () => {
    const input = {
      gender,
      height: parseFloat(height),
      neck: parseFloat(neck),
      waist: parseFloat(waist),
      hip: gender === 'female' ? parseFloat(hip) : undefined,
    };
    if (input.height > 0 && input.neck > 0 && input.waist > 0) {
      if (gender === 'female' && (!input.hip || input.hip <= 0)) return;
      calculate(input);
    }
  };

  const handleReset = () => {
    reset();
    setHeight('');
    setNeck('');
    setWaist('');
    setHip('');
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Army Body Fat Calculator',
    description: 'Calculate body fat percentage using the official U.S. Army circumference-based method.',
    applicationCategory: 'HealthApplication',
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
    <SiteLayout toolName="Army Body Fat Calculator" category="health">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Your Body Fat Percentage
          </h2>

          {/* Gender Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gender
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setGender('male')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
                  gender === 'male'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                Male
              </button>
              <button
                onClick={() => setGender('female')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
                  gender === 'female'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                Female
              </button>
            </div>
          </div>

          {/* Measurement Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Height (inches)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="70"
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Neck Circumference (inches)
              </label>
              <input
                type="number"
                value={neck}
                onChange={(e) => setNeck(e.target.value)}
                placeholder="15.5"
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Waist Circumference (inches)
              </label>
              <input
                type="number"
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
                placeholder="34"
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            {gender === 'female' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Hip Circumference (inches)
                </label>
                <input
                  type="number"
                  value={hip}
                  onChange={(e) => setHip(e.target.value)}
                  placeholder="38"
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleCalculate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Calculate Body Fat
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <div className="text-sm text-blue-600 dark:text-blue-400">Body Fat Percentage</div>
                <div className="text-4xl font-bold text-blue-700 dark:text-blue-300">
                  {result.bodyFatPercentage}%
                </div>
                <div className="text-sm text-blue-500 dark:text-blue-400">{result.category}</div>
              </div>
              <div
                className={`p-4 rounded-lg ${
                  result.meetsStandard
                    ? 'bg-green-100 dark:bg-green-900/30'
                    : 'bg-red-100 dark:bg-red-900/30'
                }`}
              >
                <div
                  className={`text-sm ${
                    result.meetsStandard
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  Army Standard
                </div>
                <div
                  className={`text-2xl font-bold ${
                    result.meetsStandard
                      ? 'text-green-700 dark:text-green-300'
                      : 'text-red-700 dark:text-red-300'
                  }`}
                >
                  {result.meetsStandard ? 'PASS' : 'DOES NOT MEET'}
                </div>
                <div
                  className={`text-sm ${
                    result.meetsStandard
                      ? 'text-green-500 dark:text-green-400'
                      : 'text-red-500 dark:text-red-400'
                  }`}
                >
                  Max allowed: {result.maxAllowedBodyFat}%
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Body Fat Categories</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                <div className="text-center p-2 bg-white dark:bg-gray-600 rounded">
                  <div className="font-medium text-gray-900 dark:text-white">Essential</div>
                  <div className="text-gray-500 dark:text-gray-400">
                    {gender === 'male' ? '2-6%' : '10-14%'}
                  </div>
                </div>
                <div className="text-center p-2 bg-white dark:bg-gray-600 rounded">
                  <div className="font-medium text-gray-900 dark:text-white">Athletic</div>
                  <div className="text-gray-500 dark:text-gray-400">
                    {gender === 'male' ? '6-14%' : '14-21%'}
                  </div>
                </div>
                <div className="text-center p-2 bg-white dark:bg-gray-600 rounded">
                  <div className="font-medium text-gray-900 dark:text-white">Fitness</div>
                  <div className="text-gray-500 dark:text-gray-400">
                    {gender === 'male' ? '14-18%' : '21-25%'}
                  </div>
                </div>
                <div className="text-center p-2 bg-white dark:bg-gray-600 rounded">
                  <div className="font-medium text-gray-900 dark:text-white">Average</div>
                  <div className="text-gray-500 dark:text-gray-400">
                    {gender === 'male' ? '18-25%' : '25-32%'}
                  </div>
                </div>
                <div className="text-center p-2 bg-white dark:bg-gray-600 rounded">
                  <div className="font-medium text-gray-900 dark:text-white">Above Avg</div>
                  <div className="text-gray-500 dark:text-gray-400">
                    {gender === 'male' ? '25%+' : '32%+'}
                  </div>
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

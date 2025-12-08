'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useTDEECalculator, Gender, ActivityLevel } from '@/hooks/useTDEECalculator';

const ACTIVITY_LEVELS: { value: ActivityLevel; label: string; description: string }[] = [
  { value: 'sedentary', label: 'Sedentary', description: 'Little or no exercise, desk job' },
  { value: 'light', label: 'Lightly Active', description: 'Light exercise 1-3 days/week' },
  { value: 'moderate', label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week' },
  { value: 'active', label: 'Very Active', description: 'Hard exercise 6-7 days/week' },
  { value: 'very-active', label: 'Extra Active', description: 'Very hard exercise, physical job' },
];

const FEATURES = [
  {
    title: 'Mifflin-St Jeor Formula',
    description: 'Uses the most accurate and widely accepted equation for calculating basal metabolic rate.',
  },
  {
    title: 'Activity-Adjusted Results',
    description: 'Accounts for your daily activity level to give you accurate total daily energy expenditure.',
  },
  {
    title: 'Goal-Based Calories',
    description: 'Get calorie targets for cutting, maintaining, or bulking based on your TDEE.',
  },
];

const FAQS = [
  {
    question: 'What is TDEE?',
    answer: 'TDEE (Total Daily Energy Expenditure) is the total number of calories you burn each day, including your basal metabolic rate plus all physical activities.',
  },
  {
    question: 'What is BMR?',
    answer: 'BMR (Basal Metabolic Rate) is the number of calories your body burns at rest just to maintain basic functions like breathing, circulation, and cell production.',
  },
  {
    question: 'How accurate is the Mifflin-St Jeor formula?',
    answer: 'The Mifflin-St Jeor equation is considered one of the most accurate BMR formulas, typically within 10% of actual metabolic rate for most people.',
  },
  {
    question: 'How should I choose my activity level?',
    answer: 'Be honest about your average activity. Most office workers are sedentary. Choose moderate only if you exercise intensely 3-5 times per week.',
  },
  {
    question: 'How many calories should I eat to lose weight?',
    answer: 'For sustainable weight loss, eat 15-20% below your TDEE (shown as "Cut" calories). This creates a deficit of about 500-700 calories per day.',
  },
  {
    question: 'How often should I recalculate my TDEE?',
    answer: 'Recalculate every 10-15 pounds of weight change, or every 2-3 months, as your metabolism adjusts to your new weight and activity level.',
  },
];

export function TDEECalculator() {
  const { result, calculate, reset } = useTDEECalculator();

  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');

  const handleCalculate = () => {
    const input = {
      age: parseInt(age),
      weight: parseFloat(weight),
      height: parseFloat(height),
      gender,
      activityLevel,
    };
    if (input.age > 0 && input.weight > 0 && input.height > 0) {
      calculate(input);
    }
  };

  const handleReset = () => {
    reset();
    setAge('');
    setWeight('');
    setHeight('');
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'TDEE Calculator',
    description: 'Calculate your Total Daily Energy Expenditure and basal metabolic rate using the Mifflin-St Jeor formula.',
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
    <SiteLayout toolName="TDEE Calculator" category="health">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Your TDEE
          </h2>

          {/* Input Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="25"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Height (cm)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="175"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="70"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Activity Level Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Activity Level
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {ACTIVITY_LEVELS.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setActivityLevel(level.value)}
                  className={`p-3 rounded-lg border-2 text-left transition-colors ${
                    activityLevel === level.value
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-white">{level.label}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{level.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleCalculate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Calculate TDEE
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

            {/* BMR and TDEE Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Basal Metabolic Rate (BMR)</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{result.bmr}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">calories/day at rest</div>
              </div>
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <div className="text-sm text-blue-600 dark:text-blue-400">Total Daily Energy Expenditure</div>
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">{result.tdee}</div>
                <div className="text-sm text-blue-500 dark:text-blue-400">calories/day</div>
              </div>
            </div>

            {/* Calorie Goals */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Calorie Goals</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
                  <div className="text-sm text-red-600 dark:text-red-400 font-medium">Cut (-20%)</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {result.calorieGoals.cut}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">cal/day</div>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                  <div className="text-sm text-green-600 dark:text-green-400 font-medium">Maintain</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {result.calorieGoals.maintain}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">cal/day</div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                  <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">Bulk (+15%)</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {result.calorieGoals.bulk}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">cal/day</div>
                </div>
              </div>
            </div>

            {/* Macro Suggestions */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Suggested Macros (Balanced)</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{result.macros.protein}g</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Protein</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{result.macros.carbs}g</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Carbs</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{result.macros.fat}g</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Fat</div>
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

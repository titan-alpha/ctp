'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useWaterIntakeCalculator, ActivityLevel, Climate, WeightUnit } from '@/hooks/useWaterIntakeCalculator';

const ACTIVITY_LEVELS: { value: ActivityLevel; label: string }[] = [
  { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
  { value: 'light', label: 'Light (exercise 1-3 days/week)' },
  { value: 'moderate', label: 'Moderate (exercise 3-5 days/week)' },
  { value: 'active', label: 'Active (exercise 6-7 days/week)' },
  { value: 'very-active', label: 'Very Active (hard exercise daily)' },
];

const CLIMATES: { value: Climate; label: string; description: string }[] = [
  { value: 'hot', label: 'Hot', description: 'Above 80°F / 27°C' },
  { value: 'moderate', label: 'Moderate', description: '60-80°F / 15-27°C' },
  { value: 'cold', label: 'Cold', description: 'Below 60°F / 15°C' },
];

const FEATURES = [
  {
    title: 'Personalized Calculations',
    description: 'Get water intake recommendations based on your body weight, activity level, and environment.',
  },
  {
    title: 'Activity Adjustments',
    description: 'Automatically adjusts your hydration needs based on how active you are throughout the day.',
  },
  {
    title: 'Smart Reminders',
    description: 'Receive practical hydration tips and reminders tailored to your lifestyle and climate.',
  },
];

const FAQS = [
  {
    question: 'How much water should I drink per day?',
    answer: 'A general guideline is 0.5-1 oz of water per pound of body weight. Our calculator uses your specific stats to provide a personalized recommendation.',
  },
  {
    question: 'Does coffee and tea count toward water intake?',
    answer: 'While caffeinated beverages do contribute to hydration, caffeine has a mild diuretic effect. Our calculator adjusts for caffeine intake to ensure adequate hydration.',
  },
  {
    question: 'How does exercise affect water needs?',
    answer: 'Exercise increases water loss through sweat. Active individuals may need 20-40% more water than sedentary people. Drink extra water before, during, and after workouts.',
  },
  {
    question: 'Why does climate affect water intake?',
    answer: 'Hot weather causes more sweating and faster dehydration. You may need 16+ additional ounces of water on hot days compared to moderate temperatures.',
  },
  {
    question: 'What are signs of dehydration?',
    answer: 'Common signs include dark yellow urine, thirst, dry mouth, fatigue, headaches, and dizziness. Aim for light yellow or clear urine as a sign of good hydration.',
  },
  {
    question: 'Can I drink too much water?',
    answer: 'Yes, overhydration (hyponatremia) is possible but rare. Spread your water intake throughout the day rather than drinking large amounts at once.',
  },
];

const HYDRATION_TIPS = [
  'Drink a glass of water first thing in the morning',
  'Carry a reusable water bottle everywhere',
  'Set hourly reminders on your phone',
  'Eat water-rich foods like cucumbers and watermelon',
  'Drink a glass before each meal',
  'Replace sugary drinks with water',
];

export function WaterIntakeCalculator() {
  const { result, calculate, reset } = useWaterIntakeCalculator();

  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('lbs');
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [climate, setClimate] = useState<Climate>('moderate');
  const [caffeineServings, setCaffeineServings] = useState('1');

  const handleCalculate = () => {
    const weightValue = parseFloat(weight);
    if (weightValue > 0) {
      calculate(weightValue, weightUnit, activity, climate, parseInt(caffeineServings) || 0);
    }
  };

  const handleReset = () => {
    reset();
    setWeight('');
    setCaffeineServings('1');
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Water Intake Calculator',
    description: 'Calculate your daily water intake needs based on body weight, activity level, and climate.',
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
    <SiteLayout toolName="Water Intake Calculator" category="health">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Your Daily Water Intake
          </h2>

          {/* Weight Input with Unit Toggle */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Body Weight
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={weightUnit === 'lbs' ? '150' : '68'}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <div className="flex">
                <button
                  onClick={() => setWeightUnit('lbs')}
                  className={`px-4 py-2 rounded-l-lg font-medium transition-colors ${
                    weightUnit === 'lbs'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  lbs
                </button>
                <button
                  onClick={() => setWeightUnit('kg')}
                  className={`px-4 py-2 rounded-r-lg font-medium transition-colors ${
                    weightUnit === 'kg'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  kg
                </button>
              </div>
            </div>
          </div>

          {/* Activity Level */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Activity Level
            </label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value as ActivityLevel)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {ACTIVITY_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          {/* Climate Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Climate / Environment
            </label>
            <div className="grid grid-cols-3 gap-3">
              {CLIMATES.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setClimate(c.value)}
                  className={`p-3 rounded-lg border-2 text-center transition-colors ${
                    climate === c.value
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-white">{c.label}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{c.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Caffeine Intake */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Daily Caffeine Servings (coffee/tea/energy drinks)
            </label>
            <select
              value={caffeineServings}
              onChange={(e) => setCaffeineServings(e.target.value)}
              className="w-full md:w-48 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'serving' : 'servings'}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleCalculate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Calculate Water Intake
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
              Your Daily Water Intake
            </h3>

            {/* Main Results */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">Daily Ounces</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{result.dailyOz} oz</div>
              </div>
              <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg text-center">
                <div className="text-sm text-cyan-600 dark:text-cyan-400 font-medium">Daily Liters</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{result.dailyLiters} L</div>
              </div>
              <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg text-center">
                <div className="text-sm text-teal-600 dark:text-teal-400 font-medium">8 oz Glasses</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{result.glasses}</div>
              </div>
            </div>

            {/* Visual Glass Counter */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Daily Glass Target</h4>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: result.glasses }).map((_, i) => (
                  <div
                    key={i}
                    className="w-10 h-12 bg-blue-500 dark:bg-blue-400 rounded-b-lg rounded-t-sm relative overflow-hidden"
                    title={`Glass ${i + 1}`}
                  >
                    <div className="absolute inset-x-0 top-0 h-2 bg-blue-300 dark:bg-blue-200 opacity-50" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {result.glasses} glasses of 8 oz each = {result.dailyOz} oz total
              </p>
            </div>

            {/* Breakdown */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Calculation Breakdown</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Base (body weight)</span>
                  <span className="font-medium text-gray-900 dark:text-white">{result.breakdown.baseOz} oz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Activity adjustment</span>
                  <span className="font-medium text-gray-900 dark:text-white">+{result.breakdown.activityAdjustment} oz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Climate adjustment</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {result.breakdown.climateAdjustment >= 0 ? '+' : ''}{result.breakdown.climateAdjustment} oz
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Caffeine adjustment</span>
                  <span className="font-medium text-gray-900 dark:text-white">+{result.breakdown.caffeineAdjustment} oz</span>
                </div>
                <div className="flex justify-between border-t border-gray-300 dark:border-gray-600 pt-2 mt-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Total</span>
                  <span className="font-bold text-gray-900 dark:text-white">{result.dailyOz} oz</span>
                </div>
              </div>
            </div>

            {/* Reminders */}
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Hydration Reminders</h4>
              <ul className="space-y-2">
                {result.reminders.map((reminder, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-green-500 mt-0.5">*</span>
                    {reminder}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Hydration Tips */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Hydration Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {HYDRATION_TIPS.map((tip, index) => (
              <div key={index} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <span className="text-blue-500">-</span>
                {tip}
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

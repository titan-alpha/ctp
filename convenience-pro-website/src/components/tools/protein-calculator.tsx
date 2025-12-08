'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useProteinCalculator, ActivityLevel, Goal } from '@/hooks/useProteinCalculator';

const ACTIVITY_LEVELS: { value: ActivityLevel; label: string; range: string }[] = [
  { value: 'sedentary', label: 'Sedentary', range: '0.8 g/kg' },
  { value: 'active', label: 'Active', range: '1.2-1.6 g/kg' },
  { value: 'athlete', label: 'Athlete', range: '1.6-2.2 g/kg' },
  { value: 'bodybuilder', label: 'Bodybuilder', range: '2.2-2.7 g/kg' },
];

const GOALS: { value: Goal; label: string; description: string }[] = [
  { value: 'maintain', label: 'Maintain', description: 'Keep current muscle mass' },
  { value: 'build', label: 'Build Muscle', description: 'Gain lean muscle mass' },
  { value: 'lose', label: 'Lose Fat', description: 'Preserve muscle while cutting' },
];

const PROTEIN_SOURCES = [
  { name: 'Chicken Breast', protein: '31g per 100g' },
  { name: 'Greek Yogurt', protein: '10g per 100g' },
  { name: 'Eggs', protein: '6g per egg' },
  { name: 'Salmon', protein: '25g per 100g' },
  { name: 'Lentils', protein: '9g per 100g cooked' },
  { name: 'Whey Protein', protein: '25g per scoop' },
];

const FEATURES = [
  {
    title: 'Activity-Based Calculations',
    description: 'Get personalized protein recommendations based on your specific activity level and training intensity.',
  },
  {
    title: 'Goal Optimization',
    description: 'Adjust your intake for muscle building, fat loss, or maintenance with science-backed multipliers.',
  },
  {
    title: 'Meal Distribution',
    description: 'See exactly how much protein to consume at each meal for optimal muscle protein synthesis.',
  },
];

const FAQS = [
  {
    question: 'How much protein do I need per day?',
    answer: 'Protein needs vary by activity level: sedentary individuals need about 0.8g/kg, active people 1.2-1.6g/kg, athletes 1.6-2.2g/kg, and bodybuilders 2.2-2.7g/kg of body weight.',
  },
  {
    question: 'Should I eat more protein to lose weight?',
    answer: 'Yes, higher protein intake during fat loss helps preserve muscle mass and increases satiety. We recommend adding 0.3g/kg to your baseline when in a calorie deficit.',
  },
  {
    question: 'Can I eat too much protein?',
    answer: 'For most healthy individuals, protein up to 2.5-3g/kg is safe. However, those with kidney issues should consult a doctor before increasing protein significantly.',
  },
  {
    question: 'How should I distribute protein throughout the day?',
    answer: 'Research suggests spreading protein evenly across 3-5 meals optimizes muscle protein synthesis, with 20-40g per meal being ideal for most people.',
  },
  {
    question: 'Is plant protein as effective as animal protein?',
    answer: 'Plant proteins can be equally effective when combining various sources to get all essential amino acids. Consider slightly higher total intake (10-20% more) with plant-based diets.',
  },
  {
    question: 'When should I consume protein for best results?',
    answer: 'Timing matters less than total daily intake. However, consuming protein within a few hours of training and spreading intake evenly can optimize muscle growth.',
  },
];

export function ProteinCalculator() {
  const { result, calculate, reset } = useProteinCalculator();

  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('active');
  const [goal, setGoal] = useState<Goal>('maintain');
  const [mealsPerDay, setMealsPerDay] = useState(3);

  const handleCalculate = () => {
    const weightValue = parseFloat(weight);
    if (weightValue > 0) {
      const weightKg = unit === 'lbs' ? weightValue * 0.453592 : weightValue;
      calculate(weightKg, activityLevel, goal, mealsPerDay);
    }
  };

  const handleReset = () => {
    reset();
    setWeight('');
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Protein Calculator',
    description: 'Calculate your daily protein needs based on activity level and fitness goals.',
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
    <SiteLayout toolName="Protein Calculator" category="health">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Your Daily Protein Needs
          </h2>

          {/* Weight Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Body Weight
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={unit === 'kg' ? '70' : '154'}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                <button
                  onClick={() => setUnit('kg')}
                  className={`px-4 py-2 font-medium transition-colors ${
                    unit === 'kg'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  kg
                </button>
                <button
                  onClick={() => setUnit('lbs')}
                  className={`px-4 py-2 font-medium transition-colors ${
                    unit === 'lbs'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  lbs
                </button>
              </div>
            </div>
          </div>

          {/* Activity Level */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Activity Level
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                  <div className="text-sm text-gray-500 dark:text-gray-400">{level.range}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Goal Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Goal
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {GOALS.map((g) => (
                <button
                  key={g.value}
                  onClick={() => setGoal(g.value)}
                  className={`p-3 rounded-lg border-2 text-left transition-colors ${
                    goal === g.value
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-white">{g.label}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{g.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Meals Per Day */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Meals Per Day
            </label>
            <select
              value={mealsPerDay}
              onChange={(e) => setMealsPerDay(parseInt(e.target.value))}
              className="w-full md:w-48 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {[2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n} meals
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
              Calculate Protein
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
              Your Daily Protein Needs
            </h3>

            {/* Main Result */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                <div className="text-sm text-green-600 dark:text-green-400 font-medium">Daily Target</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {result.gramsPerDay}g
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Range: {result.minGrams}-{result.maxGrams}g
                </div>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">Per Meal</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {result.gramsPerMeal}g
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Based on {mealsPerDay} meals/day
                </div>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500">
                <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">Per kg Body Weight</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {result.gramsPerKg}g
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Multiplier used
                </div>
              </div>
            </div>

            {/* Protein Sources */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                Protein Source Suggestions
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {PROTEIN_SOURCES.map((source, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      {source.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {source.protein}
                    </div>
                  </div>
                ))}
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

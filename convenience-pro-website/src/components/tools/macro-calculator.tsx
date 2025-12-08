'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useMacroCalculator, Goal, DietType, Gender, ActivityLevel } from '@/hooks/useMacroCalculator';

const GOALS: { value: Goal; label: string; description: string }[] = [
  { value: 'cutting', label: 'Cutting', description: '-20% calories for fat loss' },
  { value: 'maintenance', label: 'Maintenance', description: 'Maintain current weight' },
  { value: 'bulking', label: 'Bulking', description: '+15% calories for muscle gain' },
];

const DIET_TYPES: { value: DietType; label: string; split: string }[] = [
  { value: 'balanced', label: 'Balanced', split: '40% carbs / 30% protein / 30% fat' },
  { value: 'low-carb', label: 'Low Carb', split: '25% carbs / 40% protein / 35% fat' },
  { value: 'high-protein', label: 'High Protein', split: '30% carbs / 40% protein / 30% fat' },
];

const ACTIVITY_LEVELS: { value: ActivityLevel; label: string }[] = [
  { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
  { value: 'light', label: 'Light (exercise 1-3 days/week)' },
  { value: 'moderate', label: 'Moderate (exercise 3-5 days/week)' },
  { value: 'active', label: 'Active (exercise 6-7 days/week)' },
  { value: 'very-active', label: 'Very Active (hard exercise daily)' },
];

const FEATURES = [
  {
    title: 'Goal-Based Calculations',
    description: 'Automatically adjusts calories based on whether you want to cut fat, maintain weight, or build muscle.',
  },
  {
    title: 'Multiple Diet Presets',
    description: 'Choose from balanced, low-carb, or high-protein macro distributions to match your dietary preferences.',
  },
  {
    title: 'Per-Meal Breakdown',
    description: 'See exactly how much protein, carbs, and fat you need at each meal for easier meal planning.',
  },
];

const FAQS = [
  {
    question: 'What is TDEE and why does it matter for macros?',
    answer: 'TDEE (Total Daily Energy Expenditure) is the total calories you burn daily including all activities. Your macros are calculated as percentages of your adjusted TDEE based on your goal.',
  },
  {
    question: 'Which diet type should I choose?',
    answer: 'Balanced works for most people. Choose Low Carb if you prefer fewer carbs and more fat, or High Protein if you\'re focused on muscle building or preservation during cutting.',
  },
  {
    question: 'How accurate is the TDEE calculation?',
    answer: 'The calculator uses the Mifflin-St Jeor equation, which is considered one of the most accurate formulas. However, individual metabolism varies, so use results as a starting point and adjust based on results.',
  },
  {
    question: 'How much protein do I need per day?',
    answer: 'For active individuals, 0.7-1g per pound of body weight is commonly recommended. Our calculator distributes this based on your selected diet type and calorie goals.',
  },
  {
    question: 'Should I hit my macros exactly every day?',
    answer: 'Consistency matters more than perfection. Aim to be within 5-10% of your targets most days. Weekly averages are more important than daily precision.',
  },
  {
    question: 'How many meals per day should I eat?',
    answer: 'Meal frequency is personal preference. Most people do well with 3-5 meals. The calculator divides your daily macros evenly across your chosen number of meals.',
  },
];

export function MacroCalculator() {
  const { result, tdee, calculateFromTDEE, calculateFromStats, reset } = useMacroCalculator();

  const [inputMode, setInputMode] = useState<'tdee' | 'stats'>('stats');
  const [manualTdee, setManualTdee] = useState('');
  const [goal, setGoal] = useState<Goal>('maintenance');
  const [dietType, setDietType] = useState<DietType>('balanced');
  const [mealsPerDay, setMealsPerDay] = useState(3);
  const [showPerMeal, setShowPerMeal] = useState(false);

  // Stats for auto-calculation
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');

  const handleCalculate = () => {
    if (inputMode === 'tdee') {
      const tdeeValue = parseFloat(manualTdee);
      if (tdeeValue > 0) {
        calculateFromTDEE(tdeeValue, goal, dietType, mealsPerDay);
      }
    } else {
      const stats = {
        age: parseInt(age),
        weight: parseFloat(weight),
        height: parseFloat(height),
        gender,
        activityLevel,
      };
      if (stats.age > 0 && stats.weight > 0 && stats.height > 0) {
        calculateFromStats(stats, goal, dietType, mealsPerDay);
      }
    }
  };

  const handleReset = () => {
    reset();
    setManualTdee('');
    setAge('');
    setWeight('');
    setHeight('');
    setShowPerMeal(false);
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Macro Calculator',
    description: 'Calculate your daily macronutrient needs based on your goals and activity level.',
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
    <SiteLayout toolName="Macro Calculator" category="health">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Your Macros
          </h2>

          {/* Input Mode Toggle */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              How would you like to calculate?
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setInputMode('stats')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  inputMode === 'stats'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Auto-Calculate from Stats
              </button>
              <button
                onClick={() => setInputMode('tdee')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  inputMode === 'tdee'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Enter TDEE Manually
              </button>
            </div>
          </div>

          {/* Stats Input */}
          {inputMode === 'stats' && (
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
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Activity Level
                </label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {ACTIVITY_LEVELS.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Manual TDEE Input */}
          {inputMode === 'tdee' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Your TDEE (calories)
              </label>
              <input
                type="number"
                value={manualTdee}
                onChange={(e) => setManualTdee(e.target.value)}
                placeholder="2000"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          )}

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

          {/* Diet Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Diet Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {DIET_TYPES.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDietType(d.value)}
                  className={`p-3 rounded-lg border-2 text-left transition-colors ${
                    dietType === d.value
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-white">{d.label}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{d.split}</div>
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
              Calculate Macros
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
              Your Daily Macros
            </h3>

            {/* TDEE Display */}
            <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">Your TDEE</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{tdee} calories</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Target: {result.totalCalories} calories ({goal})
              </div>
            </div>

            {/* Visual Macro Breakdown - Pie Chart Style */}
            <div className="mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-48 h-48">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    {/* Carbs */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#3B82F6"
                      strokeWidth="20"
                      strokeDasharray={`${result.carbs.percentage * 2.51} 251`}
                      strokeDashoffset="0"
                    />
                    {/* Protein */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#10B981"
                      strokeWidth="20"
                      strokeDasharray={`${result.protein.percentage * 2.51} 251`}
                      strokeDashoffset={`${-result.carbs.percentage * 2.51}`}
                    />
                    {/* Fat */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#F59E0B"
                      strokeWidth="20"
                      strokeDasharray={`${result.fat.percentage * 2.51} 251`}
                      strokeDashoffset={`${-(result.carbs.percentage + result.protein.percentage) * 2.51}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {result.totalCalories}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">calories</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Macro Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                  <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">Carbs</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {result.carbs.grams}g
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {result.carbs.percentage}% | {result.carbs.calories} cal
                  </div>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                  <div className="text-sm text-green-600 dark:text-green-400 font-medium">Protein</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {result.protein.grams}g
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {result.protein.percentage}% | {result.protein.calories} cal
                  </div>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
                  <div className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Fat</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {result.fat.grams}g
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {result.fat.percentage}% | {result.fat.calories} cal
                  </div>
                </div>
              </div>
            </div>

            {/* Per Meal Toggle */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <button
                onClick={() => setShowPerMeal(!showPerMeal)}
                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium"
              >
                {showPerMeal ? '- Hide' : '+ Show'} Per-Meal Breakdown
              </button>

              {showPerMeal && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Per Meal ({mealsPerDay} meals/day)
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Calories</div>
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {result.perMeal.calories}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Protein</div>
                      <div className="text-lg font-bold text-green-600">{result.perMeal.protein}g</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Carbs</div>
                      <div className="text-lg font-bold text-blue-600">{result.perMeal.carbs}g</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Fat</div>
                      <div className="text-lg font-bold text-yellow-600">{result.perMeal.fat}g</div>
                    </div>
                  </div>
                </div>
              )}
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

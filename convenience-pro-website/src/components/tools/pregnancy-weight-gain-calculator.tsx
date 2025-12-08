'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { usePregnancyWeightGainCalculator } from '@/hooks/usePregnancyWeightGainCalculator';

const FEATURES = [
  {
    title: 'IOM Guidelines Based',
    description: 'Uses official Institute of Medicine recommendations for healthy pregnancy weight gain based on your pre-pregnancy BMI.',
  },
  {
    title: 'Week-by-Week Tracking',
    description: 'See your recommended weight gain range for any week of pregnancy with detailed trimester breakdowns.',
  },
  {
    title: 'Visual Progress Chart',
    description: 'Interactive chart showing your healthy weight gain corridor throughout all 40 weeks of pregnancy.',
  },
];

const FAQS = [
  {
    question: 'How much weight should I gain during pregnancy?',
    answer: 'Weight gain recommendations depend on your pre-pregnancy BMI. Underweight women (BMI < 18.5) should gain 28-40 lbs, normal weight (BMI 18.5-24.9) should gain 25-35 lbs, overweight (BMI 25-29.9) should gain 15-25 lbs, and obese women (BMI 30+) should gain 11-20 lbs.',
  },
  {
    question: 'When does most pregnancy weight gain occur?',
    answer: 'Most weight gain occurs in the second and third trimesters. During the first trimester, you may gain only 1-4.5 pounds. After that, steady weekly gains of 0.5-1 pound per week are typical, depending on your BMI category.',
  },
  {
    question: 'Is it safe to diet during pregnancy?',
    answer: 'Restrictive dieting during pregnancy is not recommended as it can deprive your baby of essential nutrients. Instead, focus on eating nutrient-dense foods and staying within recommended weight gain ranges. Consult your healthcare provider for personalized advice.',
  },
  {
    question: 'What if I am gaining weight too fast or too slow?',
    answer: 'If your weight gain falls outside the recommended range, discuss it with your healthcare provider. They can assess your individual situation and provide guidance on nutrition and activity level adjustments.',
  },
  {
    question: 'Does this calculator work for twin pregnancies?',
    answer: 'No, this calculator is designed for singleton pregnancies. Twin and multiple pregnancies have different weight gain recommendations. Consult your healthcare provider for guidance on multiple pregnancies.',
  },
  {
    question: 'How accurate is this pregnancy weight gain calculator?',
    answer: 'This calculator uses IOM guidelines which are evidence-based recommendations. However, individual needs vary. Always work with your healthcare provider to determine what is healthy for your specific pregnancy.',
  },
];

const BMI_LABELS = {
  underweight: 'Underweight (BMI < 18.5)',
  normal: 'Normal Weight (BMI 18.5-24.9)',
  overweight: 'Overweight (BMI 25-29.9)',
  obese: 'Obese (BMI 30+)',
};

export function PregnancyWeightGainCalculator() {
  const { result, calculate, reset } = usePregnancyWeightGainCalculator();

  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('lbs');
  const [heightFeet, setHeightFeet] = useState('');
  const [heightInches, setHeightInches] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [heightUnit, setHeightUnit] = useState<'imperial' | 'metric'>('imperial');
  const [currentWeek, setCurrentWeek] = useState(20);

  const handleCalculate = () => {
    let weightKg = parseFloat(weight);
    if (weightUnit === 'lbs') {
      weightKg = weightKg * 0.453592;
    }

    let heightCmValue: number;
    if (heightUnit === 'imperial') {
      const feet = parseFloat(heightFeet) || 0;
      const inches = parseFloat(heightInches) || 0;
      heightCmValue = (feet * 12 + inches) * 2.54;
    } else {
      heightCmValue = parseFloat(heightCm);
    }

    if (weightKg > 0 && heightCmValue > 0) {
      calculate(weightKg, heightCmValue, currentWeek);
    }
  };

  const handleReset = () => {
    reset();
    setWeight('');
    setHeightFeet('');
    setHeightInches('');
    setHeightCm('');
    setCurrentWeek(20);
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Pregnancy Weight Gain Calculator',
    description: 'Calculate healthy pregnancy weight gain based on IOM guidelines and your pre-pregnancy BMI.',
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
    <SiteLayout toolName="Pregnancy Weight Gain Calculator" category="health">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Your Healthy Weight Gain
          </h2>

          {/* Weight Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pre-Pregnancy Weight
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={weightUnit === 'lbs' ? '140' : '63'}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <select
                value={weightUnit}
                onChange={(e) => setWeightUnit(e.target.value as 'kg' | 'lbs')}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="lbs">lbs</option>
                <option value="kg">kg</option>
              </select>
            </div>
          </div>

          {/* Height Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Height
            </label>
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => setHeightUnit('imperial')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  heightUnit === 'imperial'
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Feet/Inches
              </button>
              <button
                onClick={() => setHeightUnit('metric')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  heightUnit === 'metric'
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Centimeters
              </button>
            </div>
            {heightUnit === 'imperial' ? (
              <div className="flex gap-2">
                <input
                  type="number"
                  value={heightFeet}
                  onChange={(e) => setHeightFeet(e.target.value)}
                  placeholder="5"
                  className="w-24 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <span className="flex items-center text-gray-600 dark:text-gray-400">ft</span>
                <input
                  type="number"
                  value={heightInches}
                  onChange={(e) => setHeightInches(e.target.value)}
                  placeholder="6"
                  className="w-24 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <span className="flex items-center text-gray-600 dark:text-gray-400">in</span>
              </div>
            ) : (
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                placeholder="168"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            )}
          </div>

          {/* Current Week Slider */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Week of Pregnancy: <span className="font-bold text-pink-600">{currentWeek}</span>
            </label>
            <input
              type="range"
              min="1"
              max="40"
              value={currentWeek}
              onChange={(e) => setCurrentWeek(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-600"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>Week 1</span>
              <span>Week 13</span>
              <span>Week 27</span>
              <span>Week 40</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleCalculate}
              className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition-colors"
            >
              Calculate Weight Gain
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
              Your Weight Gain Recommendations
            </h3>

            {/* BMI Category */}
            <div className="mb-6 p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
              <div className="text-sm text-pink-600 dark:text-pink-400">Pre-Pregnancy BMI</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{result.bmi}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {BMI_LABELS[result.bmiCategory]}
              </div>
            </div>

            {/* Recommended Range Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Recommended Gain</div>
                <div className="text-2xl font-bold text-pink-600">
                  {result.recommendedRange.min}-{result.recommendedRange.max} lbs
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Weekly Rate (2nd/3rd Tri)</div>
                <div className="text-2xl font-bold text-pink-600">
                  {result.weeklyGainRate.min}-{result.weeklyGainRate.max} lbs
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Target at Week {currentWeek}</div>
                <div className="text-2xl font-bold text-pink-600">
                  {result.currentTargetRange.min}-{result.currentTargetRange.max} lbs
                </div>
              </div>
            </div>

            {/* Visual Progress Chart */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Weight Gain Progress Chart</h4>
              <div className="relative h-48 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <svg viewBox="0 0 400 150" className="w-full h-full">
                  {/* Grid lines */}
                  <line x1="40" y1="10" x2="40" y2="130" stroke="#ccc" strokeWidth="1" />
                  <line x1="40" y1="130" x2="390" y2="130" stroke="#ccc" strokeWidth="1" />

                  {/* Y-axis labels */}
                  <text x="5" y="15" fontSize="10" fill="#888">40 lbs</text>
                  <text x="5" y="70" fontSize="10" fill="#888">20 lbs</text>
                  <text x="5" y="130" fontSize="10" fill="#888">0 lbs</text>

                  {/* X-axis labels */}
                  <text x="40" y="145" fontSize="10" fill="#888">0</text>
                  <text x="125" y="145" fontSize="10" fill="#888">13</text>
                  <text x="215" y="145" fontSize="10" fill="#888">27</text>
                  <text x="380" y="145" fontSize="10" fill="#888">40</text>

                  {/* Weight gain corridor (shaded area) */}
                  <path
                    d={`M 40 130 ${result.weeklyProgress.map((w, i) =>
                      `L ${40 + (i * 8.75)} ${130 - (w.minWeight * 3)}`
                    ).join(' ')} ${result.weeklyProgress.slice().reverse().map((w, i) =>
                      `L ${40 + ((39 - i) * 8.75)} ${130 - (w.maxWeight * 3)}`
                    ).join(' ')} Z`}
                    fill="rgba(236, 72, 153, 0.2)"
                    stroke="none"
                  />

                  {/* Min line */}
                  <path
                    d={`M 40 130 ${result.weeklyProgress.map((w, i) =>
                      `L ${40 + (i * 8.75)} ${130 - (w.minWeight * 3)}`
                    ).join(' ')}`}
                    fill="none"
                    stroke="#EC4899"
                    strokeWidth="2"
                  />

                  {/* Max line */}
                  <path
                    d={`M 40 130 ${result.weeklyProgress.map((w, i) =>
                      `L ${40 + (i * 8.75)} ${130 - (w.maxWeight * 3)}`
                    ).join(' ')}`}
                    fill="none"
                    stroke="#EC4899"
                    strokeWidth="2"
                  />

                  {/* Current week marker */}
                  <line
                    x1={40 + ((currentWeek - 1) * 8.75)}
                    y1="10"
                    x2={40 + ((currentWeek - 1) * 8.75)}
                    y2="130"
                    stroke="#9333EA"
                    strokeWidth="2"
                    strokeDasharray="4"
                  />
                  <circle
                    cx={40 + ((currentWeek - 1) * 8.75)}
                    cy={130 - ((result.currentTargetRange.min + result.currentTargetRange.max) / 2 * 3)}
                    r="5"
                    fill="#9333EA"
                  />
                </svg>
              </div>
              <div className="flex justify-center gap-6 mt-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-pink-200 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">Healthy Range</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-1 bg-purple-600"></div>
                  <span className="text-gray-600 dark:text-gray-400">Current Week</span>
                </div>
              </div>
            </div>

            {/* Trimester Breakdown */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Trimester Breakdown</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {result.trimesterBreakdown.map((tri) => (
                  <div
                    key={tri.trimester}
                    className={`p-4 rounded-lg border-2 ${
                      (currentWeek <= 13 && tri.trimester === 1) ||
                      (currentWeek > 13 && currentWeek <= 27 && tri.trimester === 2) ||
                      (currentWeek > 27 && tri.trimester === 3)
                        ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                        : 'border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      Trimester {tri.trimester}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{tri.weekRange}</div>
                    <div className="text-lg font-bold text-pink-600 mt-2">
                      {tri.expectedGain.min}-{tri.expectedGain.max} lbs
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

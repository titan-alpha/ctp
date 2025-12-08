'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import {
  useCarbonFootprintCalculator,
  DietType,
  HomeType,
} from '@/hooks/useCarbonFootprintCalculator';

const FEATURES = [
  {
    title: 'Multi-Category Analysis',
    description:
      'Calculates emissions from travel, home energy, and diet for a comprehensive footprint assessment.',
  },
  {
    title: 'US Average Comparison',
    description:
      'Compare your carbon footprint to the US average of 16 tons per year to see where you stand.',
  },
  {
    title: 'Personalized Tips',
    description:
      'Get actionable recommendations based on your highest emission categories to reduce your impact.',
  },
];

const FAQS = [
  {
    question: 'What is a carbon footprint?',
    answer:
      'A carbon footprint is the total amount of greenhouse gases (primarily CO2) produced directly and indirectly by an individual, organization, or product. It is usually measured in tons of CO2 equivalent per year.',
  },
  {
    question: 'What is the average carbon footprint in the US?',
    answer:
      'The average American has a carbon footprint of about 16 tons of CO2 per year, which is one of the highest in the world. The global average is about 4 tons per person.',
  },
  {
    question: 'How accurate is this calculator?',
    answer:
      'This calculator provides estimates based on average emission factors. Actual emissions may vary based on specific vehicle efficiency, energy sources in your region, and individual consumption patterns.',
  },
  {
    question: 'What has the biggest impact on carbon footprint?',
    answer:
      'For most people, the biggest contributors are transportation (especially flying and driving), home energy use, and diet (particularly meat consumption). Making changes in these areas can significantly reduce your footprint.',
  },
  {
    question: 'How can I offset my carbon footprint?',
    answer:
      'You can offset emissions by supporting verified carbon offset projects like reforestation, renewable energy, or methane capture. However, reducing emissions directly is always more effective than offsetting.',
  },
  {
    question: 'What is a sustainable carbon footprint?',
    answer:
      'To limit global warming to 1.5°C, the average global footprint needs to drop to about 2 tons per person by 2050. Currently, this is achievable through major lifestyle changes and systemic shifts to clean energy.',
  },
];

const DIET_OPTIONS: { value: DietType; label: string }[] = [
  { value: 'vegan', label: 'Vegan' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'average', label: 'Average (some meat)' },
  { value: 'meat-heavy', label: 'Meat Heavy' },
];

const HOME_OPTIONS: { value: HomeType; label: string }[] = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'small-house', label: 'Small House' },
  { value: 'medium-house', label: 'Medium House' },
  { value: 'large-house', label: 'Large House' },
];

const getRatingColor = (rating: string) => {
  switch (rating) {
    case 'excellent':
      return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400';
    case 'good':
      return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400';
    case 'average':
      return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400';
    case 'high':
      return 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400';
    case 'very-high':
      return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400';
    default:
      return 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400';
  }
};

export function CarbonFootprintCalculator() {
  const { result, calculate, reset } = useCarbonFootprintCalculator();

  const [carMilesPerWeek, setCarMilesPerWeek] = useState(150);
  const [flightsPerYear, setFlightsPerYear] = useState(2);
  const [longFlightsPerYear, setLongFlightsPerYear] = useState(1);
  const [electricityKwhPerMonth, setElectricityKwhPerMonth] = useState(900);
  const [naturalGasThermsPerMonth, setNaturalGasThermsPerMonth] = useState(50);
  const [homeType, setHomeType] = useState<HomeType>('medium-house');
  const [dietType, setDietType] = useState<DietType>('average');

  const handleCalculate = () => {
    calculate({
      carMilesPerWeek,
      flightsPerYear,
      longFlightsPerYear,
      electricityKwhPerMonth,
      naturalGasThermsPerMonth,
      homeType,
      dietType,
    });
  };

  const handleReset = () => {
    reset();
    setCarMilesPerWeek(150);
    setFlightsPerYear(2);
    setLongFlightsPerYear(1);
    setElectricityKwhPerMonth(900);
    setNaturalGasThermsPerMonth(50);
    setHomeType('medium-house');
    setDietType('average');
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Carbon Footprint Calculator',
    description:
      'Estimate your annual CO2 emissions from travel, home energy, and diet. Compare to the US average and get personalized tips.',
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
    <SiteLayout toolName="Carbon Footprint Calculator" category="lifestyle-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Your Carbon Footprint
          </h2>

          {/* Travel Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Travel
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Car Miles/Week
                </label>
                <input
                  type="number"
                  min="0"
                  value={carMilesPerWeek}
                  onChange={(e) => setCarMilesPerWeek(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Short Flights/Year
                </label>
                <input
                  type="number"
                  min="0"
                  value={flightsPerYear}
                  onChange={(e) => setFlightsPerYear(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Long Flights/Year
                </label>
                <input
                  type="number"
                  min="0"
                  value={longFlightsPerYear}
                  onChange={(e) => setLongFlightsPerYear(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Home Energy Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Home Energy
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Electricity (kWh/Month)
                </label>
                <input
                  type="number"
                  min="0"
                  value={electricityKwhPerMonth}
                  onChange={(e) => setElectricityKwhPerMonth(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Natural Gas (Therms/Month)
                </label>
                <input
                  type="number"
                  min="0"
                  value={naturalGasThermsPerMonth}
                  onChange={(e) => setNaturalGasThermsPerMonth(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Home Type
                </label>
                <select
                  value={homeType}
                  onChange={(e) => setHomeType(e.target.value as HomeType)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {HOME_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Diet Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Diet
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {DIET_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDietType(option.value)}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    dietType === option.value
                      ? 'border-green-600 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-green-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {option.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Calculate Button */}
          <div className="flex gap-4">
            <button
              onClick={handleCalculate}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              Calculate Footprint
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
              Your Carbon Footprint
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Total Footprint */}
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Annual CO2 Emissions
                </div>
                <div className="text-5xl font-bold text-green-600 dark:text-green-400">
                  {result.totalCO2TonsPerYear}
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-400">
                  tons CO2/year
                </div>
              </div>

              {/* Comparison */}
              <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Compared to US Average (16 tons)
                </div>
                <div
                  className={`text-3xl font-bold ${
                    result.comparisonToAverage <= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {result.comparisonToAverage > 0 ? '+' : ''}
                  {result.comparisonToAverage}%
                </div>
                <div
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${getRatingColor(
                    result.rating
                  )}`}
                >
                  {result.rating.replace('-', ' ').toUpperCase()}
                </div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Breakdown by Category
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {result.breakdown.travel}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Travel
                  </div>
                </div>
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {result.breakdown.homeEnergy}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Home Energy
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {result.breakdown.diet}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Diet
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Tips to Reduce Your Footprint
              </h4>
              <ul className="space-y-2">
                {result.tips.map((tip, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-gray-600 dark:text-gray-400"
                  >
                    <span className="text-green-500 mt-1">*</span>
                    {tip}
                  </li>
                ))}
              </ul>
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
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
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

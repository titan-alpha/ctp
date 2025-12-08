'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useLampWattageCalculator } from '@/hooks/useLampWattageCalculator';

const USAGE_TYPES = [
  { label: 'Living Room / General', lumens: 20 },
  { label: 'Kitchen / Workspace', lumens: 50 },
  { label: 'Bedroom / Relaxation', lumens: 15 },
  { label: 'Bathroom', lumens: 70 },
  { label: 'Dining Room', lumens: 35 },
  { label: 'Office / Study', lumens: 50 },
];

const FEATURES = [
  {
    title: 'Room-Based Calculations',
    description: 'Enter your room dimensions and get precise lumen requirements based on industry lighting standards.',
  },
  {
    title: 'Usage Type Presets',
    description: 'Select from common room types to automatically apply recommended lumens per square foot.',
  },
  {
    title: 'Multiple Bulb Options',
    description: 'Compare LED, CFL, and incandescent bulb recommendations to find the most efficient solution.',
  },
];

const FAQS = [
  {
    question: 'How many lumens do I need per square foot?',
    answer: 'The recommended lumens per square foot varies by room type: 10-20 for bedrooms, 30-40 for living rooms, 50-75 for kitchens and bathrooms, and 50-75 for task-oriented spaces like offices.',
  },
  {
    question: 'What is the difference between lumens and watts?',
    answer: 'Lumens measure the amount of light produced (brightness), while watts measure energy consumption. Modern LED bulbs produce more lumens per watt than older incandescent bulbs, making them more efficient.',
  },
  {
    question: 'How do I choose between LED, CFL, and incandescent bulbs?',
    answer: 'LED bulbs are the most energy-efficient and long-lasting, using about 75% less energy than incandescent. CFLs are more efficient than incandescent but less than LED. Incandescent bulbs are cheapest upfront but cost more to operate.',
  },
  {
    question: 'Should I use multiple smaller bulbs or fewer larger ones?',
    answer: 'Multiple smaller bulbs distributed throughout a room provide more even lighting and reduce shadows. Fewer larger bulbs may create hot spots and darker corners. Consider your fixture options when deciding.',
  },
  {
    question: 'How does ceiling height affect lighting needs?',
    answer: 'Higher ceilings require more lumens because light dissipates over distance. For ceilings over 10 feet, increase your lumen requirements by 10-20% for each additional foot of height.',
  },
  {
    question: 'What color temperature should I choose?',
    answer: 'Warm white (2700-3000K) is best for living rooms and bedrooms. Cool white (3500-4100K) works well in kitchens and bathrooms. Daylight (5000-6500K) is ideal for offices and task lighting.',
  },
];

export function LampWattageCalculator() {
  const { result, calculate, reset } = useLampWattageCalculator();

  const [roomLength, setRoomLength] = useState('');
  const [roomWidth, setRoomWidth] = useState('');
  const [usageType, setUsageType] = useState('Living Room / General');
  const [customLumens, setCustomLumens] = useState('20');

  const handleUsageTypeChange = (type: string) => {
    setUsageType(type);
    const preset = USAGE_TYPES.find((u) => u.label === type);
    if (preset) {
      setCustomLumens(preset.lumens.toString());
    }
  };

  const handleCalculate = () => {
    if (roomLength && roomWidth) {
      calculate({
        roomLength: parseFloat(roomLength) || 0,
        roomWidth: parseFloat(roomWidth) || 0,
        lumensPerSqFt: parseFloat(customLumens) || 20,
      });
    }
  };

  const handleReset = () => {
    reset();
    setRoomLength('');
    setRoomWidth('');
    setUsageType('Living Room / General');
    setCustomLumens('20');
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Lamp Wattage Calculator',
    description: 'Calculate the lighting needs for any room based on dimensions and usage type. Get bulb recommendations for LED, CFL, and incandescent options.',
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
    <SiteLayout toolName="Lamp Wattage Calculator" category="home-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Room Lighting Needs
          </h2>

          {/* Room Dimensions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Room Length (ft)
              </label>
              <input
                type="number"
                value={roomLength}
                onChange={(e) => setRoomLength(e.target.value)}
                placeholder="12"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Room Width (ft)
              </label>
              <input
                type="number"
                value={roomWidth}
                onChange={(e) => setRoomWidth(e.target.value)}
                placeholder="10"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Usage Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Room Usage Type
              </label>
              <select
                value={usageType}
                onChange={(e) => handleUsageTypeChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {USAGE_TYPES.map((type) => (
                  <option key={type.label} value={type.label}>
                    {type.label} ({type.lumens} lm/sq ft)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Lumens per Sq Ft
              </label>
              <input
                type="number"
                value={customLumens}
                onChange={(e) => setCustomLumens(e.target.value)}
                placeholder="20"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleCalculate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Calculate Lighting Needs
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
              Lighting Requirements
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <div className="text-sm text-yellow-600 dark:text-yellow-400">Total Lumens Needed</div>
                <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">
                  {result.totalLumensNeeded.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  lumens
                </div>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Room Area</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {result.roomArea.toFixed(0)} sq ft
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  @ {customLumens} lumens/sq ft
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Bulb Recommendations</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2 text-gray-600 dark:text-gray-400">Bulb Type</th>
                      <th className="text-left py-2 text-gray-600 dark:text-gray-400">Wattage</th>
                      <th className="text-left py-2 text-gray-600 dark:text-gray-400">Lumens</th>
                      <th className="text-left py-2 text-gray-600 dark:text-gray-400">Bulbs Needed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.bulbSuggestions.map((bulb, index) => (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-700/50">
                        <td className="py-2 text-gray-900 dark:text-white">{bulb.type}</td>
                        <td className="py-2 text-gray-900 dark:text-white">{bulb.wattage}</td>
                        <td className="py-2 text-gray-900 dark:text-white">{bulb.lumens}</td>
                        <td className="py-2 font-medium text-blue-600 dark:text-blue-400">{bulb.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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

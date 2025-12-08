'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useBatteryLifeCalculator } from '@/hooks/useBatteryLifeCalculator';

const FEATURES = [
  {
    title: 'Accurate Runtime Estimation',
    description: 'Calculate precise battery runtime based on your device capacity and power consumption for reliable planning.',
  },
  {
    title: 'Universal Compatibility',
    description: 'Works with any battery-powered device from smartphones and laptops to IoT sensors and power banks.',
  },
  {
    title: 'Instant Results',
    description: 'Get immediate calculations in hours and minutes to help you plan your device usage effectively.',
  },
];

const FAQS = [
  {
    question: 'How is battery life calculated?',
    answer: 'Battery life is calculated using the formula: Runtime (hours) = Battery Capacity (mAh) / Power Draw (mA). This gives you the theoretical maximum runtime under constant load.',
  },
  {
    question: 'What is mAh (milliamp hours)?',
    answer: 'mAh stands for milliamp hours and measures battery capacity. A 3000mAh battery can deliver 3000mA for one hour, or 1000mA for three hours.',
  },
  {
    question: 'What is power draw in mA?',
    answer: 'Power draw (mA) is the amount of current your device consumes during operation. Lower power draw means longer battery life.',
  },
  {
    question: 'Why is my actual battery life different from calculated?',
    answer: 'Actual battery life varies due to factors like screen brightness, wireless connections, temperature, battery age, and varying workloads that change power consumption.',
  },
  {
    question: 'How do I find my device power draw?',
    answer: 'Check your device specifications, use a USB power meter, or look up typical consumption for your device type. Smartphones typically draw 200-500mA during normal use.',
  },
  {
    question: 'Does battery age affect runtime?',
    answer: 'Yes, batteries lose capacity over time. A battery rated at 3000mAh may only hold 2400mAh after 2-3 years of use, reducing runtime by about 20%.',
  },
];

export function BatteryLifeCalculator() {
  const { result, calculate, reset } = useBatteryLifeCalculator();

  const [batteryCapacity, setBatteryCapacity] = useState('');
  const [powerDraw, setPowerDraw] = useState('');

  const handleCalculate = () => {
    const capacity = parseFloat(batteryCapacity);
    const draw = parseFloat(powerDraw);
    if (capacity > 0 && draw > 0) {
      calculate({ batteryCapacity: capacity, powerDraw: draw });
    }
  };

  const handleReset = () => {
    reset();
    setBatteryCapacity('');
    setPowerDraw('');
  };

  const formatRuntime = (hours: number, minutes: number) => {
    if (hours >= 1) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Battery Life Calculator',
    description: 'Calculate device battery runtime based on capacity and power draw.',
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
    <SiteLayout toolName="Battery Life Calculator" category="tech-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Battery Runtime
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Battery Capacity (mAh)
              </label>
              <input
                type="number"
                value={batteryCapacity}
                onChange={(e) => setBatteryCapacity(e.target.value)}
                placeholder="3000"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Power Draw (mA)
              </label>
              <input
                type="number"
                value={powerDraw}
                onChange={(e) => setPowerDraw(e.target.value)}
                placeholder="300"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleCalculate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Calculate Runtime
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
              Estimated Battery Life
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <div className="text-sm text-blue-600 dark:text-blue-400">Runtime</div>
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                  {formatRuntime(Math.floor(result.runtimeHours), result.runtimeMinutes)}
                </div>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Hours</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {result.runtimeHours.toFixed(2)}
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

'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useSleepCalculator, CalculationMode } from '@/hooks/useSleepCalculator';

const FEATURES = [
  {
    title: '90-Minute Sleep Cycles',
    description: 'Based on the science of sleep cycles, helping you wake between cycles when sleep is lightest.',
  },
  {
    title: 'Fall Asleep Time Included',
    description: 'Accounts for the average 14 minutes it takes to fall asleep for more accurate calculations.',
  },
  {
    title: 'Multiple Options',
    description: 'Provides 4-6 cycle options so you can choose the best time based on your schedule.',
  },
];

const FAQS = [
  {
    question: 'What is a sleep cycle?',
    answer: 'A sleep cycle is approximately 90 minutes long and includes all stages of sleep: light sleep, deep sleep, and REM sleep. Completing full cycles helps you wake feeling refreshed.',
  },
  {
    question: 'Why 90 minutes per cycle?',
    answer: 'Research shows the average sleep cycle lasts about 90 minutes. Waking at the end of a cycle (during light sleep) feels more natural than waking mid-cycle during deep sleep.',
  },
  {
    question: 'How many sleep cycles do I need?',
    answer: 'Most adults need 5-6 complete cycles (7.5-9 hours) for optimal health. 4 cycles (6 hours) is the minimum for short-term functionality.',
  },
  {
    question: 'Why does the calculator add 14 minutes?',
    answer: 'The average person takes about 14 minutes to fall asleep. This is factored in so your sleep time calculations are more accurate.',
  },
  {
    question: 'What if I fall asleep faster or slower?',
    answer: 'The 14-minute average works for most people. If you consistently fall asleep faster or slower, mentally adjust the suggested times by a few minutes.',
  },
  {
    question: 'Is it better to sleep more or wake at the right time?',
    answer: 'Waking at the end of a cycle often feels better than sleeping longer and waking mid-cycle. However, consistently getting 5-6 cycles is ideal for long-term health.',
  },
];

const SLEEP_TIPS = [
  'Keep a consistent sleep schedule, even on weekends',
  'Avoid screens 30-60 minutes before bed',
  'Keep your bedroom cool (65-68°F / 18-20°C)',
  'Limit caffeine after 2 PM',
  'Exercise regularly, but not too close to bedtime',
];

export function SleepCalculator() {
  const { results, mode, setMode, calculate, reset } = useSleepCalculator();
  const [hours, setHours] = useState('07');
  const [minutes, setMinutes] = useState('00');
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');

  const handleCalculate = () => {
    const date = new Date();
    let hour = parseInt(hours);

    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;

    date.setHours(hour, parseInt(minutes), 0, 0);

    // If the time is in the past, assume next day
    if (date < new Date()) {
      date.setDate(date.getDate() + 1);
    }

    calculate(date);
  };

  const handleModeChange = (newMode: CalculationMode) => {
    setMode(newMode);
    reset();
    if (newMode === 'wake') {
      setHours('07');
      setMinutes('00');
      setPeriod('AM');
    } else {
      setHours('10');
      setMinutes('30');
      setPeriod('PM');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return 'bg-green-100 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400';
      case 'good':
        return 'bg-blue-100 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-400';
      default:
        return 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-500 text-yellow-700 dark:text-yellow-400';
    }
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Sleep Calculator',
    description: 'Calculate optimal bedtimes and wake times based on 90-minute sleep cycles.',
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
    <SiteLayout toolName="Sleep Calculator" category="health">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Your Sleep Times
          </h2>

          {/* Mode Toggle */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              I want to calculate...
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => handleModeChange('wake')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  mode === 'wake'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                When to go to bed
              </button>
              <button
                onClick={() => handleModeChange('sleep')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  mode === 'sleep'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                When to wake up
              </button>
            </div>
          </div>

          {/* Time Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {mode === 'wake' ? 'I need to wake up at:' : 'I want to go to bed at:'}
            </label>
            <div className="flex gap-2 items-center">
              <select
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                  <option key={h} value={h.toString().padStart(2, '0')}>
                    {h}
                  </option>
                ))}
              </select>
              <span className="text-gray-900 dark:text-white text-xl">:</span>
              <select
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {Array.from({ length: 12 }, (_, i) => i * 5).map((m) => (
                  <option key={m} value={m.toString().padStart(2, '0')}>
                    {m.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as 'AM' | 'PM')}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          {/* Calculate Button */}
          <button
            onClick={handleCalculate}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Calculate
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              {mode === 'wake' ? 'Optimal Bedtimes' : 'Optimal Wake Times'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {mode === 'wake'
                ? 'Go to bed at one of these times to wake up feeling refreshed:'
                : 'Set your alarm for one of these times to wake at the end of a sleep cycle:'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${getQualityColor(result.quality)}`}
                >
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatTime(result.time)}
                  </div>
                  <div className="text-sm mt-1">
                    {result.cycles} cycles ({result.totalHours} hours)
                  </div>
                  <div className="text-xs mt-1 capitalize font-medium">
                    {result.quality} sleep
                  </div>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              * Includes 14 minutes to fall asleep
            </p>
          </div>
        )}

        {/* Sleep Tips */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Sleep Quality Tips
          </h3>
          <ul className="space-y-2">
            {SLEEP_TIPS.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                <span className="text-blue-600 dark:text-blue-400 mt-1">&#8226;</span>
                {tip}
              </li>
            ))}
          </ul>
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

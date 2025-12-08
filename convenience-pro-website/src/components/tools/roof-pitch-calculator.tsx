'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useRoofPitchCalculator } from '@/hooks/useRoofPitchCalculator';

const FEATURES = [
  {
    title: 'Multiple Output Formats',
    description: 'Get your roof pitch expressed as a ratio (X:12), angle in degrees, and percentage grade for any application.',
  },
  {
    title: 'Visual Pitch Diagram',
    description: 'See a visual representation of your roof pitch angle to better understand and communicate the slope.',
  },
  {
    title: 'Pitch Classification',
    description: 'Automatically categorizes your roof pitch from low slope to very steep, helping you understand roofing requirements.',
  },
];

const FAQS = [
  {
    question: 'What is roof pitch?',
    answer: 'Roof pitch is the measure of the steepness or angle of a roof. It is typically expressed as a ratio of vertical rise to horizontal run, such as 4:12, meaning the roof rises 4 inches for every 12 inches of horizontal distance.',
  },
  {
    question: 'How do I measure roof rise and run?',
    answer: 'To measure rise and run, place a level horizontally against the roof surface. Mark a point 12 inches from the roof edge along the level. The vertical distance from that point down to the roof surface is your rise. The horizontal distance (12 inches in this case) is your run.',
  },
  {
    question: 'What is considered a standard roof pitch?',
    answer: 'A standard roof pitch ranges from 4:12 to 9:12 (approximately 18 to 37 degrees). Pitches below 4:12 are considered low-slope and may require special roofing materials. Pitches above 9:12 are steep and may require additional safety measures during installation.',
  },
  {
    question: 'Why does roof pitch matter?',
    answer: 'Roof pitch affects water drainage, snow load capacity, material choices, and overall aesthetics. Steeper pitches shed water and snow better but require more materials. The pitch also determines which roofing materials are appropriate for your roof.',
  },
  {
    question: 'What is the minimum roof pitch for shingles?',
    answer: 'The minimum recommended pitch for asphalt shingles is typically 2:12 to 4:12, depending on the manufacturer. Below 2:12, a low-slope or flat roof membrane system is usually required to prevent water infiltration.',
  },
  {
    question: 'How do I convert roof pitch to degrees?',
    answer: 'To convert pitch to degrees, use the arctangent function: degrees = arctan(rise/run) x (180/pi). For example, a 4:12 pitch equals arctan(4/12) x 57.3 = approximately 18.4 degrees. Our calculator does this automatically.',
  },
];

export function RoofPitchCalculator() {
  const { result, calculate, reset } = useRoofPitchCalculator();

  const [rise, setRise] = useState('');
  const [run, setRun] = useState('12');

  const handleCalculate = () => {
    if (rise && run) {
      calculate({
        rise: parseFloat(rise) || 0,
        run: parseFloat(run) || 12,
      });
    }
  };

  const handleReset = () => {
    reset();
    setRise('');
    setRun('12');
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Roof Pitch Calculator',
    description: 'Calculate roof pitch from rise and run measurements. Get results in ratio, degrees, and percentage formats.',
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

  // Calculate angle for diagram
  const diagramAngle = result ? Math.min(result.degrees, 60) : 0;

  return (
    <SiteLayout toolName="Roof Pitch Calculator" category="home-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Roof Pitch
          </h2>

          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Rise (inches)
              </label>
              <input
                type="number"
                value={rise}
                onChange={(e) => setRise(e.target.value)}
                placeholder="4"
                min="0"
                step="0.5"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Vertical height of the roof
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Run (inches)
              </label>
              <input
                type="number"
                value={run}
                onChange={(e) => setRun(e.target.value)}
                placeholder="12"
                min="0.1"
                step="0.5"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Horizontal distance (standard is 12)
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleCalculate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Calculate Pitch
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
              Roof Pitch Results
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-center">
                <div className="text-sm text-blue-600 dark:text-blue-400">Pitch Ratio</div>
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                  {result.pitchRatio}
                </div>
              </div>
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg text-center">
                <div className="text-sm text-green-600 dark:text-green-400">Angle</div>
                <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                  {result.degrees.toFixed(1)}°
                </div>
              </div>
              <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-center">
                <div className="text-sm text-purple-600 dark:text-purple-400">Percentage</div>
                <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                  {result.percentage.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Pitch Category */}
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg mb-6 text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">Pitch Classification</div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {result.pitchCategory}
              </div>
            </div>

            {/* Pitch Diagram */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">Pitch Diagram</h4>
              <div className="flex justify-center">
                <svg width="300" height="180" viewBox="0 0 300 180" className="overflow-visible">
                  {/* Background */}
                  <rect width="300" height="180" fill="transparent" />

                  {/* Ground line */}
                  <line x1="30" y1="150" x2="270" y2="150" stroke="currentColor" strokeWidth="2" className="text-gray-400" />

                  {/* Vertical line (rise) */}
                  <line x1="250" y1="150" x2="250" y2={150 - Math.tan(diagramAngle * Math.PI / 180) * 200} stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" className="text-blue-500" />

                  {/* Horizontal line (run) */}
                  <line x1="50" y1="150" x2="250" y2="150" stroke="currentColor" strokeWidth="2" className="text-green-500" />

                  {/* Roof slope line */}
                  <line x1="50" y1="150" x2="250" y2={150 - Math.tan(diagramAngle * Math.PI / 180) * 200} stroke="currentColor" strokeWidth="3" className="text-orange-500" />

                  {/* Angle arc */}
                  <path
                    d={`M 80 150 A 30 30 0 0 0 ${50 + 30 * Math.cos(diagramAngle * Math.PI / 180)} ${150 - 30 * Math.sin(diagramAngle * Math.PI / 180)}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-orange-400"
                  />

                  {/* Labels */}
                  <text x="150" y="170" textAnchor="middle" className="text-xs fill-green-600 dark:fill-green-400">Run</text>
                  <text x="265" y={150 - Math.tan(diagramAngle * Math.PI / 180) * 100} textAnchor="start" className="text-xs fill-blue-600 dark:fill-blue-400">Rise</text>
                  <text x="95" y="140" textAnchor="middle" className="text-xs fill-orange-600 dark:fill-orange-400">{result.degrees.toFixed(1)}°</text>
                </svg>
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

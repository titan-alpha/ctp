'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useRafterCalculator } from '@/hooks/useRafterCalculator';

const FEATURES = [
  {
    title: 'Accurate Rafter Length',
    description: 'Calculate precise rafter lengths using the Pythagorean theorem based on span and roof pitch.',
  },
  {
    title: 'Rise Calculation',
    description: 'Automatically determine the vertical rise from the wall plate to the ridge based on your pitch.',
  },
  {
    title: 'Visual Diagram',
    description: 'See a visual representation of your roof structure to better understand the calculations.',
  },
];

const FAQS = [
  {
    question: 'What is roof pitch?',
    answer: 'Roof pitch is the slope of a roof expressed as a ratio of rise to run. For example, a 4:12 pitch means the roof rises 4 inches for every 12 inches of horizontal run.',
  },
  {
    question: 'How do I measure the span of my roof?',
    answer: 'The span is the total horizontal distance from one exterior wall to the other. Measure from the outside edge of one wall plate to the outside edge of the opposite wall plate.',
  },
  {
    question: 'What is the difference between span and run?',
    answer: 'The span is the full width of the building. The run is half the span - the horizontal distance from the wall to the center ridge of the roof.',
  },
  {
    question: 'What pitch should I use for my roof?',
    answer: 'Common residential pitches range from 4:12 to 9:12. Lower pitches (4:12 to 6:12) are easier to walk on, while steeper pitches (8:12+) shed water and snow better.',
  },
  {
    question: 'Does this calculator include overhang?',
    answer: 'This calculator provides the basic rafter length from wall to ridge. Add your desired overhang length (typically 12-24 inches) to get the total rafter length needed.',
  },
  {
    question: 'How do I convert the pitch to degrees?',
    answer: 'The calculator shows the pitch angle in degrees. Common conversions: 4:12 = 18.4°, 6:12 = 26.6°, 8:12 = 33.7°, 12:12 = 45°.',
  },
];

export function RafterCalculator() {
  const { result, calculate, reset } = useRafterCalculator();

  const [span, setSpan] = useState('');
  const [pitch, setPitch] = useState('6');

  const handleCalculate = () => {
    if (span && pitch) {
      calculate({
        span: parseFloat(span),
        pitch: parseFloat(pitch),
      });
    }
  };

  const handleReset = () => {
    reset();
    setSpan('');
    setPitch('6');
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Rafter Calculator',
    description: 'Calculate roof rafter length and rise based on span and pitch for construction projects.',
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
    <SiteLayout toolName="Rafter Calculator" category="home-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Rafter Length
          </h2>

          {/* Span Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Building Span (feet)
            </label>
            <input
              type="number"
              value={span}
              onChange={(e) => setSpan(e.target.value)}
              placeholder="Enter total span"
              step="0.5"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">Distance from wall to wall</span>
          </div>

          {/* Pitch Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Roof Pitch (rise per 12&quot; run)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                placeholder="6"
                step="0.5"
                min="1"
                max="24"
                className="w-24 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <span className="text-gray-700 dark:text-gray-300">: 12</span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Common pitches: 4:12 (low), 6:12 (medium), 8:12 (steep)</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleCalculate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Calculate
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <div className="text-sm text-blue-600 dark:text-blue-400">Rafter Length</div>
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                  {result.rafterLength.toFixed(2)} ft
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  ({(result.rafterLength * 12).toFixed(1)} inches)
                </div>
              </div>
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <div className="text-sm text-green-600 dark:text-green-400">Rise</div>
                <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                  {result.rise.toFixed(2)} ft
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  ({(result.rise * 12).toFixed(1)} inches)
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Run</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {result.run.toFixed(2)} ft
                </div>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Pitch Angle</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {result.pitchAngle.toFixed(1)}°
                </div>
              </div>
            </div>

            {/* Rafter Diagram */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Roof Diagram</h4>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <svg viewBox="0 0 400 200" className="w-full max-w-md mx-auto">
                  {/* Ground/Wall line */}
                  <line x1="50" y1="150" x2="350" y2="150" stroke="currentColor" strokeWidth="2" className="text-gray-400" />

                  {/* Left wall */}
                  <line x1="50" y1="150" x2="50" y2="130" stroke="currentColor" strokeWidth="2" className="text-gray-600" />

                  {/* Right wall */}
                  <line x1="350" y1="150" x2="350" y2="130" stroke="currentColor" strokeWidth="2" className="text-gray-600" />

                  {/* Ridge point */}
                  <circle cx="200" cy="50" r="4" fill="currentColor" className="text-blue-600" />

                  {/* Left rafter */}
                  <line x1="50" y1="130" x2="200" y2="50" stroke="currentColor" strokeWidth="3" className="text-blue-600" />

                  {/* Right rafter */}
                  <line x1="350" y1="130" x2="200" y2="50" stroke="currentColor" strokeWidth="3" className="text-blue-600" />

                  {/* Rise indicator */}
                  <line x1="200" y1="130" x2="200" y2="50" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" className="text-green-500" />

                  {/* Run indicator */}
                  <line x1="50" y1="140" x2="200" y2="140" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" className="text-orange-500" />

                  {/* Labels */}
                  <text x="110" y="80" fill="currentColor" fontSize="12" className="text-blue-600">Rafter</text>
                  <text x="205" y="95" fill="currentColor" fontSize="10" className="text-green-500">Rise</text>
                  <text x="115" y="138" fill="currentColor" fontSize="10" className="text-orange-500">Run</text>
                  <text x="175" y="170" fill="currentColor" fontSize="10" className="text-gray-500">Span</text>
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

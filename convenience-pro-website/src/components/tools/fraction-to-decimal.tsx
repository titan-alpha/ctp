'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useFractionToDecimal } from '@/hooks/useFractionToDecimal';

const FEATURES = [
  {
    title: 'Fraction to Decimal',
    description: 'Convert any fraction including improper fractions and mixed numbers to their decimal equivalent instantly.',
  },
  {
    title: 'Decimal to Fraction',
    description: 'Convert decimal numbers back to fractions with automatic simplification to lowest terms.',
  },
  {
    title: 'Auto Simplification',
    description: 'All fractions are automatically reduced to their simplest form using the greatest common divisor.',
  },
];

const FAQS = [
  {
    question: 'How do I convert a fraction to a decimal?',
    answer: 'Enter the numerator (top number) and denominator (bottom number) of your fraction. The tool will instantly calculate and display the decimal equivalent.',
  },
  {
    question: 'Can I convert mixed numbers?',
    answer: 'Yes! Enter the whole number in the optional field along with the numerator and denominator to convert mixed numbers like 2 1/4 to decimals.',
  },
  {
    question: 'How do I convert a decimal to a fraction?',
    answer: 'Switch to "Decimal to Fraction" mode using the toggle, enter your decimal number, and the tool will convert it to a simplified fraction.',
  },
  {
    question: 'Are the fractions automatically simplified?',
    answer: 'Yes, all fractions are automatically reduced to their lowest terms by finding the greatest common divisor (GCD) of the numerator and denominator.',
  },
  {
    question: 'What is a mixed number?',
    answer: 'A mixed number combines a whole number with a fraction, like 3 1/2. This represents three and one-half, which equals 3.5 as a decimal.',
  },
  {
    question: 'Can I convert repeating decimals?',
    answer: 'The tool handles standard decimal inputs. For repeating decimals, enter as many decimal places as needed for the precision you require.',
  },
];

export function FractionToDecimal() {
  const { result, error, convertFractionToDecimal, convertDecimalToFraction, reset } = useFractionToDecimal();
  const [mode, setMode] = useState<'fractionToDecimal' | 'decimalToFraction'>('fractionToDecimal');
  const [numerator, setNumerator] = useState('');
  const [denominator, setDenominator] = useState('');
  const [wholeNumber, setWholeNumber] = useState('');
  const [decimalInput, setDecimalInput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    if (mode === 'fractionToDecimal') {
      const num = parseInt(numerator, 10);
      const den = parseInt(denominator, 10);
      const whole = wholeNumber ? parseInt(wholeNumber, 10) : 0;
      convertFractionToDecimal(num, den, whole);
    } else {
      convertDecimalToFraction(decimalInput);
    }
  };

  const handleReset = () => {
    setNumerator('');
    setDenominator('');
    setWholeNumber('');
    setDecimalInput('');
    reset();
    setCopied(false);
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Fraction to Decimal Converter',
    description: 'Convert fractions to decimals and decimals to fractions. Supports mixed numbers and automatic simplification.',
    applicationCategory: 'UtilityApplication',
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
    <SiteLayout toolName="Fraction to Decimal Converter" category="education-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            {mode === 'fractionToDecimal' ? 'Convert Fraction to Decimal' : 'Convert Decimal to Fraction'}
          </h2>

          {/* Mode Toggle */}
          <div className="mb-6 flex gap-4">
            <button
              onClick={() => { setMode('fractionToDecimal'); handleReset(); }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                mode === 'fractionToDecimal'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Fraction to Decimal
            </button>
            <button
              onClick={() => { setMode('decimalToFraction'); handleReset(); }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                mode === 'decimalToFraction'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Decimal to Fraction
            </button>
          </div>

          {mode === 'fractionToDecimal' ? (
            <div className="mb-6">
              {/* Mixed Number Input */}
              <div className="flex flex-wrap items-end gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Whole (optional)
                  </label>
                  <input
                    type="number"
                    value={wholeNumber}
                    onChange={(e) => setWholeNumber(e.target.value)}
                    placeholder="0"
                    className="w-24 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Numerator
                  </label>
                  <input
                    type="number"
                    value={numerator}
                    onChange={(e) => setNumerator(e.target.value)}
                    placeholder="1"
                    className="w-24 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg"
                  />
                </div>
                <span className="text-3xl text-gray-900 dark:text-white pb-2">/</span>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Denominator
                  </label>
                  <input
                    type="number"
                    value={denominator}
                    onChange={(e) => setDenominator(e.target.value)}
                    placeholder="2"
                    className="w-24 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter Decimal
              </label>
              <input
                type="text"
                value={decimalInput}
                onChange={(e) => setDecimalInput(e.target.value)}
                placeholder="e.g., 0.75"
                className="w-full max-w-xs px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg"
              />
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={handleConvert}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Convert
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>

          {/* Results Display */}
          {result && (
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Results</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Decimal</span>
                    <button
                      onClick={() => handleCopy(result.decimal)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{result.decimal}</p>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Simplified Fraction</span>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{result.simplified}</p>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Mixed Number</span>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{result.mixedNumber}</p>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Improper Fraction</span>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{result.fraction}</p>
                </div>
              </div>
            </div>
          )}
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

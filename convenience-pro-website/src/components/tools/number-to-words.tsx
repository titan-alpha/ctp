'use client';

import { useState, useEffect } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useNumberToWords, CurrencyType } from '@/hooks/useNumberToWords';

const FEATURES = [
  {
    title: 'Large Number Support',
    description: 'Convert numbers up to quintillions including billions and trillions with perfect accuracy.',
  },
  {
    title: 'Currency Mode',
    description: 'Format numbers as currency amounts in USD, EUR, GBP, INR, and more with proper terminology.',
  },
  {
    title: 'Decimal & Negative',
    description: 'Handle decimal numbers and negative values with correct word representation.',
  },
];

const FAQS = [
  {
    question: 'How do I convert a number to words?',
    answer: 'Simply enter any number in the input field and the tool will instantly display the written word equivalent. Enable currency mode to format as money.',
  },
  {
    question: 'What is the largest number this tool can convert?',
    answer: 'This tool supports numbers up to quintillions (10^18) and beyond, making it suitable for virtually any numerical conversion need.',
  },
  {
    question: 'Can I convert decimal numbers to words?',
    answer: 'Yes! Decimal numbers are fully supported. Each digit after the decimal point is spelled out individually (e.g., 3.14 becomes "three point one four").',
  },
  {
    question: 'How does currency mode work?',
    answer: 'Currency mode converts numbers to monetary format. For example, 123.45 in USD becomes "one hundred twenty-three dollars and forty-five cents".',
  },
  {
    question: 'Which currencies are supported?',
    answer: 'We support USD, EUR, GBP, INR, JPY, CAD, and AUD with their proper currency names and subunits (cents, pence, paise, etc.).',
  },
  {
    question: 'Can I convert negative numbers?',
    answer: 'Yes, negative numbers are supported. Simply include a minus sign before the number and it will be converted with "negative" prefix.',
  },
];

export function NumberToWords() {
  const { words, convert, reset, currencies } = useNumberToWords();
  const [input, setInput] = useState('');
  const [currencyMode, setCurrencyMode] = useState(false);
  const [currency, setCurrency] = useState<CurrencyType>('USD');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    convert(input, currencyMode, currency);
  }, [input, currencyMode, currency, convert]);

  const handleReset = () => {
    setInput('');
    reset();
    setCopied(false);
  };

  const handleCopy = async () => {
    if (words) {
      await navigator.clipboard.writeText(words);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Number to Words Converter',
    description: 'Convert numbers to written words. Supports large numbers, decimals, negatives, and currency formatting.',
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
    <SiteLayout toolName="Number to Words Converter" category="text-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Convert Number to Words
          </h2>

          {/* Number Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter a Number
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., 1234567.89"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg"
            />
          </div>

          {/* Currency Toggle and Selector */}
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={currencyMode}
                onChange={(e) => setCurrencyMode(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700 dark:text-gray-300">Currency Mode</span>
            </label>
            {currencyMode && (
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyType)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {currencies.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Output Display */}
          {words && (
            <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Result</span>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-xl text-gray-900 dark:text-white break-words">{words}</p>
            </div>
          )}

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
          >
            Reset
          </button>
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

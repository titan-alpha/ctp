'use client';

import { useState, useEffect } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useGcdCalculator } from '@/hooks/useGcdCalculator';

const FEATURES = [
  {
    title: 'Euclidean Algorithm',
    description: 'Uses the efficient Euclidean algorithm to calculate GCD with optimal performance for any size numbers.',
  },
  {
    title: 'Multiple Numbers',
    description: 'Calculate the GCD of two or more numbers at once. Add as many numbers as you need.',
  },
  {
    title: 'Step-by-Step Solution',
    description: 'View the complete calculation process with detailed steps explaining each division operation.',
  },
];

const FAQS = [
  {
    question: 'What is the Greatest Common Divisor (GCD)?',
    answer: 'The Greatest Common Divisor (GCD), also known as the Greatest Common Factor (GCF) or Highest Common Factor (HCF), is the largest positive integer that divides each of the given numbers without leaving a remainder.',
  },
  {
    question: 'How does the Euclidean algorithm work?',
    answer: 'The Euclidean algorithm repeatedly divides the larger number by the smaller one and replaces the larger number with the remainder until the remainder is zero. The last non-zero remainder is the GCD.',
  },
  {
    question: 'Can I find the GCD of more than two numbers?',
    answer: 'Yes! This calculator supports multiple numbers. The GCD is calculated by finding the GCD of the first two numbers, then finding the GCD of that result with the third number, and so on.',
  },
  {
    question: 'What is the GCD of 0 and another number?',
    answer: 'The GCD of 0 and any non-zero number n is n itself, because every integer divides 0. However, GCD(0, 0) is undefined.',
  },
  {
    question: 'How is GCD used in real life?',
    answer: 'GCD is used to simplify fractions, solve problems involving ratios, in cryptography (RSA algorithm), computer graphics, and many mathematical proofs and algorithms.',
  },
  {
    question: 'What is the relationship between GCD and LCM?',
    answer: 'For any two positive integers a and b: GCD(a, b) x LCM(a, b) = a x b. This relationship allows you to calculate LCM if you know the GCD.',
  },
];

export function GcdCalculator() {
  const { result, steps, calculate, reset } = useGcdCalculator();
  const [numbers, setNumbers] = useState<string[]>(['', '']);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const parsed = numbers.map((n) => parseInt(n, 10)).filter((n) => !isNaN(n));
    if (parsed.length >= 2) {
      calculate(parsed);
    } else {
      reset();
    }
  }, [numbers, calculate, reset]);

  const handleNumberChange = (index: number, value: string) => {
    const newNumbers = [...numbers];
    newNumbers[index] = value;
    setNumbers(newNumbers);
  };

  const addNumber = () => {
    setNumbers([...numbers, '']);
  };

  const removeNumber = (index: number) => {
    if (numbers.length > 2) {
      setNumbers(numbers.filter((_, i) => i !== index));
    }
  };

  const handleReset = () => {
    setNumbers(['', '']);
    reset();
    setCopied(false);
  };

  const handleCopy = async () => {
    if (result !== null) {
      await navigator.clipboard.writeText(result.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'GCD Calculator',
    description: 'Calculate the Greatest Common Divisor (GCD) of multiple numbers using the Euclidean algorithm with step-by-step solution.',
    applicationCategory: 'EducationalApplication',
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
    <SiteLayout toolName="GCD Calculator" category="education-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Greatest Common Divisor
          </h2>

          {/* Number Inputs */}
          <div className="mb-6 space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter Numbers
            </label>
            {numbers.map((num, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="number"
                  value={num}
                  onChange={(e) => handleNumberChange(index, e.target.value)}
                  placeholder={`Number ${index + 1}`}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg"
                />
                {numbers.length > 2 && (
                  <button
                    onClick={() => removeNumber(index)}
                    className="px-3 py-3 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-600 dark:text-red-300 rounded-lg transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addNumber}
              className="px-4 py-2 bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800 text-green-700 dark:text-green-300 rounded-lg transition-colors"
            >
              + Add Number
            </button>
          </div>

          {/* Result Display */}
          {result !== null && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">GCD Result</span>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{result}</p>
            </div>
          )}

          {/* Step-by-Step Solution */}
          {steps.length > 0 && (
            <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Step-by-Step Solution (Euclidean Algorithm)
              </h3>
              <div className="space-y-2 font-mono text-sm">
                {steps.map((step, index) => (
                  <div key={index} className="text-gray-700 dark:text-gray-300">
                    <span className="text-gray-500 dark:text-gray-400">Step {index + 1}:</span>{' '}
                    {step.explanation}
                  </div>
                ))}
                <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold">
                  Therefore, GCD = {result}
                </div>
              </div>
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

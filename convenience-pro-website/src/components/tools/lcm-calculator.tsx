'use client';

import { useState, useEffect } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useLcmCalculator } from '@/hooks/useLcmCalculator';

const FEATURES = [
  {
    title: 'Multiple Numbers',
    description: 'Calculate the LCM of two or more numbers at once with step-by-step solutions.',
  },
  {
    title: 'GCD-Based Method',
    description: 'Uses the efficient GCD relationship formula: LCM(a,b) = |a x b| / GCD(a,b).',
  },
  {
    title: 'Detailed Steps',
    description: 'See the complete calculation process with formulas and intermediate results.',
  },
];

const FAQS = [
  {
    question: 'What is LCM (Least Common Multiple)?',
    answer: 'The Least Common Multiple (LCM) is the smallest positive integer that is divisible by all given numbers. For example, the LCM of 4 and 6 is 12.',
  },
  {
    question: 'How is LCM calculated using GCD?',
    answer: 'LCM can be calculated using the formula: LCM(a, b) = |a x b| / GCD(a, b). This method is efficient and works by finding the Greatest Common Divisor first.',
  },
  {
    question: 'Can I find LCM of more than two numbers?',
    answer: 'Yes! This calculator supports multiple numbers. It calculates LCM iteratively: LCM(a, b, c) = LCM(LCM(a, b), c).',
  },
  {
    question: 'What is the relationship between LCM and GCD?',
    answer: 'For any two positive integers a and b: LCM(a, b) x GCD(a, b) = a x b. This relationship makes calculations more efficient.',
  },
  {
    question: 'Why is LCM useful?',
    answer: 'LCM is used for finding common denominators in fractions, scheduling recurring events, solving problems involving cycles, and many mathematical applications.',
  },
  {
    question: 'What happens if one number is zero?',
    answer: 'If any input number is zero, it will be excluded from the calculation since LCM with zero is undefined.',
  },
];

export function LcmCalculator() {
  const { lcm, steps, calculate, reset } = useLcmCalculator();
  const [inputs, setInputs] = useState<string[]>(['', '']);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const numbers = inputs.map((i) => parseInt(i, 10)).filter((n) => !isNaN(n));
    if (numbers.length >= 2) {
      calculate(numbers);
    } else {
      reset();
    }
  }, [inputs, calculate, reset]);

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const addInput = () => {
    setInputs([...inputs, '']);
  };

  const removeInput = (index: number) => {
    if (inputs.length > 2) {
      const newInputs = inputs.filter((_, i) => i !== index);
      setInputs(newInputs);
    }
  };

  const handleReset = () => {
    setInputs(['', '']);
    reset();
    setCopied(false);
  };

  const handleCopy = async () => {
    if (lcm !== null) {
      await navigator.clipboard.writeText(lcm.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'LCM Calculator',
    description: 'Calculate the Least Common Multiple of two or more numbers with step-by-step solutions using the GCD method.',
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
    <SiteLayout toolName="LCM Calculator" category="education-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Least Common Multiple
          </h2>

          {/* Number Inputs */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter Numbers
            </label>
            <div className="space-y-3">
              {inputs.map((input, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="number"
                    value={input}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    placeholder={`Number ${index + 1}`}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  {inputs.length > 2 && (
                    <button
                      onClick={() => removeInput(index)}
                      className="px-3 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={addInput}
              className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              Add Number
            </button>
          </div>

          {/* Result Display */}
          {lcm !== null && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">LCM Result</span>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{lcm}</p>
            </div>
          )}

          {/* Step-by-Step Solution */}
          {steps.length > 0 && (
            <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Step-by-Step Solution</h3>
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-medium text-gray-700 dark:text-gray-300">{step.description}</p>
                    {step.formula && (
                      <p className="text-gray-600 dark:text-gray-400 font-mono ml-4">{step.formula}</p>
                    )}
                    {step.result && (
                      <p className="text-blue-600 dark:text-blue-400 font-mono ml-4">{step.result}</p>
                    )}
                  </div>
                ))}
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

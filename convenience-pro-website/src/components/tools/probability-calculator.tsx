'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useProbabilityCalculator } from '@/hooks/useProbabilityCalculator';

type Mode = 'single' | 'combined' | 'permutation';
type CombinedOperation = 'and' | 'or' | 'not';
type PermType = 'permutation' | 'combination';

const FEATURES = [
  {
    title: 'Single Event Probability',
    description: 'Calculate the probability of a single event by entering favorable outcomes and total possible outcomes.',
  },
  {
    title: 'Combined Events',
    description: 'Compute AND, OR, and NOT probability operations for independent events using standard probability rules.',
  },
  {
    title: 'Permutations & Combinations',
    description: 'Calculate the number of ways to arrange or choose items with or without considering order.',
  },
];

const FAQS = [
  {
    question: 'What is probability?',
    answer: 'Probability is a measure of the likelihood that an event will occur, expressed as a number between 0 and 1. A probability of 0 means the event is impossible, while 1 means it is certain.',
  },
  {
    question: 'What is the difference between AND and OR probability?',
    answer: 'AND probability (intersection) calculates the chance of both events occurring: P(A AND B) = P(A) x P(B) for independent events. OR probability (union) calculates the chance of either event occurring: P(A OR B) = P(A) + P(B) - P(A AND B).',
  },
  {
    question: 'What is the difference between permutations and combinations?',
    answer: 'Permutations count arrangements where order matters (e.g., ranking 3 people from 10). Combinations count selections where order does not matter (e.g., choosing 3 people from 10 for a committee).',
  },
  {
    question: 'How do I calculate the probability of NOT an event?',
    answer: 'The probability of NOT an event is the complement: P(NOT A) = 1 - P(A). If the probability of rain is 0.3, then the probability of no rain is 1 - 0.3 = 0.7.',
  },
  {
    question: 'What is factorial and how is it used?',
    answer: 'Factorial (n!) is the product of all positive integers up to n. For example, 5! = 5 x 4 x 3 x 2 x 1 = 120. It is used in permutation and combination formulas to count arrangements.',
  },
  {
    question: 'What are odds vs probability?',
    answer: 'Probability is the ratio of favorable outcomes to total outcomes. Odds compare favorable outcomes to unfavorable outcomes. A 25% probability (1/4) equals odds of 1:3 (1 favorable to 3 unfavorable).',
  },
];

export function ProbabilityCalculator() {
  const { result, error, calculateSingleEvent, calculateCombined, calculatePermutation, calculateCombination, reset } = useProbabilityCalculator();
  const [mode, setMode] = useState<Mode>('single');

  // Single event inputs
  const [favorable, setFavorable] = useState('');
  const [total, setTotal] = useState('');

  // Combined event inputs
  const [operation, setOperation] = useState<CombinedOperation>('and');
  const [probA, setProbA] = useState('');
  const [probB, setProbB] = useState('');

  // Permutation inputs
  const [permType, setPermType] = useState<PermType>('permutation');
  const [nValue, setNValue] = useState('');
  const [rValue, setRValue] = useState('');

  const handleCalculate = () => {
    if (mode === 'single') {
      calculateSingleEvent(parseInt(favorable), parseInt(total));
    } else if (mode === 'combined') {
      const pA = parseFloat(probA);
      const pB = operation !== 'not' ? parseFloat(probB) : undefined;
      calculateCombined(operation, pA, pB);
    } else {
      const n = parseInt(nValue);
      const r = parseInt(rValue);
      if (permType === 'permutation') {
        calculatePermutation(n, r);
      } else {
        calculateCombination(n, r);
      }
    }
  };

  const handleReset = () => {
    reset();
    setFavorable('');
    setTotal('');
    setProbA('');
    setProbB('');
    setNValue('');
    setRValue('');
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Probability Calculator',
    description: 'Free online probability calculator for single events, combined events (AND, OR, NOT), permutations, and combinations.',
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
    <SiteLayout toolName="Probability Calculator" category="education-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Probability
          </h2>

          {/* Mode Toggle */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setMode('single')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                mode === 'single'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Single Event
            </button>
            <button
              onClick={() => setMode('combined')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                mode === 'combined'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Combined Events
            </button>
            <button
              onClick={() => setMode('permutation')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                mode === 'permutation'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Permutation/Combination
            </button>
          </div>

          {/* Single Event Inputs */}
          {mode === 'single' && (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Favorable Outcomes
                </label>
                <input
                  type="number"
                  min="0"
                  value={favorable}
                  onChange={(e) => setFavorable(e.target.value)}
                  placeholder="e.g., 1"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Total Possible Outcomes
                </label>
                <input
                  type="number"
                  min="1"
                  value={total}
                  onChange={(e) => setTotal(e.target.value)}
                  placeholder="e.g., 6"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Combined Event Inputs */}
          {mode === 'combined' && (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Operation
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setOperation('and')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      operation === 'and'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    AND
                  </button>
                  <button
                    onClick={() => setOperation('or')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      operation === 'or'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    OR
                  </button>
                  <button
                    onClick={() => setOperation('not')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      operation === 'not'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    NOT
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Probability of Event A (0 to 1)
                </label>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={probA}
                  onChange={(e) => setProbA(e.target.value)}
                  placeholder="e.g., 0.5"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {operation !== 'not' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Probability of Event B (0 to 1)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={probB}
                    onChange={(e) => setProbB(e.target.value)}
                    placeholder="e.g., 0.3"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          )}

          {/* Permutation/Combination Inputs */}
          {mode === 'permutation' && (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setPermType('permutation')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      permType === 'permutation'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Permutation (order matters)
                  </button>
                  <button
                    onClick={() => setPermType('combination')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      permType === 'combination'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Combination (order does not matter)
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    n (total items)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={nValue}
                    onChange={(e) => setNValue(e.target.value)}
                    placeholder="e.g., 10"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    r (items to choose)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={rValue}
                    onChange={(e) => setRValue(e.target.value)}
                    placeholder="e.g., 3"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
              {error}
            </div>
          )}

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
              Results
            </h3>

            <div className="text-center mb-6 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              {result.mode === 'single' && (
                <>
                  <div className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                    Probability
                  </div>
                  <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {result.percentage}%
                  </div>
                  <div className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                    {result.favorable} out of {result.total}
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{result.probability}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Decimal</div>
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{result.odds}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Odds</div>
                    </div>
                  </div>
                </>
              )}

              {result.mode === 'combined' && (
                <>
                  <div className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                    P(A {result.operation === 'not' ? 'NOT' : result.operation.toUpperCase()} {result.operation !== 'not' ? 'B' : ''})
                  </div>
                  <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {result.percentage}%
                  </div>
                  <div className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                    Decimal: {result.result}
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg text-left">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Formula:</div>
                    <div className="text-gray-600 dark:text-gray-400">{result.explanation}</div>
                  </div>
                </>
              )}

              {result.mode === 'permutation' && (
                <>
                  <div className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                    {result.type === 'permutation' ? 'Permutation' : 'Combination'}
                  </div>
                  <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {result.result.toLocaleString()}
                  </div>
                  <div className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                    {result.formula}
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg text-left">
                    <div className="text-gray-600 dark:text-gray-400">{result.explanation}</div>
                  </div>
                </>
              )}
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

'use client';

import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useNumerologyCalculator } from '@/hooks/useNumerologyCalculator';

const FEATURES = [
  {
    title: 'Life Path Number',
    description: 'Discover your life purpose and destiny through your birthdate using ancient numerology calculations.',
  },
  {
    title: 'Expression Number',
    description: 'Learn about your natural talents and abilities revealed through the numerical value of your name.',
  },
  {
    title: 'Master Numbers',
    description: 'Identifies special master numbers (11, 22, 33) that carry heightened spiritual significance.',
  },
];

const FAQS = [
  {
    question: 'What is a Life Path Number?',
    answer: 'Your Life Path Number is derived from your birthdate and reveals your life purpose, natural talents, and the opportunities and challenges you may encounter. It is considered the most important number in numerology.',
  },
  {
    question: 'How is the Expression Number calculated?',
    answer: 'The Expression Number is calculated by converting each letter of your full birth name to a number using the Pythagorean system (A=1, B=2, etc.), then adding them together and reducing to a single digit or master number.',
  },
  {
    question: 'What are Master Numbers?',
    answer: 'Master Numbers are 11, 22, and 33. These are not reduced to single digits because they carry special spiritual significance and represent heightened potential for learning and achievement.',
  },
  {
    question: 'Should I use my birth name or current name?',
    answer: 'For the Expression Number, numerologists traditionally recommend using your full name as it appears on your birth certificate, as this represents your true spiritual identity.',
  },
  {
    question: 'Is numerology scientifically proven?',
    answer: 'Numerology is a metaphysical practice and is not scientifically validated. It is used as a tool for self-reflection and personal insight rather than as a predictive science.',
  },
  {
    question: 'Can my numbers change over time?',
    answer: 'Your Life Path Number never changes as it is based on your birthdate. However, if you legally change your name, you may calculate a new Expression Number to see how it might influence your life.',
  },
];

const getNumberColor = (num: number) => {
  if (num === 11 || num === 22 || num === 33) {
    return 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-500';
  }
  return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-500';
};

export function NumerologyCalculator() {
  const { result, birthdate, name, setBirthdate, setName, calculate, reset } = useNumerologyCalculator();

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Numerology Calculator',
    description: 'Calculate your Life Path Number and Expression Number with meanings and interpretations.',
    applicationCategory: 'LifestyleApplication',
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
    <SiteLayout toolName="Numerology Calculator" category="lifestyle-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Your Numerology Numbers
          </h2>

          {/* Birthdate Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Birthdate <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Required for Life Path Number calculation
            </p>
          </div>

          {/* Name Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name (Optional)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter your full birth name"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Used for Expression Number calculation
            </p>
          </div>

          {/* Calculate Button */}
          <div className="flex gap-4">
            <button
              onClick={calculate}
              disabled={!birthdate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              Calculate Numbers
            </button>
            <button
              onClick={reset}
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
              Your Numerology Results
            </h3>

            <div className="space-y-6">
              {/* Life Path Number */}
              <div className={`p-6 rounded-lg border-l-4 ${getNumberColor(result.lifePathNumber)}`}>
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-4xl font-bold">{result.lifePathNumber}</div>
                  <div>
                    <div className="text-sm font-medium">Life Path Number</div>
                    {(result.lifePathNumber === 11 || result.lifePathNumber === 22 || result.lifePathNumber === 33) && (
                      <span className="text-xs bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded">
                        Master Number
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{result.lifePathMeaning}</p>
              </div>

              {/* Expression Number */}
              {result.expressionNumber && (
                <div className={`p-6 rounded-lg border-l-4 ${getNumberColor(result.expressionNumber)}`}>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-4xl font-bold">{result.expressionNumber}</div>
                    <div>
                      <div className="text-sm font-medium">Expression Number</div>
                      {(result.expressionNumber === 11 || result.expressionNumber === 22 || result.expressionNumber === 33) && (
                        <span className="text-xs bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded">
                          Master Number
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{result.expressionMeaning}</p>
                </div>
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

'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useNpsCalculator } from '@/hooks/useNpsCalculator';

const FEATURES = [
  {
    title: 'Instant NPS Calculation',
    description: 'Calculate your Net Promoter Score instantly by entering response counts for each score from 0 to 10.',
  },
  {
    title: 'Visual Breakdown',
    description: 'See a clear breakdown of promoters, passives, and detractors with percentages and visual indicators.',
  },
  {
    title: 'Score Interpretation',
    description: 'Get actionable insights with automatic interpretation of your NPS score and improvement recommendations.',
  },
];

const FAQS = [
  {
    question: 'What is Net Promoter Score (NPS)?',
    answer: 'Net Promoter Score is a customer loyalty metric that measures how likely customers are to recommend your product or service. It ranges from -100 to +100, calculated by subtracting the percentage of detractors from promoters.',
  },
  {
    question: 'How is NPS calculated?',
    answer: 'NPS is calculated by asking customers "How likely are you to recommend us?" on a 0-10 scale. Scores 9-10 are Promoters, 7-8 are Passives, and 0-6 are Detractors. NPS = % Promoters - % Detractors.',
  },
  {
    question: 'What is a good NPS score?',
    answer: 'Generally, 0-30 is good, 30-70 is great, and above 70 is excellent. However, benchmarks vary by industry. Any positive score means you have more promoters than detractors.',
  },
  {
    question: 'Who are Promoters, Passives, and Detractors?',
    answer: 'Promoters (9-10) are loyal enthusiasts who will keep buying and refer others. Passives (7-8) are satisfied but unenthusiastic customers. Detractors (0-6) are unhappy customers who can damage your brand.',
  },
  {
    question: 'Why are Passives not included in the NPS calculation?',
    answer: 'Passives are excluded because they are considered neutral. They are satisfied but not enthusiastic enough to actively promote your brand, nor dissatisfied enough to detract from it.',
  },
  {
    question: 'How often should I measure NPS?',
    answer: 'Most companies measure NPS quarterly or after key touchpoints like purchases or support interactions. Consistent measurement helps track trends and measure the impact of improvements.',
  },
];

export function NpsCalculator() {
  const { result, error, calculate, reset } = useNpsCalculator();
  const [responses, setResponses] = useState<Record<number, number>>({
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0,
  });

  const handleResponseChange = (score: number, value: string) => {
    const numValue = parseInt(value) || 0;
    setResponses((prev) => ({ ...prev, [score]: Math.max(0, numValue) }));
  };

  const handleCalculate = () => {
    calculate(responses);
  };

  const handleReset = () => {
    reset();
    setResponses({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 });
  };

  const getScoreColor = (score: number) => {
    if (score <= 6) return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700';
    if (score <= 8) return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700';
    return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'excellent': return 'text-green-600 dark:text-green-400';
      case 'great': return 'text-green-500 dark:text-green-400';
      case 'good': return 'text-yellow-600 dark:text-yellow-400';
      case 'needs-improvement': return 'text-orange-600 dark:text-orange-400';
      case 'critical': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'NPS Calculator',
    description: 'Calculate Net Promoter Score from survey responses. Get breakdown of promoters, passives, and detractors with score interpretation.',
    applicationCategory: 'BusinessApplication',
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
    <SiteLayout toolName="NPS Calculator" category="business-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Your Net Promoter Score
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Enter the number of responses for each score (0-10) from your NPS survey.
          </p>

          {/* Score Input Grid */}
          <div className="mb-6">
            <div className="grid grid-cols-11 gap-2 mb-2">
              {Array.from({ length: 11 }, (_, i) => (
                <div key={i} className="text-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{i}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-11 gap-2">
              {Array.from({ length: 11 }, (_, i) => (
                <div key={i} className={`rounded-lg border ${getScoreColor(i)}`}>
                  <input
                    type="number"
                    min="0"
                    value={responses[i] || ''}
                    onChange={(e) => handleResponseChange(i, e.target.value)}
                    placeholder="0"
                    className="w-full px-2 py-2 text-center bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs">
              <span className="text-red-600 dark:text-red-400">Detractors (0-6)</span>
              <span className="text-yellow-600 dark:text-yellow-400">Passives (7-8)</span>
              <span className="text-green-600 dark:text-green-400">Promoters (9-10)</span>
            </div>
          </div>

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
              Calculate NPS
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
              Your NPS Results
            </h3>

            {/* NPS Score Display */}
            <div className="text-center mb-6 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-6xl font-bold mb-2">
                <span className={getCategoryColor(result.category)}>{result.npsScore}</span>
              </div>
              <div className="text-lg text-gray-600 dark:text-gray-400">Net Promoter Score</div>
              <p className={`mt-4 ${getCategoryColor(result.category)}`}>{result.interpretation}</p>
            </div>

            {/* Visual Breakdown */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Response Breakdown</h4>
              <div className="h-8 flex rounded-lg overflow-hidden mb-4">
                {result.breakdown.detractorPercentage > 0 && (
                  <div
                    className="bg-red-500 flex items-center justify-center text-white text-sm font-medium"
                    style={{ width: `${result.breakdown.detractorPercentage}%` }}
                  >
                    {result.breakdown.detractorPercentage > 10 && `${result.breakdown.detractorPercentage}%`}
                  </div>
                )}
                {result.breakdown.passivePercentage > 0 && (
                  <div
                    className="bg-yellow-500 flex items-center justify-center text-white text-sm font-medium"
                    style={{ width: `${result.breakdown.passivePercentage}%` }}
                  >
                    {result.breakdown.passivePercentage > 10 && `${result.breakdown.passivePercentage}%`}
                  </div>
                )}
                {result.breakdown.promoterPercentage > 0 && (
                  <div
                    className="bg-green-500 flex items-center justify-center text-white text-sm font-medium"
                    style={{ width: `${result.breakdown.promoterPercentage}%` }}
                  >
                    {result.breakdown.promoterPercentage > 10 && `${result.breakdown.promoterPercentage}%`}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">{result.breakdown.detractors}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Detractors</div>
                  <div className="text-sm text-red-600 dark:text-red-400">{result.breakdown.detractorPercentage}%</div>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{result.breakdown.passives}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Passives</div>
                  <div className="text-sm text-yellow-600 dark:text-yellow-400">{result.breakdown.passivePercentage}%</div>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{result.breakdown.promoters}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Promoters</div>
                  <div className="text-sm text-green-600 dark:text-green-400">{result.breakdown.promoterPercentage}%</div>
                </div>
              </div>

              <div className="mt-4 text-center text-gray-600 dark:text-gray-400">
                Total Responses: <span className="font-semibold">{result.breakdown.totalResponses}</span>
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

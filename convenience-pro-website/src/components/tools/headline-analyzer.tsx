'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useHeadlineAnalyzer } from '@/hooks/useHeadlineAnalyzer';

const FEATURES = [
  {
    title: 'Comprehensive Scoring',
    description: 'Get a detailed 0-100 score based on proven headline writing principles and engagement factors.',
  },
  {
    title: 'Factor Breakdown',
    description: 'See exactly how word count, power words, emotional appeal, and structure affect your headline.',
  },
  {
    title: 'Actionable Suggestions',
    description: 'Receive specific recommendations to improve your headline and boost click-through rates.',
  },
];

const FAQS = [
  {
    question: 'How is the headline score calculated?',
    answer: 'The score is based on multiple factors: word count (ideal 6-12 words), presence of power words, emotional words, numbers, question format, proper structure, and readability. Each factor contributes to the final 0-100 score.',
  },
  {
    question: 'What are power words in headlines?',
    answer: 'Power words are persuasive words that trigger an emotional or psychological response. Examples include "proven", "ultimate", "secret", "exclusive", and "guaranteed". They help grab attention and increase clicks.',
  },
  {
    question: 'Why do numbers improve headlines?',
    answer: 'Numbers make headlines more specific and credible. Headlines like "7 Ways to..." or "5 Tips for..." set clear expectations and tend to get higher click-through rates than vague alternatives.',
  },
  {
    question: 'What is the ideal headline length?',
    answer: 'Research shows that headlines with 6-12 words perform best. This length is long enough to be descriptive but short enough to be easily scanned and remembered.',
  },
  {
    question: 'Should all headlines be questions?',
    answer: 'Not necessarily. Question headlines can be effective for engagement, but declarative statements and how-to formats also work well. The best format depends on your content and audience.',
  },
  {
    question: 'How can I improve a low-scoring headline?',
    answer: 'Follow the specific suggestions provided. Common improvements include adding a number, using power or emotional words, adjusting length to 6-12 words, and trying different formats like questions or colons.',
  },
];

function ScoreGauge({ score, grade }: { score: number; grade: string }) {
  const getColor = (s: number) => {
    if (s >= 80) return 'text-green-500';
    if (s >= 60) return 'text-yellow-500';
    if (s >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getBgColor = (s: number) => {
    if (s >= 80) return 'bg-green-500';
    if (s >= 60) return 'bg-yellow-500';
    if (s >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="text-center">
      <div className="relative inline-flex items-center justify-center w-32 h-32">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${score * 3.52} 352`}
            className={getColor(score)}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className={`text-3xl font-bold ${getColor(score)}`}>{score}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">/ 100</span>
        </div>
      </div>
      <div className={`mt-2 text-2xl font-bold ${getColor(score)}`}>Grade: {grade}</div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-4">
        <div className={`h-3 rounded-full ${getBgColor(score)}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

export function HeadlineAnalyzer() {
  const { result, analyze, reset } = useHeadlineAnalyzer();
  const [headline, setHeadline] = useState('');

  const handleAnalyze = () => {
    if (headline.trim()) {
      analyze(headline);
    }
  };

  const handleReset = () => {
    reset();
    setHeadline('');
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Headline Analyzer',
    description: 'Analyze and score your headlines for maximum engagement. Get detailed breakdowns and improvement suggestions.',
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
    <SiteLayout toolName="Headline Analyzer" category="text-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Analyze Your Headline
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter Your Headline
            </label>
            <textarea
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g., 7 Proven Ways to Boost Your Productivity Today"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Enter a headline for your blog post, article, or social media content
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAnalyze}
              disabled={!headline.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
            >
              Analyze Headline
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {result && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Analysis Results
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ScoreGauge score={result.score} grade={result.grade} />

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Score Breakdown</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Word Count ({result.breakdown.wordCount.value})</span>
                      <span className="font-medium text-gray-900 dark:text-white">{result.breakdown.wordCount.score}/20</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Power Words ({result.breakdown.powerWords.count})</span>
                      <span className="font-medium text-gray-900 dark:text-white">{result.breakdown.powerWords.score}/25</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Emotional Words ({result.breakdown.emotionalWords.count})</span>
                      <span className="font-medium text-gray-900 dark:text-white">{result.breakdown.emotionalWords.score}/20</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Contains Number</span>
                      <span className="font-medium text-gray-900 dark:text-white">{result.breakdown.numbers.score}/15</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Question Format</span>
                      <span className="font-medium text-gray-900 dark:text-white">{result.breakdown.questionFormat.score}/10</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Structure</span>
                      <span className="font-medium text-gray-900 dark:text-white">{result.breakdown.structure.score}/5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Readability</span>
                      <span className="font-medium text-gray-900 dark:text-white">{result.breakdown.readability.score}/5</span>
                    </div>
                  </div>
                </div>
              </div>

              {(result.breakdown.powerWords.words.length > 0 || result.breakdown.emotionalWords.words.length > 0) && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.breakdown.powerWords.words.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Power Words Found:</h5>
                        <div className="flex flex-wrap gap-2">
                          {result.breakdown.powerWords.words.map((word, i) => (
                            <span key={i} className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm rounded">
                              {word}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {result.breakdown.emotionalWords.words.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Emotional Words Found:</h5>
                        <div className="flex flex-wrap gap-2">
                          {result.breakdown.emotionalWords.words.map((word, i) => (
                            <span key={i} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-sm rounded">
                              {word}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Improvement Suggestions
              </h3>
              <ul className="space-y-2">
                {result.suggestions.map((suggestion, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">*</span>
                    <span className="text-gray-600 dark:text-gray-400">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

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

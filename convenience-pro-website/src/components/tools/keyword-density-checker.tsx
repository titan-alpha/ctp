'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useKeywordDensityChecker, KeywordStat } from '@/hooks/useKeywordDensityChecker';

const FEATURES = [
  {
    title: 'Comprehensive Analysis',
    description: 'Get detailed keyword frequency counts, density percentages, and text statistics in seconds.',
  },
  {
    title: 'Target Keyword Tracking',
    description: 'Track specific keywords or phrases to ensure optimal density for SEO performance.',
  },
  {
    title: 'Visual Word Cloud',
    description: 'See your most frequent keywords visualized with size based on their frequency.',
  },
];

const FAQS = [
  {
    question: 'What is keyword density?',
    answer: 'Keyword density is the percentage of times a keyword appears in your text compared to the total word count. It helps search engines understand what your content is about.',
  },
  {
    question: 'What is the ideal keyword density for SEO?',
    answer: 'Most SEO experts recommend a keyword density between 1-2% for your primary keyword. Going above 3% may be considered keyword stuffing and can harm your rankings.',
  },
  {
    question: 'Does keyword density still matter for SEO?',
    answer: 'While not as important as it once was, keyword density is still a factor. Modern SEO focuses more on natural language, user intent, and semantic relevance, but maintaining appropriate density helps search engines understand your topic.',
  },
  {
    question: 'What are stop words and why are they excluded?',
    answer: 'Stop words are common words like "the", "is", "at", "which", and "on" that are filtered out because they appear frequently but carry little meaning for keyword analysis.',
  },
  {
    question: 'How do I use this tool effectively?',
    answer: 'Paste your content, optionally enter a target keyword, and analyze. Review the density table for overused words and check if your target keyword is within the 1-2% range.',
  },
  {
    question: 'Can I analyze multi-word phrases?',
    answer: 'Yes! Enter multi-word phrases in the target keyword field to see how often that exact phrase appears in your content and its density percentage.',
  },
];

function WordCloud({ keywords }: { keywords: KeywordStat[] }) {
  if (keywords.length === 0) return null;

  const maxCount = Math.max(...keywords.map(k => k.count));
  const minSize = 14;
  const maxSize = 48;

  const getSize = (count: number) => {
    const ratio = count / maxCount;
    return minSize + (maxSize - minSize) * ratio;
  };

  const colors = [
    'text-blue-600 dark:text-blue-400',
    'text-green-600 dark:text-green-400',
    'text-purple-600 dark:text-purple-400',
    'text-orange-600 dark:text-orange-400',
    'text-pink-600 dark:text-pink-400',
    'text-teal-600 dark:text-teal-400',
    'text-indigo-600 dark:text-indigo-400',
    'text-red-600 dark:text-red-400',
  ];

  return (
    <div className="flex flex-wrap gap-3 justify-center items-center p-6 bg-gray-50 dark:bg-gray-900 rounded-lg min-h-[200px]">
      {keywords.slice(0, 30).map((keyword, index) => (
        <span
          key={keyword.keyword}
          className={`font-medium transition-transform hover:scale-110 cursor-default ${colors[index % colors.length]}`}
          style={{ fontSize: `${getSize(keyword.count)}px` }}
          title={`${keyword.keyword}: ${keyword.count} times (${keyword.density.toFixed(2)}%)`}
        >
          {keyword.keyword}
        </span>
      ))}
    </div>
  );
}

export function KeywordDensityChecker() {
  const { result, analyze, reset } = useKeywordDensityChecker();
  const [text, setText] = useState('');
  const [targetKeyword, setTargetKeyword] = useState('');

  const handleAnalyze = () => {
    if (text.trim()) {
      analyze(text, targetKeyword);
    }
  };

  const handleReset = () => {
    reset();
    setText('');
    setTargetKeyword('');
  };

  const getDensityColor = (density: number) => {
    if (density >= 3) return 'text-red-600 dark:text-red-400';
    if (density >= 1 && density <= 2) return 'text-green-600 dark:text-green-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Keyword Density Checker',
    description: 'Analyze your content for keyword frequency and density. Optimize your text for SEO with detailed keyword statistics.',
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
    <SiteLayout toolName="Keyword Density Checker" category="seo-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Analyze Your Content
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter Your Text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your article, blog post, or any text content here..."
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Target Keyword (Optional)
            </label>
            <input
              type="text"
              value={targetKeyword}
              onChange={(e) => setTargetKeyword(e.target.value)}
              placeholder="e.g., keyword density, SEO optimization"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Enter a specific keyword or phrase to track its density
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAnalyze}
              disabled={!text.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
            >
              Analyze Keywords
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
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Text Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{result.totalWords}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Words</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{result.uniqueWords}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Unique Words</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{result.characterCount}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Characters</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{result.sentenceCount}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Sentences</div>
                </div>
              </div>

              {result.targetKeywordStats && (
                <div className="mt-6 p-4 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Target Keyword Analysis</h4>
                  <div className="flex items-center gap-6">
                    <span className="text-gray-600 dark:text-gray-400">
                      &quot;{result.targetKeywordStats.keyword}&quot;
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {result.targetKeywordStats.count} occurrences
                    </span>
                    <span className={`font-bold ${getDensityColor(result.targetKeywordStats.density)}`}>
                      {result.targetKeywordStats.density.toFixed(2)}% density
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Word Cloud
              </h3>
              <WordCloud keywords={result.keywords} />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Keyword Density Table
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Rank</th>
                      <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Keyword</th>
                      <th className="text-center py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Count</th>
                      <th className="text-center py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Density</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.keywords.map((keyword, index) => (
                      <tr key={keyword.keyword} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{index + 1}</td>
                        <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{keyword.keyword}</td>
                        <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-400">{keyword.count}</td>
                        <td className={`py-3 px-4 text-center font-medium ${getDensityColor(keyword.density)}`}>
                          {keyword.density.toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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

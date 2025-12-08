'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useEngagementRateCalculator } from '@/hooks/useEngagementRateCalculator';

const PLATFORMS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
];

const FEATURES = [
  {
    title: 'Multi-Platform Support',
    description: 'Calculate engagement rates for Instagram, Facebook, Twitter, LinkedIn, TikTok, and YouTube.',
  },
  {
    title: 'Industry Benchmarks',
    description: 'Compare your engagement rate against platform-specific benchmarks to see how you perform.',
  },
  {
    title: 'Comprehensive Metrics',
    description: 'Factor in likes, comments, and shares to get an accurate engagement percentage.',
  },
];

const FAQS = [
  {
    question: 'What is engagement rate?',
    answer: 'Engagement rate measures the level of interaction your content receives relative to your audience size. It is calculated by dividing total engagements (likes, comments, shares) by your follower count and multiplying by 100.',
  },
  {
    question: 'What is a good engagement rate?',
    answer: 'A good engagement rate varies by platform. For Instagram, 3-6% is considered good. For Facebook and Twitter, 1-3% is good. TikTok tends to have higher rates, with 6-10% being good. Always compare within your specific platform and industry.',
  },
  {
    question: 'Why does engagement rate matter?',
    answer: 'Engagement rate indicates how well your content resonates with your audience. High engagement means your followers find your content valuable, which can lead to better reach, brand loyalty, and conversion rates.',
  },
  {
    question: 'How can I improve my engagement rate?',
    answer: 'Post consistently at optimal times, create valuable and shareable content, use relevant hashtags, engage with your audience through comments and DMs, and analyze what content performs best to refine your strategy.',
  },
  {
    question: 'Should I include saves and story views in engagement?',
    answer: 'This calculator uses the standard formula with likes, comments, and shares. Some marketers include saves (Instagram) or video views. The key is to be consistent with whatever metrics you choose to track.',
  },
  {
    question: 'Is engagement rate more important than follower count?',
    answer: 'Yes, engagement rate is often more valuable than raw follower count. A smaller, highly engaged audience typically delivers better results than a large, passive one. Brands increasingly prioritize engagement metrics when evaluating influencer partnerships.',
  },
];

const BENCHMARK_COLORS = {
  low: 'text-red-600 dark:text-red-400',
  average: 'text-yellow-600 dark:text-yellow-400',
  good: 'text-green-600 dark:text-green-400',
  excellent: 'text-blue-600 dark:text-blue-400',
};

export function EngagementRateCalculator() {
  const { result, error, calculate, reset } = useEngagementRateCalculator();
  const [platform, setPlatform] = useState('instagram');
  const [followers, setFollowers] = useState('');
  const [likes, setLikes] = useState('');
  const [comments, setComments] = useState('');
  const [shares, setShares] = useState('');

  const handleCalculate = () => {
    calculate(
      parseInt(followers) || 0,
      parseInt(likes) || 0,
      parseInt(comments) || 0,
      parseInt(shares) || 0,
      platform
    );
  };

  const handleReset = () => {
    reset();
    setFollowers('');
    setLikes('');
    setComments('');
    setShares('');
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Engagement Rate Calculator',
    description: 'Calculate social media engagement rate with platform-specific benchmarks for Instagram, Facebook, Twitter, LinkedIn, TikTok, and YouTube.',
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
    <SiteLayout toolName="Engagement Rate Calculator" category="social-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Engagement Rate
          </h2>

          {/* Platform Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Platform
            </label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPlatform(p.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    platform === p.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Metrics Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Followers
              </label>
              <input
                type="number"
                value={followers}
                onChange={(e) => setFollowers(e.target.value)}
                placeholder="10000"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Likes
              </label>
              <input
                type="number"
                value={likes}
                onChange={(e) => setLikes(e.target.value)}
                placeholder="500"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Comments
              </label>
              <input
                type="number"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="50"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Shares
              </label>
              <input
                type="number"
                value={shares}
                onChange={(e) => setShares(e.target.value)}
                placeholder="25"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
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
            <div className="text-center py-8">
              <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {result.engagementPercentage}%
              </div>
              <div className="text-gray-600 dark:text-gray-400 mb-4">
                Engagement Rate
              </div>
              <div className={`text-xl font-semibold ${BENCHMARK_COLORS[result.benchmark]}`}>
                {result.benchmarkLabel}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {result.totalEngagements.toLocaleString()}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Total Engagements</div>
              </div>
              <div className="text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {parseInt(followers).toLocaleString()}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Followers</div>
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

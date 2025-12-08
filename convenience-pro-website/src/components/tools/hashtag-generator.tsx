'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useHashtagGenerator, Platform, Niche } from '@/hooks/useHashtagGenerator';

const PLATFORMS: { value: Platform; label: string; limit: string }[] = [
  { value: 'instagram', label: 'Instagram', limit: '30 hashtags' },
  { value: 'twitter', label: 'Twitter/X', limit: '10 hashtags' },
  { value: 'tiktok', label: 'TikTok', limit: '5 hashtags' },
  { value: 'all', label: 'All Platforms', limit: '30 hashtags' },
];

const NICHES: { value: Niche; label: string }[] = [
  { value: 'general', label: 'General' },
  { value: 'fitness', label: 'Fitness & Health' },
  { value: 'food', label: 'Food & Cooking' },
  { value: 'travel', label: 'Travel' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'tech', label: 'Technology' },
  { value: 'business', label: 'Business' },
  { value: 'photography', label: 'Photography' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'beauty', label: 'Beauty' },
];

const FEATURES = [
  {
    title: 'Platform-Optimized',
    description: 'Generates hashtags tailored to Instagram, Twitter, or TikTok character and count limits.',
  },
  {
    title: 'Niche-Specific Tags',
    description: 'Get hashtags relevant to your industry or content niche for better engagement.',
  },
  {
    title: 'One-Click Copy',
    description: 'Easily copy all generated hashtags to paste directly into your social media posts.',
  },
];

const FAQS = [
  {
    question: 'How many hashtags should I use on Instagram?',
    answer: 'Instagram allows up to 30 hashtags per post. Studies suggest using 9-11 relevant hashtags for optimal engagement, but this can vary by niche and audience.',
  },
  {
    question: 'What is the difference between popular and niche hashtags?',
    answer: 'Popular hashtags have millions of posts and high visibility but lots of competition. Niche hashtags are more specific with fewer posts, giving your content a better chance to be discovered by targeted audiences.',
  },
  {
    question: 'How do I choose the right hashtags for my content?',
    answer: 'Mix popular, niche, and related hashtags. Use keywords that describe your content, target audience, and industry. Our generator helps create this mix automatically.',
  },
  {
    question: 'Should I use different hashtags for different platforms?',
    answer: 'Yes! Twitter works best with 1-2 hashtags, TikTok with 3-5, and Instagram can handle up to 30. Each platform has different character limits and audience behaviors.',
  },
  {
    question: 'Can I use the same hashtags on every post?',
    answer: 'It is best to vary your hashtags. Using the exact same set repeatedly can look spammy to algorithms. Rotate between related hashtags to reach different audiences.',
  },
  {
    question: 'How do hashtags help my content get discovered?',
    answer: 'Hashtags categorize your content and make it searchable. When users follow or search hashtags, your content can appear in their feeds, expanding your reach beyond your followers.',
  },
];

export function HashtagGenerator() {
  const { result, generate, reset, platformLimits } = useHashtagGenerator();
  const [keywords, setKeywords] = useState('');
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [niche, setNiche] = useState<Niche>('general');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (keywords.trim()) {
      generate(keywords, platform, niche);
    }
  };

  const handleReset = () => {
    reset();
    setKeywords('');
    setCopied(false);
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentLimit = platformLimits[platform];

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Hashtag Generator',
    description: 'Generate relevant hashtags for Instagram, Twitter, and TikTok to boost your social media reach.',
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
    <SiteLayout toolName="Hashtag Generator" category="generators">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Generate Hashtags
          </h2>

          {/* Keywords Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Keywords or Topic
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g., fitness, workout, gym, health"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Enter keywords separated by commas or spaces
            </p>
          </div>

          {/* Platform Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Platform
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {PLATFORMS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPlatform(p.value)}
                  className={`p-3 rounded-lg border-2 text-left transition-colors ${
                    platform === p.value
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-white">{p.label}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{p.limit}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Niche Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Niche / Industry
            </label>
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value as Niche)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {NICHES.map((n) => (
                <option key={n.value} value={n.value}>
                  {n.label}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleGenerate}
              disabled={!keywords.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
            >
              Generate Hashtags
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Generated Hashtags
              </h3>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {result.hashtags.length} / {currentLimit.maxHashtags} hashtags |{' '}
                <span className={result.totalCharacters > currentLimit.maxCharacters ? 'text-red-500' : ''}>
                  {result.totalCharacters} / {currentLimit.maxCharacters} characters
                </span>
              </div>
            </div>

            {/* All Hashtags with Copy */}
            <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">All Hashtags</span>
                <button
                  onClick={() => handleCopy(result.formatted)}
                  className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy All'}
                </button>
              </div>
              <p className="text-gray-900 dark:text-white break-words">{result.formatted}</p>
            </div>

            {/* Categorized Hashtags */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-green-700 dark:text-green-400">Popular</h4>
                  <button
                    onClick={() => handleCopy(result.popular.join(' '))}
                    className="text-xs text-green-600 hover:text-green-800"
                  >
                    Copy
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {result.popular.map((tag, i) => (
                    <span key={i} className="text-sm text-gray-700 dark:text-gray-300">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-blue-700 dark:text-blue-400">Niche</h4>
                  <button
                    onClick={() => handleCopy(result.niche.join(' '))}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Copy
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {result.niche.map((tag, i) => (
                    <span key={i} className="text-sm text-gray-700 dark:text-gray-300">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-purple-700 dark:text-purple-400">Related</h4>
                  <button
                    onClick={() => handleCopy(result.related.join(' '))}
                    className="text-xs text-purple-600 hover:text-purple-800"
                  >
                    Copy
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {result.related.map((tag, i) => (
                    <span key={i} className="text-sm text-gray-700 dark:text-gray-300">{tag}</span>
                  ))}
                </div>
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

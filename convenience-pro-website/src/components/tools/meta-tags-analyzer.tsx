'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useMetaTagsAnalyzer } from '@/hooks/useMetaTagsAnalyzer';

const FEATURES = [
  {
    title: 'Complete Tag Analysis',
    description: 'Analyze all essential meta tags including title, description, Open Graph, and Twitter cards in one scan.',
  },
  {
    title: 'Length Validation',
    description: 'Get real-time feedback on title and description lengths with optimal range recommendations.',
  },
  {
    title: 'SEO Score',
    description: 'Receive an overall SEO score from 0-100 with actionable suggestions to improve your meta tags.',
  },
];

const FAQS = [
  {
    question: 'What are meta tags and why are they important?',
    answer: 'Meta tags are HTML elements that provide information about a webpage to search engines and social media platforms. They affect how your page appears in search results and social shares, impacting click-through rates and SEO.',
  },
  {
    question: 'What is the ideal length for a title tag?',
    answer: 'The ideal title tag length is between 30-60 characters. Titles longer than 60 characters may be truncated in search results, while shorter titles may not be descriptive enough.',
  },
  {
    question: 'What is the ideal length for a meta description?',
    answer: 'Meta descriptions should be between 120-160 characters. This ensures the full description is visible in search results while providing enough detail to entice users to click.',
  },
  {
    question: 'What are Open Graph tags?',
    answer: 'Open Graph (OG) tags control how your content appears when shared on social media platforms like Facebook and LinkedIn. Key OG tags include og:title, og:description, og:image, and og:url.',
  },
  {
    question: 'What Twitter Card tags should I use?',
    answer: 'Essential Twitter Card tags include twitter:card (use "summary_large_image" for best visibility), twitter:title, twitter:description, and twitter:image. These control how your content appears when shared on Twitter.',
  },
  {
    question: 'How do I use this meta tags analyzer?',
    answer: 'You can either paste your HTML source code directly into the text area or enter a URL to fetch and analyze. The tool will scan for all important meta tags and provide detailed feedback on what is present, missing, or needs improvement.',
  },
];

function StatusIcon({ status }: { status: 'present' | 'missing' | 'warning' }) {
  if (status === 'present') {
    return (
      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    );
  }
  if (status === 'warning') {
    return (
      <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    );
  }
  return (
    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

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

function LengthBar({ current, min, max, status }: { current: number; min: number; max: number; status: 'good' | 'short' | 'long' }) {
  const percentage = Math.min((current / max) * 100, 150);
  const getColor = () => {
    if (status === 'good') return 'bg-green-500';
    if (status === 'short') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
        <span>{min} min</span>
        <span>{current} chars</span>
        <span>{max} max</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div className={`h-2 rounded-full ${getColor()}`} style={{ width: `${Math.min(percentage, 100)}%` }} />
      </div>
    </div>
  );
}

export function MetaTagsAnalyzer() {
  const { result, isLoading, error, analyzeHtml, analyzeUrl, reset } = useMetaTagsAnalyzer();
  const [inputType, setInputType] = useState<'html' | 'url'>('html');
  const [htmlInput, setHtmlInput] = useState('');
  const [urlInput, setUrlInput] = useState('');

  const handleAnalyze = () => {
    if (inputType === 'html') {
      analyzeHtml(htmlInput);
    } else {
      analyzeUrl(urlInput);
    }
  };

  const handleReset = () => {
    reset();
    setHtmlInput('');
    setUrlInput('');
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Meta Tags Analyzer',
    description: 'Analyze and validate meta tags for SEO optimization. Check title, description, Open Graph, and Twitter cards.',
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

  const basicTags = result ? [result.title, result.description, result.canonical, result.robots, result.viewport, result.charset] : [];
  const ogTags = result ? [result.ogTitle, result.ogDescription, result.ogImage, result.ogUrl, result.ogType] : [];
  const twitterTags = result ? [result.twitterCard, result.twitterTitle, result.twitterDescription, result.twitterImage] : [];

  return (
    <SiteLayout toolName="Meta Tags Analyzer" category="seo-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Analyze Meta Tags
          </h2>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setInputType('html')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                inputType === 'html'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Paste HTML
            </button>
            <button
              onClick={() => setInputType('url')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                inputType === 'url'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Enter URL
            </button>
          </div>

          {inputType === 'html' ? (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Paste HTML Source Code
              </label>
              <textarea
                value={htmlInput}
                onChange={(e) => setHtmlInput(e.target.value)}
                placeholder="<!DOCTYPE html><html><head>..."
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm resize-none"
              />
            </div>
          ) : (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter Website URL
              </label>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleAnalyze}
              disabled={isLoading || (inputType === 'html' ? !htmlInput.trim() : !urlInput.trim())}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
            >
              {isLoading ? 'Analyzing...' : 'Analyze Meta Tags'}
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
              <div className="flex justify-center mb-8">
                <ScoreGauge score={result.overallScore} grade={result.grade} />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Basic Meta Tags
              </h3>
              <div className="space-y-4">
                {basicTags.map((tag, i) => (
                  <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <StatusIcon status={tag.status} />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-gray-900 dark:text-white">{tag.name}</h4>
                          <span className={`text-xs px-2 py-1 rounded ${
                            tag.status === 'present' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                            tag.status === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                            'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                          }`}>
                            {tag.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{tag.message}</p>
                        {tag.content && (
                          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 font-mono bg-gray-50 dark:bg-gray-900 p-2 rounded break-all">
                            {tag.content}
                          </p>
                        )}
                        {'length' in tag && tag.length && (
                          <LengthBar {...tag.length} />
                        )}
                        {tag.recommendation && (
                          <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                            Recommendation: {tag.recommendation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Open Graph Tags
              </h3>
              <div className="space-y-4">
                {ogTags.map((tag, i) => (
                  <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <StatusIcon status={tag.status} />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-gray-900 dark:text-white">{tag.name}</h4>
                          <span className={`text-xs px-2 py-1 rounded ${
                            tag.status === 'present' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                            'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                          }`}>
                            {tag.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{tag.message}</p>
                        {tag.content && (
                          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 font-mono bg-gray-50 dark:bg-gray-900 p-2 rounded break-all">
                            {tag.content}
                          </p>
                        )}
                        {tag.recommendation && (
                          <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                            Recommendation: {tag.recommendation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Twitter Card Tags
              </h3>
              <div className="space-y-4">
                {twitterTags.map((tag, i) => (
                  <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <StatusIcon status={tag.status} />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-gray-900 dark:text-white">{tag.name}</h4>
                          <span className={`text-xs px-2 py-1 rounded ${
                            tag.status === 'present' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                            'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                          }`}>
                            {tag.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{tag.message}</p>
                        {tag.content && (
                          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 font-mono bg-gray-50 dark:bg-gray-900 p-2 rounded break-all">
                            {tag.content}
                          </p>
                        )}
                        {tag.recommendation && (
                          <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                            Recommendation: {tag.recommendation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
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

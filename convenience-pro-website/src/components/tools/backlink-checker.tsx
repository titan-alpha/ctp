'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useBacklinkChecker } from '@/hooks/useBacklinkChecker';

const FEATURES = [
  {
    title: 'Domain Analysis',
    description: 'Extract comprehensive domain information including subdomains, TLD, protocol, and security status.',
  },
  {
    title: 'Simulated Metrics',
    description: 'View estimated domain authority, page authority, backlink counts, and trust metrics for demo purposes.',
  },
  {
    title: 'SEO Recommendations',
    description: 'Get actionable suggestions to improve your backlink profile and overall SEO health.',
  },
];

const FAQS = [
  {
    question: 'What is a backlink checker?',
    answer: 'A backlink checker is an SEO tool that analyzes the incoming links pointing to a website. It helps you understand your link profile, identify link opportunities, and monitor your backlink health.',
  },
  {
    question: 'Why are backlinks important for SEO?',
    answer: 'Backlinks are one of the most important ranking factors for search engines. Quality backlinks from authoritative sites signal trust and relevance, helping your pages rank higher in search results.',
  },
  {
    question: 'What is domain authority?',
    answer: 'Domain Authority (DA) is a search engine ranking score that predicts how likely a website is to rank in search results. It ranges from 1 to 100, with higher scores indicating greater ranking potential.',
  },
  {
    question: 'What is the difference between trust flow and citation flow?',
    answer: 'Trust Flow measures the quality of links pointing to a site based on their trustworthiness. Citation Flow measures the quantity of links. A healthy site typically has balanced trust and citation flow scores.',
  },
  {
    question: 'How can I improve my backlink profile?',
    answer: 'Focus on creating high-quality content that naturally attracts links, reach out for guest posting opportunities, build relationships with industry influencers, and regularly audit your links to disavow spammy ones.',
  },
  {
    question: 'Are the metrics in this tool accurate?',
    answer: 'This tool provides simulated metrics for demonstration purposes. For accurate, real-time backlink data, you would need to use premium SEO tools with API access to comprehensive link databases.',
  },
];

function MetricCard({ label, value, maxValue, suffix = '' }: { label: string; value: number; maxValue?: number; suffix?: string }) {
  const percentage = maxValue ? (value / maxValue) * 100 : null;

  const getColor = (pct: number) => {
    if (pct >= 70) return 'bg-green-500';
    if (pct >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">
        {typeof value === 'number' ? value.toLocaleString() : value}{suffix}
      </div>
      {percentage !== null && (
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
          <div className={`h-2 rounded-full ${getColor(percentage)}`} style={{ width: `${Math.min(percentage, 100)}%` }} />
        </div>
      )}
    </div>
  );
}

export function BacklinkChecker() {
  const { result, isLoading, error, analyze, reset } = useBacklinkChecker();
  const [url, setUrl] = useState('');

  const handleAnalyze = () => {
    if (url.trim()) {
      analyze(url);
    }
  };

  const handleReset = () => {
    reset();
    setUrl('');
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Backlink Checker',
    description: 'Analyze your website backlink profile with domain authority, trust metrics, and SEO recommendations.',
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
    <SiteLayout toolName="Backlink Checker" category="seo-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Check Backlinks
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter URL to Analyze
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              placeholder="e.g., example.com or https://example.com/page"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Enter a domain or full URL to analyze its backlink profile
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleAnalyze}
              disabled={!url.trim() || isLoading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
            >
              {isLoading ? 'Analyzing...' : 'Analyze Backlinks'}
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
                Domain Information
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Domain</span>
                  <p className="font-medium text-gray-900 dark:text-white">{result.domainInfo.domain}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Protocol</span>
                  <p className="font-medium text-gray-900 dark:text-white">{result.domainInfo.protocol.toUpperCase()}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">TLD</span>
                  <p className="font-medium text-gray-900 dark:text-white">.{result.domainInfo.tld}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Secure</span>
                  <p className={`font-medium ${result.domainInfo.isSecure ? 'text-green-600' : 'text-red-600'}`}>
                    {result.domainInfo.isSecure ? 'Yes (HTTPS)' : 'No (HTTP)'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Backlink Metrics (Simulated)
              </h3>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Note: These metrics are simulated for demonstration. Full backlink analysis requires API integration with SEO data providers.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard label="Domain Authority" value={result.metrics.domainAuthority} maxValue={100} />
                <MetricCard label="Page Authority" value={result.metrics.pageAuthority} maxValue={100} />
                <MetricCard label="Est. Backlinks" value={result.metrics.estimatedBacklinks} />
                <MetricCard label="Referring Domains" value={result.metrics.referringDomains} />
                <MetricCard label="Trust Flow" value={result.metrics.trustFlow} maxValue={100} />
                <MetricCard label="Citation Flow" value={result.metrics.citationFlow} maxValue={100} />
                <MetricCard label="Spam Score" value={result.metrics.spamScore} maxValue={100} suffix="%" />
                <MetricCard label="Nofollow Links" value={result.linkStructure.nofollowPercentage} suffix="%" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                SEO Recommendations
              </h3>
              <ul className="space-y-2">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">*</span>
                    <span className="text-gray-600 dark:text-gray-400">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 mb-8 text-white">
              <h3 className="text-xl font-bold mb-2">Need Real Backlink Data?</h3>
              <p className="mb-4 opacity-90">
                For accurate, comprehensive backlink analysis with real-time data, consider integrating with professional SEO APIs like Moz, Ahrefs, or Majestic.
              </p>
              <button className="px-6 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors">
                Learn About API Integration
              </button>
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

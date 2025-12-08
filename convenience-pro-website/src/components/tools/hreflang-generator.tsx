'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import {
  useHreflangGenerator,
  COMMON_LANGUAGES,
  LANGUAGE_PRESETS,
} from '@/hooks/useHreflangGenerator';

const FEATURES = [
  {
    title: 'Language-Region Support',
    description:
      'Full support for ISO language codes including regional variants like en-US, en-GB, es-MX, and zh-CN.',
  },
  {
    title: 'x-default Option',
    description:
      'Include the x-default hreflang tag to specify a fallback URL for users whose language is not targeted.',
  },
  {
    title: 'Quick Presets',
    description:
      'Use pre-configured language sets for European, North American, Asian markets, or global basics.',
  },
];

const FAQS = [
  {
    question: 'What are hreflang tags?',
    answer:
      'Hreflang tags are HTML attributes that tell search engines which language and regional URL to serve to users. They help prevent duplicate content issues and ensure users see the correct language version of your page.',
  },
  {
    question: 'When should I use hreflang tags?',
    answer:
      'Use hreflang tags when your website has multiple language versions or regional variations of the same content. This includes translated pages, regional pricing pages, or content customized for different countries.',
  },
  {
    question: 'What is x-default hreflang?',
    answer:
      'The x-default hreflang value specifies a fallback URL for users whose language or region is not specifically targeted by any other hreflang tag. It is typically set to your main or international version of the page.',
  },
  {
    question: 'Where should I place hreflang tags?',
    answer:
      'Hreflang tags should be placed in the <head> section of your HTML document. Alternatively, you can implement them via HTTP headers or in your XML sitemap.',
  },
  {
    question: 'Do hreflang tags need to be reciprocal?',
    answer:
      'Yes, hreflang tags must be reciprocal. If page A references page B with hreflang, page B must also reference page A. Missing reciprocal links can cause search engines to ignore the tags.',
  },
  {
    question: 'What is the correct hreflang format?',
    answer:
      'Hreflang uses ISO 639-1 language codes (e.g., en, es, fr) optionally combined with ISO 3166-1 Alpha-2 country codes (e.g., en-US, es-MX). The language code is required, the region code is optional.',
  },
];

export function HreflangGenerator() {
  const {
    entries,
    includeXDefault,
    xDefaultUrl,
    generatedTags,
    addEntry,
    removeEntry,
    updateEntry,
    setIncludeXDefault,
    setXDefaultUrl,
    applyPreset,
    generate,
    reset,
  } = useHreflangGenerator();

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedTags);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Hreflang Tag Generator',
    description:
      'Generate hreflang tags for multilingual and multi-regional websites to improve international SEO.',
    applicationCategory: 'DeveloperApplication',
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
    <SiteLayout toolName="Hreflang Tag Generator" category="seo-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Generate Hreflang Tags
          </h2>

          {/* Presets */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quick Presets
            </label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGE_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Language Rows */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Language URLs
            </label>
            <div className="space-y-3">
              {entries.map((entry) => (
                <div key={entry.id} className="flex gap-3 items-center">
                  <select
                    value={entry.langCode}
                    onChange={(e) => updateEntry(entry.id, 'langCode', e.target.value)}
                    className="w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select language</option>
                    {COMMON_LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.label} ({lang.code})
                      </option>
                    ))}
                  </select>
                  <input
                    type="url"
                    value={entry.url}
                    onChange={(e) => updateEntry(entry.id, 'url', e.target.value)}
                    placeholder="https://example.com/page"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  {entries.length > 1 && (
                    <button
                      onClick={() => removeEntry(entry.id)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={addEntry}
              className="mt-3 px-4 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              + Add Language
            </button>
          </div>

          {/* x-default Option */}
          <div className="mb-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={includeXDefault}
                onChange={(e) => setIncludeXDefault(e.target.checked)}
                className="mr-2 w-4 h-4 text-blue-600"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Include x-default (fallback URL)
              </span>
            </label>
            {includeXDefault && (
              <input
                type="url"
                value={xDefaultUrl}
                onChange={(e) => setXDefaultUrl(e.target.value)}
                placeholder="https://example.com/default-page"
                className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={generate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Generate Tags
            </button>
            <button
              onClick={reset}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Generated Output */}
        {generatedTags && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Generated Hreflang Tags
              </h3>
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-auto max-h-96 text-sm text-gray-800 dark:text-gray-200">
              {generatedTags}
            </pre>
          </div>
        )}

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {FEATURES.map((feature, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
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

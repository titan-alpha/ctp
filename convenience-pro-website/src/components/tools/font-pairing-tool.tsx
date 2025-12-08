'use client';

import { useState, useCallback } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useFontPairingTool, FontPair, FontCategory } from '@/hooks/useFontPairingTool';

const CATEGORIES: { value: FontCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Styles' },
  { value: 'serif-sans', label: 'Serif + Sans' },
  { value: 'modern', label: 'Modern' },
  { value: 'classic', label: 'Classic' },
  { value: 'playful', label: 'Playful' },
];

const FEATURES = [
  {
    title: 'Curated Pairings',
    description: 'Professionally selected font combinations that work beautifully together for any project.',
  },
  {
    title: 'Google Fonts Ready',
    description: 'All fonts are available on Google Fonts. Copy the import link and start using them instantly.',
  },
  {
    title: 'Live Preview',
    description: 'See exactly how your text will look with each font pairing before you commit.',
  },
];

const FAQS = [
  {
    question: 'What makes a good font pairing?',
    answer: 'Good font pairings have contrast without conflict. Typically, you want fonts with different characteristics (like serif + sans-serif) but similar proportions and mood. The heading font should be distinctive while the body font should be highly readable.',
  },
  {
    question: 'How many fonts should I use on a website?',
    answer: 'Most designers recommend using 2-3 fonts maximum. One for headings, one for body text, and optionally one for accents or special elements. Too many fonts can make your design look cluttered and unprofessional.',
  },
  {
    question: 'Are these fonts free to use?',
    answer: 'Yes! All font pairings in this tool use Google Fonts, which are free for personal and commercial use. Simply copy the provided link or CSS import to add them to your project.',
  },
  {
    question: 'What is the difference between serif and sans-serif fonts?',
    answer: 'Serif fonts have small decorative strokes (serifs) at the ends of letters, giving them a traditional, elegant look. Sans-serif fonts lack these strokes, appearing cleaner and more modern. Pairing both creates visual contrast.',
  },
  {
    question: 'How do I add Google Fonts to my website?',
    answer: 'You can add Google Fonts in two ways: 1) Add the HTML link tag to your document head, or 2) Use the CSS @import statement at the top of your stylesheet. Both methods work well; the link tag is slightly faster.',
  },
  {
    question: 'Can I customize the font weights?',
    answer: 'Absolutely! The Google Fonts links provided include the recommended weights, but you can modify them to include additional weights by editing the URL parameters (e.g., wght@400;500;600;700).',
  },
];

export function FontPairingTool() {
  const {
    filteredPairs,
    selectedCategory,
    selectedPair,
    previewText,
    setSelectedCategory,
    setSelectedPair,
    setPreviewText,
    getGoogleFontsLink,
    getCSSImport,
    getCSSVariables,
  } = useFontPairingTool();

  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleCopy = useCallback(async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  }, []);

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Font Pairing Tool',
    description: 'Find perfect font combinations for your website. Browse curated pairings with live preview and copy Google Fonts code.',
    applicationCategory: 'DesignApplication',
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
    <SiteLayout toolName="Font Pairing Tool" category="design-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Find Your Perfect Font Pairing
          </h2>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === cat.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Preview Text Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preview Text
            </label>
            <input
              type="text"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              placeholder="Enter preview text..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Font Pair Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {filteredPairs.map((pair) => (
              <FontPairCard
                key={pair.id}
                pair={pair}
                previewText={previewText}
                isSelected={selectedPair?.id === pair.id}
                onSelect={() => setSelectedPair(selectedPair?.id === pair.id ? null : pair)}
              />
            ))}
          </div>

          {/* Selected Pair Details */}
          {selectedPair && (
            <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-6 bg-blue-50 dark:bg-blue-900/20">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {selectedPair.name} - Code Snippets
              </h3>

              <div className="space-y-4">
                {/* Google Fonts Link */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">HTML Link</span>
                    <button
                      onClick={() => handleCopy(getGoogleFontsLink(selectedPair), 'link')}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {copiedType === 'link' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
                    {getGoogleFontsLink(selectedPair)}
                  </pre>
                </div>

                {/* CSS Import */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">CSS Import</span>
                    <button
                      onClick={() => handleCopy(getCSSImport(selectedPair), 'import')}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {copiedType === 'import' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
                    {getCSSImport(selectedPair)}
                  </pre>
                </div>

                {/* CSS Variables */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">CSS Variables</span>
                    <button
                      onClick={() => handleCopy(getCSSVariables(selectedPair), 'css')}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {copiedType === 'css' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
                    {getCSSVariables(selectedPair)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

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

interface FontPairCardProps {
  pair: FontPair;
  previewText: string;
  isSelected: boolean;
  onSelect: () => void;
}

function FontPairCard({ pair, previewText, isSelected, onSelect }: FontPairCardProps) {
  // Load Google Fonts dynamically
  const googleFontsUrl = (() => {
    const fonts: string[] = [];
    if (pair.heading.googleName) fonts.push(pair.heading.googleName);
    if (pair.body.googleName) fonts.push(pair.body.googleName);
    if (fonts.length === 0) return null;
    return `https://fonts.googleapis.com/css2?family=${fonts.join('&family=')}&display=swap`;
  })();

  return (
    <>
      {googleFontsUrl && (
        <link href={googleFontsUrl} rel="stylesheet" />
      )}
      <div
        onClick={onSelect}
        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
          isSelected
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
        }`}
      >
        <div className="mb-3">
          <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
            {pair.category.replace('-', ' + ')}
          </span>
        </div>

        <h3
          className="text-2xl mb-2 text-gray-900 dark:text-white"
          style={{ fontFamily: `'${pair.heading.family}', serif`, fontWeight: pair.heading.weight }}
        >
          {previewText || 'Heading Preview'}
        </h3>

        <p
          className="text-base text-gray-600 dark:text-gray-400 mb-3"
          style={{ fontFamily: `'${pair.body.family}', sans-serif`, fontWeight: pair.body.weight }}
        >
          {previewText || 'Body text preview with this font pairing.'}
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">
          {pair.description}
        </p>

        <div className="flex flex-wrap gap-1">
          {pair.bestFor.map((use, i) => (
            <span
              key={i}
              className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
            >
              {use}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

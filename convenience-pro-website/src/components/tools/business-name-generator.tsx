'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useBusinessNameGenerator, NameStyle, Industry } from '@/hooks/useBusinessNameGenerator';

const INDUSTRIES: { value: Industry; label: string }[] = [
  { value: 'technology', label: 'Technology' },
  { value: 'food', label: 'Food & Beverage' },
  { value: 'fashion', label: 'Fashion & Apparel' },
  { value: 'health', label: 'Health & Wellness' },
  { value: 'finance', label: 'Finance & Banking' },
  { value: 'creative', label: 'Creative & Design' },
  { value: 'retail', label: 'Retail & E-commerce' },
  { value: 'services', label: 'Professional Services' },
];

const STYLES: { value: NameStyle; label: string; description: string }[] = [
  { value: 'modern', label: 'Modern', description: 'Clean, minimal, contemporary' },
  { value: 'classic', label: 'Classic', description: 'Traditional, professional, timeless' },
  { value: 'playful', label: 'Playful', description: 'Fun, friendly, approachable' },
  { value: 'tech', label: 'Tech', description: 'Digital, innovative, futuristic' },
];

const FEATURES = [
  {
    title: 'Multiple Naming Styles',
    description: 'Choose from modern, classic, playful, or tech-focused naming styles to match your brand personality.',
  },
  {
    title: 'Industry-Tailored Names',
    description: 'Get name suggestions specifically optimized for your industry with relevant terminology and feel.',
  },
  {
    title: 'Save Your Favorites',
    description: 'Mark names you love as favorites to easily compare and shortlist your top choices.',
  },
];

const FAQS = [
  {
    question: 'How does the business name generator work?',
    answer: 'Our generator combines your keywords with industry-specific terms, prefixes, and suffixes based on your selected naming style to create unique, memorable business name suggestions.',
  },
  {
    question: 'Can I use the generated names for my business?',
    answer: 'Yes, the generated names are suggestions you can use. However, we recommend checking trademark availability and domain registration before finalizing your choice.',
  },
  {
    question: 'What makes a good business name?',
    answer: 'A good business name is memorable, easy to spell and pronounce, relevant to your industry, and available as a domain name and trademark.',
  },
  {
    question: 'How many keywords should I enter?',
    answer: 'We recommend entering 1-3 keywords that best describe your business, product, or values. More specific keywords yield more relevant results.',
  },
  {
    question: 'Why should I check trademark availability?',
    answer: 'Using a trademarked name can lead to legal issues and forced rebranding. Always verify your chosen name is not already trademarked in your industry.',
  },
  {
    question: 'Can I generate more names?',
    answer: 'Yes! Simply click the Generate button again to get a fresh batch of name suggestions based on your inputs.',
  },
];

export function BusinessNameGenerator() {
  const { names, isGenerating, generate, toggleFavorite, favorites, reset } = useBusinessNameGenerator();

  const [keywordInput, setKeywordInput] = useState('');
  const [industry, setIndustry] = useState<Industry>('technology');
  const [style, setStyle] = useState<NameStyle>('modern');

  const handleGenerate = () => {
    const keywords = keywordInput.split(',').map(k => k.trim()).filter(k => k.length > 0);
    if (keywords.length > 0) {
      generate(keywords, industry, style);
    }
  };

  const handleReset = () => {
    reset();
    setKeywordInput('');
  };

  const copyToClipboard = (name: string) => {
    navigator.clipboard.writeText(name);
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Business Name Generator',
    description: 'Generate unique and creative business names based on your keywords, industry, and preferred naming style.',
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
    <SiteLayout toolName="Business Name Generator" category="generators">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Generate Business Names
          </h2>

          {/* Keyword Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Keywords (comma-separated)
            </label>
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="e.g., swift, cloud, digital"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Enter 1-3 keywords that describe your business
            </p>
          </div>

          {/* Industry Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Industry
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value as Industry)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {INDUSTRIES.map((ind) => (
                <option key={ind.value} value={ind.value}>
                  {ind.label}
                </option>
              ))}
            </select>
          </div>

          {/* Style Preference */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Naming Style
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {STYLES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStyle(s.value)}
                  className={`p-3 rounded-lg border-2 text-left transition-colors ${
                    style === s.value
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-white">{s.label}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{s.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleGenerate}
              disabled={!keywordInput.trim() || isGenerating}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
            >
              {isGenerating ? 'Generating...' : 'Generate Names'}
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Generated Names Grid */}
        {names.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Generated Names ({names.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {names.map((name) => (
                <div
                  key={name.id}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    name.isFavorite
                      ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
                      : 'border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {name.name}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleFavorite(name.id)}
                        className={`p-1 rounded transition-colors ${
                          name.isFavorite
                            ? 'text-yellow-500'
                            : 'text-gray-400 hover:text-yellow-500'
                        }`}
                        title={name.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => copyToClipboard(name.name)}
                        className="p-1 rounded text-gray-400 hover:text-blue-500 transition-colors"
                        title="Copy to clipboard"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Your Favorites ({favorites.length})
            </h3>
            <div className="flex flex-wrap gap-3">
              {favorites.map((name) => (
                <div
                  key={name.id}
                  className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 rounded-lg font-medium text-gray-900 dark:text-white"
                >
                  {name.name}
                </div>
              ))}
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

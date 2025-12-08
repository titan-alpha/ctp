'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useRhymeFinder, countSyllables } from '@/hooks/useRhymeFinder';

type TabType = 'perfect' | 'near' | 'slant';

const TABS: { value: TabType; label: string; description: string }[] = [
  { value: 'perfect', label: 'Perfect Rhymes', description: 'Words with identical ending sounds' },
  { value: 'near', label: 'Near Rhymes', description: 'Words with similar but not identical sounds' },
  { value: 'slant', label: 'Slant Rhymes', description: 'Words with related consonant patterns' },
];

const SYLLABLE_OPTIONS = [
  { value: 0, label: 'All Syllables' },
  { value: 1, label: '1 Syllable' },
  { value: 2, label: '2 Syllables' },
  { value: 3, label: '3 Syllables' },
  { value: 4, label: '4+ Syllables' },
];

const FEATURES = [
  {
    title: 'Multiple Rhyme Types',
    description: 'Find perfect, near, and slant rhymes to expand your creative options for poetry and lyrics.',
  },
  {
    title: 'Syllable Filtering',
    description: 'Filter results by syllable count to match your meter and rhythm requirements.',
  },
  {
    title: 'One-Click Copy',
    description: 'Click any word to instantly copy it to your clipboard for quick use in your writing.',
  },
];

const FAQS = [
  {
    question: 'What is a perfect rhyme?',
    answer: 'A perfect rhyme (also called exact rhyme) occurs when the ending sounds of two words match exactly, including the vowel and any following consonants. Examples: cat/hat, love/dove, night/light.',
  },
  {
    question: 'What is a near rhyme?',
    answer: 'A near rhyme (also called half rhyme) occurs when words have similar but not identical ending sounds. The vowels or consonants may differ slightly. Examples: love/move, heart/hurt.',
  },
  {
    question: 'What is a slant rhyme?',
    answer: 'A slant rhyme (also called oblique rhyme) involves words that share some sounds but do not rhyme perfectly. They often share consonant sounds or have similar rhythmic patterns. Examples: soul/all, worm/swarm.',
  },
  {
    question: 'Why use different types of rhymes?',
    answer: 'Using varied rhyme types adds depth and sophistication to your writing. Perfect rhymes create strong connections, while near and slant rhymes add subtlety and avoid predictability in poetry and songs.',
  },
  {
    question: 'How does syllable filtering help?',
    answer: 'Syllable filtering helps you find rhymes that match your desired meter. If you need a two-syllable word to maintain rhythm, filtering ensures all suggestions fit your structure.',
  },
  {
    question: 'Can I use this for songwriting?',
    answer: 'Absolutely! This tool is perfect for songwriters, poets, rappers, and anyone who needs to find rhyming words. The variety of rhyme types helps create more interesting and varied lyrics.',
  },
];

export function RhymeFinder() {
  const { result, findRhymes, reset } = useRhymeFinder();
  const [word, setWord] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('perfect');
  const [syllableFilter, setSyllableFilter] = useState(0);
  const [copiedWord, setCopiedWord] = useState<string | null>(null);

  const handleSearch = () => {
    if (word.trim()) {
      findRhymes(word, syllableFilter || null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleReset = () => {
    reset();
    setWord('');
    setSyllableFilter(0);
    setCopiedWord(null);
  };

  const handleCopyWord = async (wordToCopy: string) => {
    await navigator.clipboard.writeText(wordToCopy);
    setCopiedWord(wordToCopy);
    setTimeout(() => setCopiedWord(null), 1500);
  };

  const getResultsForTab = (): string[] => {
    if (!result) return [];
    return result[activeTab] || [];
  };

  const currentResults = getResultsForTab();

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Rhyme Finder',
    description: 'Find perfect, near, and slant rhymes for any word. Ideal for poets, songwriters, and creative writers.',
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
    <SiteLayout toolName="Rhyme Finder" category="text-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Find Rhyming Words
          </h2>

          {/* Word Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter a Word
            </label>
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., love, night, rain"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Syllable Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by Syllables
            </label>
            <select
              value={syllableFilter}
              onChange={(e) => setSyllableFilter(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {SYLLABLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSearch}
              disabled={!word.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
            >
              Find Rhymes
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
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
              {TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 -mb-px ${
                    activeTab === tab.value
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                    {result[tab.value]?.length || 0}
                  </span>
                </button>
              ))}
            </div>

            {/* Tab Description */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {TABS.find(t => t.value === activeTab)?.description}
            </p>

            {/* Results Grid */}
            {currentResults.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {currentResults.map((rhyme, index) => (
                  <button
                    key={index}
                    onClick={() => handleCopyWord(rhyme)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      copiedWord === rhyme
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400'
                    }`}
                  >
                    {rhyme}
                    <span className="ml-1 text-xs text-gray-400">
                      ({countSyllables(rhyme)})
                    </span>
                    {copiedWord === rhyme && (
                      <span className="ml-2 text-xs">Copied!</span>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No {activeTab} rhymes found. Try a different word or adjust the syllable filter.
              </p>
            )}
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

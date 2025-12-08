'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import {
  useApaCitationGenerator,
  SourceType,
  Source,
  BookSource,
  JournalSource,
  WebsiteSource,
} from '@/hooks/useApaCitationGenerator';

const SOURCE_TYPES: { value: SourceType; label: string }[] = [
  { value: 'book', label: 'Book' },
  { value: 'journal', label: 'Journal Article' },
  { value: 'website', label: 'Website' },
];

const FEATURES = [
  {
    title: 'APA 7th Edition Format',
    description: 'Generate citations that follow the latest APA 7th edition guidelines for accurate academic formatting.',
  },
  {
    title: 'In-Text & Reference Citations',
    description: 'Get both in-text parenthetical citations and full reference list entries in one click.',
  },
  {
    title: 'Multiple Source Types',
    description: 'Support for books, journal articles, and websites with appropriate fields for each source type.',
  },
];

const FAQS = [
  {
    question: 'What is APA 7th edition format?',
    answer: 'APA 7th edition is the latest version of the American Psychological Association citation style, published in 2019. It includes updates like listing up to 20 authors, new DOI format, and simplified running heads.',
  },
  {
    question: 'How do I format multiple authors in APA?',
    answer: 'Enter authors separated by commas (e.g., "John Smith, Jane Doe"). For 1-2 authors, all names appear. For 3+ authors, the in-text citation uses "et al." after the first author.',
  },
  {
    question: 'What is the difference between in-text and reference citations?',
    answer: 'In-text citations appear within your paper text (e.g., Smith, 2023) to indicate the source. Reference citations are the full entries at the end of your paper providing complete source details.',
  },
  {
    question: 'Should I include DOI in my citation?',
    answer: 'Yes, APA 7th edition recommends including DOIs when available. Enter just the DOI number (e.g., 10.1234/example) without the URL prefix.',
  },
  {
    question: 'How do I cite a website with no author?',
    answer: 'Leave the author field empty. The tool will use the website name as the author in both in-text and reference citations, following APA guidelines.',
  },
  {
    question: 'What date format should I use?',
    answer: 'For publication year, use just the year (e.g., 2023). For retrieval dates on websites, use the format "Month Day, Year" (e.g., November 20, 2025).',
  },
];

export function ApaCitationGenerator() {
  const { inTextCitation, referenceCitation, generateCitation } = useApaCitationGenerator();

  const [sourceType, setSourceType] = useState<SourceType>('book');
  const [copiedInText, setCopiedInText] = useState(false);
  const [copiedReference, setCopiedReference] = useState(false);

  // Book fields
  const [bookAuthors, setBookAuthors] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [bookPublisher, setBookPublisher] = useState('');
  const [bookYear, setBookYear] = useState('');
  const [bookEdition, setBookEdition] = useState('');
  const [bookDoi, setBookDoi] = useState('');

  // Journal fields
  const [journalAuthors, setJournalAuthors] = useState('');
  const [journalTitle, setJournalTitle] = useState('');
  const [journalName, setJournalName] = useState('');
  const [journalYear, setJournalYear] = useState('');
  const [journalVolume, setJournalVolume] = useState('');
  const [journalIssue, setJournalIssue] = useState('');
  const [journalPages, setJournalPages] = useState('');
  const [journalDoi, setJournalDoi] = useState('');

  // Website fields
  const [websiteAuthors, setWebsiteAuthors] = useState('');
  const [websiteTitle, setWebsiteTitle] = useState('');
  const [websiteName, setWebsiteName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [websitePublishDate, setWebsitePublishDate] = useState('');
  const [websiteRetrievalDate, setWebsiteRetrievalDate] = useState('');

  const buildSource = (): Source | null => {
    switch (sourceType) {
      case 'book':
        if (!bookAuthors || !bookTitle || !bookPublisher || !bookYear) return null;
        return {
          type: 'book',
          authors: bookAuthors,
          title: bookTitle,
          publisher: bookPublisher,
          year: bookYear,
          edition: bookEdition || undefined,
          doi: bookDoi || undefined,
        } as BookSource;

      case 'journal':
        if (!journalAuthors || !journalTitle || !journalName || !journalYear || !journalVolume || !journalPages)
          return null;
        return {
          type: 'journal',
          authors: journalAuthors,
          title: journalTitle,
          journalName: journalName,
          year: journalYear,
          volume: journalVolume,
          issue: journalIssue || undefined,
          pages: journalPages,
          doi: journalDoi || undefined,
        } as JournalSource;

      case 'website':
        if (!websiteTitle || !websiteName || !websiteUrl || !websiteRetrievalDate) return null;
        return {
          type: 'website',
          authors: websiteAuthors || undefined,
          title: websiteTitle,
          siteName: websiteName,
          url: websiteUrl,
          publishDate: websitePublishDate || undefined,
          retrievalDate: websiteRetrievalDate,
        } as WebsiteSource;

      default:
        return null;
    }
  };

  const handleGenerate = () => {
    const source = buildSource();
    if (source) {
      generateCitation(source);
    }
  };

  const handleCopyInText = async () => {
    if (inTextCitation) {
      await navigator.clipboard.writeText(inTextCitation);
      setCopiedInText(true);
      setTimeout(() => setCopiedInText(false), 2000);
    }
  };

  const handleCopyReference = async () => {
    if (referenceCitation) {
      await navigator.clipboard.writeText(referenceCitation.replace(/\*/g, ''));
      setCopiedReference(true);
      setTimeout(() => setCopiedReference(false), 2000);
    }
  };

  const inputClass =
    'w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white';
  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'APA Citation Generator',
    description: 'Generate APA 7th edition citations for books, journal articles, and websites. Get both in-text and reference list citations.',
    applicationCategory: 'UtilitiesApplication',
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
    <SiteLayout toolName="APA Citation Generator" category="education-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Generate APA Citation
          </h2>

          {/* Source Type Selector */}
          <div className="mb-6">
            <label className={labelClass}>Source Type</label>
            <div className="flex flex-wrap gap-2">
              {SOURCE_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSourceType(type.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    sourceType === type.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Form Fields */}
          <div className="space-y-4 mb-6">
            {sourceType === 'book' && (
              <>
                <div>
                  <label className={labelClass}>Author(s) *</label>
                  <input
                    type="text"
                    value={bookAuthors}
                    onChange={(e) => setBookAuthors(e.target.value)}
                    placeholder="John Smith, Jane Doe"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Title *</label>
                  <input
                    type="text"
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    placeholder="The Great Book"
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Publisher *</label>
                    <input
                      type="text"
                      value={bookPublisher}
                      onChange={(e) => setBookPublisher(e.target.value)}
                      placeholder="Publisher Name"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Year *</label>
                    <input
                      type="text"
                      value={bookYear}
                      onChange={(e) => setBookYear(e.target.value)}
                      placeholder="2023"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Edition (optional)</label>
                    <input
                      type="text"
                      value={bookEdition}
                      onChange={(e) => setBookEdition(e.target.value)}
                      placeholder="2nd"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>DOI (optional)</label>
                    <input
                      type="text"
                      value={bookDoi}
                      onChange={(e) => setBookDoi(e.target.value)}
                      placeholder="10.1234/example"
                      className={inputClass}
                    />
                  </div>
                </div>
              </>
            )}

            {sourceType === 'journal' && (
              <>
                <div>
                  <label className={labelClass}>Author(s) *</label>
                  <input
                    type="text"
                    value={journalAuthors}
                    onChange={(e) => setJournalAuthors(e.target.value)}
                    placeholder="John Smith, Jane Doe"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Article Title *</label>
                  <input
                    type="text"
                    value={journalTitle}
                    onChange={(e) => setJournalTitle(e.target.value)}
                    placeholder="Research Findings on Topic"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Journal Name *</label>
                  <input
                    type="text"
                    value={journalName}
                    onChange={(e) => setJournalName(e.target.value)}
                    placeholder="Journal of Science"
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className={labelClass}>Year *</label>
                    <input
                      type="text"
                      value={journalYear}
                      onChange={(e) => setJournalYear(e.target.value)}
                      placeholder="2023"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Volume *</label>
                    <input
                      type="text"
                      value={journalVolume}
                      onChange={(e) => setJournalVolume(e.target.value)}
                      placeholder="12"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Issue</label>
                    <input
                      type="text"
                      value={journalIssue}
                      onChange={(e) => setJournalIssue(e.target.value)}
                      placeholder="3"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Pages *</label>
                    <input
                      type="text"
                      value={journalPages}
                      onChange={(e) => setJournalPages(e.target.value)}
                      placeholder="45-67"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>DOI (optional)</label>
                  <input
                    type="text"
                    value={journalDoi}
                    onChange={(e) => setJournalDoi(e.target.value)}
                    placeholder="10.1234/example"
                    className={inputClass}
                  />
                </div>
              </>
            )}

            {sourceType === 'website' && (
              <>
                <div>
                  <label className={labelClass}>Author(s) (optional)</label>
                  <input
                    type="text"
                    value={websiteAuthors}
                    onChange={(e) => setWebsiteAuthors(e.target.value)}
                    placeholder="John Smith"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Page Title *</label>
                  <input
                    type="text"
                    value={websiteTitle}
                    onChange={(e) => setWebsiteTitle(e.target.value)}
                    placeholder="Article Title"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Website Name *</label>
                  <input
                    type="text"
                    value={websiteName}
                    onChange={(e) => setWebsiteName(e.target.value)}
                    placeholder="Example Website"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>URL *</label>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://example.com/article"
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Publish Date (optional)</label>
                    <input
                      type="text"
                      value={websitePublishDate}
                      onChange={(e) => setWebsitePublishDate(e.target.value)}
                      placeholder="2023"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Retrieval Date *</label>
                    <input
                      type="text"
                      value={websiteRetrievalDate}
                      onChange={(e) => setWebsiteRetrievalDate(e.target.value)}
                      placeholder="November 20, 2025"
                      className={inputClass}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Generate Citation
          </button>
        </div>

        {/* Citation Output */}
        {(inTextCitation || referenceCitation) && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Generated Citations
            </h3>

            {/* In-Text Citation */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                In-Text Citation
              </label>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg mb-2">
                <p className="text-gray-900 dark:text-white font-mono">{inTextCitation}</p>
              </div>
              <button
                onClick={handleCopyInText}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors text-sm"
              >
                {copiedInText ? 'Copied!' : 'Copy In-Text'}
              </button>
            </div>

            {/* Reference Citation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reference List Entry
              </label>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg mb-2">
                <p
                  className="text-gray-900 dark:text-white"
                  dangerouslySetInnerHTML={{
                    __html: referenceCitation.replace(/\*([^*]+)\*/g, '<em>$1</em>'),
                  }}
                />
              </div>
              <button
                onClick={handleCopyReference}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors text-sm"
              >
                {copiedReference ? 'Copied!' : 'Copy Reference'}
              </button>
            </div>
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

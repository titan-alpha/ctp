'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import {
  useBibliographyGenerator,
  SourceType,
  CitationFormat,
  Source,
  BookSource,
  JournalSource,
  WebsiteSource,
  VideoSource,
} from '@/hooks/useBibliographyGenerator';

const SOURCE_TYPES: { value: SourceType; label: string }[] = [
  { value: 'book', label: 'Book' },
  { value: 'journal', label: 'Journal Article' },
  { value: 'website', label: 'Website' },
  { value: 'video', label: 'Video' },
];

const CITATION_FORMATS: { value: CitationFormat; label: string }[] = [
  { value: 'apa', label: 'APA (7th Edition)' },
  { value: 'mla', label: 'MLA (9th Edition)' },
  { value: 'chicago', label: 'Chicago' },
];

const FEATURES = [
  {
    title: 'Multiple Citation Formats',
    description: 'Generate citations in APA, MLA, and Chicago styles with accurate formatting for each style guide.',
  },
  {
    title: 'Various Source Types',
    description: 'Support for books, journal articles, websites, and videos with appropriate fields for each type.',
  },
  {
    title: 'Build Your Bibliography',
    description: 'Add multiple citations to your list and copy them all at once for easy inclusion in your paper.',
  },
];

const FAQS = [
  {
    question: 'What is APA citation format?',
    answer: 'APA (American Psychological Association) is a citation style commonly used in social sciences, education, and psychology. It emphasizes the date of publication and uses author-date in-text citations.',
  },
  {
    question: 'What is MLA citation format?',
    answer: 'MLA (Modern Language Association) is primarily used in humanities, especially literature and language studies. It focuses on authorship and uses author-page number in-text citations.',
  },
  {
    question: 'What is Chicago citation format?',
    answer: 'Chicago style offers two systems: notes-bibliography (used in humanities) and author-date (used in sciences). Our tool generates the notes-bibliography format.',
  },
  {
    question: 'How do I enter multiple authors?',
    answer: 'Enter multiple authors separated by commas. For example: "John Smith, Jane Doe, Robert Johnson". The tool will format them correctly for each citation style.',
  },
  {
    question: 'What date format should I use?',
    answer: 'For best results, use the format that matches your citation style. APA typically uses year only (2023), while MLA and Chicago may use full dates (January 15, 2023).',
  },
  {
    question: 'Can I edit citations after generating them?',
    answer: 'The generated citations are displayed as text that you can copy. For edits, modify the input fields and regenerate the citation.',
  },
];

export function BibliographyGenerator() {
  const { citation, citations, generateCitation, addToList, removeFromList, clearList } =
    useBibliographyGenerator();

  const [sourceType, setSourceType] = useState<SourceType>('book');
  const [format, setFormat] = useState<CitationFormat>('apa');
  const [copied, setCopied] = useState(false);
  const [copiedList, setCopiedList] = useState(false);

  // Book fields
  const [bookAuthors, setBookAuthors] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [bookPublisher, setBookPublisher] = useState('');
  const [bookYear, setBookYear] = useState('');
  const [bookCity, setBookCity] = useState('');
  const [bookEdition, setBookEdition] = useState('');

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
  const [websiteAccessDate, setWebsiteAccessDate] = useState('');
  const [websitePublishDate, setWebsitePublishDate] = useState('');

  // Video fields
  const [videoAuthors, setVideoAuthors] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoPlatform, setVideoPlatform] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoUploadDate, setVideoUploadDate] = useState('');

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
          city: bookCity || undefined,
          edition: bookEdition || undefined,
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
        if (!websiteTitle || !websiteName || !websiteUrl || !websiteAccessDate) return null;
        return {
          type: 'website',
          authors: websiteAuthors || undefined,
          title: websiteTitle,
          siteName: websiteName,
          url: websiteUrl,
          accessDate: websiteAccessDate,
          publishDate: websitePublishDate || undefined,
        } as WebsiteSource;

      case 'video':
        if (!videoAuthors || !videoTitle || !videoPlatform || !videoUrl || !videoUploadDate) return null;
        return {
          type: 'video',
          authors: videoAuthors,
          title: videoTitle,
          platform: videoPlatform,
          url: videoUrl,
          uploadDate: videoUploadDate,
        } as VideoSource;

      default:
        return null;
    }
  };

  const handleGenerate = () => {
    const source = buildSource();
    if (source) {
      generateCitation(source, format);
    }
  };

  const handleAddToList = () => {
    const source = buildSource();
    if (source) {
      addToList(source, format);
    }
  };

  const handleCopy = async () => {
    if (citation) {
      await navigator.clipboard.writeText(citation.replace(/\*/g, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyList = async () => {
    if (citations.length > 0) {
      const text = citations.map((c) => c.citation.replace(/\*/g, '')).join('\n\n');
      await navigator.clipboard.writeText(text);
      setCopiedList(true);
      setTimeout(() => setCopiedList(false), 2000);
    }
  };

  const inputClass =
    'w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white';
  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Bibliography Generator',
    description: 'Generate properly formatted citations in APA, MLA, and Chicago styles for books, journals, websites, and videos.',
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
    <SiteLayout toolName="Bibliography Generator" category="generators">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Generate Citations
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

          {/* Citation Format Selector */}
          <div className="mb-6">
            <label className={labelClass}>Citation Format</label>
            <div className="flex flex-wrap gap-2">
              {CITATION_FORMATS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFormat(f.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    format === f.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {f.label}
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
                    <label className={labelClass}>City (optional)</label>
                    <input
                      type="text"
                      value={bookCity}
                      onChange={(e) => setBookCity(e.target.value)}
                      placeholder="New York"
                      className={inputClass}
                    />
                  </div>
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
                    <label className={labelClass}>Access Date *</label>
                    <input
                      type="text"
                      value={websiteAccessDate}
                      onChange={(e) => setWebsiteAccessDate(e.target.value)}
                      placeholder="November 20, 2025"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Publish Date (optional)</label>
                    <input
                      type="text"
                      value={websitePublishDate}
                      onChange={(e) => setWebsitePublishDate(e.target.value)}
                      placeholder="January 15, 2023"
                      className={inputClass}
                    />
                  </div>
                </div>
              </>
            )}

            {sourceType === 'video' && (
              <>
                <div>
                  <label className={labelClass}>Creator/Channel *</label>
                  <input
                    type="text"
                    value={videoAuthors}
                    onChange={(e) => setVideoAuthors(e.target.value)}
                    placeholder="Channel Name"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Video Title *</label>
                  <input
                    type="text"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="How to Do Something"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Platform *</label>
                  <input
                    type="text"
                    value={videoPlatform}
                    onChange={(e) => setVideoPlatform(e.target.value)}
                    placeholder="YouTube"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>URL *</label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Upload Date *</label>
                  <input
                    type="text"
                    value={videoUploadDate}
                    onChange={(e) => setVideoUploadDate(e.target.value)}
                    placeholder="March 10, 2023"
                    className={inputClass}
                  />
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleGenerate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Generate Citation
            </button>
            <button
              onClick={handleAddToList}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              Add to List
            </button>
          </div>
        </div>

        {/* Generated Citation Display */}
        {citation && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Generated Citation
            </h3>
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4">
              <p
                className="text-gray-900 dark:text-white"
                dangerouslySetInnerHTML={{
                  __html: citation.replace(/\*([^*]+)\*/g, '<em>$1</em>'),
                }}
              />
            </div>
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
            >
              {copied ? 'Copied!' : 'Copy Citation'}
            </button>
          </div>
        )}

        {/* Citation List */}
        {citations.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Bibliography ({citations.length})
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyList}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm"
                >
                  {copiedList ? 'Copied!' : 'Copy All'}
                </button>
                <button
                  onClick={clearList}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors text-sm"
                >
                  Clear List
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {citations.map((c) => (
                <div
                  key={c.id}
                  className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg flex justify-between items-start gap-4"
                >
                  <p
                    className="text-gray-900 dark:text-white flex-1"
                    dangerouslySetInnerHTML={{
                      __html: c.citation.replace(/\*([^*]+)\*/g, '<em>$1</em>'),
                    }}
                  />
                  <button
                    onClick={() => removeFromList(c.id)}
                    className="text-red-500 hover:text-red-700 font-medium text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
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

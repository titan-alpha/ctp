'use client';

import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useGoogleSerpSimulator } from '@/hooks/useGoogleSerpSimulator';

const FEATURES = [
  {
    title: 'Pixel-Width Accuracy',
    description: 'See exactly how Google truncates your titles and descriptions based on pixel width, not just character count.',
  },
  {
    title: 'Mobile & Desktop Preview',
    description: 'Toggle between mobile and desktop views to optimize your SERP appearance for all devices.',
  },
  {
    title: 'Real-Time Feedback',
    description: 'Get instant character counts, pixel width estimates, and truncation warnings as you type.',
  },
];

const FAQS = [
  {
    question: 'What is a SERP simulator?',
    answer: 'A SERP (Search Engine Results Page) simulator shows you how your page will appear in Google search results before it goes live. This helps you optimize your title tags and meta descriptions for better click-through rates.',
  },
  {
    question: 'Why does Google truncate my title?',
    answer: 'Google truncates titles based on pixel width, not character count. Wide characters (like M, W) take more space than narrow ones (like i, l). Titles exceeding ~600 pixels on desktop or ~480 pixels on mobile get truncated with an ellipsis.',
  },
  {
    question: 'What is the ideal title length for SEO?',
    answer: 'Aim for 50-60 characters or approximately 600 pixels wide. This ensures your full title displays on most devices. Front-load important keywords since truncated text may hide them.',
  },
  {
    question: 'What is the ideal meta description length?',
    answer: 'Meta descriptions should be 150-160 characters for desktop and 120 characters for mobile. Google may display up to 920 pixels on desktop. Keep key information in the first 120 characters.',
  },
  {
    question: 'Does meta description affect SEO rankings?',
    answer: 'Meta descriptions do not directly affect rankings, but they significantly impact click-through rates. A compelling description can increase traffic even without changing rankings.',
  },
  {
    question: 'Why does my actual SERP look different?',
    answer: 'Google may dynamically rewrite titles and descriptions based on the search query. This simulator shows how your specified meta tags would appear, but Google might display different content.',
  },
];

export function GoogleSerpSimulator() {
  const {
    preview,
    limits,
    isMobile,
    setTitle,
    setUrl,
    setDescription,
    setIsMobile,
    reset,
  } = useGoogleSerpSimulator();

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Google SERP Simulator',
    description: 'Preview how your page appears in Google search results. Optimize title tags and meta descriptions with pixel-accurate truncation preview.',
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

  const getTitleStatus = () => {
    if (preview.titleCharCount === 0) return 'neutral';
    if (preview.isTitleTruncated) return 'danger';
    if (preview.titleCharCount > limits.titleMaxChars - 10) return 'warning';
    return 'success';
  };

  const getDescStatus = () => {
    if (preview.descriptionCharCount === 0) return 'neutral';
    if (preview.isDescriptionTruncated) return 'danger';
    if (preview.descriptionCharCount > limits.descriptionMaxChars - 20) return 'warning';
    return 'success';
  };

  const statusColors = {
    neutral: 'text-gray-500',
    success: 'text-green-500',
    warning: 'text-yellow-500',
    danger: 'text-red-500',
  };

  return (
    <SiteLayout toolName="Google SERP Simulator" category="seo-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Preview Your Search Result
          </h2>

          {/* Device Toggle */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Preview:</span>
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setIsMobile(false)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  !isMobile
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Desktop
              </button>
              <button
                onClick={() => setIsMobile(true)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isMobile
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Mobile
              </button>
            </div>
          </div>

          {/* Input Fields */}
          <div className="space-y-4 mb-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Page Title (Title Tag)
                </label>
                <span className={`text-sm ${statusColors[getTitleStatus()]}`}>
                  {preview.titleCharCount}/{limits.titleMaxChars} chars | ~{preview.titlePixelWidth}/{limits.titleMaxPixels}px
                </span>
              </div>
              <input
                type="text"
                value={preview.title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your page title"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              {preview.isTitleTruncated && (
                <p className="mt-1 text-sm text-red-500">Title will be truncated in search results</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Page URL
              </label>
              <input
                type="text"
                value={preview.url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/page"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Meta Description
                </label>
                <span className={`text-sm ${statusColors[getDescStatus()]}`}>
                  {preview.descriptionCharCount}/{limits.descriptionMaxChars} chars | ~{preview.descriptionPixelWidth}/{limits.descriptionMaxPixels}px
                </span>
              </div>
              <textarea
                value={preview.description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter your meta description"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              />
              {preview.isDescriptionTruncated && (
                <p className="mt-1 text-sm text-red-500">Description will be truncated in search results</p>
              )}
            </div>
          </div>

          <button
            onClick={reset}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Google SERP Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Google Search Preview ({isMobile ? 'Mobile' : 'Desktop'})
          </h3>

          <div className={`bg-white rounded-lg p-4 border border-gray-200 ${isMobile ? 'max-w-sm' : ''}`}>
            {/* URL Breadcrumb */}
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-xs text-gray-600">G</span>
              </div>
              <div>
                <div className="text-sm text-gray-800">{preview.displayUrl.split('/')[0] || 'example.com'}</div>
                <div className="text-xs text-gray-500">{preview.displayUrl}</div>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl text-blue-700 hover:underline cursor-pointer leading-tight mb-1">
              {preview.truncatedTitle}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed">
              {preview.truncatedDescription}
            </p>
          </div>
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

'use client';

import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useColorContrastChecker } from '@/hooks/useColorContrastChecker';

const FEATURES = [
  {
    title: 'WCAG Compliance',
    description: 'Check your color combinations against WCAG 2.1 AA and AAA accessibility guidelines.',
  },
  {
    title: 'Real-Time Preview',
    description: 'See how your text looks instantly as you adjust foreground and background colors.',
  },
  {
    title: 'Precise Calculations',
    description: 'Get accurate contrast ratios calculated using the official WCAG luminance formula.',
  },
];

const FAQS = [
  {
    question: 'What is color contrast ratio?',
    answer: 'Color contrast ratio is a measurement of the difference in luminance between two colors. It ranges from 1:1 (no contrast) to 21:1 (maximum contrast, black on white). Higher ratios mean better readability.',
  },
  {
    question: 'What is WCAG AA compliance?',
    answer: 'WCAG AA requires a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text (18pt or 14pt bold). This is the standard level of accessibility compliance most websites should meet.',
  },
  {
    question: 'What is WCAG AAA compliance?',
    answer: 'WCAG AAA is the highest level of accessibility. It requires a minimum contrast ratio of 7:1 for normal text and 4.5:1 for large text. This ensures optimal readability for users with visual impairments.',
  },
  {
    question: 'What counts as large text?',
    answer: 'Large text is defined as 18pt (24px) or larger, or 14pt (18.5px) bold or larger. Large text has lower contrast requirements because its size makes it inherently easier to read.',
  },
  {
    question: 'Why is color contrast important for accessibility?',
    answer: 'Good color contrast ensures text is readable for people with visual impairments, color blindness, or those viewing screens in bright sunlight. It is also a legal requirement in many jurisdictions.',
  },
  {
    question: 'How do I fix low contrast issues?',
    answer: 'To improve contrast, make light colors lighter and dark colors darker. You can also try using different hues. Avoid gray-on-gray combinations and ensure text stands out clearly from its background.',
  },
];

export function ColorContrastChecker() {
  const {
    foregroundColor,
    backgroundColor,
    setForegroundColor,
    setBackgroundColor,
    swapColors,
    result,
  } = useColorContrastChecker();

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Color Contrast Checker',
    description: 'Check color contrast ratios for WCAG accessibility compliance. Test foreground and background colors for AA and AAA standards.',
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

  const getComplianceBadge = (passes: boolean, label: string) => (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        passes
          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      }`}
    >
      {passes ? 'Pass' : 'Fail'} - {label}
    </span>
  );

  return (
    <SiteLayout toolName="Color Contrast Checker" category="developer-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Check Color Contrast
          </h2>

          {/* Color Pickers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Foreground (Text) Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={foregroundColor}
                  onChange={(e) => setForegroundColor(e.target.value)}
                  className="w-16 h-12 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
                />
                <input
                  type="text"
                  value={foregroundColor}
                  onChange={(e) => setForegroundColor(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white uppercase"
                  maxLength={7}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Background Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-16 h-12 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
                />
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white uppercase"
                  maxLength={7}
                />
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={swapColors}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Swap Colors
            </button>
          </div>

          {/* Live Preview */}
          <div
            className="rounded-lg p-8 mb-6 text-center"
            style={{ backgroundColor }}
          >
            <p
              className="text-lg mb-2"
              style={{ color: foregroundColor }}
            >
              Normal Text Sample (16px)
            </p>
            <p
              className="text-2xl font-bold"
              style={{ color: foregroundColor }}
            >
              Large Text Sample (24px Bold)
            </p>
          </div>

          {/* Contrast Ratio */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Contrast Ratio</p>
            <p className="text-5xl font-bold text-gray-900 dark:text-white">
              {result.ratioDisplay}
            </p>
          </div>

          {/* WCAG Compliance Badges */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">WCAG AA</h3>
              <div className="flex flex-wrap gap-2">
                {getComplianceBadge(result.aa.normalText, 'Normal Text (4.5:1)')}
                {getComplianceBadge(result.aa.largeText, 'Large Text (3:1)')}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">WCAG AAA</h3>
              <div className="flex flex-wrap gap-2">
                {getComplianceBadge(result.aaa.normalText, 'Normal Text (7:1)')}
                {getComplianceBadge(result.aaa.largeText, 'Large Text (4.5:1)')}
              </div>
            </div>
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

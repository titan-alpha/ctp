'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useCssGridGenerator } from '@/hooks/useCssGridGenerator';

const FEATURES = [
  {
    title: 'Visual Grid Builder',
    description: 'Create complex CSS Grid layouts visually with real-time preview. No coding required to get started.',
  },
  {
    title: 'Template Areas Support',
    description: 'Define named grid areas for semantic layouts. Perfect for creating page layouts with header, sidebar, and footer.',
  },
  {
    title: 'Full Alignment Control',
    description: 'Control item and content alignment with justify-items, align-items, justify-content, and align-content properties.',
  },
];

const FAQS = [
  {
    question: 'What is CSS Grid?',
    answer: 'CSS Grid is a two-dimensional layout system that allows you to create complex web layouts with rows and columns. It provides precise control over element placement and spacing.',
  },
  {
    question: 'How do I use the generated CSS code?',
    answer: 'Copy the generated CSS code and paste it into your stylesheet. Then apply the grid-container class to your parent element and grid-item class to child elements.',
  },
  {
    question: 'What are grid template areas?',
    answer: 'Grid template areas let you name regions of your grid and place items by referencing those names. This creates more readable and maintainable code for complex layouts.',
  },
  {
    question: 'What is the difference between fr and px units?',
    answer: 'The fr unit represents a fraction of available space, making layouts flexible. Px units create fixed-width columns or rows. You can mix both for responsive designs.',
  },
  {
    question: 'How do gap properties work?',
    answer: 'Gap properties add space between grid items without affecting the outer edges. Use row-gap for vertical spacing and column-gap for horizontal spacing, or gap for both.',
  },
  {
    question: 'Is CSS Grid supported in all browsers?',
    answer: 'CSS Grid is supported in all modern browsers including Chrome, Firefox, Safari, and Edge. It has over 95% global browser support.',
  },
];

const ALIGNMENT_OPTIONS = ['start', 'end', 'center', 'stretch'] as const;
const CONTENT_OPTIONS = ['start', 'end', 'center', 'stretch', 'space-between', 'space-around', 'space-evenly'] as const;
const SIZE_PRESETS = ['1fr', '2fr', 'auto', '100px', '150px', '200px', 'minmax(100px, 1fr)'];

export function CssGridGenerator() {
  const { options, setOptions, cssCode, htmlCode, reset, copyToClipboard } = useCssGridGenerator();
  const [copied, setCopied] = useState<'css' | 'html' | null>(null);

  const handleCopy = async (type: 'css' | 'html') => {
    const success = await copyToClipboard(type === 'css' ? cssCode : htmlCode);
    if (success) {
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const updateColumnSize = (index: number, value: string) => {
    const newSizes = [...options.columnSizes];
    newSizes[index] = value;
    setOptions({ columnSizes: newSizes });
  };

  const updateRowSize = (index: number, value: string) => {
    const newSizes = [...options.rowSizes];
    newSizes[index] = value;
    setOptions({ rowSizes: newSizes });
  };

  const updateTemplateArea = (row: number, col: number, value: string) => {
    const newAreas = options.templateAreas.map((r, ri) =>
      ri === row ? r.map((c, ci) => (ci === col ? value : c)) : r
    );
    setOptions({ templateAreas: newAreas });
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'CSS Grid Generator',
    description: 'Visual CSS Grid layout builder with live preview. Generate grid code with columns, rows, gaps, and template areas.',
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
    <SiteLayout toolName="CSS Grid Generator" category="developer-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            CSS Grid Generator
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Controls Section */}
            <div className="space-y-6">
              {/* Basic Grid Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Columns: {options.columns}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={options.columns}
                    onChange={(e) => setOptions({ columns: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Rows: {options.rows}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={options.rows}
                    onChange={(e) => setOptions({ rows: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Column Gap: {options.columnGap}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={options.columnGap}
                    onChange={(e) => setOptions({ columnGap: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Row Gap: {options.rowGap}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={options.rowGap}
                    onChange={(e) => setOptions({ rowGap: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Column Sizes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Column Sizes
                </label>
                <div className="flex flex-wrap gap-2">
                  {options.columnSizes.slice(0, options.columns).map((size, index) => (
                    <select
                      key={index}
                      value={size}
                      onChange={(e) => updateColumnSize(index, e.target.value)}
                      className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {SIZE_PRESETS.map((preset) => (
                        <option key={preset} value={preset}>{preset}</option>
                      ))}
                    </select>
                  ))}
                </div>
              </div>

              {/* Row Sizes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Row Sizes
                </label>
                <div className="flex flex-wrap gap-2">
                  {options.rowSizes.slice(0, options.rows).map((size, index) => (
                    <select
                      key={index}
                      value={size}
                      onChange={(e) => updateRowSize(index, e.target.value)}
                      className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {SIZE_PRESETS.map((preset) => (
                        <option key={preset} value={preset}>{preset}</option>
                      ))}
                    </select>
                  ))}
                </div>
              </div>

              {/* Alignment */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Justify Items
                  </label>
                  <select
                    value={options.justifyItems}
                    onChange={(e) => setOptions({ justifyItems: e.target.value as typeof options.justifyItems })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {ALIGNMENT_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Align Items
                  </label>
                  <select
                    value={options.alignItems}
                    onChange={(e) => setOptions({ alignItems: e.target.value as typeof options.alignItems })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {ALIGNMENT_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Justify Content
                  </label>
                  <select
                    value={options.justifyContent}
                    onChange={(e) => setOptions({ justifyContent: e.target.value as typeof options.justifyContent })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {CONTENT_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Align Content
                  </label>
                  <select
                    value={options.alignContent}
                    onChange={(e) => setOptions({ alignContent: e.target.value as typeof options.alignContent })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {CONTENT_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Template Areas Toggle */}
              <div>
                <label className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={options.useTemplateAreas}
                    onChange={(e) => setOptions({ useTemplateAreas: e.target.checked })}
                    className="mr-2"
                  />
                  Use Template Areas
                </label>
              </div>

              {/* Template Areas Editor */}
              {options.useTemplateAreas && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Template Areas
                  </label>
                  <div className="space-y-2">
                    {options.templateAreas.slice(0, options.rows).map((row, ri) => (
                      <div key={ri} className="flex gap-2">
                        {row.slice(0, options.columns).map((area, ci) => (
                          <input
                            key={ci}
                            type="text"
                            value={area}
                            onChange={(e) => updateTemplateArea(ri, ci, e.target.value)}
                            className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={reset}
                className="px-4 py-2 text-red-600 hover:text-red-700 dark:text-red-400 font-medium transition-colors"
              >
                Reset
              </button>
            </div>

            {/* Preview Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Live Preview
              </label>
              <div
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-100 dark:bg-gray-900 min-h-64"
                style={{
                  display: 'grid',
                  gridTemplateColumns: options.columnSizes.slice(0, options.columns).join(' '),
                  gridTemplateRows: options.rowSizes.slice(0, options.rows).join(' '),
                  gap: `${options.rowGap}px ${options.columnGap}px`,
                  justifyItems: options.justifyItems,
                  alignItems: options.alignItems,
                  justifyContent: options.justifyContent,
                  alignContent: options.alignContent,
                }}
              >
                {Array(options.columns * options.rows)
                  .fill(null)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="bg-blue-500 text-white rounded p-4 flex items-center justify-center font-medium min-w-[40px] min-h-[40px]"
                    >
                      {i + 1}
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Generated Code */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  CSS Code
                </label>
                <button
                  onClick={() => handleCopy('css')}
                  className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                >
                  {copied === 'css' ? 'Copied!' : 'Copy CSS'}
                </button>
              </div>
              <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto text-sm font-mono max-h-64">
                {cssCode}
              </pre>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  HTML Code
                </label>
                <button
                  onClick={() => handleCopy('html')}
                  className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                >
                  {copied === 'html' ? 'Copied!' : 'Copy HTML'}
                </button>
              </div>
              <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto text-sm font-mono max-h-64">
                {htmlCode}
              </pre>
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

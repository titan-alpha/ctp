'use client';

import { useState, useCallback } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useHexToRgba } from '@/hooks/useHexToRgba';

const FEATURES = [
  {
    title: 'Multiple Hex Formats',
    description: 'Supports 3-digit (#RGB), 6-digit (#RRGGBB), and 8-digit (#RRGGBBAA) hex color codes.',
  },
  {
    title: 'Adjustable Opacity',
    description: 'Fine-tune transparency with a smooth opacity slider from 0% to 100%.',
  },
  {
    title: 'Multiple Output Formats',
    description: 'Get your color in RGBA, RGB, and HSL formats with one-click copy functionality.',
  },
];

const FAQS = [
  {
    question: 'What is a hex color code?',
    answer: 'A hex color code is a 6-digit (or 3-digit shorthand) hexadecimal representation of a color. It consists of pairs of characters representing red, green, and blue values (00-FF).',
  },
  {
    question: 'What is RGBA?',
    answer: 'RGBA stands for Red, Green, Blue, and Alpha. It is a color model that adds an alpha channel (transparency) to the standard RGB model. Values range from 0-255 for RGB and 0-1 for alpha.',
  },
  {
    question: 'What hex formats are supported?',
    answer: 'This tool supports 3-digit (#RGB), 6-digit (#RRGGBB), and 8-digit (#RRGGBBAA) hex color codes. The 8-digit format includes built-in alpha/transparency.',
  },
  {
    question: 'How does the opacity slider work?',
    answer: 'The opacity slider lets you adjust the alpha (transparency) value from 0% (fully transparent) to 100% (fully opaque). This overrides any alpha value in an 8-digit hex code.',
  },
  {
    question: 'What is HSL color format?',
    answer: 'HSL stands for Hue, Saturation, and Lightness. It is an alternative color model that can be more intuitive for selecting colors based on their perceived characteristics.',
  },
  {
    question: 'Is my data processed locally?',
    answer: 'Yes, all color conversions happen directly in your browser. No data is sent to any server, ensuring complete privacy.',
  },
];

export function HexToRgba() {
  const {
    hex,
    setHex,
    opacity,
    setOpacity,
    rgba,
    rgbaString,
    rgbString,
    hslString,
    isValid,
    error,
    reset,
  } = useHexToRgba();

  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Hex to RGBA Converter',
    description: 'Convert hex color codes to RGBA, RGB, and HSL formats with adjustable opacity. Free online color conversion tool.',
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
    <SiteLayout toolName="Hex to RGBA Converter" category="developer-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Convert Hex to RGBA
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Section */}
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hex Color Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={isValid ? hex : '#000000'}
                    onChange={(e) => setHex(e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
                  />
                  <input
                    type="text"
                    value={hex}
                    onChange={(e) => setHex(e.target.value)}
                    placeholder="#3b82f6"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {error && (
                  <p className="mt-1 text-sm text-red-500">{error}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Opacity: {opacity}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <button
                onClick={reset}
                className="px-4 py-2 text-red-600 hover:text-red-700 dark:text-red-400 font-medium transition-colors"
              >
                Reset
              </button>
            </div>

            {/* Preview & Output Section */}
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color Preview
                </label>
                <div
                  className="w-full h-24 rounded-lg border border-gray-300 dark:border-gray-600"
                  style={{
                    backgroundColor: isValid ? rgbaString : '#ffffff',
                    backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                  }}
                >
                  <div
                    className="w-full h-full rounded-lg"
                    style={{ backgroundColor: isValid ? rgbaString : '#ffffff' }}
                  />
                </div>
              </div>

              {isValid && rgba && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={rgbaString}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(rgbaString, 'rgba')}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      {copied === 'rgba' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={rgbString}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(rgbString, 'rgb')}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      {copied === 'rgb' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={hslString}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(hslString, 'hsl')}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      {copied === 'hsl' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <p>R: {rgba.r} | G: {rgba.g} | B: {rgba.b} | A: {rgba.a}</p>
                  </div>
                </div>
              )}
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

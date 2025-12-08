'use client';

import { useState, useCallback } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useBmpToPng, ConvertedImage } from '@/hooks/useBmpToPng';

const FEATURES = [
  {
    title: 'Universal Compatibility',
    description: 'Convert legacy BMP files to widely-supported PNG format for use anywhere.',
  },
  {
    title: 'Client-Side Processing',
    description: 'All conversion happens in your browser. Your images never leave your device.',
  },
  {
    title: 'Smaller File Sizes',
    description: 'PNG compression typically results in significantly smaller files compared to uncompressed BMP.',
  },
];

const FAQS = [
  {
    question: 'What is BMP format?',
    answer: 'BMP (Bitmap) is an uncompressed image format developed by Microsoft. While it preserves image quality, BMP files are typically much larger than other formats due to lack of compression.',
  },
  {
    question: 'Why convert BMP to PNG?',
    answer: 'PNG offers lossless compression, resulting in smaller file sizes while maintaining identical image quality. PNG also supports transparency and is universally supported on the web.',
  },
  {
    question: 'Will I lose image quality?',
    answer: 'No. PNG is a lossless format, so the conversion preserves all visual information from the original BMP file without any quality loss.',
  },
  {
    question: 'Are my images uploaded to a server?',
    answer: 'No. All conversion happens locally in your browser using the HTML5 Canvas API. Your images never leave your device.',
  },
  {
    question: 'How much smaller will my files be?',
    answer: 'PNG files are typically 50-90% smaller than BMP files due to lossless compression, depending on the image content.',
  },
  {
    question: 'Can I convert multiple BMP files at once?',
    answer: 'Yes. You can select or drag-and-drop multiple BMP files and they will all be converted simultaneously.',
  },
];

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function BmpToPng() {
  const { convertedImages, isConverting, error, convert, removeImage, clearAll } = useBmpToPng();
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      convert(files);
    },
    [convert]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : [];
      convert(files);
      e.target.value = '';
    },
    [convert]
  );

  const handleDownload = useCallback((image: ConvertedImage) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.originalName.replace(/\.bmp$/i, '.png');
    link.click();
  }, []);

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'BMP to PNG Converter',
    description: 'Convert BMP images to PNG format with compression. Free online tool with batch processing.',
    applicationCategory: 'MultimediaApplication',
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
    <SiteLayout toolName="BMP to PNG Converter" category="converters">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Convert BMP to PNG
          </h2>

          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            <div className="text-gray-600 dark:text-gray-400 mb-4">
              <svg
                className="mx-auto h-12 w-12 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-lg">Drag and drop BMP files here</p>
              <p className="text-sm mt-1">or</p>
            </div>
            <label className="inline-block">
              <input
                type="file"
                accept=".bmp,image/bmp"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <span className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg cursor-pointer transition-colors">
                Select Files
              </span>
            </label>
          </div>

          {isConverting && (
            <div className="mt-4 text-center text-gray-600 dark:text-gray-400">
              Converting...
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Converted Images */}
        {convertedImages.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Converted Images ({convertedImages.length})
              </h3>
              <button
                onClick={clearAll}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {convertedImages.map((image) => (
                <div
                  key={image.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div
                    className="mb-3 rounded bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImNoZWNrIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxyZWN0IGZpbGw9IiNmZmYiIHg9IjAiIHk9IjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIvPjxyZWN0IGZpbGw9IiNjY2MiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIvPjxyZWN0IGZpbGw9IiNjY2MiIHg9IjEwIiB5PSIxMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCBmaWxsPSJ1cmwoI2NoZWNrKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')]"
                  >
                    <img
                      src={image.url}
                      alt={image.originalName}
                      className="max-h-40 mx-auto object-contain"
                    />
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {image.originalName.replace(/\.bmp$/i, '.png')}
                    </p>
                    <p>
                      {image.width} x {image.height} px
                    </p>
                    <p>
                      {formatBytes(image.originalSize)} → {formatBytes(image.size)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload(image)}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => removeImage(image.id)}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  </div>
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

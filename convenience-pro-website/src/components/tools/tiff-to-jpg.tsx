'use client';

import { useState, useCallback } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useTiffToJpg } from '@/hooks/useTiffToJpg';

const FEATURES = [
  {
    title: 'Client-Side Conversion',
    description: 'All conversions happen in your browser. Your images never leave your device, ensuring complete privacy.',
  },
  {
    title: 'Batch Processing',
    description: 'Convert multiple TIFF images at once. Drag and drop a folder or select several files to process them all together.',
  },
  {
    title: 'Adjustable Quality',
    description: 'Fine-tune the JPEG quality from 10% to 100% to balance file size and image quality for your needs.',
  },
];

const FAQS = [
  {
    question: 'What is TIFF format?',
    answer: 'TIFF (Tagged Image File Format) is a high-quality image format commonly used in professional photography, publishing, and archival purposes. It supports lossless compression and can store multiple layers and pages.',
  },
  {
    question: 'Why convert TIFF to JPG?',
    answer: 'JPEG files are much smaller than TIFF files and are universally supported across all devices, browsers, and software. Converting TIFF to JPG is ideal for web use, sharing, and when file size matters.',
  },
  {
    question: 'Is my data secure during conversion?',
    answer: 'Yes, completely. All conversions happen locally in your browser using JavaScript and Canvas API. Your images are never uploaded to any server.',
  },
  {
    question: 'What quality setting should I use?',
    answer: 'For most purposes, 80-90% quality offers an excellent balance between file size and visual quality. Use 100% only when you need the highest quality, and lower values (60-70%) when file size is more important.',
  },
  {
    question: 'Can I convert multiple images at once?',
    answer: 'Yes, the tool supports batch conversion. You can drag and drop multiple TIFF files or select them all at once, and they will be converted sequentially.',
  },
  {
    question: 'Does this tool support all TIFF files?',
    answer: 'Browser support for TIFF varies. Most modern browsers support basic TIFF files, but complex multi-page or layered TIFF files may not be supported. Safari has the best native TIFF support.',
  },
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function TiffToJpg() {
  const {
    results,
    isConverting,
    error,
    quality,
    setQuality,
    convertFiles,
    removeResult,
    clearResults,
  } = useTiffToJpg();

  const [isDragging, setIsDragging] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      convertFiles(files);
    },
    [convertFiles]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : [];
      convertFiles(files);
      e.target.value = '';
    },
    [convertFiles]
  );

  const handleDownload = useCallback((result: { url: string; fileName: string }) => {
    const a = document.createElement('a');
    a.href = result.url;
    a.download = result.fileName;
    a.click();
  }, []);

  const handleDownloadAll = useCallback(() => {
    results.forEach((result) => {
      const a = document.createElement('a');
      a.href = result.url;
      a.download = result.fileName;
      a.click();
    });
  }, [results]);

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'TIFF to JPG Converter',
    description: 'Free online tool to convert TIFF images to JPG format. Client-side conversion with adjustable quality and batch processing support.',
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
    <SiteLayout toolName="TIFF to JPG Converter" category="converters">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Convert TIFF to JPG
          </h2>

          {/* Quality Slider */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              JPEG Quality: {Math.round(quality * 100)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>Smaller file</span>
              <span>Higher quality</span>
            </div>
          </div>

          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            <div className="text-gray-600 dark:text-gray-400 mb-4">
              {isConverting ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Converting...
                </div>
              ) : (
                <>
                  <p className="text-lg mb-2">Drag and drop TIFF files here</p>
                  <p className="text-sm">or</p>
                </>
              )}
            </div>
            <label className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg cursor-pointer transition-colors">
              Select Files
              <input
                type="file"
                accept=".tif,.tiff,image/tiff"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                disabled={isConverting}
              />
            </label>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Converted Images ({results.length})
              </h3>
              <div className="flex gap-2">
                {results.length > 1 && (
                  <button
                    onClick={handleDownloadAll}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Download All
                  </button>
                )}
                <button
                  onClick={clearResults}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <img
                    src={result.url}
                    alt={result.fileName}
                    className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-80"
                    onClick={() => setPreviewIndex(index)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-white truncate">
                      {result.fileName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {result.width} x {result.height} | {formatBytes(result.originalSize)} → {formatBytes(result.convertedSize)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload(result)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => removeResult(index)}
                      className="px-3 py-2 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-medium rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preview Modal */}
        {previewIndex !== null && results[previewIndex] && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setPreviewIndex(null)}
          >
            <div className="max-w-4xl max-h-full overflow-auto">
              <img
                src={results[previewIndex].url}
                alt={results[previewIndex].fileName}
                className="max-w-full h-auto"
              />
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

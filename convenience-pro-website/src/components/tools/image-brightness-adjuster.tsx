'use client';

import { useState, useCallback } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useImageBrightnessAdjuster } from '@/hooks/useImageBrightnessAdjuster';

const FEATURES = [
  {
    title: 'Real-Time Preview',
    description: 'See brightness changes instantly as you adjust the slider. Fine-tune until you get the perfect result.',
  },
  {
    title: 'Client-Side Processing',
    description: 'All image processing happens in your browser. Your images never leave your device.',
  },
  {
    title: 'Before/After Comparison',
    description: 'Compare your original image with the adjusted version side by side before downloading.',
  },
];

const FAQS = [
  {
    question: 'What is image brightness adjustment?',
    answer: 'Brightness adjustment changes the overall lightness or darkness of an image by adding or subtracting a value from each pixel color channel.',
  },
  {
    question: 'What is the brightness range?',
    answer: 'The brightness slider ranges from -100 (darkest) to +100 (brightest). A value of 0 means no change to the original image.',
  },
  {
    question: 'Which image formats are supported?',
    answer: 'This tool supports JPEG, PNG, WebP, GIF, and BMP image formats. The output is always saved as PNG to preserve quality.',
  },
  {
    question: 'Are my images uploaded to a server?',
    answer: 'No. All processing happens locally in your browser using the HTML5 Canvas API. Your images never leave your device.',
  },
  {
    question: 'Will brightness adjustment affect image quality?',
    answer: 'The tool uses pixel-level manipulation which maintains image resolution. Output is saved as lossless PNG to preserve quality.',
  },
  {
    question: 'Is there a file size limit?',
    answer: 'There is no strict limit, but very large images may take longer to process depending on your device capabilities.',
  },
];

export function ImageBrightnessAdjuster() {
  const {
    originalImage,
    previewUrl,
    result,
    brightness,
    isProcessing,
    error,
    loadImage,
    setBrightness,
    applyBrightness,
    reset,
  } = useImageBrightnessAdjuster();
  const [isDragging, setIsDragging] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        loadImage(files[0]);
      }
    },
    [loadImage]
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
      if (files.length > 0) {
        loadImage(files[0]);
      }
      e.target.value = '';
    },
    [loadImage]
  );

  const handleDownload = useCallback(() => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result.url;
    link.download = 'brightness-adjusted.png';
    link.click();
  }, [result]);

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Image Brightness Adjuster',
    description: 'Adjust image brightness online for free. Real-time preview, before/after comparison, and client-side processing.',
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
    <SiteLayout toolName="Image Brightness Adjuster" category="image-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Adjust Image Brightness
          </h2>

          {!originalImage ? (
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
                <p className="text-lg">Drag and drop an image here</p>
                <p className="text-sm mt-1">or</p>
              </div>
              <label className="inline-block">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/bmp"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <span className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg cursor-pointer transition-colors">
                  Select Image
                </span>
              </label>
            </div>
          ) : (
            <div>
              {/* Image Preview */}
              <div className="mb-6">
                {showComparison && originalImage ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Original</p>
                      <img
                        src={originalImage}
                        alt="Original"
                        className="max-h-64 mx-auto object-contain rounded border border-gray-200 dark:border-gray-700"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Adjusted</p>
                      <img
                        src={previewUrl || originalImage}
                        alt="Preview"
                        className="max-h-64 mx-auto object-contain rounded border border-gray-200 dark:border-gray-700"
                      />
                    </div>
                  </div>
                ) : (
                  <img
                    src={previewUrl || originalImage}
                    alt="Preview"
                    className="max-h-80 mx-auto object-contain rounded border border-gray-200 dark:border-gray-700"
                  />
                )}
              </div>

              {/* Brightness Slider */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Brightness
                  </label>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {brightness > 0 ? `+${brightness}` : brightness}
                  </span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>-100 (Darker)</span>
                  <span>0</span>
                  <span>+100 (Brighter)</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowComparison(!showComparison)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
                >
                  {showComparison ? 'Hide Comparison' : 'Show Comparison'}
                </button>
                <button
                  onClick={applyBrightness}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
                >
                  {isProcessing ? 'Processing...' : 'Apply & Generate'}
                </button>
                {result && (
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Download PNG
                  </button>
                )}
                <button
                  onClick={reset}
                  className="px-4 py-2 text-red-600 hover:text-red-700 dark:text-red-400 font-medium transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}
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

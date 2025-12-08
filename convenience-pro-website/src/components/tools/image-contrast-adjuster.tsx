'use client';

import { useState, useCallback, useEffect } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useImageContrastAdjuster } from '@/hooks/useImageContrastAdjuster';

const FEATURES = [
  {
    title: 'Real-Time Preview',
    description: 'See contrast adjustments instantly with live preview before downloading your enhanced image.',
  },
  {
    title: 'Client-Side Processing',
    description: 'All image processing happens in your browser. Your photos never leave your device.',
  },
  {
    title: 'Precise Control',
    description: 'Fine-tune contrast from -100 to +100 with a smooth slider for perfect results every time.',
  },
];

const FAQS = [
  {
    question: 'What is image contrast?',
    answer: 'Image contrast refers to the difference between the lightest and darkest areas of an image. Higher contrast makes darks darker and lights lighter, while lower contrast brings tones closer together.',
  },
  {
    question: 'How does the contrast formula work?',
    answer: 'This tool uses the standard contrast formula: factor = (259 * (contrast + 255)) / (255 * (259 - contrast)). This mathematical approach ensures smooth, predictable adjustments across the entire tonal range.',
  },
  {
    question: 'What image formats are supported?',
    answer: 'The tool supports JPEG, PNG, WebP, GIF, and BMP image formats. Output is provided as PNG to preserve quality.',
  },
  {
    question: 'Are my images uploaded to a server?',
    answer: 'No. All processing happens locally in your browser using the HTML5 Canvas API. Your images are never uploaded or transmitted anywhere.',
  },
  {
    question: 'What is the contrast range?',
    answer: 'The contrast slider ranges from -100 (minimum contrast, more gray) to +100 (maximum contrast, more vivid). A value of 0 means no change from the original.',
  },
  {
    question: 'Will adjusting contrast affect image quality?',
    answer: 'The tool processes your image at full resolution. However, extreme contrast adjustments may cause clipping in very bright or dark areas, which is normal for contrast editing.',
  },
];

export function ImageContrastAdjuster() {
  const {
    originalImage,
    adjustedImage,
    contrast,
    isProcessing,
    error,
    loadImage,
    setContrast,
    applyContrast,
    reset,
  } = useImageContrastAdjuster();

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (originalImage) {
      applyContrast();
    }
  }, [contrast, originalImage, applyContrast]);

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
    if (!adjustedImage) return;
    const link = document.createElement('a');
    link.href = adjustedImage.url;
    link.download = `contrast-adjusted-${Date.now()}.png`;
    link.click();
  }, [adjustedImage]);

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Image Contrast Adjuster',
    description: 'Adjust image contrast online for free. Real-time preview, precise control, and client-side processing.',
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
    <SiteLayout toolName="Image Contrast Adjuster" category="image-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Adjust Image Contrast
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
              {/* Contrast Slider */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contrast: {contrast}
                </label>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>-100</span>
                  <span>0</span>
                  <span>+100</span>
                </div>
              </div>

              {/* Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Original</h3>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
                    <img
                      src={originalImage}
                      alt="Original"
                      className="max-h-64 w-full object-contain"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preview {isProcessing && '(Processing...)'}
                  </h3>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
                    {adjustedImage ? (
                      <img
                        src={adjustedImage.url}
                        alt="Adjusted"
                        className="max-h-64 w-full object-contain"
                      />
                    ) : (
                      <div className="h-64 flex items-center justify-center text-gray-400">
                        Processing...
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={handleDownload}
                  disabled={!adjustedImage || isProcessing}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
                >
                  Download
                </button>
                <button
                  onClick={reset}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
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

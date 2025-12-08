'use client';

import { useState, useCallback } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useImageSaturationAdjuster } from '@/hooks/useImageSaturationAdjuster';

const FEATURES = [
  {
    title: 'HSL Color Conversion',
    description: 'Uses accurate HSL color space conversion to adjust saturation while preserving hue and luminance.',
  },
  {
    title: 'Full Range Control',
    description: 'Adjust from -100 (complete grayscale) to +100 (vivid, enhanced colors) with precise control.',
  },
  {
    title: 'Privacy First',
    description: 'All processing happens locally in your browser. Your images never leave your device.',
  },
];

const FAQS = [
  {
    question: 'What is image saturation?',
    answer: 'Saturation refers to the intensity or purity of colors in an image. Higher saturation makes colors more vivid and vibrant, while lower saturation makes colors appear more muted or gray.',
  },
  {
    question: 'What does -100 saturation mean?',
    answer: 'A saturation value of -100 removes all color from the image, converting it to complete grayscale. This is useful for creating black and white images.',
  },
  {
    question: 'What does +100 saturation mean?',
    answer: 'A saturation value of +100 maximizes color intensity, making colors appear more vivid and vibrant. This can create a dramatic, eye-catching effect.',
  },
  {
    question: 'Are my images uploaded to a server?',
    answer: 'No. All saturation adjustment processing happens locally in your browser using the HTML5 Canvas API. Your images never leave your device.',
  },
  {
    question: 'What image formats are supported?',
    answer: 'This tool supports all common web image formats including JPEG, PNG, WebP, GIF, and AVIF. The output is always in PNG format to preserve quality.',
  },
  {
    question: 'Will adjusting saturation affect image quality?',
    answer: 'The tool processes images at their original resolution. Output is saved as PNG to prevent compression artifacts. However, extreme saturation values may cause color clipping.',
  },
];

export function ImageSaturationAdjuster() {
  const {
    originalUrl,
    adjustedImage,
    saturation,
    isProcessing,
    error,
    loadImage,
    setSaturation,
    applyAdjustment,
    reset,
  } = useImageSaturationAdjuster();
  const [isDragging, setIsDragging] = useState(false);

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
    link.download = 'saturation-adjusted.png';
    link.click();
  }, [adjustedImage]);

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Image Saturation Adjuster',
    description: 'Adjust image color saturation online. Convert to grayscale or enhance colors with precise HSL-based processing.',
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
    <SiteLayout toolName="Image Saturation Adjuster" category="image-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Adjust Image Saturation
          </h2>

          {!originalUrl ? (
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
                  accept="image/*"
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
              {/* Preview */}
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Original</p>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-2 bg-gray-50 dark:bg-gray-900">
                      <img
                        src={originalUrl}
                        alt="Original"
                        className="max-h-64 mx-auto object-contain"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview</p>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-2 bg-gray-50 dark:bg-gray-900">
                      {adjustedImage ? (
                        <img
                          src={adjustedImage.url}
                          alt="Adjusted"
                          className="max-h-64 mx-auto object-contain"
                        />
                      ) : (
                        <div className="h-64 flex items-center justify-center text-gray-400">
                          Adjust saturation and click Apply
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Saturation Slider */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Saturation: {saturation > 0 ? '+' : ''}{saturation}
                </label>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={saturation}
                  onChange={(e) => setSaturation(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>-100 (Grayscale)</span>
                  <span>0</span>
                  <span>+100 (Vivid)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={applyAdjustment}
                  disabled={isProcessing}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
                >
                  {isProcessing ? 'Processing...' : 'Apply'}
                </button>
                {adjustedImage && (
                  <button
                    onClick={handleDownload}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Download PNG
                  </button>
                )}
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

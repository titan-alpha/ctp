'use client';

import { useState, useRef } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useSocialMediaImageResizer, Platform, PLATFORM_PRESETS } from '@/hooks/useSocialMediaImageResizer';

const PLATFORMS: { value: Platform; label: string }[] = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'linkedin', label: 'LinkedIn' },
];

const FEATURES = [
  {
    title: 'Multiple Platform Presets',
    description: 'Instantly resize images for Instagram, Facebook, Twitter, and LinkedIn with platform-specific dimensions.',
  },
  {
    title: 'Canvas-Based Processing',
    description: 'All image processing happens locally in your browser using HTML5 Canvas - your images are never uploaded to any server.',
  },
  {
    title: 'Batch Resize & Download',
    description: 'Generate all sizes for a platform at once and download each resized image individually.',
  },
];

const FAQS = [
  {
    question: 'What image sizes does Instagram require?',
    answer: 'Instagram supports square posts (1080x1080), portrait posts (1080x1350), landscape posts (1080x566), Stories/Reels (1080x1920), and profile pictures (320x320).',
  },
  {
    question: 'What are the recommended image dimensions for Facebook?',
    answer: 'Facebook recommends 1200x630 pixels for shared images, 820x312 for cover photos, 180x180 for profile pictures, and 1080x1920 for Stories.',
  },
  {
    question: 'How does the image resizing work?',
    answer: 'The tool uses HTML5 Canvas to resize images directly in your browser. Images are scaled and cropped to fit the target dimensions while maintaining visual quality.',
  },
  {
    question: 'Are my images uploaded to a server?',
    answer: 'No, all processing happens locally in your browser. Your images never leave your device, ensuring complete privacy and security.',
  },
  {
    question: 'What image formats are supported?',
    answer: 'The tool accepts common image formats including JPG, PNG, GIF, and WebP. All resized images are exported as PNG for maximum quality.',
  },
  {
    question: 'Can I resize for multiple platforms at once?',
    answer: 'You can select a platform and generate all sizes for that platform at once. To resize for different platforms, simply switch between them and generate the sizes you need.',
  },
];

export function SocialMediaImageResizer() {
  const {
    originalImage,
    resizedImages,
    isProcessing,
    error,
    loadImage,
    resizeAllSizes,
    downloadImage,
    reset,
    platformPresets,
  } = useSocialMediaImageResizer();

  const [platform, setPlatform] = useState<Platform>('instagram');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadImage(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      loadImage(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const currentPreset = platformPresets[platform];

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Social Media Image Resizer',
    description: 'Resize images for Instagram, Facebook, Twitter, and LinkedIn with platform-specific presets.',
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

  return (
    <SiteLayout toolName="Social Media Image Resizer" category="social-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Resize Images for Social Media
          </h2>

          {/* File Upload */}
          {!originalImage && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center cursor-pointer hover:border-blue-500 transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Drag and drop an image here, or click to select
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Supports JPG, PNG, GIF, WebP
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}

          {/* Original Image Preview */}
          {originalImage && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Original Image</h3>
                <button
                  onClick={reset}
                  className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                >
                  Upload New Image
                </button>
              </div>
              <div className="flex justify-center">
                <img
                  src={originalImage}
                  alt="Original"
                  className="max-w-full max-h-64 rounded-lg shadow"
                />
              </div>
            </div>
          )}

          {/* Platform Selector */}
          {originalImage && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Platform
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPlatform(p.value)}
                    className={`p-3 rounded-lg border-2 text-center transition-colors ${
                      platform === p.value
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">{p.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Presets */}
          {originalImage && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {currentPreset.name} Sizes
                </label>
                <button
                  onClick={() => resizeAllSizes(platform)}
                  disabled={isProcessing}
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  {isProcessing ? 'Processing...' : 'Generate All Sizes'}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {currentPreset.sizes.map((size) => (
                  <div
                    key={size.name}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">{size.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {size.width} x {size.height} px
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Resized Images */}
        {resizedImages.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Resized Images
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {resizedImages.map((image, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded mb-3 flex items-center justify-center overflow-hidden">
                    <img
                      src={image.dataUrl}
                      alt={image.sizeName}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {image.sizeName}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    {image.width} x {image.height} px
                  </div>
                  <button
                    onClick={() => downloadImage(image)}
                    className="w-full px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    Download
                  </button>
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

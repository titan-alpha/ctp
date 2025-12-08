'use client';

import { useState, useCallback } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useGifToMp4, ConvertedVideo } from '@/hooks/useGifToMp4';

const FEATURES = [
  {
    title: 'Client-Side Processing',
    description: 'All conversion happens in your browser using canvas and MediaRecorder. Your files never leave your device.',
  },
  {
    title: 'Animated GIF Support',
    description: 'Parses all frames from animated GIFs and preserves timing for smooth video playback.',
  },
  {
    title: 'High Quality Output',
    description: 'Generates high-bitrate video output that maintains the visual quality of your original GIF.',
  },
];

const FAQS = [
  {
    question: 'Why convert GIF to MP4/WebM?',
    answer: 'Video formats like MP4 and WebM offer much better compression than GIF, resulting in smaller file sizes while maintaining or improving quality. They also support millions of colors compared to GIF\'s 256 color limit.',
  },
  {
    question: 'What format is the output video?',
    answer: 'The converter outputs WebM format with VP9 codec, which is widely supported by modern browsers and offers excellent compression and quality.',
  },
  {
    question: 'Are my files uploaded to a server?',
    answer: 'No. All processing happens locally in your browser using the Canvas API and MediaRecorder. Your GIF files never leave your device.',
  },
  {
    question: 'Is there a file size limit?',
    answer: 'There is no strict limit, but very large GIFs or GIFs with many frames may be slow to process depending on your device capabilities.',
  },
  {
    question: 'Will the animation timing be preserved?',
    answer: 'Yes. The converter reads frame delay information from the GIF and applies the same timing to the output video for accurate playback.',
  },
  {
    question: 'Can I convert multiple GIFs at once?',
    answer: 'Currently the tool processes one GIF at a time. Clear the current result before converting another GIF.',
  },
];

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(1);
  return mins > 0 ? `${mins}:${secs.padStart(4, '0')}` : `${secs}s`;
}

export function GifToMp4() {
  const { convertedVideo, isConverting, progress, error, convert, clear } = useGifToMp4();
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        convert(files[0]);
      }
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
      if (files.length > 0) {
        convert(files[0]);
      }
      e.target.value = '';
    },
    [convert]
  );

  const handleDownload = useCallback((video: ConvertedVideo) => {
    const link = document.createElement('a');
    link.href = video.url;
    link.download = video.originalName.replace(/\.gif$/i, '.webm');
    link.click();
  }, []);

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'GIF to MP4 Converter',
    description: 'Convert animated GIF images to MP4/WebM video format. Free online tool with client-side processing.',
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
    <SiteLayout toolName="GIF to MP4 Converter" category="converters">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Convert GIF to Video
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
              <p className="text-lg">Drag and drop a GIF file here</p>
              <p className="text-sm mt-1">or</p>
            </div>
            <label className="inline-block">
              <input
                type="file"
                accept=".gif,image/gif"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isConverting}
              />
              <span className={`px-6 py-3 font-medium rounded-lg cursor-pointer transition-colors ${
                isConverting
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}>
                Select GIF File
              </span>
            </label>
          </div>

          {/* Progress Bar */}
          {isConverting && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Converting...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Converted Video */}
        {convertedVideo && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Converted Video
              </h3>
              <button
                onClick={clear}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400"
              >
                Clear
              </button>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="mb-4 bg-black rounded-lg overflow-hidden">
                <video
                  src={convertedVideo.url}
                  controls
                  loop
                  autoPlay
                  muted
                  className="max-h-80 mx-auto"
                />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {convertedVideo.originalName.replace(/\.gif$/i, '.webm')}
                </p>
                <p>
                  {convertedVideo.width} x {convertedVideo.height} px
                </p>
                <p>Duration: {formatDuration(convertedVideo.duration)}</p>
                <p>
                  {formatBytes(convertedVideo.originalSize)} → {formatBytes(convertedVideo.size)}
                </p>
              </div>
              <button
                onClick={() => handleDownload(convertedVideo)}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Download Video
              </button>
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

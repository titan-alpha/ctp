'use client';

import { useState, useCallback } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useAudioConverter, OutputFormat, Quality } from '@/hooks/useAudioConverter';

const OUTPUT_FORMATS: { value: OutputFormat; label: string; description: string }[] = [
  { value: 'wav', label: 'WAV', description: 'Lossless, larger file size' },
  { value: 'mp3', label: 'MP3', description: 'Compressed, smaller file size' },
];

const QUALITY_OPTIONS: { value: Quality; label: string; bitrate: string }[] = [
  { value: 'low', label: 'Low', bitrate: '96 kbps' },
  { value: 'medium', label: 'Medium', bitrate: '128 kbps' },
  { value: 'high', label: 'High', bitrate: '320 kbps' },
];

const FEATURES = [
  {
    title: 'Browser-Based Conversion',
    description: 'All audio processing happens locally in your browser. Your files never leave your device.',
  },
  {
    title: 'Multiple Format Support',
    description: 'Supports MP3, WAV, OGG, and AAC audio files as input with automatic format detection.',
  },
  {
    title: 'Quality Control',
    description: 'Choose your preferred output quality and bitrate settings for the perfect balance of size and fidelity.',
  },
];

const FAQS = [
  {
    question: 'What audio formats can I convert?',
    answer: 'You can convert MP3, WAV, OGG, and AAC audio files. The converter automatically detects the input format.',
  },
  {
    question: 'What output formats are available?',
    answer: 'You can convert to WAV (lossless quality) or MP3 (compressed). WAV maintains original quality while MP3 offers smaller file sizes.',
  },
  {
    question: 'Is my audio file uploaded to a server?',
    answer: 'No, all conversion happens entirely in your browser using the Web Audio API. Your files never leave your device.',
  },
  {
    question: 'Why would I choose WAV over MP3?',
    answer: 'WAV is lossless and preserves all audio quality, ideal for professional use or further editing. MP3 is smaller but loses some quality.',
  },
  {
    question: 'What does the quality setting affect?',
    answer: 'The quality setting controls the bitrate for MP3 output. Higher bitrates mean better quality but larger files. For WAV, quality is always lossless.',
  },
  {
    question: 'Are there file size limits?',
    answer: 'There is no hard limit, but very large files may be slow to process depending on your device. Files under 100MB work best.',
  },
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function AudioConverter() {
  const {
    file,
    inputFormat,
    outputFormat,
    quality,
    isConverting,
    progress,
    result,
    error,
    setFile,
    setOutputFormat,
    setQuality,
    convert,
    download,
    reset,
  } = useAudioConverter();

  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('audio/')) {
      setFile(droppedFile);
    }
  }, [setFile]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  }, [setFile]);

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Audio Converter',
    description: 'Convert audio files between MP3, WAV, OGG, and AAC formats directly in your browser.',
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
    <SiteLayout toolName="Audio Converter" category="converters">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Convert Your Audio
          </h2>

          {/* File Upload */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors mb-6 ${
              isDragging
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            {file ? (
              <div>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{file.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {formatFileSize(file.size)} | Format: {inputFormat.toUpperCase()}
                </p>
                <button
                  onClick={reset}
                  className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Choose different file
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Drag and drop an audio file here, or
                </p>
                <label className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors">
                  Browse Files
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Supported: MP3, WAV, OGG, AAC
                </p>
              </div>
            )}
          </div>

          {/* Output Format */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Output Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              {OUTPUT_FORMATS.map((fmt) => (
                <button
                  key={fmt.value}
                  onClick={() => setOutputFormat(fmt.value)}
                  className={`p-3 rounded-lg border-2 text-left transition-colors ${
                    outputFormat === fmt.value
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-white">{fmt.label}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{fmt.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Quality Settings */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quality {outputFormat === 'wav' && '(WAV is always lossless)'}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {QUALITY_OPTIONS.map((q) => (
                <button
                  key={q.value}
                  onClick={() => setQuality(q.value)}
                  disabled={outputFormat === 'wav'}
                  className={`p-3 rounded-lg border-2 text-center transition-colors ${
                    quality === q.value && outputFormat !== 'wav'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600'
                  } ${outputFormat === 'wav' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="font-medium text-gray-900 dark:text-white">{q.label}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{q.bitrate}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Progress Indicator */}
          {isConverting && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
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

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-700 dark:text-green-400 font-medium">Conversion complete!</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {result.filename} | {formatFileSize(result.size)} | Duration: {formatDuration(result.duration)}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            {!result ? (
              <button
                onClick={convert}
                disabled={!file || isConverting}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                {isConverting ? 'Converting...' : 'Convert'}
              </button>
            ) : (
              <button
                onClick={download}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                Download
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

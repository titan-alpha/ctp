'use client';

import { useState, useCallback } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useMp3ToWav } from '@/hooks/useMp3ToWav';

const FEATURES = [
  {
    title: 'Lossless WAV Output',
    description: 'Convert your MP3 files to uncompressed WAV format with PCM 16-bit encoding for maximum audio quality.',
  },
  {
    title: 'Browser-Based Processing',
    description: 'All conversion happens locally in your browser using the Web Audio API. Your files never leave your device.',
  },
  {
    title: 'Instant Preview',
    description: 'Preview both your original MP3 and the converted WAV file before downloading to ensure quality.',
  },
];

const FAQS = [
  {
    question: 'Why convert MP3 to WAV?',
    answer: 'WAV is an uncompressed audio format that preserves full audio quality. Converting MP3 to WAV is useful for audio editing, professional production, or when software requires uncompressed audio input.',
  },
  {
    question: 'Will converting MP3 to WAV improve audio quality?',
    answer: 'No, converting MP3 to WAV will not restore quality lost during MP3 compression. However, WAV prevents further quality loss and is better for editing workflows.',
  },
  {
    question: 'Is my audio file uploaded to a server?',
    answer: 'No, all conversion happens entirely in your browser using the Web Audio API. Your files never leave your device, ensuring complete privacy.',
  },
  {
    question: 'What sample rates are supported?',
    answer: 'The converter preserves the original sample rate of your MP3 file. Common rates like 44.1kHz, 48kHz, and others are all supported.',
  },
  {
    question: 'Why are WAV files larger than MP3?',
    answer: 'WAV files are uncompressed, storing raw audio data. A typical WAV file is 10x larger than an equivalent MP3. This is the trade-off for lossless quality.',
  },
  {
    question: 'Are there file size limits?',
    answer: 'There is no hard limit, but large files may be slower to process. Files under 50MB work best for optimal performance in the browser.',
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

export function Mp3ToWav() {
  const {
    file,
    isConverting,
    progress,
    result,
    error,
    setFile,
    convert,
    download,
    reset,
  } = useMp3ToWav();

  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
    if (droppedFile && (droppedFile.type === 'audio/mpeg' || droppedFile.name.endsWith('.mp3'))) {
      setFile(droppedFile);
      setPreviewUrl(URL.createObjectURL(droppedFile));
    }
  }, [setFile]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  }, [setFile]);

  const handleReset = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    reset();
  }, [previewUrl, reset]);

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'MP3 to WAV Converter',
    description: 'Convert MP3 audio files to WAV format directly in your browser with lossless PCM 16-bit encoding.',
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
    <SiteLayout toolName="MP3 to WAV Converter" category="converters">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Convert MP3 to WAV
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
                  {formatFileSize(file.size)}
                </p>
                <button
                  onClick={handleReset}
                  className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Choose different file
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Drag and drop an MP3 file here, or
                </p>
                <label className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors">
                  Browse Files
                  <input
                    type="file"
                    accept=".mp3,audio/mpeg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Supported: MP3 audio files
                </p>
              </div>
            )}
          </div>

          {/* Audio Preview - Original */}
          {previewUrl && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Original MP3 Preview
              </label>
              <audio controls className="w-full" src={previewUrl}>
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

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
            <div className="mb-6">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg mb-4">
                <p className="text-green-700 dark:text-green-400 font-medium">Conversion complete!</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {result.filename} | {formatFileSize(result.size)} | Duration: {formatDuration(result.duration)} | Sample Rate: {result.sampleRate} Hz
                </p>
              </div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Converted WAV Preview
              </label>
              <audio controls className="w-full" src={result.url}>
                Your browser does not support the audio element.
              </audio>
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
                {isConverting ? 'Converting...' : 'Convert to WAV'}
              </button>
            ) : (
              <button
                onClick={download}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                Download WAV
              </button>
            )}
            <button
              onClick={handleReset}
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

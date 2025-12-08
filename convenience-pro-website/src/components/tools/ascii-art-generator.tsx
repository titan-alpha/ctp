'use client';

import { useState, useCallback } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useAsciiArtGenerator, CharacterSet } from '@/hooks/useAsciiArtGenerator';

const FEATURES = [
  {
    title: 'Multiple Character Sets',
    description: 'Choose from standard, detailed, or block characters to create different ASCII art styles.',
  },
  {
    title: 'Adjustable Width',
    description: 'Control the output width from 20 to 200 characters per line for the perfect size.',
  },
  {
    title: 'Client-Side Processing',
    description: 'All image processing happens in your browser. Your images never leave your device.',
  },
];

const FAQS = [
  {
    question: 'What is ASCII art?',
    answer: 'ASCII art is a graphic design technique that creates images using text characters. It originated in the early days of computing when graphics were limited.',
  },
  {
    question: 'How does the conversion work?',
    answer: 'The tool analyzes each pixel brightness in your image and maps it to a corresponding ASCII character. Darker pixels get denser characters, lighter pixels get sparser ones.',
  },
  {
    question: 'What character sets are available?',
    answer: 'Three sets: Standard (10 characters for basic art), Detailed (70 characters for high detail), and Blocks (Unicode block characters for a different aesthetic).',
  },
  {
    question: 'Which image formats are supported?',
    answer: 'This tool supports JPEG, PNG, WebP, GIF, and BMP image formats.',
  },
  {
    question: 'How do I get the best results?',
    answer: 'Use high-contrast images with clear subjects. Adjust the width based on where you plan to display the art. Simple images often work better than complex scenes.',
  },
  {
    question: 'Are my images uploaded to a server?',
    answer: 'No. All processing happens locally in your browser using the HTML5 Canvas API. Your images never leave your device.',
  },
];

const CHARACTER_SET_OPTIONS: { value: CharacterSet; label: string; description: string }[] = [
  { value: 'standard', label: 'Standard', description: '10 characters - balanced detail' },
  { value: 'detailed', label: 'Detailed', description: '70 characters - maximum detail' },
  { value: 'blocks', label: 'Blocks', description: 'Unicode blocks - modern style' },
];

export function AsciiArtGenerator() {
  const {
    originalImage,
    result,
    width,
    characterSet,
    isProcessing,
    error,
    loadImage,
    setWidth,
    setCharacterSet,
    generateAscii,
    reset,
  } = useAsciiArtGenerator();
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleCopy = useCallback(() => {
    if (!result) return;
    navigator.clipboard.writeText(result.ascii);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  const handleDownload = useCallback(() => {
    if (!result) return;
    const blob = new Blob([result.ascii], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ascii-art.txt';
    link.click();
    URL.revokeObjectURL(url);
  }, [result]);

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ASCII Art Generator',
    description: 'Convert images to ASCII art online for free. Multiple character sets, adjustable width, and client-side processing.',
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
    <SiteLayout toolName="ASCII Art Generator" category="generators">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Convert Image to ASCII Art
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
                <img
                  src={originalImage}
                  alt="Original"
                  className="max-h-48 mx-auto object-contain rounded border border-gray-200 dark:border-gray-700"
                />
              </div>

              {/* Character Set Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Character Set
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {CHARACTER_SET_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setCharacterSet(option.value)}
                      className={`p-3 rounded-lg border text-left transition-colors ${
                        characterSet === option.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-medium text-gray-900 dark:text-white text-sm">
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {option.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Width Slider */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Width (characters)
                  </label>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{width}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="200"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>20</span>
                  <span>110</span>
                  <span>200</span>
                </div>
              </div>

              {/* Generate Button */}
              <div className="flex flex-wrap gap-3 mb-6">
                <button
                  onClick={generateAscii}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
                >
                  {isProcessing ? 'Generating...' : 'Generate ASCII Art'}
                </button>
                <button
                  onClick={reset}
                  className="px-4 py-2 text-red-600 hover:text-red-700 dark:text-red-400 font-medium transition-colors"
                >
                  Reset
                </button>
              </div>

              {/* ASCII Output */}
              {result && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Output ({result.width}x{result.height} characters)
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={handleCopy}
                        className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors"
                      >
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                      <button
                        onClick={handleDownload}
                        className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                      >
                        Download TXT
                      </button>
                    </div>
                  </div>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs leading-none font-mono whitespace-pre">
                    {result.ascii}
                  </pre>
                </div>
              )}
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

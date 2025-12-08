'use client';

import { useRef } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useYoutubeThumbnailMaker, FONT_FAMILIES } from '@/hooks/useYoutubeThumbnailMaker';

const FEATURES = [
  {
    title: 'YouTube-Optimized Size',
    description: 'Creates thumbnails at the perfect 1280x720 resolution recommended by YouTube for best quality.',
  },
  {
    title: 'Custom Text Overlays',
    description: 'Add multiple text layers with different fonts, colors, and stroke effects to make your text pop.',
  },
  {
    title: 'Background Image Upload',
    description: 'Upload your own background images and customize with eye-catching text to increase click-through rates.',
  },
];

const FAQS = [
  {
    question: 'What is the ideal YouTube thumbnail size?',
    answer: 'YouTube recommends 1280x720 pixels with a 16:9 aspect ratio. This tool automatically creates thumbnails at this exact size for optimal display on all devices.',
  },
  {
    question: 'What file format should I use for YouTube thumbnails?',
    answer: 'YouTube accepts JPG, GIF, and PNG formats under 2MB. This tool exports high-quality PNG files which maintain sharp text and graphics.',
  },
  {
    question: 'How can I make my thumbnail stand out?',
    answer: 'Use bold, contrasting colors, large readable text, and expressive faces if applicable. Keep text minimal and use the stroke effect to make it readable over any background.',
  },
  {
    question: 'Can I add multiple text elements to my thumbnail?',
    answer: 'Yes! You can add as many text overlays as you need, each with its own font, size, color, and position. This allows for creative multi-line designs.',
  },
  {
    question: 'What fonts work best for YouTube thumbnails?',
    answer: 'Bold, sans-serif fonts like Impact and Arial Black are popular choices because they are easily readable even at small sizes. The tool provides several font options to choose from.',
  },
  {
    question: 'Why is my thumbnail text hard to read?',
    answer: 'Try increasing the stroke width to add a contrasting outline around your text. Also ensure there is good contrast between your text color and background.',
  },
];

export function YoutubeThumbnailMaker() {
  const {
    options,
    addTextOverlay,
    updateTextOverlay,
    removeTextOverlay,
    result,
    isProcessing,
    error,
    canvasRef,
    generateThumbnail,
    uploadBackground,
    reset,
    setOptions,
    backgroundImage,
  } = useYoutubeThumbnailMaker();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadBackground(file);
    }
  };

  const handleDownload = () => {
    if (result) {
      const link = document.createElement('a');
      link.href = result.url;
      link.download = 'youtube-thumbnail.png';
      link.click();
    }
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'YouTube Thumbnail Maker',
    description: 'Create eye-catching YouTube thumbnails with custom text overlays, backgrounds, and effects.',
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
    <SiteLayout toolName="YouTube Thumbnail Maker" category="social-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Create Your Thumbnail
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Preview Canvas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preview (1280x720)
              </label>
              <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={1280}
                  height={720}
                  className="w-full h-auto"
                  style={{ aspectRatio: '16/9' }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-6">
              {/* Background Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Background Image
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                  >
                    {backgroundImage ? 'Change Image' : 'Upload Image'}
                  </button>
                  {!backgroundImage && (
                    <input
                      type="color"
                      value={options.backgroundColor}
                      onChange={(e) => setOptions({ backgroundColor: e.target.value })}
                      className="h-10 w-20 rounded cursor-pointer"
                      title="Background Color"
                    />
                  )}
                </div>
              </div>

              {/* Add Text Button */}
              <div>
                <button
                  onClick={addTextOverlay}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  + Add Text
                </button>
              </div>

              {/* Text Overlays */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {options.overlays.map((overlay, index) => (
                  <div key={index} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium text-gray-900 dark:text-white">Text {index + 1}</span>
                      <button
                        onClick={() => removeTextOverlay(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>

                    <input
                      type="text"
                      value={overlay.text}
                      onChange={(e) => updateTextOverlay(index, { text: e.target.value })}
                      placeholder="Enter text"
                      className="w-full px-3 py-2 mb-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <select
                        value={overlay.fontFamily}
                        onChange={(e) => updateTextOverlay(index, { fontFamily: e.target.value })}
                        className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                      >
                        {FONT_FAMILIES.map((font) => (
                          <option key={font} value={font}>{font}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={overlay.fontSize}
                        onChange={(e) => updateTextOverlay(index, { fontSize: parseInt(e.target.value) || 72 })}
                        className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                        min={12}
                        max={200}
                      />
                    </div>

                    <div className="grid grid-cols-4 gap-2 mb-3">
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400">Fill</label>
                        <input
                          type="color"
                          value={overlay.color}
                          onChange={(e) => updateTextOverlay(index, { color: e.target.value })}
                          className="w-full h-8 rounded cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400">Stroke</label>
                        <input
                          type="color"
                          value={overlay.strokeColor}
                          onChange={(e) => updateTextOverlay(index, { strokeColor: e.target.value })}
                          className="w-full h-8 rounded cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400">X</label>
                        <input
                          type="number"
                          value={overlay.x}
                          onChange={(e) => updateTextOverlay(index, { x: parseInt(e.target.value) || 0 })}
                          className="w-full px-1 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                          min={0}
                          max={1280}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400">Y</label>
                        <input
                          type="number"
                          value={overlay.y}
                          onChange={(e) => updateTextOverlay(index, { y: parseInt(e.target.value) || 0 })}
                          className="w-full px-1 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                          min={0}
                          max={720}
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <label className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                        <input
                          type="checkbox"
                          checked={overlay.bold}
                          onChange={(e) => updateTextOverlay(index, { bold: e.target.checked })}
                        />
                        Bold
                      </label>
                      <label className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                        <input
                          type="checkbox"
                          checked={overlay.italic}
                          onChange={(e) => updateTextOverlay(index, { italic: e.target.checked })}
                        />
                        Italic
                      </label>
                      <div className="flex items-center gap-1">
                        <label className="text-xs text-gray-500 dark:text-gray-400">Stroke Width</label>
                        <input
                          type="number"
                          value={overlay.strokeWidth}
                          onChange={(e) => updateTextOverlay(index, { strokeWidth: parseInt(e.target.value) || 0 })}
                          className="w-16 px-1 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                          min={0}
                          max={20}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={generateThumbnail}
              disabled={isProcessing}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
            >
              {isProcessing ? 'Generating...' : 'Generate Thumbnail'}
            </button>
            {result && (
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

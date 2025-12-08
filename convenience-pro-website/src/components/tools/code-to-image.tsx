'use client';

import { useState, useCallback, useEffect } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useCodeToImage, detectLanguage, Theme, Language } from '@/hooks/useCodeToImage';

const FEATURES = [
  {
    title: 'Syntax Highlighting',
    description: 'Beautiful syntax highlighting for 15+ programming languages with automatic language detection.',
  },
  {
    title: 'Multiple Themes',
    description: 'Choose from dark, light, Monokai, and GitHub themes to match your style or presentation.',
  },
  {
    title: 'Customizable Output',
    description: 'Adjust padding, font size, line numbers, and background color to create the perfect code snippet.',
  },
];

const FAQS = [
  {
    question: 'What is Code to Image?',
    answer: 'Code to Image converts your source code into beautiful, shareable images with syntax highlighting. Perfect for social media, presentations, and documentation.',
  },
  {
    question: 'Which programming languages are supported?',
    answer: 'We support JavaScript, TypeScript, Python, HTML, CSS, JSON, Bash, SQL, Java, C++, Go, Rust, PHP, Ruby, and plain text with automatic language detection.',
  },
  {
    question: 'What themes are available?',
    answer: 'Four themes are available: Dark (VS Code style), Light, Monokai (Sublime Text style), and GitHub. Each theme provides professional syntax highlighting.',
  },
  {
    question: 'Can I customize the output?',
    answer: 'Yes! You can adjust padding, font size, toggle line numbers, and set a custom background color. All changes are reflected in the live preview.',
  },
  {
    question: 'What image formats can I download?',
    answer: 'You can download your code snippets as PNG (lossless, transparent support) or JPG (smaller file size) formats.',
  },
  {
    question: 'Is my code secure?',
    answer: 'Absolutely. All processing happens locally in your browser. Your code never leaves your device or gets uploaded to any server.',
  },
];

const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'bash', label: 'Bash' },
  { value: 'sql', label: 'SQL' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'plain', label: 'Plain Text' },
];

const THEMES: { value: Theme; label: string }[] = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
  { value: 'monokai', label: 'Monokai' },
  { value: 'github', label: 'GitHub' },
];

export function CodeToImage() {
  const {
    code,
    setCode,
    options,
    setOptions,
    previewUrl,
    result,
    isProcessing,
    error,
    generateImage,
    reset,
  } = useCodeToImage();

  const [autoDetect, setAutoDetect] = useState(true);

  useEffect(() => {
    if (autoDetect && code.trim()) {
      const detected = detectLanguage(code);
      if (detected !== options.language) {
        setOptions({ language: detected });
      }
    }
  }, [code, autoDetect, options.language, setOptions]);

  const handleCodeChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  }, [setCode]);

  const handleDownload = useCallback((format: 'png' | 'jpeg') => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result.url;
    link.download = `code-snippet.${format === 'jpeg' ? 'jpg' : 'png'}`;
    link.click();
  }, [result]);

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Code to Image Generator',
    description: 'Convert code snippets to beautiful images with syntax highlighting. Support for 15+ languages and multiple themes.',
    applicationCategory: 'DeveloperApplication',
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
    <SiteLayout toolName="Code to Image" category="generators">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-5xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Convert Code to Image
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Code
                </label>
                <textarea
                  value={code}
                  onChange={handleCodeChange}
                  placeholder="Paste your code here..."
                  className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Language
                  </label>
                  <select
                    value={options.language}
                    onChange={(e) => {
                      setAutoDetect(false);
                      setOptions({ language: e.target.value as Language });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.value} value={lang.value}>{lang.label}</option>
                    ))}
                  </select>
                  <label className="flex items-center mt-1 text-xs text-gray-500">
                    <input
                      type="checkbox"
                      checked={autoDetect}
                      onChange={(e) => setAutoDetect(e.target.checked)}
                      className="mr-1"
                    />
                    Auto-detect
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Theme
                  </label>
                  <select
                    value={options.theme}
                    onChange={(e) => setOptions({ theme: e.target.value as Theme })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {THEMES.map((theme) => (
                      <option key={theme.value} value={theme.value}>{theme.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Padding: {options.padding}px
                  </label>
                  <input
                    type="range"
                    min="8"
                    max="64"
                    value={options.padding}
                    onChange={(e) => setOptions({ padding: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Font Size: {options.fontSize}px
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="24"
                    value={options.fontSize}
                    onChange={(e) => setOptions({ fontSize: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-4">
                <label className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={options.showLineNumbers}
                    onChange={(e) => setOptions({ showLineNumbers: e.target.checked })}
                    className="mr-2"
                  />
                  Show Line Numbers
                </label>

                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-700 dark:text-gray-300">Background:</label>
                  <input
                    type="color"
                    value={options.backgroundColor || '#1e1e1e'}
                    onChange={(e) => setOptions({ backgroundColor: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                  <button
                    onClick={() => setOptions({ backgroundColor: '' })}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => generateImage('png')}
                  disabled={isProcessing || !code.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
                >
                  {isProcessing ? 'Generating...' : 'Generate Image'}
                </button>
                {result && (
                  <>
                    <button
                      onClick={() => handleDownload('png')}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Download PNG
                    </button>
                    <button
                      onClick={() => handleDownload('jpeg')}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Download JPG
                    </button>
                  </>
                )}
                <button
                  onClick={reset}
                  className="px-4 py-2 text-red-600 hover:text-red-700 dark:text-red-400 font-medium transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Preview Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preview
              </label>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-100 dark:bg-gray-900 min-h-64 flex items-center justify-center">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Code preview"
                    className="max-w-full max-h-96 object-contain rounded"
                  />
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    Enter code and click &quot;Generate Image&quot; to see preview
                  </p>
                )}
              </div>
              {result && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Size: {result.width} x {result.height}px
                </p>
              )}
            </div>
          </div>

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

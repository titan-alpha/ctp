'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useEnvFileGenerator, FrameworkTemplate } from '@/hooks/useEnvFileGenerator';

const TEMPLATES: { value: FrameworkTemplate; label: string }[] = [
  { value: 'nextjs', label: 'Next.js' },
  { value: 'react', label: 'React (CRA)' },
  { value: 'node', label: 'Node.js' },
  { value: 'django', label: 'Django' },
  { value: 'laravel', label: 'Laravel' },
  { value: 'rails', label: 'Ruby on Rails' },
  { value: 'custom', label: 'Custom' },
];

const FEATURES = [
  {
    title: 'Framework Templates',
    description: 'Start quickly with pre-configured templates for Next.js, React, Node.js, Django, Laravel, and Rails.',
  },
  {
    title: 'Format Validation',
    description: 'Validates environment variable names and detects duplicate keys to ensure proper .env formatting.',
  },
  {
    title: 'Instant Download',
    description: 'Download your generated .env file instantly with proper formatting and quoted values where needed.',
  },
];

const FAQS = [
  {
    question: 'What is an .env file?',
    answer: 'An .env file is a configuration file used to store environment variables for your application. It keeps sensitive data like API keys, database credentials, and configuration settings separate from your code.',
  },
  {
    question: 'Should I commit .env files to version control?',
    answer: 'No, .env files typically contain sensitive information and should be added to .gitignore. Instead, provide a .env.example file with placeholder values for other developers.',
  },
  {
    question: 'What is the difference between NEXT_PUBLIC_ and regular variables?',
    answer: 'In Next.js, variables prefixed with NEXT_PUBLIC_ are exposed to the browser. Regular environment variables are only available on the server side for security.',
  },
  {
    question: 'How do I use environment variables in my code?',
    answer: 'Access them via process.env.VARIABLE_NAME in Node.js/Next.js, os.environ["VARIABLE_NAME"] in Python, or the appropriate method for your framework.',
  },
  {
    question: 'Can I use special characters in .env values?',
    answer: 'Yes, values with spaces or special characters should be wrapped in quotes. This generator automatically handles quoting for values that need it.',
  },
  {
    question: 'What naming convention should I use for env variables?',
    answer: 'Use SCREAMING_SNAKE_CASE (all uppercase with underscores). Variable names must start with a letter or underscore and contain only alphanumeric characters and underscores.',
  },
];

export function EnvFileGenerator() {
  const {
    entries,
    content,
    errors,
    addEntry,
    removeEntry,
    updateEntry,
    applyTemplate,
    reset,
    validate,
  } = useEnvFileGenerator();
  const [copied, setCopied] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<FrameworkTemplate>('custom');

  const handleTemplateChange = (template: FrameworkTemplate) => {
    setSelectedTemplate(template);
    applyTemplate(template);
  };

  const handleCopy = async () => {
    if (!validate()) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!validate()) return;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '.env';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getErrorForEntry = (id: string) => errors.find((e) => e.id === id);

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Env File Generator',
    description: 'Generate .env files from key-value pairs with templates for popular frameworks like Next.js, React, Node.js, Django, and Laravel.',
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
    <SiteLayout toolName="Env File Generator" category="developer-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Generate .env File
          </h2>

          {/* Template Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Framework Template
            </label>
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map((template) => (
                <button
                  key={template.value}
                  onClick={() => handleTemplateChange(template.value)}
                  className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                    selectedTemplate === template.value
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {template.label}
                </button>
              ))}
            </div>
          </div>

          {/* Key-Value Rows */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Environment Variables
            </label>
            <div className="space-y-3">
              {entries.map((entry) => {
                const error = getErrorForEntry(entry.id);
                return (
                  <div key={entry.id}>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={entry.key}
                        onChange={(e) => updateEntry(entry.id, 'key', e.target.value)}
                        placeholder="VARIABLE_NAME"
                        className={`flex-1 px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 ${
                          error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                      />
                      <input
                        type="text"
                        value={entry.value}
                        onChange={(e) => updateEntry(entry.id, 'value', e.target.value)}
                        placeholder="value"
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                      />
                      <button
                        onClick={() => removeEntry(entry.id)}
                        className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                        title="Remove"
                      >
                        X
                      </button>
                    </div>
                    {error && (
                      <p className="text-red-500 text-sm mt-1">{error.message}</p>
                    )}
                  </div>
                );
              })}
            </div>
            <button
              onClick={addEntry}
              className="mt-3 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              + Add Variable
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              Download .env
            </button>
            <button
              onClick={handleCopy}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
            <button
              onClick={reset}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Preview Output */}
        {content && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Preview
            </h3>
            <pre className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-auto max-h-96 text-sm text-gray-800 dark:text-gray-200">
              {content}
            </pre>
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

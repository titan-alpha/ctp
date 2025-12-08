'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useHttpRequestBuilder, HttpMethod, BodyType, KeyValuePair } from '@/hooks/useHttpRequestBuilder';

const HTTP_METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

const BODY_TYPES: { value: BodyType; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'json', label: 'JSON' },
  { value: 'form-data', label: 'Form Data' },
];

const FEATURES = [
  {
    title: 'Multiple HTTP Methods',
    description: 'Build requests for GET, POST, PUT, DELETE, and PATCH methods with proper configuration.',
  },
  {
    title: 'Code Generation',
    description: 'Automatically generate curl commands and JavaScript fetch code ready to copy and use.',
  },
  {
    title: 'Headers & Parameters',
    description: 'Add custom headers and query parameters with easy-to-use key-value pair inputs.',
  },
];

const FAQS = [
  {
    question: 'What HTTP methods are supported?',
    answer: 'The tool supports GET, POST, PUT, DELETE, and PATCH methods, covering all common REST API operations.',
  },
  {
    question: 'Can I add custom headers?',
    answer: 'Yes, you can add multiple custom headers with key-value pairs. Each header can be enabled or disabled individually.',
  },
  {
    question: 'What body formats are supported?',
    answer: 'The tool supports JSON and form-data body formats. For JSON, the Content-Type header is automatically added.',
  },
  {
    question: 'How do I use the generated curl command?',
    answer: 'Copy the generated curl command and paste it directly into your terminal to execute the HTTP request.',
  },
  {
    question: 'Is the generated fetch code production-ready?',
    answer: 'The fetch code provides a working template. You may need to add error handling and modify it for your specific use case.',
  },
  {
    question: 'Are query parameters automatically encoded?',
    answer: 'Yes, query parameters are URL-encoded automatically when building the request URL.',
  },
];

function KeyValueRow({
  pair,
  onUpdate,
  onRemove,
  onToggle,
}: {
  pair: KeyValuePair;
  onUpdate: (field: 'key' | 'value', value: string) => void;
  onRemove: () => void;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <input
        type="checkbox"
        checked={pair.enabled}
        onChange={onToggle}
        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
      />
      <input
        type="text"
        value={pair.key}
        onChange={(e) => onUpdate('key', e.target.value)}
        placeholder="Key"
        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
      />
      <input
        type="text"
        value={pair.value}
        onChange={(e) => onUpdate('value', e.target.value)}
        placeholder="Value"
        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
      />
      <button
        onClick={onRemove}
        className="px-2 py-2 text-red-600 hover:text-red-800 dark:text-red-400"
      >
        X
      </button>
    </div>
  );
}

export function HttpRequestBuilder() {
  const {
    config,
    generatedCode,
    setMethod,
    setUrl,
    setBodyType,
    setBody,
    addHeader,
    removeHeader,
    updateHeader,
    toggleHeader,
    addQueryParam,
    removeQueryParam,
    updateQueryParam,
    toggleQueryParam,
    generate,
  } = useHttpRequestBuilder();

  const [copiedCurl, setCopiedCurl] = useState(false);
  const [copiedFetch, setCopiedFetch] = useState(false);

  const copyToClipboard = async (text: string, type: 'curl' | 'fetch') => {
    await navigator.clipboard.writeText(text);
    if (type === 'curl') {
      setCopiedCurl(true);
      setTimeout(() => setCopiedCurl(false), 2000);
    } else {
      setCopiedFetch(true);
      setTimeout(() => setCopiedFetch(false), 2000);
    }
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'HTTP Request Builder',
    description: 'Build HTTP requests and generate curl commands and fetch code for API testing.',
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
    <SiteLayout toolName="HTTP Request Builder" category="developer-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Build HTTP Request
          </h2>

          {/* Method and URL */}
          <div className="flex gap-2 mb-6">
            <select
              value={config.method}
              onChange={(e) => setMethod(e.target.value as HttpMethod)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium"
            >
              {HTTP_METHODS.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={config.url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://api.example.com/endpoint"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Headers */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Headers
              </label>
              <button
                onClick={addHeader}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
              >
                + Add Header
              </button>
            </div>
            {config.headers.map((header) => (
              <KeyValueRow
                key={header.id}
                pair={header}
                onUpdate={(field, value) => updateHeader(header.id, field, value)}
                onRemove={() => removeHeader(header.id)}
                onToggle={() => toggleHeader(header.id)}
              />
            ))}
          </div>

          {/* Query Parameters */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Query Parameters
              </label>
              <button
                onClick={addQueryParam}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
              >
                + Add Parameter
              </button>
            </div>
            {config.queryParams.map((param) => (
              <KeyValueRow
                key={param.id}
                pair={param}
                onUpdate={(field, value) => updateQueryParam(param.id, field, value)}
                onRemove={() => removeQueryParam(param.id)}
                onToggle={() => toggleQueryParam(param.id)}
              />
            ))}
          </div>

          {/* Body Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Body Type
            </label>
            <div className="flex gap-4">
              {BODY_TYPES.map((bt) => (
                <label key={bt.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="bodyType"
                    checked={config.bodyType === bt.value}
                    onChange={() => setBodyType(bt.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{bt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Body Editor */}
          {config.bodyType !== 'none' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Request Body {config.bodyType === 'json' ? '(JSON)' : '(key=value&key2=value2)'}
              </label>
              <textarea
                value={config.body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={config.bodyType === 'json' ? '{\n  "key": "value"\n}' : 'key=value&key2=value2'}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
              />
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={generate}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Generate Code
          </button>
        </div>

        {/* Generated curl */}
        {generatedCode.curl && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                curl Command
              </h3>
              <button
                onClick={() => copyToClipboard(generatedCode.curl, 'curl')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {copiedCurl ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{generatedCode.curl}</code>
            </pre>
          </div>
        )}

        {/* Generated fetch */}
        {generatedCode.fetch && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                JavaScript Fetch
              </h3>
              <button
                onClick={() => copyToClipboard(generatedCode.fetch, 'fetch')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {copiedFetch ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{generatedCode.fetch}</code>
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

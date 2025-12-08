'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useApiMockGenerator, DataType, FieldsMap, DEFAULT_FIELDS } from '@/hooks/useApiMockGenerator';

const DATA_TYPES: { value: DataType; label: string }[] = [
  { value: 'user', label: 'User' },
  { value: 'product', label: 'Product' },
  { value: 'order', label: 'Order' },
  { value: 'post', label: 'Post' },
];

const FIELD_LABELS: Record<DataType, Record<string, string>> = {
  user: { id: 'ID', name: 'Name', email: 'Email', phone: 'Phone', address: 'Address', avatar: 'Avatar', createdAt: 'Created At' },
  product: { id: 'ID', name: 'Name', description: 'Description', price: 'Price', category: 'Category', stock: 'Stock', image: 'Image', rating: 'Rating' },
  order: { id: 'ID', userId: 'User ID', products: 'Products', total: 'Total', status: 'Status', shippingAddress: 'Shipping Address', createdAt: 'Created At' },
  post: { id: 'ID', title: 'Title', body: 'Body', authorId: 'Author ID', tags: 'Tags', likes: 'Likes', createdAt: 'Created At' },
};

const FEATURES = [
  {
    title: 'Multiple Data Types',
    description: 'Generate mock data for users, products, orders, and blog posts with realistic field values.',
  },
  {
    title: 'Customizable Fields',
    description: 'Select exactly which fields to include in your mock data to match your API schema.',
  },
  {
    title: 'Instant JSON Output',
    description: 'Get properly formatted JSON output ready to copy and use in your development workflow.',
  },
];

const FAQS = [
  {
    question: 'What types of mock data can I generate?',
    answer: 'You can generate mock data for four common API resource types: users (with names, emails, addresses), products (with prices, categories, stock), orders (with line items, totals, status), and blog posts (with titles, content, tags).',
  },
  {
    question: 'Is the generated data random each time?',
    answer: 'Yes, each time you click Generate, completely new random data is created. This is useful for testing with varied data sets.',
  },
  {
    question: 'Can I control the array size?',
    answer: 'Yes, you can generate a single object or an array of up to 100 items using the count selector.',
  },
  {
    question: 'Is this tool free to use?',
    answer: 'Yes, this tool is completely free. All data generation happens in your browser with no server requests.',
  },
  {
    question: 'Can I customize which fields are included?',
    answer: 'Yes, use the field checkboxes to select exactly which fields you want in your mock data. Uncheck fields you do not need.',
  },
  {
    question: 'What format is the output?',
    answer: 'The output is valid JSON, properly formatted with indentation. You can copy it directly to use in your code, API testing tools, or databases.',
  },
];

export function ApiMockGenerator() {
  const { jsonOutput, generate } = useApiMockGenerator();
  const [dataType, setDataType] = useState<DataType>('user');
  const [count, setCount] = useState(1);
  const [fields, setFields] = useState<FieldsMap>(DEFAULT_FIELDS);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    generate(dataType, fields[dataType], count);
  };

  const toggleField = (field: string) => {
    setFields((prev) => ({
      ...prev,
      [dataType]: {
        ...prev[dataType],
        [field]: !prev[dataType][field as keyof typeof prev[typeof dataType]],
      },
    }));
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(jsonOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'API Mock Generator',
    description: 'Generate mock JSON responses for API testing and development.',
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

  const currentFields = fields[dataType];

  return (
    <SiteLayout toolName="API Mock Generator" category="developer-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Generate Mock API Data
          </h2>

          {/* Data Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data Type
            </label>
            <select
              value={dataType}
              onChange={(e) => setDataType(e.target.value as DataType)}
              className="w-full md:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {DATA_TYPES.map((dt) => (
                <option key={dt.value} value={dt.value}>
                  {dt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Field Checkboxes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fields to Include
            </label>
            <div className="flex flex-wrap gap-3">
              {Object.keys(currentFields).map((field) => (
                <label key={field} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentFields[field as keyof typeof currentFields]}
                    onChange={() => toggleField(field)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {FIELD_LABELS[dataType][field]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Count Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Count (Array Size)
            </label>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
              min={1}
              max={100}
              className="w-full md:w-32 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">1-100 items</p>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Generate Mock Data
          </button>
        </div>

        {/* JSON Output */}
        {jsonOutput && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                JSON Output
              </h3>
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {copied ? 'Copied!' : 'Copy JSON'}
              </button>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm max-h-96 overflow-y-auto">
              <code>{jsonOutput}</code>
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

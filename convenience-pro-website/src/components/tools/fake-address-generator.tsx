'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useFakeAddressGenerator, Country, FakeAddress } from '@/hooks/useFakeAddressGenerator';

const COUNTRIES: { value: Country; label: string }[] = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
];

const FEATURES = [
  {
    title: 'Multiple Countries',
    description: 'Generate realistic addresses for US, UK, Canada, Australia, and Germany with proper formatting.',
  },
  {
    title: 'Valid-Looking Data',
    description: 'All addresses use real city names, valid state/postal codes, and proper street naming conventions.',
  },
  {
    title: 'Bulk Generation',
    description: 'Generate multiple addresses at once for batch testing scenarios and data population.',
  },
];

const FAQS = [
  {
    question: 'Are these real addresses?',
    answer: 'No, these are randomly generated fake addresses. While they use real city and state names with valid-looking formats, the specific street addresses are fictional and should not be used for any purpose other than testing.',
  },
  {
    question: 'Can I use these addresses for testing?',
    answer: 'Yes, these addresses are perfect for testing form validations, database schemas, e-commerce checkouts, and other software development scenarios where you need realistic-looking address data.',
  },
  {
    question: 'Are the zip/postal codes valid?',
    answer: 'The zip and postal codes follow the correct format for each country and use prefixes that correspond to the selected state/region, but they may not be actual valid codes for the generated street addresses.',
  },
  {
    question: 'Can I use these for shipping or legal documents?',
    answer: 'Absolutely not. These are fake addresses intended only for software testing and development. Never use generated addresses for actual shipping, legal documents, or any official purpose.',
  },
  {
    question: 'How random are the generated addresses?',
    answer: 'Each address is randomly generated from curated lists of street names, cities, and states. The street numbers, apartment numbers, and postal codes are randomly generated within valid ranges.',
  },
  {
    question: 'Is there a limit to how many addresses I can generate?',
    answer: 'No, you can generate as many addresses as you need. The generator runs entirely in your browser with no server requests or rate limits.',
  },
];

export function FakeAddressGenerator() {
  const { addresses, generateAddress, generateMultiple, clearAddresses } = useFakeAddressGenerator();
  const [country, setCountry] = useState<Country>('us');
  const [quantity, setQuantity] = useState(1);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleGenerate = () => {
    if (quantity === 1) {
      generateAddress(country);
    } else {
      generateMultiple(country, quantity);
    }
  };

  const copyToClipboard = async (text: string, fieldId: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Fake Address Generator',
    description: 'Generate realistic fake addresses for testing and development purposes.',
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
    <SiteLayout toolName="Fake Address Generator" category="generators">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        {/* Disclaimer */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 dark:text-yellow-200 text-sm">
            <strong>Disclaimer:</strong> These addresses are randomly generated for testing and development purposes only.
            They should never be used for shipping, legal documents, or any official purpose.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Generate Fake Address
          </h2>

          {/* Country Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Country/Region
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value as Country)}
              className="w-full md:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {COUNTRIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quantity
            </label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full md:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {[1, 5, 10, 25, 50].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'address' : 'addresses'}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleGenerate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Generate {quantity > 1 ? `${quantity} Addresses` : 'Address'}
            </button>
            {addresses.length > 0 && (
              <button
                onClick={clearAddresses}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Generated Addresses */}
        {addresses.length > 0 && (
          <div className="space-y-4 mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Generated Addresses ({addresses.length})
            </h3>
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                copiedField={copiedField}
                onCopy={copyToClipboard}
              />
            ))}
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

function AddressCard({
  address,
  copiedField,
  onCopy,
}: {
  address: FakeAddress;
  copiedField: string | null;
  onCopy: (text: string, fieldId: string) => void;
}) {
  const fields = [
    { label: 'Street', value: address.street, key: 'street' },
    { label: 'City', value: address.city, key: 'city' },
    { label: 'State/Province', value: address.state, key: 'state' },
    { label: 'ZIP/Postal Code', value: address.zip, key: 'zip' },
    { label: 'Country', value: address.country, key: 'country' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {fields.map((field) => (
          <div key={field.key} className="flex items-center justify-between gap-2">
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{field.label}</div>
              <div className="text-gray-900 dark:text-white font-medium">{field.value}</div>
            </div>
            <button
              onClick={() => onCopy(field.value, `${address.id}-${field.key}`)}
              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded transition-colors"
            >
              {copiedField === `${address.id}-${field.key}` ? 'Copied!' : 'Copy'}
            </button>
          </div>
        ))}
      </div>

      {/* Full Address */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Full Address</div>
            <div className="text-gray-900 dark:text-white">{address.fullAddress}</div>
          </div>
          <button
            onClick={() => onCopy(address.fullAddress, `${address.id}-full`)}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {copiedField === `${address.id}-full` ? 'Copied!' : 'Copy Full'}
          </button>
        </div>
      </div>
    </div>
  );
}

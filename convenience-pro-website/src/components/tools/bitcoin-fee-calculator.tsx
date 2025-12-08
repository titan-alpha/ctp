'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useBitcoinFeeCalculator } from '@/hooks/useBitcoinFeeCalculator';

const PRIORITIES = [
  { value: 'low', label: 'Low Priority', description: 'Cheapest, slowest' },
  { value: 'medium', label: 'Medium Priority', description: 'Balanced' },
  { value: 'high', label: 'High Priority', description: 'Fastest, most expensive' },
] as const;

const TX_SIZE_PRESETS = [
  { label: 'Simple (1 in, 2 out)', bytes: 226 },
  { label: 'Standard (2 in, 2 out)', bytes: 374 },
  { label: 'Complex (3 in, 2 out)', bytes: 522 },
];

const FEATURES = [
  {
    title: 'Accurate Fee Estimation',
    description: 'Calculate transaction fees based on transaction size and network priority to avoid overpaying or underpaying.',
  },
  {
    title: 'Priority-Based Pricing',
    description: 'Choose between low, medium, and high priority to balance between cost and confirmation speed.',
  },
  {
    title: 'USD Conversion',
    description: 'See your fee estimates in both satoshis and US dollars for better financial planning.',
  },
];

const FAQS = [
  {
    question: 'What is a Bitcoin transaction fee?',
    answer: 'A Bitcoin transaction fee is a small amount of BTC paid to miners for processing and confirming your transaction on the blockchain. Higher fees typically result in faster confirmation times.',
  },
  {
    question: 'What is sat/byte?',
    answer: 'Sat/byte (satoshis per byte) is the unit used to measure Bitcoin transaction fees. It represents how many satoshis (0.00000001 BTC) you pay for each byte of transaction data.',
  },
  {
    question: 'How is transaction size determined?',
    answer: 'Transaction size depends on the number of inputs and outputs. A typical transaction with 1 input and 2 outputs is around 226 bytes. More complex transactions with multiple inputs/outputs will be larger.',
  },
  {
    question: 'What priority should I choose?',
    answer: 'Choose high priority if you need fast confirmation (next block). Medium priority is good for regular transactions. Low priority is suitable for non-urgent transfers when you want to save on fees.',
  },
  {
    question: 'Why do fees fluctuate?',
    answer: 'Bitcoin fees fluctuate based on network congestion. When many people are transacting, competition for block space increases, driving up fees. During quiet periods, fees are lower.',
  },
  {
    question: 'What happens if my fee is too low?',
    answer: 'If your fee is too low, your transaction may take a long time to confirm or could get stuck in the mempool. In extreme cases, it might eventually be dropped from the mempool entirely.',
  },
];

export function BitcoinFeeCalculator() {
  const { result, calculate, reset } = useBitcoinFeeCalculator();

  const [transactionSize, setTransactionSize] = useState('226');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleCalculate = () => {
    const size = parseInt(transactionSize);
    if (size > 0) {
      calculate({ transactionSize: size, priority });
    }
  };

  const handleReset = () => {
    reset();
    setTransactionSize('226');
    setPriority('medium');
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Bitcoin Fee Calculator',
    description: 'Estimate Bitcoin transaction fees based on transaction size and priority. Get fee estimates in sat/byte and USD.',
    applicationCategory: 'FinanceApplication',
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
    <SiteLayout toolName="Bitcoin Fee Calculator" category="crypto-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Estimate Bitcoin Transaction Fee
          </h2>

          {/* Transaction Size */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Transaction Size (bytes)
            </label>
            <input
              type="number"
              value={transactionSize}
              onChange={(e) => setTransactionSize(e.target.value)}
              placeholder="226"
              min="1"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {TX_SIZE_PRESETS.map((preset) => (
                <button
                  key={preset.bytes}
                  onClick={() => setTransactionSize(preset.bytes.toString())}
                  className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-gray-600 dark:text-gray-300"
                >
                  {preset.label} ({preset.bytes} bytes)
                </button>
              ))}
            </div>
          </div>

          {/* Priority Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Transaction Priority
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {PRIORITIES.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPriority(p.value)}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    priority === p.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-white">{p.label}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{p.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleCalculate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Calculate Fee
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Fee Estimate
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Fee Rate</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {result.satPerByte} sat/byte
                </div>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Fee</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {result.totalSatoshis.toLocaleString()} sats
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {result.totalBtc.toFixed(8)} BTC
                </div>
              </div>
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <div className="text-sm text-blue-600 dark:text-blue-400">USD Estimate</div>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  ${result.usdEstimate.toFixed(2)}
                </div>
              </div>
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <div className="text-sm text-green-600 dark:text-green-400">Confirmation Time</div>
                <div className="text-lg font-bold text-green-700 dark:text-green-300">
                  {result.confirmationTime}
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Note: Fee estimates are approximate. Actual network fees may vary based on current mempool conditions.
            </p>
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

'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useCidrCalculator } from '@/hooks/useCidrCalculator';

const SUBNET_MASKS = [
  { prefix: 32, mask: '255.255.255.255', hosts: '1' },
  { prefix: 31, mask: '255.255.255.254', hosts: '2' },
  { prefix: 30, mask: '255.255.255.252', hosts: '4' },
  { prefix: 29, mask: '255.255.255.248', hosts: '8' },
  { prefix: 28, mask: '255.255.255.240', hosts: '16' },
  { prefix: 27, mask: '255.255.255.224', hosts: '32' },
  { prefix: 26, mask: '255.255.255.192', hosts: '64' },
  { prefix: 25, mask: '255.255.255.128', hosts: '128' },
  { prefix: 24, mask: '255.255.255.0', hosts: '256' },
  { prefix: 23, mask: '255.255.254.0', hosts: '512' },
  { prefix: 22, mask: '255.255.252.0', hosts: '1,024' },
  { prefix: 21, mask: '255.255.248.0', hosts: '2,048' },
  { prefix: 20, mask: '255.255.240.0', hosts: '4,096' },
  { prefix: 19, mask: '255.255.224.0', hosts: '8,192' },
  { prefix: 18, mask: '255.255.192.0', hosts: '16,384' },
  { prefix: 17, mask: '255.255.128.0', hosts: '32,768' },
  { prefix: 16, mask: '255.255.0.0', hosts: '65,536' },
  { prefix: 8, mask: '255.0.0.0', hosts: '16,777,216' },
];

const FEATURES = [
  {
    title: 'Instant Calculations',
    description: 'Get network address, broadcast, usable host range, and subnet mask instantly from any CIDR notation.',
  },
  {
    title: 'Multiple Input Methods',
    description: 'Enter CIDR notation directly or select from common subnet masks using the dropdown.',
  },
  {
    title: 'Complete Network Details',
    description: 'View total hosts, usable hosts, wildcard mask, IP class, and binary subnet mask representation.',
  },
];

const FAQS = [
  {
    question: 'What is CIDR notation?',
    answer: 'CIDR (Classless Inter-Domain Routing) notation represents IP addresses with their routing prefix. For example, 192.168.1.0/24 means the first 24 bits are the network portion.',
  },
  {
    question: 'What is the difference between network and broadcast address?',
    answer: 'The network address is the first address in a subnet (all host bits are 0) and identifies the network. The broadcast address is the last address (all host bits are 1) used to send data to all hosts.',
  },
  {
    question: 'Why are usable hosts fewer than total hosts?',
    answer: 'In most subnets, the network address and broadcast address cannot be assigned to devices, reducing usable hosts by 2. Exception: /31 and /32 networks have special rules.',
  },
  {
    question: 'What is a wildcard mask?',
    answer: 'A wildcard mask is the inverse of a subnet mask, used in access control lists (ACLs) and routing protocols. Where subnet mask has 1s, wildcard has 0s, and vice versa.',
  },
  {
    question: 'How do I choose the right subnet size?',
    answer: 'Count the number of hosts you need, add 2 for network and broadcast addresses, then choose the smallest prefix that accommodates that number. For 50 hosts, you need /26 (64 total addresses).',
  },
  {
    question: 'What are IP address classes?',
    answer: 'IP classes (A, B, C, D, E) are legacy classifications based on the first octet. Class A: 1-126, Class B: 128-191, Class C: 192-223. CIDR has largely replaced classful networking.',
  },
];

export function CidrCalculator() {
  const { result, error, calculate, calculateFromMask, reset } = useCidrCalculator();
  const [cidrInput, setCidrInput] = useState('');
  const [ipInput, setIpInput] = useState('');
  const [selectedMask, setSelectedMask] = useState('');
  const [inputMode, setInputMode] = useState<'cidr' | 'mask'>('cidr');

  const handleCalculate = () => {
    if (inputMode === 'cidr') {
      calculate(cidrInput);
    } else if (ipInput && selectedMask) {
      const maskEntry = SUBNET_MASKS.find((m) => m.prefix === parseInt(selectedMask));
      if (maskEntry) {
        calculateFromMask(ipInput, maskEntry.mask);
      }
    }
  };

  const handleReset = () => {
    reset();
    setCidrInput('');
    setIpInput('');
    setSelectedMask('');
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'CIDR Calculator',
    description: 'Calculate network address, broadcast address, usable host range, and subnet mask from CIDR notation.',
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
    <SiteLayout toolName="CIDR Calculator" category="developer-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate CIDR Network Details
          </h2>

          {/* Input Mode Toggle */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setInputMode('cidr')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                inputMode === 'cidr'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              CIDR Notation
            </button>
            <button
              onClick={() => setInputMode('mask')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                inputMode === 'mask'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              IP + Subnet Mask
            </button>
          </div>

          {/* CIDR Input */}
          {inputMode === 'cidr' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                CIDR Notation
              </label>
              <input
                type="text"
                value={cidrInput}
                onChange={(e) => setCidrInput(e.target.value)}
                placeholder="192.168.1.0/24"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          )}

          {/* IP + Mask Input */}
          {inputMode === 'mask' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  IP Address
                </label>
                <input
                  type="text"
                  value={ipInput}
                  onChange={(e) => setIpInput(e.target.value)}
                  placeholder="192.168.1.0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subnet Mask
                </label>
                <select
                  value={selectedMask}
                  onChange={(e) => setSelectedMask(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select subnet mask</option>
                  {SUBNET_MASKS.map((m) => (
                    <option key={m.prefix} value={m.prefix}>
                      /{m.prefix} - {m.mask} ({m.hosts} hosts)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleCalculate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Calculate
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
              Network Details for {result.cidrNotation}
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="py-3 text-gray-600 dark:text-gray-400 font-medium">Network Address</td>
                    <td className="py-3 text-gray-900 dark:text-white font-mono">{result.networkAddress}</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-600 dark:text-gray-400 font-medium">Broadcast Address</td>
                    <td className="py-3 text-gray-900 dark:text-white font-mono">{result.broadcastAddress}</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-600 dark:text-gray-400 font-medium">First Usable Host</td>
                    <td className="py-3 text-gray-900 dark:text-white font-mono">{result.firstUsable}</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-600 dark:text-gray-400 font-medium">Last Usable Host</td>
                    <td className="py-3 text-gray-900 dark:text-white font-mono">{result.lastUsable}</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-600 dark:text-gray-400 font-medium">Total Hosts</td>
                    <td className="py-3 text-gray-900 dark:text-white">{result.totalHosts.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-600 dark:text-gray-400 font-medium">Usable Hosts</td>
                    <td className="py-3 text-gray-900 dark:text-white">{result.usableHosts.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-600 dark:text-gray-400 font-medium">Subnet Mask</td>
                    <td className="py-3 text-gray-900 dark:text-white font-mono">{result.subnetMask}</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-600 dark:text-gray-400 font-medium">Wildcard Mask</td>
                    <td className="py-3 text-gray-900 dark:text-white font-mono">{result.wildcardMask}</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-600 dark:text-gray-400 font-medium">Binary Subnet Mask</td>
                    <td className="py-3 text-gray-900 dark:text-white font-mono text-sm">{result.binarySubnetMask}</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-600 dark:text-gray-400 font-medium">IP Class</td>
                    <td className="py-3 text-gray-900 dark:text-white">{result.ipClass}</td>
                  </tr>
                </tbody>
              </table>
            </div>
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

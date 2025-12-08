'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useBillableHoursCalculator } from '@/hooks/useBillableHoursCalculator';

const FEATURES = [
  {
    title: 'Multi-Project Tracking',
    description: 'Track billable hours across multiple projects and clients with automatic categorization and totals.',
  },
  {
    title: 'Instant Calculations',
    description: 'See running totals update in real-time as you add, edit, or remove time entries.',
  },
  {
    title: 'Invoice Summary',
    description: 'Get a complete breakdown by project and client, ready for invoicing or expense reports.',
  },
];

const FAQS = [
  {
    question: 'How do I track time for different clients?',
    answer: 'Enter the client name when adding a time entry. The calculator automatically groups entries by client and provides a breakdown of total hours and amounts for each client.',
  },
  {
    question: 'Can I use different hourly rates for different projects?',
    answer: 'Yes, each time entry has its own hourly rate. This allows you to track work with varying rates for different projects, tasks, or client agreements.',
  },
  {
    question: 'Is my data saved?',
    answer: 'Currently, data is stored in your browser session. For permanent storage, you can copy the invoice summary before closing the page.',
  },
  {
    question: 'How is the total amount calculated?',
    answer: 'The total amount is calculated by multiplying the hours worked by the hourly rate for each entry, then summing all entries together.',
  },
  {
    question: 'Can I edit entries after adding them?',
    answer: 'Currently, you can remove entries and add new ones. For edits, remove the incorrect entry and add a corrected one.',
  },
  {
    question: 'What currency does this calculator use?',
    answer: 'The calculator displays amounts in dollars ($) but is currency-agnostic. The calculations work the same regardless of which currency you use for your rates.',
  },
];

export function BillableHoursCalculator() {
  const {
    entries,
    addEntry,
    removeEntry,
    clearEntries,
    totalHours,
    totalAmount,
    projectBreakdown,
    clientBreakdown,
  } = useBillableHoursCalculator();

  const [project, setProject] = useState('');
  const [client, setClient] = useState('');
  const [description, setDescription] = useState('');
  const [hours, setHours] = useState('');
  const [rate, setRate] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAddEntry = () => {
    if (!project || !client || !hours || !rate) return;

    addEntry({
      project,
      client,
      description,
      hours: parseFloat(hours),
      rate: parseFloat(rate),
      date,
    });

    setDescription('');
    setHours('');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Billable Hours Calculator',
    description: 'Track billable hours across multiple projects and clients, calculate totals, and generate invoice summaries.',
    applicationCategory: 'BusinessApplication',
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
    <SiteLayout toolName="Billable Hours Calculator" category="business-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        {/* Running Total Display */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 mb-8 text-white">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-blue-100 text-sm">Total Hours</p>
              <p className="text-3xl font-bold">{totalHours.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Total Amount</p>
              <p className="text-3xl font-bold">{formatCurrency(totalAmount)}</p>
            </div>
          </div>
        </div>

        {/* Time Entry Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Add Time Entry
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Project *
              </label>
              <input
                type="text"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                placeholder="Website Redesign"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Client *
              </label>
              <input
                type="text"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="Acme Corp"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Homepage design and development"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Hours *
              </label>
              <input
                type="number"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="2.5"
                step="0.25"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Hourly Rate ($) *
              </label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="75"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAddEntry}
              disabled={!project || !client || !hours || !rate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              Add Entry
            </button>
            {entries.length > 0 && (
              <button
                onClick={clearEntries}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Entries List */}
        {entries.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Time Entries ({entries.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="py-3 text-gray-600 dark:text-gray-400 font-medium">Date</th>
                    <th className="py-3 text-gray-600 dark:text-gray-400 font-medium">Project</th>
                    <th className="py-3 text-gray-600 dark:text-gray-400 font-medium">Client</th>
                    <th className="py-3 text-gray-600 dark:text-gray-400 font-medium">Hours</th>
                    <th className="py-3 text-gray-600 dark:text-gray-400 font-medium">Rate</th>
                    <th className="py-3 text-gray-600 dark:text-gray-400 font-medium">Amount</th>
                    <th className="py-3 text-gray-600 dark:text-gray-400 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {entries.map((entry) => (
                    <tr key={entry.id}>
                      <td className="py-3 text-gray-900 dark:text-white">{entry.date}</td>
                      <td className="py-3 text-gray-900 dark:text-white">{entry.project}</td>
                      <td className="py-3 text-gray-900 dark:text-white">{entry.client}</td>
                      <td className="py-3 text-gray-900 dark:text-white">{entry.hours}</td>
                      <td className="py-3 text-gray-900 dark:text-white">{formatCurrency(entry.rate)}</td>
                      <td className="py-3 text-gray-900 dark:text-white font-medium">
                        {formatCurrency(entry.hours * entry.rate)}
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => removeEntry(entry.id)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Invoice Summary */}
        {entries.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Invoice Summary
            </h3>

            {/* By Client */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">By Client</h4>
              <div className="space-y-3">
                {clientBreakdown.map((clientSummary) => (
                  <div
                    key={clientSummary.client}
                    className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{clientSummary.client}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {clientSummary.totalHours.toFixed(2)} hours | {clientSummary.projects.length} project(s)
                      </p>
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(clientSummary.totalAmount)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* By Project */}
            <div>
              <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">By Project</h4>
              <div className="space-y-3">
                {projectBreakdown.map((projectSummary) => (
                  <div
                    key={`${projectSummary.project}-${projectSummary.client}`}
                    className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{projectSummary.project}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {projectSummary.client} | {projectSummary.totalHours.toFixed(2)} hours
                      </p>
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(projectSummary.totalAmount)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Grand Total */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <p className="text-xl font-bold text-gray-900 dark:text-white">Grand Total</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(totalAmount)}
              </p>
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

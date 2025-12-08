'use client';

import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useFabricCalculator, ProjectType } from '@/hooks/useFabricCalculator';

const FEATURES = [
  {
    title: 'Multiple Project Types',
    description: 'Calculate fabric for curtains, tablecloths, pillowcases, quilts, clothing, and custom rectangular projects.',
  },
  {
    title: 'Pattern Repeat Support',
    description: 'Account for pattern matching and repeats to ensure your design lines up perfectly across seams.',
  },
  {
    title: 'Seam Allowance Included',
    description: 'Automatically adds seam allowances to your measurements so you never cut your fabric too short.',
  },
];

const FAQS = [
  {
    question: 'How do I measure for fabric?',
    answer: 'Measure the finished dimensions you want for your project in inches. The calculator will add seam allowances and any extra fabric needed based on your project type.',
  },
  {
    question: 'What is standard fabric width?',
    answer: 'Most quilting cotton is 44-45 inches wide. Home decor fabrics are typically 54 inches, and some specialty fabrics can be 60 inches or wider.',
  },
  {
    question: 'How does pattern repeat work?',
    answer: 'If your fabric has a repeating pattern, enter the repeat length. The calculator will add extra fabric to ensure patterns align properly at seams.',
  },
  {
    question: 'Why do curtains need more fabric?',
    answer: 'Curtains typically need 2-2.5x the window width for proper fullness and pleating. The calculator automatically factors this in.',
  },
  {
    question: 'Should I buy extra fabric?',
    answer: 'Yes! We recommend buying 10-15% extra for mistakes, shrinkage, and any last-minute adjustments to your project.',
  },
  {
    question: 'How accurate is this calculator?',
    answer: 'The calculator provides estimates based on standard sewing practices. Complex patterns or unusual shapes may require additional fabric.',
  },
];

const PROJECT_TYPES: { value: ProjectType; label: string }[] = [
  { value: 'rectangular', label: 'Rectangular (Custom)' },
  { value: 'curtain', label: 'Curtains' },
  { value: 'tablecloth', label: 'Tablecloth' },
  { value: 'pillowcase', label: 'Pillowcase' },
  { value: 'quilt', label: 'Quilt' },
  { value: 'clothing', label: 'Clothing' },
];

export function FabricCalculator() {
  const {
    projectType,
    length,
    width,
    fabricWidth,
    quantity,
    seamAllowance,
    patternRepeat,
    result,
    setProjectType,
    setLength,
    setWidth,
    setFabricWidth,
    setQuantity,
    setSeamAllowance,
    setPatternRepeat,
    calculate,
    reset,
  } = useFabricCalculator();

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Fabric Calculator',
    description: 'Calculate how much fabric you need for sewing projects. Supports curtains, tablecloths, quilts, and more.',
    applicationCategory: 'LifestyleApplication',
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
    <SiteLayout toolName="Fabric Calculator" category="lifestyle-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Fabric Needed
          </h2>

          {/* Project Type Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project Type
            </label>
            <select
              value={projectType}
              onChange={(e) => setProjectType(e.target.value as ProjectType)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {PROJECT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Dimension Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Finished Length (inches)
              </label>
              <input
                type="number"
                min="1"
                value={length}
                onChange={(e) => setLength(Math.max(1, parseFloat(e.target.value) || 1))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Finished Width (inches)
              </label>
              <input
                type="number"
                min="1"
                value={width}
                onChange={(e) => setWidth(Math.max(1, parseFloat(e.target.value) || 1))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Fabric Width & Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fabric Width (inches)
              </label>
              <input
                type="number"
                min="1"
                value={fabricWidth}
                onChange={(e) => setFabricWidth(Math.max(1, parseFloat(e.target.value) || 1))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Common: 45" (quilting), 54" (decor), 60" (apparel)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Advanced Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Seam Allowance (inches)
              </label>
              <input
                type="number"
                min="0"
                step="0.125"
                value={seamAllowance}
                onChange={(e) => setSeamAllowance(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pattern Repeat (inches, 0 = none)
              </label>
              <input
                type="number"
                min="0"
                value={patternRepeat}
                onChange={(e) => setPatternRepeat(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={calculate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Calculate Fabric
            </button>
            <button
              onClick={reset}
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
              Fabric Requirements
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Yards Needed</p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                  {result.yardsNeeded} yards
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <p className="text-sm text-green-600 dark:text-green-400 mb-1">Meters Needed</p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                  {result.metersNeeded} meters
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Area</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {result.totalArea.toLocaleString()} sq in
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">Pieces Across Fabric</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {result.pieces}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">Est. Waste</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  ~{result.wastePercentage}%
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Tip: Consider buying 10-15% extra fabric for mistakes, shrinkage, and adjustments.
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

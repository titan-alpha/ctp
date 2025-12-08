'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useShippingCostCalculator } from '@/hooks/useShippingCostCalculator';

const ZONES = [
  { value: '1', label: 'Zone 1 (Local)' },
  { value: '2', label: 'Zone 2' },
  { value: '3', label: 'Zone 3' },
  { value: '4', label: 'Zone 4' },
  { value: '5', label: 'Zone 5' },
  { value: '6', label: 'Zone 6' },
  { value: '7', label: 'Zone 7' },
  { value: '8', label: 'Zone 8 (Cross-Country)' },
];

const FEATURES = [
  {
    title: 'Multi-Carrier Comparison',
    description: 'Compare rates from USPS, UPS, FedEx, and DHL side by side to find the best shipping option for your package.',
  },
  {
    title: 'Dimensional Weight Calculator',
    description: 'Automatically calculates dimensional weight and determines billable weight to give you accurate cost estimates.',
  },
  {
    title: 'Zone-Based Pricing',
    description: 'Estimates shipping costs based on origin and destination zones for more accurate pricing across different distances.',
  },
];

const FAQS = [
  {
    question: 'What is dimensional weight?',
    answer: 'Dimensional weight (DIM weight) is a pricing technique that considers package size rather than just actual weight. It is calculated by multiplying length x width x height and dividing by a dimensional factor (typically 139 for domestic shipping). Carriers charge based on whichever is greater: actual weight or dimensional weight.',
  },
  {
    question: 'How are shipping zones determined?',
    answer: 'Shipping zones are based on the distance between origin and destination. Zone 1 is local (same area), while Zone 8 represents cross-country shipping. The further the zone, the higher the shipping cost. Each carrier has their own zone maps based on ZIP codes.',
  },
  {
    question: 'Which carrier is cheapest for shipping?',
    answer: 'The cheapest carrier depends on package size, weight, and distance. Generally, USPS is most economical for small, lightweight packages. UPS and FedEx Ground are competitive for heavier packages. Use our calculator to compare rates for your specific shipment.',
  },
  {
    question: 'What factors affect shipping cost?',
    answer: 'Shipping costs are affected by package weight, dimensions, distance (zones), delivery speed, insurance, signature requirements, and special handling needs. Dimensional weight may also increase costs for large but lightweight packages.',
  },
  {
    question: 'How accurate are these shipping estimates?',
    answer: 'These are estimated rates based on standard pricing. Actual rates may vary based on account discounts, seasonal surcharges, fuel surcharges, residential delivery fees, and special service requirements. Always confirm final pricing with the carrier.',
  },
  {
    question: 'What is the difference between ground and express shipping?',
    answer: 'Ground shipping uses trucks and takes longer (1-7 days depending on distance) but is more economical. Express shipping uses air transport for faster delivery (1-3 days) but costs significantly more. Choose based on your urgency and budget.',
  },
];

export function ShippingCostCalculator() {
  const { result, calculate, reset } = useShippingCostCalculator();

  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [originZone, setOriginZone] = useState('1');
  const [destinationZone, setDestinationZone] = useState('5');

  const handleCalculate = () => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    const h = parseFloat(height);
    const wt = parseFloat(weight);

    if (l > 0 && w > 0 && h > 0 && wt > 0) {
      calculate({
        dimensions: { length: l, width: w, height: h, weight: wt },
        originZone,
        destinationZone,
      });
    }
  };

  const handleReset = () => {
    reset();
    setLength('');
    setWidth('');
    setHeight('');
    setWeight('');
    setOriginZone('1');
    setDestinationZone('5');
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
    name: 'Shipping Cost Calculator',
    description: 'Estimate shipping costs and compare carrier rates for USPS, UPS, FedEx, and DHL based on package dimensions and shipping zones.',
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
    <SiteLayout toolName="Shipping Cost Calculator" category="ecommerce-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Shipping Costs
          </h2>

          {/* Package Dimensions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
              Package Dimensions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Length (in)
                </label>
                <input
                  type="number"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  placeholder="12"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Width (in)
                </label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  placeholder="8"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Height (in)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="6"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Weight (lbs)
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="5"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Shipping Zones */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
              Shipping Zones
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Origin Zone
                </label>
                <select
                  value={originZone}
                  onChange={(e) => setOriginZone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {ZONES.map((zone) => (
                    <option key={zone.value} value={zone.value}>
                      {zone.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Destination Zone
                </label>
                <select
                  value={destinationZone}
                  onChange={(e) => setDestinationZone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {ZONES.map((zone) => (
                    <option key={zone.value} value={zone.value}>
                      {zone.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleCalculate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Calculate Shipping
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
              Shipping Estimates
            </h3>

            {/* Weight Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Dimensional Weight</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {result.dimensionalWeight} lbs
                </div>
              </div>
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <div className="text-sm text-blue-600 dark:text-blue-400">Billable Weight</div>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {result.billableWeight} lbs
                </div>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Zone Distance</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {result.zoneDistance} zones
                </div>
              </div>
            </div>

            {/* Best Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg border-2 border-green-500">
                <div className="text-sm font-semibold text-green-700 dark:text-green-400 mb-1">
                  Cheapest Option
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {result.cheapest.carrier} {result.cheapest.service}
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(result.cheapest.price)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {result.cheapest.estimatedDays} business days
                </div>
              </div>
              <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-lg border-2 border-purple-500">
                <div className="text-sm font-semibold text-purple-700 dark:text-purple-400 mb-1">
                  Fastest Option
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {result.fastest.carrier} {result.fastest.service}
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(result.fastest.price)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {result.fastest.estimatedDays} business days
                </div>
              </div>
            </div>

            {/* Carrier Comparison Table */}
            <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
              All Carrier Options
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="py-3 px-2 text-gray-700 dark:text-gray-300">Carrier</th>
                    <th className="py-3 px-2 text-gray-700 dark:text-gray-300">Service</th>
                    <th className="py-3 px-2 text-gray-700 dark:text-gray-300">Price</th>
                    <th className="py-3 px-2 text-gray-700 dark:text-gray-300">Delivery</th>
                    <th className="py-3 px-2 text-gray-700 dark:text-gray-300">Features</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rates.sort((a, b) => a.price - b.price).map((rate, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-3 px-2 font-medium text-gray-900 dark:text-white">
                        {rate.carrier}
                      </td>
                      <td className="py-3 px-2 text-gray-600 dark:text-gray-400">
                        {rate.service}
                      </td>
                      <td className="py-3 px-2 font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(rate.price)}
                      </td>
                      <td className="py-3 px-2 text-gray-600 dark:text-gray-400">
                        {rate.estimatedDays} days
                      </td>
                      <td className="py-3 px-2 text-sm text-gray-500 dark:text-gray-500">
                        {rate.features.slice(0, 2).join(', ')}
                      </td>
                    </tr>
                  ))}
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

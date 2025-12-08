'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useTileCalculator } from '@/hooks/useTileCalculator';

const FEATURES = [
  {
    title: 'Accurate Estimation',
    description: 'Calculate exact tile quantities based on room dimensions and tile sizes for precise project planning.',
  },
  {
    title: 'Wastage Calculator',
    description: 'Account for cuts, breakage, and future repairs with adjustable wastage percentage from 5% to 20%.',
  },
  {
    title: 'Box Count',
    description: 'Get the exact number of boxes to purchase based on tiles per box for easy shopping.',
  },
];

const FAQS = [
  {
    question: 'How much tile wastage should I plan for?',
    answer: 'For standard installations, 10% wastage is recommended. For diagonal patterns or complex layouts, use 15-20%. Simple rectangular rooms with minimal cuts can use 5-10%.',
  },
  {
    question: 'How do I measure my room for tiles?',
    answer: 'Measure the length and width of your room in meters at the widest points. For irregular rooms, divide into rectangles and calculate each section separately.',
  },
  {
    question: 'What tile size should I choose?',
    answer: 'Larger tiles (60x60cm) make rooms look bigger and have fewer grout lines. Smaller tiles (30x30cm) are better for small bathrooms and areas with drains.',
  },
  {
    question: 'How many tiles come in a box?',
    answer: 'This varies by tile size and manufacturer. Common counts are 4-6 tiles for 60x60cm, 8-11 tiles for 45x45cm, and 10-14 tiles for 30x30cm sizes.',
  },
  {
    question: 'Should I buy extra tiles?',
    answer: 'Yes, always buy 5-10% extra beyond the wastage calculation. This covers future repairs and ensures color match from the same batch.',
  },
  {
    question: 'How do I calculate tiles for walls?',
    answer: 'Measure wall height and width, subtract window and door areas, then use the same calculation. Wall tiles typically need 10-15% wastage for cuts around fixtures.',
  },
];

export function TileCalculator() {
  const { result, calculate, reset } = useTileCalculator();

  const [roomLength, setRoomLength] = useState('');
  const [roomWidth, setRoomWidth] = useState('');
  const [tileLength, setTileLength] = useState('60');
  const [tileWidth, setTileWidth] = useState('60');
  const [wastagePercent, setWastagePercent] = useState(10);
  const [tilesPerBox, setTilesPerBox] = useState('4');

  const handleCalculate = () => {
    if (roomLength && roomWidth && tileLength && tileWidth && tilesPerBox) {
      calculate({
        roomLength: parseFloat(roomLength),
        roomWidth: parseFloat(roomWidth),
        tileLength: parseFloat(tileLength),
        tileWidth: parseFloat(tileWidth),
        wastagePercent,
        tilesPerBox: parseInt(tilesPerBox),
      });
    }
  };

  const handleReset = () => {
    reset();
    setRoomLength('');
    setRoomWidth('');
    setTileLength('60');
    setTileWidth('60');
    setWastagePercent(10);
    setTilesPerBox('4');
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Tile Calculator',
    description: 'Calculate how many tiles you need for your floor or wall project with wastage estimation.',
    applicationCategory: 'UtilitiesApplication',
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
    <SiteLayout toolName="Tile Calculator" category="home-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Tiles Needed
          </h2>

          {/* Room Dimensions */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Room Dimensions (meters)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  value={roomLength}
                  onChange={(e) => setRoomLength(e.target.value)}
                  placeholder="Length"
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">Length (m)</span>
              </div>
              <div>
                <input
                  type="number"
                  value={roomWidth}
                  onChange={(e) => setRoomWidth(e.target.value)}
                  placeholder="Width"
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">Width (m)</span>
              </div>
            </div>
          </div>

          {/* Tile Dimensions */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tile Size (centimeters)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  value={tileLength}
                  onChange={(e) => setTileLength(e.target.value)}
                  placeholder="60"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">Length (cm)</span>
              </div>
              <div>
                <input
                  type="number"
                  value={tileWidth}
                  onChange={(e) => setTileWidth(e.target.value)}
                  placeholder="60"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">Width (cm)</span>
              </div>
            </div>
          </div>

          {/* Tiles Per Box */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tiles Per Box
            </label>
            <input
              type="number"
              value={tilesPerBox}
              onChange={(e) => setTilesPerBox(e.target.value)}
              placeholder="4"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Wastage Slider */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Wastage Allowance: {wastagePercent}%
            </label>
            <input
              type="range"
              min="5"
              max="20"
              value={wastagePercent}
              onChange={(e) => setWastagePercent(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>5% (Simple)</span>
              <span>10% (Standard)</span>
              <span>20% (Complex)</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleCalculate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Calculate Tiles
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
              Your Results
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <div className="text-sm text-blue-600 dark:text-blue-400">Boxes Needed</div>
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                  {result.boxesNeeded}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">boxes to purchase</div>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Tiles</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {result.totalTiles}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">tiles in boxes</div>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Room Area</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {result.roomArea.toFixed(2)} m²
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">to cover</div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Breakdown</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tile area</span>
                  <span className="text-gray-900 dark:text-white">{(result.tileArea * 10000).toFixed(0)} cm² ({result.tileArea.toFixed(4)} m²)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tiles needed (exact)</span>
                  <span className="text-gray-900 dark:text-white">{result.tilesNeeded} tiles</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">With {wastagePercent}% wastage</span>
                  <span className="text-gray-900 dark:text-white">{result.tilesWithWastage} tiles</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Extra tiles</span>
                  <span className="text-green-600 dark:text-green-400">+{result.wasteTiles} spare</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total coverage</span>
                  <span className="text-gray-900 dark:text-white">{result.coverage.toFixed(2)} m²</span>
                </div>
              </div>
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

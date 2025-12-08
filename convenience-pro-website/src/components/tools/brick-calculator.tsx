'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useBrickCalculator } from '@/hooks/useBrickCalculator';

const BRICK_PRESETS = [
  { name: 'Standard UK', length: 215, height: 65 },
  { name: 'Standard US (Modular)', length: 194, height: 57 },
  { name: 'King Size', length: 295, height: 70 },
  { name: 'Queen Size', length: 295, height: 70 },
  { name: 'Engineering', length: 215, height: 65 },
];

const FEATURES = [
  {
    title: 'Mortar Joint Calculation',
    description: 'Accurately accounts for mortar joint thickness between bricks for precise material estimation.',
  },
  {
    title: 'Multiple Brick Sizes',
    description: 'Choose from standard brick size presets or enter custom dimensions for any brick type.',
  },
  {
    title: 'Wastage Allowance',
    description: 'Include configurable wastage percentage for cuts, breakage, and unforeseen requirements.',
  },
];

const FAQS = [
  {
    question: 'How do I calculate bricks for a wall?',
    answer: 'Measure your wall length and height in meters, select your brick size, and enter the mortar joint thickness. The calculator divides the wall area by the brick area (including mortar) to give you the exact count.',
  },
  {
    question: 'What mortar joint thickness should I use?',
    answer: 'Standard mortar joints are 10mm thick. This is the most common spacing used in brick construction. Thinner joints (8mm) or thicker joints (12mm) may be used for aesthetic or structural reasons.',
  },
  {
    question: 'How much brick wastage should I allow?',
    answer: 'For standard walls, allow 5-10% wastage. For walls with many openings (windows, doors), corners, or decorative patterns, allow 10-15% to account for additional cuts and breakage.',
  },
  {
    question: 'What is the standard brick size?',
    answer: 'In the UK, standard bricks are 215mm x 102.5mm x 65mm. In the US, modular bricks are typically 194mm x 92mm x 57mm. Always verify the actual size with your supplier.',
  },
  {
    question: 'How many bricks are in a square meter?',
    answer: 'Using standard UK bricks (215x65mm) with 10mm mortar joints, approximately 60 bricks are needed per square meter for single-skin walls.',
  },
  {
    question: 'Should I deduct for windows and doors?',
    answer: 'Yes, measure and subtract the area of windows and doors from your total wall area before calculating. However, keep the wastage percentage to cover cuts around these openings.',
  },
];

export function BrickCalculator() {
  const { result, calculate, reset } = useBrickCalculator();

  const [wallLength, setWallLength] = useState('');
  const [wallHeight, setWallHeight] = useState('');
  const [brickLength, setBrickLength] = useState('215');
  const [brickHeight, setBrickHeight] = useState('65');
  const [mortarJoint, setMortarJoint] = useState('10');
  const [wastagePercent, setWastagePercent] = useState(10);

  const handlePresetChange = (presetName: string) => {
    const preset = BRICK_PRESETS.find((p) => p.name === presetName);
    if (preset) {
      setBrickLength(preset.length.toString());
      setBrickHeight(preset.height.toString());
    }
  };

  const handleCalculate = () => {
    if (wallLength && wallHeight && brickLength && brickHeight && mortarJoint) {
      calculate({
        wallLength: parseFloat(wallLength),
        wallHeight: parseFloat(wallHeight),
        brickLength: parseFloat(brickLength),
        brickHeight: parseFloat(brickHeight),
        mortarJoint: parseFloat(mortarJoint),
        wastagePercent,
      });
    }
  };

  const handleReset = () => {
    reset();
    setWallLength('');
    setWallHeight('');
    setBrickLength('215');
    setBrickHeight('65');
    setMortarJoint('10');
    setWastagePercent(10);
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Brick Calculator',
    description: 'Calculate how many bricks you need for your wall project with mortar joint and wastage estimation.',
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
    <SiteLayout toolName="Brick Calculator" category="home-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Bricks Needed
          </h2>

          {/* Wall Dimensions */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Wall Dimensions (meters)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  value={wallLength}
                  onChange={(e) => setWallLength(e.target.value)}
                  placeholder="Length"
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">Length (m)</span>
              </div>
              <div>
                <input
                  type="number"
                  value={wallHeight}
                  onChange={(e) => setWallHeight(e.target.value)}
                  placeholder="Height"
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">Height (m)</span>
              </div>
            </div>
          </div>

          {/* Brick Size Preset */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Brick Size Preset
            </label>
            <select
              onChange={(e) => handlePresetChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select a preset or enter custom</option>
              {BRICK_PRESETS.map((preset) => (
                <option key={preset.name} value={preset.name}>
                  {preset.name} ({preset.length}mm x {preset.height}mm)
                </option>
              ))}
            </select>
          </div>

          {/* Brick Dimensions */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Brick Dimensions (millimeters)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  value={brickLength}
                  onChange={(e) => setBrickLength(e.target.value)}
                  placeholder="215"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">Length (mm)</span>
              </div>
              <div>
                <input
                  type="number"
                  value={brickHeight}
                  onChange={(e) => setBrickHeight(e.target.value)}
                  placeholder="65"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">Height (mm)</span>
              </div>
            </div>
          </div>

          {/* Mortar Joint */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mortar Joint Thickness (mm)
            </label>
            <input
              type="number"
              value={mortarJoint}
              onChange={(e) => setMortarJoint(e.target.value)}
              placeholder="10"
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
              Calculate Bricks
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
                <div className="text-sm text-blue-600 dark:text-blue-400">Bricks Needed</div>
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                  {result.bricksWithWastage}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">including wastage</div>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Exact Count</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {result.bricksNeeded}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">without wastage</div>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Wall Area</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {result.wallArea.toFixed(2)} m²
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">to cover</div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Breakdown</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Bricks per square meter</span>
                  <span className="text-gray-900 dark:text-white">{result.bricksPerSquareMeter.toFixed(1)} bricks/m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Brick area (with mortar)</span>
                  <span className="text-gray-900 dark:text-white">{(result.brickArea * 1000000).toFixed(0)} mm²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Bricks needed (exact)</span>
                  <span className="text-gray-900 dark:text-white">{result.bricksNeeded} bricks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">With {wastagePercent}% wastage</span>
                  <span className="text-gray-900 dark:text-white">{result.bricksWithWastage} bricks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Extra bricks for wastage</span>
                  <span className="text-green-600 dark:text-green-400">+{result.wasteBricks} spare</span>
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

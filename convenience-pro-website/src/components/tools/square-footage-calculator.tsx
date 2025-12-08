'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useSquareFootageCalculator, ShapeType, Area } from '@/hooks/useSquareFootageCalculator';

const SHAPES: { value: ShapeType; label: string }[] = [
  { value: 'rectangle', label: 'Rectangle / Square' },
  { value: 'circle', label: 'Circle' },
  { value: 'triangle', label: 'Triangle' },
  { value: 'irregular', label: 'Irregular (L-Shaped)' },
];

const FEATURES = [
  {
    title: 'Multiple Shape Support',
    description: 'Calculate square footage for rectangles, circles, triangles, and irregular L-shaped areas with precise measurements.',
  },
  {
    title: 'Multi-Room Calculator',
    description: 'Add multiple rooms or areas and get an instant total square footage calculation for your entire project.',
  },
  {
    title: 'Instant Results',
    description: 'Get accurate square footage calculations in real-time as you enter your dimensions, no waiting required.',
  },
];

const FAQS = [
  {
    question: 'How do I calculate square footage of a room?',
    answer: 'For rectangular rooms, multiply the length by the width. For example, a 12ft x 10ft room equals 120 square feet. Our calculator handles this automatically for various shapes.',
  },
  {
    question: 'How do I calculate square footage for an L-shaped room?',
    answer: 'Break the L-shaped room into two rectangles, calculate the area of each, then add them together. Our irregular shape option helps you do this easily.',
  },
  {
    question: 'What is the formula for square footage of a circle?',
    answer: 'The formula is Pi (3.14159) multiplied by the radius squared. If you know the diameter, divide it by 2 to get the radius first.',
  },
  {
    question: 'How many square feet are in an acre?',
    answer: 'There are 43,560 square feet in one acre. To convert acres to square feet, multiply by 43,560.',
  },
  {
    question: 'Why do I need to know square footage?',
    answer: 'Square footage is essential for real estate pricing, flooring estimates, painting calculations, HVAC sizing, and determining material quantities for renovation projects.',
  },
  {
    question: 'How accurate is this calculator?',
    answer: 'Our calculator provides mathematically precise results based on your input dimensions. For best results, measure your spaces carefully and double-check your entries.',
  },
];

interface AreaInput {
  id: string;
  name: string;
  shape: ShapeType;
  length: string;
  width: string;
  radius: string;
  base: string;
  height: string;
  side1Length: string;
  side1Width: string;
  side2Length: string;
  side2Width: string;
}

const createEmptyArea = (): AreaInput => ({
  id: crypto.randomUUID(),
  name: '',
  shape: 'rectangle',
  length: '',
  width: '',
  radius: '',
  base: '',
  height: '',
  side1Length: '',
  side1Width: '',
  side2Length: '',
  side2Width: '',
});

export function SquareFootageCalculator() {
  const { areas, totalSquareFeet, addArea, removeArea, clearAll } = useSquareFootageCalculator();
  const [inputs, setInputs] = useState<AreaInput[]>([createEmptyArea()]);

  const updateInput = (id: string, field: keyof AreaInput, value: string) => {
    setInputs(inputs.map((input) => (input.id === id ? { ...input, [field]: value } : input)));
  };

  const addInputArea = () => {
    setInputs([...inputs, createEmptyArea()]);
  };

  const removeInputArea = (id: string) => {
    if (inputs.length > 1) {
      setInputs(inputs.filter((input) => input.id !== id));
    }
  };

  const handleAddArea = (input: AreaInput) => {
    const name = input.name || `Area ${areas.length + 1}`;
    let dimensions: Area['dimensions'] = {};

    switch (input.shape) {
      case 'rectangle':
        dimensions = { length: parseFloat(input.length) || 0, width: parseFloat(input.width) || 0 };
        break;
      case 'circle':
        dimensions = { radius: parseFloat(input.radius) || 0 };
        break;
      case 'triangle':
        dimensions = { base: parseFloat(input.base) || 0, height: parseFloat(input.height) || 0 };
        break;
      case 'irregular':
        dimensions = {
          sides: [
            { length: parseFloat(input.side1Length) || 0, width: parseFloat(input.side1Width) || 0 },
            { length: parseFloat(input.side2Length) || 0, width: parseFloat(input.side2Width) || 0 },
          ],
        };
        break;
    }

    addArea(name, input.shape, dimensions);
  };

  const handleCalculateAll = () => {
    clearAll();
    inputs.forEach((input) => handleAddArea(input));
  };

  const handleReset = () => {
    clearAll();
    setInputs([createEmptyArea()]);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Square Footage Calculator',
    description: 'Calculate square footage for rooms, properties, and areas with support for multiple shapes and multi-room calculations.',
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
    <SiteLayout toolName="Square Footage Calculator" category="real-estate-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Square Footage
          </h2>

          {/* Area Inputs */}
          <div className="space-y-6">
            {inputs.map((input, index) => (
              <div key={input.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-900 dark:text-white">Area {index + 1}</h3>
                  {inputs.length > 1 && (
                    <button
                      onClick={() => removeInputArea(input.id)}
                      className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Area Name (optional)
                    </label>
                    <input
                      type="text"
                      value={input.name}
                      onChange={(e) => updateInput(input.id, 'name', e.target.value)}
                      placeholder="e.g., Living Room"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Shape
                    </label>
                    <select
                      value={input.shape}
                      onChange={(e) => updateInput(input.id, 'shape', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {SHAPES.map((shape) => (
                        <option key={shape.value} value={shape.value}>
                          {shape.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Shape-specific inputs */}
                {input.shape === 'rectangle' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Length (ft)
                      </label>
                      <input
                        type="number"
                        value={input.length}
                        onChange={(e) => updateInput(input.id, 'length', e.target.value)}
                        placeholder="12"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Width (ft)
                      </label>
                      <input
                        type="number"
                        value={input.width}
                        onChange={(e) => updateInput(input.id, 'width', e.target.value)}
                        placeholder="10"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}

                {input.shape === 'circle' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Radius (ft)
                    </label>
                    <input
                      type="number"
                      value={input.radius}
                      onChange={(e) => updateInput(input.id, 'radius', e.target.value)}
                      placeholder="5"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                )}

                {input.shape === 'triangle' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Base (ft)
                      </label>
                      <input
                        type="number"
                        value={input.base}
                        onChange={(e) => updateInput(input.id, 'base', e.target.value)}
                        placeholder="10"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Height (ft)
                      </label>
                      <input
                        type="number"
                        value={input.height}
                        onChange={(e) => updateInput(input.id, 'height', e.target.value)}
                        placeholder="8"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}

                {input.shape === 'irregular' && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Enter dimensions for two rectangles that make up the L-shape
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Section 1 Length (ft)
                        </label>
                        <input
                          type="number"
                          value={input.side1Length}
                          onChange={(e) => updateInput(input.id, 'side1Length', e.target.value)}
                          placeholder="10"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Section 1 Width (ft)
                        </label>
                        <input
                          type="number"
                          value={input.side1Width}
                          onChange={(e) => updateInput(input.id, 'side1Width', e.target.value)}
                          placeholder="8"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Section 2 Length (ft)
                        </label>
                        <input
                          type="number"
                          value={input.side2Length}
                          onChange={(e) => updateInput(input.id, 'side2Length', e.target.value)}
                          placeholder="6"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Section 2 Width (ft)
                        </label>
                        <input
                          type="number"
                          value={input.side2Width}
                          onChange={(e) => updateInput(input.id, 'side2Width', e.target.value)}
                          placeholder="5"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={addInputArea}
            className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            + Add Another Area
          </button>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleCalculateAll}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Calculate Total
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
        {areas.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Results</h3>

            {/* Total */}
            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-6">
              <div className="text-sm text-blue-600 dark:text-blue-400">Total Square Footage</div>
              <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                {formatNumber(totalSquareFeet)} sq ft
              </div>
            </div>

            {/* Area Breakdown */}
            <div className="space-y-3">
              {areas.map((area) => (
                <div
                  key={area.id}
                  className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">{area.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                      ({area.shape})
                    </span>
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {formatNumber(area.squareFeet)} sq ft
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {FEATURES.map((feature, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
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
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{faq.question}</h3>
                <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

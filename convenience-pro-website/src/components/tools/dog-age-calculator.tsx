'use client';

import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useDogAgeCalculator, DogSize } from '@/hooks/useDogAgeCalculator';

const FEATURES = [
  {
    title: 'Size-Adjusted Calculation',
    description: 'Accounts for the fact that small dogs age differently than large dogs for more accurate results.',
  },
  {
    title: 'Non-Linear Aging Model',
    description: 'Uses scientifically-backed non-linear calculation since dogs age faster in their first two years.',
  },
  {
    title: 'Life Stage Indicator',
    description: 'Shows your dog\'s current life stage with helpful care tips for each phase.',
  },
];

const FAQS = [
  {
    question: 'Is the 7 dog years to 1 human year rule accurate?',
    answer: 'No, the old "7 years" rule is a myth. Dogs age much faster in their first two years, then slow down. The rate also varies by size, with larger dogs aging faster than smaller dogs.',
  },
  {
    question: 'Why does dog size affect age calculation?',
    answer: 'Larger dogs tend to have shorter lifespans and age faster than smaller dogs. A Great Dane is considered senior around age 7, while a Chihuahua might not reach senior status until 10-12 years.',
  },
  {
    question: 'What size category is my dog?',
    answer: 'Small dogs are typically under 20 lbs (9 kg), medium dogs are 20-50 lbs (9-23 kg), and large dogs are over 50 lbs (23 kg). When in doubt, consult your veterinarian.',
  },
  {
    question: 'How accurate is this calculator?',
    answer: 'This calculator uses widely accepted formulas from veterinary research. However, individual dogs may age differently based on breed, genetics, diet, and overall health.',
  },
  {
    question: 'At what age is a dog considered a senior?',
    answer: 'It varies by size: small dogs around 10-12 years, medium dogs around 8-10 years, and large dogs around 6-8 years. Senior dogs benefit from more frequent vet visits.',
  },
  {
    question: 'Can I use this for puppies under 1 year?',
    answer: 'Yes! Enter decimal values like 0.5 for 6 months. Puppies develop rapidly, reaching adolescence around 6-12 months depending on breed size.',
  },
];

const SIZE_OPTIONS: { value: DogSize; label: string; description: string }[] = [
  { value: 'small', label: 'Small', description: 'Under 20 lbs (9 kg)' },
  { value: 'medium', label: 'Medium', description: '20-50 lbs (9-23 kg)' },
  { value: 'large', label: 'Large', description: 'Over 50 lbs (23 kg)' },
];

const getLifeStageColor = (stage: string) => {
  switch (stage) {
    case 'puppy':
      return 'bg-pink-100 dark:bg-pink-900/20 border-pink-500 text-pink-700 dark:text-pink-400';
    case 'young':
      return 'bg-green-100 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400';
    case 'adult':
      return 'bg-blue-100 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-400';
    case 'mature':
      return 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-500 text-yellow-700 dark:text-yellow-400';
    case 'senior':
      return 'bg-purple-100 dark:bg-purple-900/20 border-purple-500 text-purple-700 dark:text-purple-400';
    default:
      return 'bg-gray-100 dark:bg-gray-900/20 border-gray-500 text-gray-700 dark:text-gray-400';
  }
};

export function DogAgeCalculator() {
  const { result, dogAge, dogSize, setDogAge, setDogSize, calculate, reset } = useDogAgeCalculator();

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Dog Age Calculator',
    description: 'Calculate your dog\'s age in human years based on their size. Uses accurate non-linear aging model.',
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
    <SiteLayout toolName="Dog Age Calculator" category="lifestyle-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Calculate Your Dog&apos;s Human Age
          </h2>

          {/* Dog Age Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dog&apos;s Age (years)
            </label>
            <input
              type="number"
              min="0"
              max="30"
              step="0.5"
              value={dogAge}
              onChange={(e) => setDogAge(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter dog's age"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Use decimals for months (e.g., 0.5 for 6 months)
            </p>
          </div>

          {/* Dog Size Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dog Size
            </label>
            <div className="grid grid-cols-3 gap-4">
              {SIZE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDogSize(option.value)}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    dogSize === option.value
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {option.label}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {option.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Calculate Button */}
          <div className="flex gap-4">
            <button
              onClick={calculate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Calculate Age
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
              Results
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Human Age Result */}
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Human Age Equivalent
                </div>
                <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                  {result.humanAge}
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-400">
                  human years
                </div>
              </div>

              {/* Life Stage */}
              <div className={`p-6 rounded-lg border-l-4 ${getLifeStageColor(result.lifeStage)}`}>
                <div className="text-sm mb-2">Life Stage</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {result.lifeStageLabel}
                </div>
                <p className="text-sm">{result.description}</p>
              </div>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              * Based on your {dogAge}-year-old {dogSize} dog
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

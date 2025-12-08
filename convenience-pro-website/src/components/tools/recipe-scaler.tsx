'use client';

import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useRecipeScaler } from '@/hooks/useRecipeScaler';

const FEATURES = [
  {
    title: 'Smart Fraction Handling',
    description: 'Automatically parses and converts fractions like 1/2, 1/4, and mixed numbers for accurate scaling.',
  },
  {
    title: 'Unit Recognition',
    description: 'Recognizes common cooking units including cups, tablespoons, teaspoons, ounces, and more.',
  },
  {
    title: 'Instant Conversion',
    description: 'Scale recipes up or down instantly - perfect for feeding a crowd or cooking for two.',
  },
];

const FAQS = [
  {
    question: 'How do I use the recipe scaler?',
    answer: 'Enter the original serving size, your desired serving size, and paste your ingredient list. Click "Scale Recipe" to see the adjusted amounts.',
  },
  {
    question: 'What ingredient formats are supported?',
    answer: 'The tool recognizes formats like "2 cups flour", "1/2 tsp salt", "1 1/2 tbsp butter", and "3 eggs". Both fractions and decimals work.',
  },
  {
    question: 'Does scaling work for all recipes?',
    answer: 'Scaling works well for most recipes. However, baking recipes may need slight adjustments for leavening agents, and cooking times may vary.',
  },
  {
    question: 'What if an ingredient has no amount?',
    answer: 'Ingredients without amounts (like "salt to taste" or "fresh herbs") will be kept as-is without scaling.',
  },
  {
    question: 'Can I scale down as well as up?',
    answer: 'Yes! Enter a smaller target serving size than the original to scale down. The tool handles both directions.',
  },
  {
    question: 'How accurate is the scaling?',
    answer: 'The mathematical scaling is precise. Results are shown as fractions when possible for easier measuring.',
  },
];

const SAMPLE_INGREDIENTS = `2 cups all-purpose flour
1/2 tsp salt
1 1/2 cups sugar
3 eggs
1/4 cup butter
1 tsp vanilla extract`;

export function RecipeScaler() {
  const {
    originalServings,
    targetServings,
    ingredients,
    scaledIngredients,
    setOriginalServings,
    setTargetServings,
    setIngredients,
    scale,
    reset,
  } = useRecipeScaler();

  const handleLoadSample = () => {
    setIngredients(SAMPLE_INGREDIENTS);
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Recipe Scaler',
    description: 'Scale recipe ingredients up or down for any serving size. Automatically adjusts amounts and handles fractions.',
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
    <SiteLayout toolName="Recipe Scaler" category="lifestyle-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Scale Your Recipe
          </h2>

          {/* Servings Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Original Servings
              </label>
              <input
                type="number"
                min="1"
                value={originalServings}
                onChange={(e) => setOriginalServings(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Servings
              </label>
              <input
                type="number"
                min="1"
                value={targetServings}
                onChange={(e) => setTargetServings(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Scale Factor Display */}
          <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Scale factor: <span className="font-bold">{(targetServings / originalServings).toFixed(2)}x</span>
              {targetServings > originalServings ? ' (scaling up)' : targetServings < originalServings ? ' (scaling down)' : ' (no change)'}
            </p>
          </div>

          {/* Ingredients Input */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Ingredients (one per line)
              </label>
              <button
                onClick={handleLoadSample}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Load sample
              </button>
            </div>
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="2 cups flour&#10;1/2 tsp salt&#10;3 eggs"
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={scale}
              disabled={!ingredients.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
            >
              Scale Recipe
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
        {scaledIngredients.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Scaled Ingredients ({targetServings} servings)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 px-3 text-sm font-medium text-gray-600 dark:text-gray-400">Original</th>
                    <th className="text-left py-2 px-3 text-sm font-medium text-gray-600 dark:text-gray-400">Scaled</th>
                  </tr>
                </thead>
                <tbody>
                  {scaledIngredients.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-700/50">
                      <td className="py-2 px-3 text-gray-600 dark:text-gray-400">{item.original}</td>
                      <td className="py-2 px-3 font-medium text-gray-900 dark:text-white">{item.scaled}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Copy Button */}
            <button
              onClick={() => navigator.clipboard.writeText(scaledIngredients.map(i => i.scaled).join('\n'))}
              className="mt-4 px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
            >
              Copy Scaled Ingredients
            </button>
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

import { CookingConversionCalculator } from '@/components/tools/cooking-conversion-calculator';

export const metadata = {
  title: 'Cooking Conversion Calculator | Cups, Tablespoons, Teaspoons, ML',
  description: 'Convert cooking measurements between cups, tablespoons, teaspoons, milliliters, fluid ounces, pints, quarts, and gallons. Free online cooking unit converter.',
  keywords: ['cooking conversion', 'cup to ml', 'tablespoon to teaspoon', 'cooking measurement converter', 'kitchen unit converter', 'recipe conversion', 'fluid ounce converter'],
  openGraph: {
    title: 'Cooking Conversion Calculator | Cups, Tablespoons, Teaspoons, ML',
    description: 'Convert cooking measurements between cups, tablespoons, teaspoons, milliliters, fluid ounces, pints, quarts, and gallons. Free online cooking unit converter.',
    type: 'website',
    url: '/tools/cooking-conversion-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cooking Conversion Calculator | Cups, Tablespoons, Teaspoons, ML',
    description: 'Convert cooking measurements between cups, tablespoons, teaspoons, milliliters, fluid ounces, pints, quarts, and gallons. Free online cooking unit converter.',
  },
};

export default function CookingConversionCalculatorPage() {
  return <CookingConversionCalculator />;
}

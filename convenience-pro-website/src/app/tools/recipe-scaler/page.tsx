import { RecipeScaler } from '@/components/tools/recipe-scaler';

export const metadata = {
  title: 'Recipe Scaler | Scale Ingredients Up or Down',
  description: 'Easily scale recipe ingredients for any serving size. Automatically adjusts amounts, handles fractions, and recognizes common cooking units.',
  keywords: ['recipe scaler', 'ingredient calculator', 'recipe converter', 'serving size calculator', 'cooking calculator', 'recipe multiplier'],
  openGraph: {
    title: 'Recipe Scaler | Scale Ingredients Up or Down',
    description: 'Easily scale recipe ingredients for any serving size. Automatically adjusts amounts, handles fractions, and recognizes common cooking units.',
    type: 'website',
    url: '/tools/recipe-scaler',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Recipe Scaler | Scale Ingredients Up or Down',
    description: 'Easily scale recipe ingredients for any serving size. Automatically adjusts amounts, handles fractions, and recognizes common cooking units.',
  },
};

export default function RecipeScalerPage() {
  return <RecipeScaler />;
}

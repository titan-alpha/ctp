import { ClothingSizeConverter } from '@/components/tools/clothing-size-converter';

export const metadata = {
  title: 'Clothing Size Converter | US, UK, EU Size Chart',
  description: 'Convert clothing sizes between US, UK, and EU for men and women. Free online clothing size converter with accurate international size charts.',
  keywords: ['clothing size converter', 'clothing size chart', 'US to UK size', 'EU clothing size', 'mens clothing size', 'womens clothing size', 'international size chart'],
  openGraph: {
    title: 'Clothing Size Converter | US, UK, EU Size Chart',
    description: 'Convert clothing sizes between US, UK, and EU for men and women. Free online clothing size converter with accurate international size charts.',
    type: 'website',
    url: '/tools/clothing-size-converter',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Clothing Size Converter | US, UK, EU Size Chart',
    description: 'Convert clothing sizes between US, UK, and EU for men and women. Free online clothing size converter with accurate international size charts.',
  },
};

export default function ClothingSizeConverterPage() {
  return <ClothingSizeConverter />;
}

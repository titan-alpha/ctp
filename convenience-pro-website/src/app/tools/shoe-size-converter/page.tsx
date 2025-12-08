import { ShoeSizeConverter } from '@/components/tools/shoe-size-converter';

export const metadata = {
  title: 'Shoe Size Converter | US, UK, EU, CM Size Chart',
  description: 'Convert shoe sizes between US, UK, EU, and CM for men and women. Free online shoe size converter with accurate conversion charts.',
  keywords: ['shoe size converter', 'shoe size chart', 'US to UK shoe size', 'EU shoe size', 'shoe size CM', 'mens shoe size', 'womens shoe size'],
  openGraph: {
    title: 'Shoe Size Converter | US, UK, EU, CM Size Chart',
    description: 'Convert shoe sizes between US, UK, EU, and CM for men and women. Free online shoe size converter with accurate conversion charts.',
    type: 'website',
    url: '/tools/shoe-size-converter',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shoe Size Converter | US, UK, EU, CM Size Chart',
    description: 'Convert shoe sizes between US, UK, EU, and CM for men and women. Free online shoe size converter with accurate conversion charts.',
  },
};

export default function ShoeSizeConverterPage() {
  return <ShoeSizeConverter />;
}

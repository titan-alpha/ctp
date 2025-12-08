import { NumberToWords } from '@/components/tools/number-to-words';

export const metadata = {
  title: 'Number to Words Converter | Convert Numbers to Written Words',
  description: 'Convert numbers to written words instantly. Supports large numbers (billions, trillions), decimals, negative numbers, and currency formatting.',
  keywords: ['number to words', 'number to text', 'convert number to words', 'number converter', 'spell out numbers', 'currency to words', 'check writing'],
  openGraph: {
    title: 'Number to Words Converter | Convert Numbers to Written Words',
    description: 'Convert numbers to written words instantly. Supports large numbers (billions, trillions), decimals, negative numbers, and currency formatting.',
    type: 'website',
    url: '/tools/number-to-words',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Number to Words Converter | Convert Numbers to Written Words',
    description: 'Convert numbers to written words instantly. Supports large numbers (billions, trillions), decimals, negative numbers, and currency formatting.',
  },
};

export default function NumberToWordsPage() {
  return <NumberToWords />;
}

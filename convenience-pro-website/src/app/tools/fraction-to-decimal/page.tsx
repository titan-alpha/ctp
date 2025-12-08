import { FractionToDecimal } from '@/components/tools/fraction-to-decimal';

export const metadata = {
  title: 'Fraction to Decimal Converter | Convert Fractions & Decimals',
  description: 'Convert fractions to decimals and decimals to fractions instantly. Supports mixed numbers, improper fractions, and automatic simplification to lowest terms.',
  keywords: ['fraction to decimal', 'decimal to fraction', 'fraction converter', 'mixed number converter', 'simplify fractions', 'fraction calculator'],
  openGraph: {
    title: 'Fraction to Decimal Converter | Convert Fractions & Decimals',
    description: 'Convert fractions to decimals and decimals to fractions instantly. Supports mixed numbers, improper fractions, and automatic simplification to lowest terms.',
    type: 'website',
    url: '/tools/fraction-to-decimal',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fraction to Decimal Converter | Convert Fractions & Decimals',
    description: 'Convert fractions to decimals and decimals to fractions instantly. Supports mixed numbers, improper fractions, and automatic simplification to lowest terms.',
  },
};

export default function FractionToDecimalPage() {
  return <FractionToDecimal />;
}

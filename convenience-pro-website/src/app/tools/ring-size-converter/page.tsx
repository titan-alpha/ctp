import { RingSizeConverter } from '@/components/tools/ring-size-converter';

export const metadata = {
  title: 'Ring Size Converter | US, UK, EU Size Chart & Calculator',
  description: 'Convert ring sizes between US, UK, and EU systems. Find your ring size from finger circumference or diameter measurements with our free converter tool.',
  keywords: ['ring size converter', 'ring size chart', 'US ring size', 'UK ring size', 'EU ring size', 'finger circumference', 'ring diameter', 'jewelry sizing'],
  openGraph: {
    title: 'Ring Size Converter | US, UK, EU Size Chart & Calculator',
    description: 'Convert ring sizes between US, UK, and EU systems. Find your ring size from finger circumference or diameter measurements with our free converter tool.',
    type: 'website',
    url: '/tools/ring-size-converter',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ring Size Converter | US, UK, EU Size Chart & Calculator',
    description: 'Convert ring sizes between US, UK, and EU systems. Find your ring size from finger circumference or diameter measurements with our free converter tool.',
  },
};

export default function RingSizeConverterPage() {
  return <RingSizeConverter />;
}

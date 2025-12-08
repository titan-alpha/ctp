import { IcoToPng } from '@/components/tools/ico-to-png';

export const metadata = {
  title: 'ICO to PNG Converter | Free Online Icon Converter',
  description: 'Convert ICO icon files to PNG format online for free. Extracts the largest image from multi-size ICO files with transparency support. Fast, private, browser-based.',
  keywords: ['ico to png', 'ico converter', 'icon converter', 'png converter', 'ico to png online', 'convert ico', 'free icon converter', 'favicon converter'],
  openGraph: {
    title: 'ICO to PNG Converter | Free Online Icon Converter',
    description: 'Convert ICO icon files to PNG format online for free. Extracts the largest image from multi-size ICO files with transparency support.',
    type: 'website',
    url: '/tools/ico-to-png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ICO to PNG Converter | Free Online Icon Converter',
    description: 'Convert ICO icon files to PNG format online for free. Extracts the largest image from multi-size ICO files with transparency support.',
  },
};

export default function IcoToPngPage() {
  return <IcoToPng />;
}

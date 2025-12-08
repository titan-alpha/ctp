import { AvifToPng } from '@/components/tools/avif-to-png';

export const metadata = {
  title: 'AVIF to PNG Converter | Free Online Image Converter',
  description: 'Convert AVIF images to PNG format online for free. Preserves transparency, supports batch conversion, and processes files locally in your browser.',
  keywords: ['avif to png', 'avif converter', 'image converter', 'png converter', 'avif to png online', 'convert avif', 'free image converter'],
  openGraph: {
    title: 'AVIF to PNG Converter | Free Online Image Converter',
    description: 'Convert AVIF images to PNG format online for free. Preserves transparency, supports batch conversion, and processes files locally in your browser.',
    type: 'website',
    url: '/tools/avif-to-png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AVIF to PNG Converter | Free Online Image Converter',
    description: 'Convert AVIF images to PNG format online for free. Preserves transparency, supports batch conversion, and processes files locally in your browser.',
  },
};

export default function AvifToPngPage() {
  return <AvifToPng />;
}

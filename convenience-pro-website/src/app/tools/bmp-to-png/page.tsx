import { BmpToPng } from '@/components/tools/bmp-to-png';

export const metadata = {
  title: 'BMP to PNG Converter | Free Online Image Converter',
  description: 'Convert BMP images to PNG format online for free. Reduce file sizes with lossless compression, supports batch conversion, and processes files locally in your browser.',
  keywords: ['bmp to png', 'bmp converter', 'image converter', 'png converter', 'bmp to png online', 'convert bmp', 'free image converter', 'bitmap to png'],
  openGraph: {
    title: 'BMP to PNG Converter | Free Online Image Converter',
    description: 'Convert BMP images to PNG format online for free. Reduce file sizes with lossless compression, supports batch conversion, and processes files locally in your browser.',
    type: 'website',
    url: '/tools/bmp-to-png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BMP to PNG Converter | Free Online Image Converter',
    description: 'Convert BMP images to PNG format online for free. Reduce file sizes with lossless compression, supports batch conversion, and processes files locally in your browser.',
  },
};

export default function BmpToPngPage() {
  return <BmpToPng />;
}

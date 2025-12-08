import { BmpToJpg } from '@/components/tools/bmp-to-jpg';

export const metadata = {
  title: 'BMP to JPG Converter | Free Online Image Converter',
  description: 'Convert BMP images to JPG format for free. Client-side conversion ensures privacy. Adjustable quality settings and batch processing supported.',
  keywords: ['bmp to jpg', 'bmp converter', 'bmp to jpeg', 'image converter', 'convert bmp', 'bmp to jpg online', 'free bmp converter', 'bitmap to jpeg'],
  openGraph: {
    title: 'BMP to JPG Converter | Free Online Image Converter',
    description: 'Convert BMP images to JPG format for free. Client-side conversion ensures privacy. Adjustable quality settings and batch processing supported.',
    type: 'website',
    url: '/tools/bmp-to-jpg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BMP to JPG Converter | Free Online Image Converter',
    description: 'Convert BMP images to JPG format for free. Client-side conversion ensures privacy. Adjustable quality settings and batch processing supported.',
  },
};

export default function BmpToJpgPage() {
  return <BmpToJpg />;
}

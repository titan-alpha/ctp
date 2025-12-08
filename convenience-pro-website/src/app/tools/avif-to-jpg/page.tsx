import { AvifToJpg } from '@/components/tools/avif-to-jpg';

export const metadata = {
  title: 'AVIF to JPG Converter | Free Online Image Converter',
  description: 'Convert AVIF images to JPG format for free. Client-side conversion ensures privacy. Adjustable quality settings and batch processing supported.',
  keywords: ['avif to jpg', 'avif converter', 'avif to jpeg', 'image converter', 'convert avif', 'avif to jpg online', 'free avif converter'],
  openGraph: {
    title: 'AVIF to JPG Converter | Free Online Image Converter',
    description: 'Convert AVIF images to JPG format for free. Client-side conversion ensures privacy. Adjustable quality settings and batch processing supported.',
    type: 'website',
    url: '/tools/avif-to-jpg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AVIF to JPG Converter | Free Online Image Converter',
    description: 'Convert AVIF images to JPG format for free. Client-side conversion ensures privacy. Adjustable quality settings and batch processing supported.',
  },
};

export default function AvifToJpgPage() {
  return <AvifToJpg />;
}

import { TiffToJpg } from '@/components/tools/tiff-to-jpg';

export const metadata = {
  title: 'TIFF to JPG Converter | Free Online Image Converter',
  description: 'Convert TIFF images to JPG format for free. Client-side conversion ensures privacy. Adjustable quality settings and batch processing supported.',
  keywords: ['tiff to jpg', 'tiff converter', 'tiff to jpeg', 'image converter', 'convert tiff', 'tiff to jpg online', 'free tiff converter'],
  openGraph: {
    title: 'TIFF to JPG Converter | Free Online Image Converter',
    description: 'Convert TIFF images to JPG format for free. Client-side conversion ensures privacy. Adjustable quality settings and batch processing supported.',
    type: 'website',
    url: '/tools/tiff-to-jpg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TIFF to JPG Converter | Free Online Image Converter',
    description: 'Convert TIFF images to JPG format for free. Client-side conversion ensures privacy. Adjustable quality settings and batch processing supported.',
  },
};

export default function TiffToJpgPage() {
  return <TiffToJpg />;
}

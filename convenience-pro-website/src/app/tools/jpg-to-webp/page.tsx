import { JpgToWebp } from '@/components/tools/jpg-to-webp';

export const metadata = {
  title: 'JPG to WebP Converter | Free Online Image Converter',
  description: 'Convert JPG images to WebP format for free. Reduce file sizes by up to 30% while maintaining quality. Client-side conversion ensures privacy. Batch processing supported.',
  keywords: ['jpg to webp', 'jpeg to webp', 'webp converter', 'image converter', 'convert jpg', 'jpg to webp online', 'free webp converter', 'compress images'],
  openGraph: {
    title: 'JPG to WebP Converter | Free Online Image Converter',
    description: 'Convert JPG images to WebP format for free. Reduce file sizes by up to 30% while maintaining quality. Client-side conversion ensures privacy.',
    type: 'website',
    url: '/tools/jpg-to-webp',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JPG to WebP Converter | Free Online Image Converter',
    description: 'Convert JPG images to WebP format for free. Reduce file sizes by up to 30% while maintaining quality. Client-side conversion ensures privacy.',
  },
};

export default function JpgToWebpPage() {
  return <JpgToWebp />;
}

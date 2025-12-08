import { JfifToJpg } from '@/components/tools/jfif-to-jpg';

export const metadata = {
  title: 'JFIF to JPG Converter | Free Online Image Converter',
  description: 'Convert JFIF images to JPG format for free. Client-side conversion ensures privacy. Adjustable quality settings and batch processing supported.',
  keywords: ['jfif to jpg', 'jfif converter', 'jfif to jpeg', 'image converter', 'convert jfif', 'jfif to jpg online', 'free jfif converter'],
  openGraph: {
    title: 'JFIF to JPG Converter | Free Online Image Converter',
    description: 'Convert JFIF images to JPG format for free. Client-side conversion ensures privacy. Adjustable quality settings and batch processing supported.',
    type: 'website',
    url: '/tools/jfif-to-jpg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JFIF to JPG Converter | Free Online Image Converter',
    description: 'Convert JFIF images to JPG format for free. Client-side conversion ensures privacy. Adjustable quality settings and batch processing supported.',
  },
};

export default function JfifToJpgPage() {
  return <JfifToJpg />;
}

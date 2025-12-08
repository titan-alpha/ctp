import { ImageContrastAdjuster } from '@/components/tools/image-contrast-adjuster';

export const metadata = {
  title: 'Image Contrast Adjuster | Free Online Contrast Tool',
  description: 'Adjust image contrast online for free. Real-time preview, precise control from -100 to +100, and secure client-side processing. No uploads required.',
  keywords: ['image contrast', 'contrast adjuster', 'photo contrast', 'image editor', 'contrast tool', 'adjust contrast online', 'free image editor'],
  openGraph: {
    title: 'Image Contrast Adjuster | Free Online Contrast Tool',
    description: 'Adjust image contrast online for free. Real-time preview, precise control from -100 to +100, and secure client-side processing. No uploads required.',
    type: 'website',
    url: '/tools/image-contrast-adjuster',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Contrast Adjuster | Free Online Contrast Tool',
    description: 'Adjust image contrast online for free. Real-time preview, precise control from -100 to +100, and secure client-side processing. No uploads required.',
  },
};

export default function ImageContrastAdjusterPage() {
  return <ImageContrastAdjuster />;
}

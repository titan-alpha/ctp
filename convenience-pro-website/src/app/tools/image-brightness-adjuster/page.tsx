import { ImageBrightnessAdjuster } from '@/components/tools/image-brightness-adjuster';

export const metadata = {
  title: 'Image Brightness Adjuster | Free Online Tool',
  description: 'Adjust image brightness online for free. Real-time preview, before/after comparison, and privacy-focused client-side processing.',
  keywords: ['image brightness', 'brightness adjuster', 'photo brightness', 'image editor', 'brightness tool', 'lighten image', 'darken image', 'free image tool'],
  openGraph: {
    title: 'Image Brightness Adjuster | Free Online Tool',
    description: 'Adjust image brightness online for free. Real-time preview, before/after comparison, and privacy-focused client-side processing.',
    type: 'website',
    url: '/tools/image-brightness-adjuster',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Brightness Adjuster | Free Online Tool',
    description: 'Adjust image brightness online for free. Real-time preview, before/after comparison, and privacy-focused client-side processing.',
  },
};

export default function ImageBrightnessAdjusterPage() {
  return <ImageBrightnessAdjuster />;
}

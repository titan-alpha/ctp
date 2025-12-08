import { ImageSaturationAdjuster } from '@/components/tools/image-saturation-adjuster';

export const metadata = {
  title: 'Image Saturation Adjuster | Free Online Color Saturation Tool',
  description: 'Adjust image color saturation online for free. Convert images to grayscale or enhance colors with vivid saturation. Process locally in your browser.',
  keywords: ['image saturation', 'saturation adjuster', 'color saturation', 'grayscale converter', 'enhance colors', 'image editor', 'HSL adjustment'],
  openGraph: {
    title: 'Image Saturation Adjuster | Free Online Color Saturation Tool',
    description: 'Adjust image color saturation online for free. Convert images to grayscale or enhance colors with vivid saturation. Process locally in your browser.',
    type: 'website',
    url: '/tools/image-saturation-adjuster',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Saturation Adjuster | Free Online Color Saturation Tool',
    description: 'Adjust image color saturation online for free. Convert images to grayscale or enhance colors with vivid saturation. Process locally in your browser.',
  },
};

export default function ImageSaturationAdjusterPage() {
  return <ImageSaturationAdjuster />;
}

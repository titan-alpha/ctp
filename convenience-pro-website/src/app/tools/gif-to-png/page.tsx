import { GifToPng } from '@/components/tools/gif-to-png';

export const metadata = {
  title: 'GIF to PNG Converter | Free Online Image Converter',
  description: 'Convert GIF images to PNG format online for free. Extract the first frame from animated GIFs. Preserves transparency and processes files locally in your browser.',
  keywords: ['gif to png', 'gif converter', 'image converter', 'png converter', 'gif to png online', 'convert gif', 'extract gif frame', 'free image converter'],
  openGraph: {
    title: 'GIF to PNG Converter | Free Online Image Converter',
    description: 'Convert GIF images to PNG format online for free. Extract the first frame from animated GIFs. Preserves transparency and processes files locally in your browser.',
    type: 'website',
    url: '/tools/gif-to-png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GIF to PNG Converter | Free Online Image Converter',
    description: 'Convert GIF images to PNG format online for free. Extract the first frame from animated GIFs. Preserves transparency and processes files locally in your browser.',
  },
};

export default function GifToPngPage() {
  return <GifToPng />;
}

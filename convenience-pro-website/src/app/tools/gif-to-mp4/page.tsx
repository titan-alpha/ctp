import { GifToMp4 } from '@/components/tools/gif-to-mp4';

export const metadata = {
  title: 'GIF to MP4 Converter | Free Online Video Converter',
  description: 'Convert animated GIF images to MP4/WebM video format online for free. Smaller file sizes, better quality, and client-side processing for privacy.',
  keywords: ['gif to mp4', 'gif to video', 'gif converter', 'convert gif to mp4', 'gif to webm', 'animated gif converter', 'free gif converter'],
  openGraph: {
    title: 'GIF to MP4 Converter | Free Online Video Converter',
    description: 'Convert animated GIF images to MP4/WebM video format online for free. Smaller file sizes, better quality, and client-side processing for privacy.',
    type: 'website',
    url: '/tools/gif-to-mp4',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GIF to MP4 Converter | Free Online Video Converter',
    description: 'Convert animated GIF images to MP4/WebM video format online for free. Smaller file sizes, better quality, and client-side processing for privacy.',
  },
};

export default function GifToMp4Page() {
  return <GifToMp4 />;
}

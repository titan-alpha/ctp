import { AudioConverter } from '@/components/tools/audio-converter';

export const metadata = {
  title: 'Audio Converter | Convert MP3, WAV, OGG, AAC Online',
  description: 'Free online audio converter. Convert audio files between MP3, WAV, OGG, and AAC formats directly in your browser. No upload required - all processing happens locally.',
  keywords: ['audio converter', 'mp3 converter', 'wav converter', 'ogg converter', 'aac converter', 'convert audio online', 'audio format converter', 'free audio converter'],
  openGraph: {
    title: 'Audio Converter | Convert MP3, WAV, OGG, AAC Online',
    description: 'Free online audio converter. Convert audio files between MP3, WAV, OGG, and AAC formats directly in your browser. No upload required.',
    type: 'website',
    url: '/tools/audio-converter',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Audio Converter | Convert MP3, WAV, OGG, AAC Online',
    description: 'Free online audio converter. Convert audio files between MP3, WAV, OGG, and AAC formats directly in your browser. No upload required.',
  },
};

export default function AudioConverterPage() {
  return <AudioConverter />;
}

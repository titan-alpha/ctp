import { Mp3ToWav } from '@/components/tools/mp3-to-wav';

export const metadata = {
  title: 'MP3 to WAV Converter | Convert MP3 to WAV Online Free',
  description: 'Free online MP3 to WAV converter. Convert MP3 audio files to uncompressed WAV format with PCM 16-bit encoding directly in your browser. No upload required - all processing happens locally.',
  keywords: ['mp3 to wav', 'mp3 to wav converter', 'convert mp3 to wav', 'mp3 wav converter online', 'free mp3 to wav', 'audio converter', 'wav converter'],
  openGraph: {
    title: 'MP3 to WAV Converter | Convert MP3 to WAV Online Free',
    description: 'Free online MP3 to WAV converter. Convert MP3 audio files to uncompressed WAV format directly in your browser. No upload required.',
    type: 'website',
    url: '/tools/mp3-to-wav',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MP3 to WAV Converter | Convert MP3 to WAV Online Free',
    description: 'Free online MP3 to WAV converter. Convert MP3 audio files to uncompressed WAV format directly in your browser. No upload required.',
  },
};

export default function Mp3ToWavPage() {
  return <Mp3ToWav />;
}

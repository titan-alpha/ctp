import { AsciiArtGenerator } from '@/components/tools/ascii-art-generator';

export const metadata = {
  title: 'ASCII Art Generator | Free Online Image to ASCII Converter',
  description: 'Convert images to ASCII art online for free. Multiple character sets, adjustable width, and privacy-focused client-side processing.',
  keywords: ['ascii art', 'ascii generator', 'image to ascii', 'text art', 'ascii converter', 'image to text', 'character art', 'free ascii tool'],
  openGraph: {
    title: 'ASCII Art Generator | Free Online Image to ASCII Converter',
    description: 'Convert images to ASCII art online for free. Multiple character sets, adjustable width, and privacy-focused client-side processing.',
    type: 'website',
    url: '/tools/ascii-art-generator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ASCII Art Generator | Free Online Image to ASCII Converter',
    description: 'Convert images to ASCII art online for free. Multiple character sets, adjustable width, and privacy-focused client-side processing.',
  },
};

export default function AsciiArtGeneratorPage() {
  return <AsciiArtGenerator />;
}

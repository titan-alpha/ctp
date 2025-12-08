import { CodeToImage } from '@/components/tools/code-to-image';

export const metadata = {
  title: 'Code to Image Generator | Free Online Tool',
  description: 'Convert code snippets to beautiful images with syntax highlighting. Support for 15+ languages, multiple themes, and customizable output. Free and privacy-focused.',
  keywords: ['code to image', 'code screenshot', 'syntax highlighting', 'code snippet', 'code image generator', 'source code image', 'code beautifier', 'carbon alternative'],
  openGraph: {
    title: 'Code to Image Generator | Free Online Tool',
    description: 'Convert code snippets to beautiful images with syntax highlighting. Support for 15+ languages, multiple themes, and customizable output.',
    type: 'website',
    url: '/tools/code-to-image',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Code to Image Generator | Free Online Tool',
    description: 'Convert code snippets to beautiful images with syntax highlighting. Support for 15+ languages, multiple themes, and customizable output.',
  },
};

export default function CodeToImagePage() {
  return <CodeToImage />;
}

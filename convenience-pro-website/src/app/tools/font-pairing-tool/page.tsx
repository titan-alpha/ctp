import { FontPairingTool } from '@/components/tools/font-pairing-tool';

export const metadata = {
  title: 'Font Pairing Tool | Find Perfect Font Combinations',
  description: 'Discover beautiful font pairings for your website. Browse curated combinations by style, preview with custom text, and copy Google Fonts code instantly.',
  keywords: ['font pairing', 'font combinations', 'google fonts', 'typography', 'web fonts', 'font matcher', 'serif sans serif', 'heading body fonts'],
  openGraph: {
    title: 'Font Pairing Tool | Find Perfect Font Combinations',
    description: 'Discover beautiful font pairings for your website. Browse curated combinations by style, preview with custom text, and copy Google Fonts code instantly.',
    type: 'website',
    url: '/tools/font-pairing-tool',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Font Pairing Tool | Find Perfect Font Combinations',
    description: 'Discover beautiful font pairings for your website. Browse curated combinations by style, preview with custom text, and copy Google Fonts code instantly.',
  },
};

export default function FontPairingToolPage() {
  return <FontPairingTool />;
}

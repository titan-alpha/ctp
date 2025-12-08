import { GoogleSerpSimulator } from '@/components/tools/google-serp-simulator';

export const metadata = {
  title: 'Google SERP Simulator | Preview Search Results & Optimize Meta Tags',
  description: 'Preview how your page appears in Google search results. Optimize title tags and meta descriptions with pixel-accurate truncation preview for desktop and mobile.',
  keywords: ['SERP simulator', 'Google preview', 'meta description checker', 'title tag optimizer', 'SEO preview tool', 'search result preview', 'snippet optimizer'],
  openGraph: {
    title: 'Google SERP Simulator | Preview Search Results & Optimize Meta Tags',
    description: 'Preview how your page appears in Google search results. Optimize title tags and meta descriptions with pixel-accurate truncation preview for desktop and mobile.',
    type: 'website',
    url: '/tools/google-serp-simulator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Google SERP Simulator | Preview Search Results & Optimize Meta Tags',
    description: 'Preview how your page appears in Google search results. Optimize title tags and meta descriptions with pixel-accurate truncation preview for desktop and mobile.',
  },
};

export default function GoogleSerpSimulatorPage() {
  return <GoogleSerpSimulator />;
}

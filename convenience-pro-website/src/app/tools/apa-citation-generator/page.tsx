import { ApaCitationGenerator } from '@/components/tools/apa-citation-generator';

export const metadata = {
  title: 'APA Citation Generator | Free APA 7th Edition Format Tool',
  description: 'Generate accurate APA 7th edition citations for books, journal articles, and websites. Get both in-text and reference list citations instantly. Free online tool.',
  keywords: ['APA citation generator', 'APA 7th edition', 'citation generator', 'reference generator', 'in-text citation', 'bibliography', 'academic citation', 'APA format'],
  openGraph: {
    title: 'APA Citation Generator | Free APA 7th Edition Format Tool',
    description: 'Generate accurate APA 7th edition citations for books, journal articles, and websites. Get both in-text and reference list citations instantly. Free online tool.',
    type: 'website',
    url: '/tools/apa-citation-generator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'APA Citation Generator | Free APA 7th Edition Format Tool',
    description: 'Generate accurate APA 7th edition citations for books, journal articles, and websites. Get both in-text and reference list citations instantly. Free online tool.',
  },
};

export default function ApaCitationGeneratorPage() {
  return <ApaCitationGenerator />;
}

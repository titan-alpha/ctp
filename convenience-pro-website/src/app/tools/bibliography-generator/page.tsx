import { BibliographyGenerator } from '@/components/tools/bibliography-generator';

export const metadata = {
  title: 'Bibliography Generator | Create APA, MLA, Chicago Citations',
  description: 'Generate properly formatted citations in APA, MLA, and Chicago styles. Support for books, journal articles, websites, and videos. Build your bibliography list for free.',
  keywords: ['bibliography generator', 'citation generator', 'APA citation', 'MLA citation', 'Chicago citation', 'reference generator', 'works cited generator', 'cite sources'],
  openGraph: {
    title: 'Bibliography Generator | Create APA, MLA, Chicago Citations',
    description: 'Generate properly formatted citations in APA, MLA, and Chicago styles. Support for books, journal articles, websites, and videos. Build your bibliography list for free.',
    type: 'website',
    url: '/tools/bibliography-generator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bibliography Generator | Create APA, MLA, Chicago Citations',
    description: 'Generate properly formatted citations in APA, MLA, and Chicago styles. Support for books, journal articles, websites, and videos. Build your bibliography list for free.',
  },
};

export default function BibliographyGeneratorPage() {
  return <BibliographyGenerator />;
}

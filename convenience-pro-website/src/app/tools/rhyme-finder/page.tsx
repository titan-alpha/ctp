import { RhymeFinder } from '@/components/tools/rhyme-finder';

export const metadata = {
  title: 'Rhyme Finder | Find Perfect, Near & Slant Rhymes',
  description: 'Find perfect, near, and slant rhymes for any word. Filter by syllable count. Free online rhyme finder for poets, songwriters, and creative writers.',
  keywords: ['rhyme finder', 'rhyming words', 'perfect rhymes', 'near rhymes', 'slant rhymes', 'poetry tool', 'songwriting tool', 'rhyme dictionary'],
  openGraph: {
    title: 'Rhyme Finder | Find Perfect, Near & Slant Rhymes',
    description: 'Find perfect, near, and slant rhymes for any word. Filter by syllable count. Free online rhyme finder for poets, songwriters, and creative writers.',
    type: 'website',
    url: '/tools/rhyme-finder',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rhyme Finder | Find Perfect, Near & Slant Rhymes',
    description: 'Find perfect, near, and slant rhymes for any word. Filter by syllable count. Free online rhyme finder for poets, songwriters, and creative writers.',
  },
};

export default function RhymeFinderPage() {
  return <RhymeFinder />;
}

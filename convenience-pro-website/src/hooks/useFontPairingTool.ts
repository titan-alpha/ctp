import { useState, useCallback, useMemo } from 'react';

export type FontCategory = 'serif-sans' | 'modern' | 'classic' | 'playful';

export interface FontPair {
  id: string;
  name: string;
  category: FontCategory;
  heading: {
    family: string;
    weight: number;
    googleName: string;
  };
  body: {
    family: string;
    weight: number;
    googleName: string;
  };
  description: string;
  bestFor: string[];
}

interface UseFontPairingToolReturn {
  fontPairs: FontPair[];
  filteredPairs: FontPair[];
  selectedCategory: FontCategory | 'all';
  selectedPair: FontPair | null;
  previewText: string;
  setSelectedCategory: (category: FontCategory | 'all') => void;
  setSelectedPair: (pair: FontPair | null) => void;
  setPreviewText: (text: string) => void;
  getGoogleFontsLink: (pair: FontPair) => string;
  getCSSImport: (pair: FontPair) => string;
  getCSSVariables: (pair: FontPair) => string;
}

const FONT_PAIRS: FontPair[] = [
  // Serif + Sans pairs
  {
    id: 'playfair-source',
    name: 'Playfair Display + Source Sans Pro',
    category: 'serif-sans',
    heading: { family: 'Playfair Display', weight: 700, googleName: 'Playfair+Display:wght@700' },
    body: { family: 'Source Sans Pro', weight: 400, googleName: 'Source+Sans+Pro:wght@400;600' },
    description: 'Elegant serif headings with clean sans-serif body text. Perfect for editorial and luxury brands.',
    bestFor: ['Blogs', 'Magazines', 'Luxury brands'],
  },
  {
    id: 'lora-open',
    name: 'Lora + Open Sans',
    category: 'serif-sans',
    heading: { family: 'Lora', weight: 700, googleName: 'Lora:wght@700' },
    body: { family: 'Open Sans', weight: 400, googleName: 'Open+Sans:wght@400;600' },
    description: 'Warm, friendly serif paired with a neutral sans-serif. Great readability across devices.',
    bestFor: ['Publishing', 'News sites', 'Documentation'],
  },
  {
    id: 'merriweather-roboto',
    name: 'Merriweather + Roboto',
    category: 'serif-sans',
    heading: { family: 'Merriweather', weight: 700, googleName: 'Merriweather:wght@700' },
    body: { family: 'Roboto', weight: 400, googleName: 'Roboto:wght@400;500' },
    description: 'Highly readable serif with modern sans-serif. Excellent for long-form content.',
    bestFor: ['Articles', 'Books', 'Academic sites'],
  },
  // Modern pairs
  {
    id: 'montserrat-hind',
    name: 'Montserrat + Hind',
    category: 'modern',
    heading: { family: 'Montserrat', weight: 700, googleName: 'Montserrat:wght@700' },
    body: { family: 'Hind', weight: 400, googleName: 'Hind:wght@400;500' },
    description: 'Bold geometric headings with clean Devanagari-inspired body. Modern and professional.',
    bestFor: ['Tech startups', 'SaaS', 'Corporate sites'],
  },
  {
    id: 'poppins-inter',
    name: 'Poppins + Inter',
    category: 'modern',
    heading: { family: 'Poppins', weight: 700, googleName: 'Poppins:wght@600;700' },
    body: { family: 'Inter', weight: 400, googleName: 'Inter:wght@400;500' },
    description: 'Trendy geometric sans-serif pair. Clean, modern, and highly versatile.',
    bestFor: ['Web apps', 'Dashboards', 'Modern brands'],
  },
  {
    id: 'raleway-nunito',
    name: 'Raleway + Nunito',
    category: 'modern',
    heading: { family: 'Raleway', weight: 700, googleName: 'Raleway:wght@700' },
    body: { family: 'Nunito', weight: 400, googleName: 'Nunito:wght@400;600' },
    description: 'Elegant thin strokes paired with rounded friendly body text. Sophisticated yet approachable.',
    bestFor: ['Fashion', 'Design portfolios', 'Creative agencies'],
  },
  // Classic pairs
  {
    id: 'georgia-verdana',
    name: 'Georgia + Verdana',
    category: 'classic',
    heading: { family: 'Georgia', weight: 700, googleName: '' },
    body: { family: 'Verdana', weight: 400, googleName: '' },
    description: 'Timeless web-safe combination. Maximum compatibility and proven readability.',
    bestFor: ['Traditional business', 'Government', 'Accessibility-focused'],
  },
  {
    id: 'eb-garamond-lato',
    name: 'EB Garamond + Lato',
    category: 'classic',
    heading: { family: 'EB Garamond', weight: 700, googleName: 'EB+Garamond:wght@700' },
    body: { family: 'Lato', weight: 400, googleName: 'Lato:wght@400;700' },
    description: 'Classic Garamond revival with modern humanist sans. Timeless elegance.',
    bestFor: ['Law firms', 'Finance', 'Traditional brands'],
  },
  {
    id: 'libre-baskerville-source',
    name: 'Libre Baskerville + Source Sans Pro',
    category: 'classic',
    heading: { family: 'Libre Baskerville', weight: 700, googleName: 'Libre+Baskerville:wght@700' },
    body: { family: 'Source Sans Pro', weight: 400, googleName: 'Source+Sans+Pro:wght@400;600' },
    description: 'Traditional transitional serif with clean modern body. Professional and trustworthy.',
    bestFor: ['Publishing', 'Education', 'Non-profits'],
  },
  // Playful pairs
  {
    id: 'fredoka-quicksand',
    name: 'Fredoka One + Quicksand',
    category: 'playful',
    heading: { family: 'Fredoka One', weight: 400, googleName: 'Fredoka+One' },
    body: { family: 'Quicksand', weight: 400, googleName: 'Quicksand:wght@400;500' },
    description: 'Fun rounded display font with playful body text. Perfect for kids and casual brands.',
    bestFor: ['Kids products', 'Games', 'Casual apps'],
  },
  {
    id: 'pacifico-poppins',
    name: 'Pacifico + Poppins',
    category: 'playful',
    heading: { family: 'Pacifico', weight: 400, googleName: 'Pacifico' },
    body: { family: 'Poppins', weight: 400, googleName: 'Poppins:wght@400;500' },
    description: 'Casual brush script headings with clean modern body. Friendly and inviting.',
    bestFor: ['Food & beverage', 'Lifestyle brands', 'Social apps'],
  },
  {
    id: 'baloo-nunito',
    name: 'Baloo 2 + Nunito Sans',
    category: 'playful',
    heading: { family: 'Baloo 2', weight: 700, googleName: 'Baloo+2:wght@700' },
    body: { family: 'Nunito Sans', weight: 400, googleName: 'Nunito+Sans:wght@400;600' },
    description: 'Bubbly display font with rounded sans-serif. Fun, approachable, and energetic.',
    bestFor: ['Gaming', 'Entertainment', 'Youth brands'],
  },
];

export function useFontPairingTool(): UseFontPairingToolReturn {
  const [selectedCategory, setSelectedCategory] = useState<FontCategory | 'all'>('all');
  const [selectedPair, setSelectedPair] = useState<FontPair | null>(null);
  const [previewText, setPreviewText] = useState('The quick brown fox jumps over the lazy dog');

  const filteredPairs = useMemo(() => {
    if (selectedCategory === 'all') return FONT_PAIRS;
    return FONT_PAIRS.filter((pair) => pair.category === selectedCategory);
  }, [selectedCategory]);

  const getGoogleFontsLink = useCallback((pair: FontPair): string => {
    const fonts: string[] = [];
    if (pair.heading.googleName) fonts.push(pair.heading.googleName);
    if (pair.body.googleName) fonts.push(pair.body.googleName);
    if (fonts.length === 0) return '/* System fonts - no Google Fonts link needed */';
    return `<link href="https://fonts.googleapis.com/css2?family=${fonts.join('&family=')}&display=swap" rel="stylesheet">`;
  }, []);

  const getCSSImport = useCallback((pair: FontPair): string => {
    const fonts: string[] = [];
    if (pair.heading.googleName) fonts.push(pair.heading.googleName);
    if (pair.body.googleName) fonts.push(pair.body.googleName);
    if (fonts.length === 0) return '/* System fonts - no import needed */';
    return `@import url('https://fonts.googleapis.com/css2?family=${fonts.join('&family=')}&display=swap');`;
  }, []);

  const getCSSVariables = useCallback((pair: FontPair): string => {
    return `:root {
  --font-heading: '${pair.heading.family}', ${pair.category === 'serif-sans' || pair.category === 'classic' ? 'serif' : 'sans-serif'};
  --font-body: '${pair.body.family}', sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  font-weight: ${pair.heading.weight};
}

body, p {
  font-family: var(--font-body);
  font-weight: ${pair.body.weight};
}`;
  }, []);

  return {
    fontPairs: FONT_PAIRS,
    filteredPairs,
    selectedCategory,
    selectedPair,
    previewText,
    setSelectedCategory,
    setSelectedPair,
    setPreviewText,
    getGoogleFontsLink,
    getCSSImport,
    getCSSVariables,
  };
}

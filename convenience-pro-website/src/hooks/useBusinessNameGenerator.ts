import { useState, useCallback } from 'react';

export type NameStyle = 'modern' | 'classic' | 'playful' | 'tech';
export type Industry = 'technology' | 'food' | 'fashion' | 'health' | 'finance' | 'creative' | 'retail' | 'services';

export interface GeneratedName {
  id: string;
  name: string;
  style: NameStyle;
  isFavorite: boolean;
}

interface UseBusinessNameGeneratorReturn {
  names: GeneratedName[];
  isGenerating: boolean;
  generate: (keywords: string[], industry: Industry, style: NameStyle) => void;
  toggleFavorite: (id: string) => void;
  favorites: GeneratedName[];
  reset: () => void;
}

const PREFIXES: Record<NameStyle, string[]> = {
  modern: ['Nova', 'Flux', 'Zen', 'Apex', 'Vibe', 'Neo', 'Aura', 'Edge', 'Pure', 'Rise'],
  classic: ['Royal', 'Prime', 'Grand', 'Elite', 'Sterling', 'Heritage', 'Noble', 'Crown', 'Legacy', 'Trust'],
  playful: ['Happy', 'Sunny', 'Pop', 'Fizz', 'Spark', 'Bounce', 'Joy', 'Zippy', 'Quirky', 'Fun'],
  tech: ['Cyber', 'Digi', 'Byte', 'Cloud', 'Data', 'Code', 'Logic', 'Pixel', 'Neural', 'Quantum'],
};

const SUFFIXES: Record<NameStyle, string[]> = {
  modern: ['Lab', 'Hub', 'Collective', 'Studio', 'Works', 'Co', 'Space', 'House', 'Group', 'Agency'],
  classic: ['& Sons', '& Associates', 'Industries', 'Enterprises', 'Company', 'Partners', 'Solutions', 'Group', 'International', 'Corp'],
  playful: ['Pals', 'Squad', 'Crew', 'Gang', 'Club', 'Party', 'Zone', 'Land', 'World', 'Express'],
  tech: ['Tech', 'Systems', 'AI', 'Labs', 'Soft', 'Digital', 'IO', 'Dev', 'Net', 'Ware'],
};

const INDUSTRY_WORDS: Record<Industry, string[]> = {
  technology: ['Sync', 'Link', 'Connect', 'Stream', 'Forge', 'Build', 'Stack', 'Core'],
  food: ['Taste', 'Fresh', 'Savory', 'Kitchen', 'Bistro', 'Harvest', 'Table', 'Plate'],
  fashion: ['Style', 'Chic', 'Thread', 'Luxe', 'Trend', 'Couture', 'Vogue', 'Mode'],
  health: ['Vita', 'Wellness', 'Bloom', 'Thrive', 'Care', 'Life', 'Glow', 'Balance'],
  finance: ['Capital', 'Wealth', 'Asset', 'Fidelity', 'Trust', 'Secure', 'Value', 'Growth'],
  creative: ['Craft', 'Design', 'Vision', 'Create', 'Arte', 'Canvas', 'Muse', 'Palette'],
  retail: ['Market', 'Shop', 'Store', 'Outlet', 'Mart', 'Emporium', 'Bazaar', 'Trade'],
  services: ['Pro', 'Expert', 'Swift', 'Premier', 'Direct', 'Easy', 'Quick', 'Smart'],
};

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function useBusinessNameGenerator(): UseBusinessNameGeneratorReturn {
  const [names, setNames] = useState<GeneratedName[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = useCallback((keywords: string[], industry: Industry, style: NameStyle) => {
    setIsGenerating(true);

    const prefixes = shuffleArray(PREFIXES[style]);
    const suffixes = shuffleArray(SUFFIXES[style]);
    const industryWords = shuffleArray(INDUSTRY_WORDS[industry]);
    const userKeywords = keywords.map(k => capitalize(k.trim())).filter(k => k.length > 0);

    const generatedNames: GeneratedName[] = [];
    const usedNames = new Set<string>();

    const addName = (name: string) => {
      const normalized = name.toLowerCase();
      if (!usedNames.has(normalized) && name.length > 2) {
        usedNames.add(normalized);
        generatedNames.push({
          id: generateId(),
          name,
          style,
          isFavorite: false,
        });
      }
    };

    // Prefix + Keyword combinations
    for (const prefix of prefixes.slice(0, 4)) {
      for (const keyword of userKeywords.slice(0, 2)) {
        addName(`${prefix}${keyword}`);
        addName(`${prefix} ${keyword}`);
      }
    }

    // Keyword + Suffix combinations
    for (const keyword of userKeywords.slice(0, 3)) {
      for (const suffix of suffixes.slice(0, 3)) {
        addName(`${keyword} ${suffix}`);
        addName(`${keyword}${suffix}`);
      }
    }

    // Prefix + Industry word combinations
    for (const prefix of prefixes.slice(0, 3)) {
      for (const word of industryWords.slice(0, 3)) {
        addName(`${prefix}${word}`);
        addName(`${prefix} ${word}`);
      }
    }

    // Industry word + Suffix combinations
    for (const word of industryWords.slice(0, 3)) {
      for (const suffix of suffixes.slice(0, 3)) {
        addName(`${word} ${suffix}`);
      }
    }

    // Keyword blends (combining two keywords)
    if (userKeywords.length >= 2) {
      addName(`${userKeywords[0]}${userKeywords[1]}`);
      addName(`${userKeywords[1]}${userKeywords[0]}`);
    }

    // Prefix + Keyword + Suffix
    if (userKeywords.length > 0) {
      for (const prefix of prefixes.slice(0, 2)) {
        for (const suffix of suffixes.slice(0, 2)) {
          addName(`${prefix} ${userKeywords[0]} ${suffix}`);
        }
      }
    }

    // Limit to 20 names and shuffle
    const finalNames = shuffleArray(generatedNames).slice(0, 20);

    setNames(finalNames);
    setIsGenerating(false);
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setNames(prev => prev.map(name =>
      name.id === id ? { ...name, isFavorite: !name.isFavorite } : name
    ));
  }, []);

  const favorites = names.filter(n => n.isFavorite);

  const reset = useCallback(() => {
    setNames([]);
  }, []);

  return {
    names,
    isGenerating,
    generate,
    toggleFavorite,
    favorites,
    reset,
  };
}

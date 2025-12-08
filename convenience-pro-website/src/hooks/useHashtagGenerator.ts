import { useState, useCallback } from 'react';

export type Platform = 'instagram' | 'twitter' | 'tiktok' | 'all';
export type Niche = 'general' | 'fitness' | 'food' | 'travel' | 'fashion' | 'tech' | 'business' | 'photography' | 'lifestyle' | 'beauty';

interface Hashtag {
  tag: string;
  category: 'popular' | 'niche' | 'related';
}

interface HashtagResult {
  hashtags: Hashtag[];
  popular: string[];
  niche: string[];
  related: string[];
  totalCharacters: number;
  formatted: string;
}

interface PlatformLimits {
  maxHashtags: number;
  maxCharacters: number;
}

interface UseHashtagGeneratorReturn {
  result: HashtagResult | null;
  generate: (keywords: string, platform: Platform, niche: Niche) => void;
  reset: () => void;
  platformLimits: Record<Platform, PlatformLimits>;
}

const PLATFORM_LIMITS: Record<Platform, PlatformLimits> = {
  instagram: { maxHashtags: 30, maxCharacters: 2200 },
  twitter: { maxHashtags: 10, maxCharacters: 280 },
  tiktok: { maxHashtags: 5, maxCharacters: 150 },
  all: { maxHashtags: 30, maxCharacters: 2200 },
};

const POPULAR_BASES: Record<Niche, string[]> = {
  general: ['viral', 'trending', 'fyp', 'explore', 'instagood', 'photooftheday', 'love', 'follow'],
  fitness: ['fitness', 'gym', 'workout', 'fitfam', 'bodybuilding', 'gains', 'fitlife', 'exercise'],
  food: ['foodie', 'yummy', 'delicious', 'foodporn', 'instafood', 'homemade', 'foodlover', 'cooking'],
  travel: ['travel', 'wanderlust', 'adventure', 'explore', 'vacation', 'travelphotography', 'instatravel', 'trip'],
  fashion: ['fashion', 'style', 'ootd', 'fashionista', 'streetstyle', 'outfit', 'fashionblogger', 'trendy'],
  tech: ['tech', 'technology', 'innovation', 'gadgets', 'coding', 'developer', 'software', 'digital'],
  business: ['business', 'entrepreneur', 'startup', 'success', 'motivation', 'hustle', 'smallbusiness', 'growth'],
  photography: ['photography', 'photo', 'photographer', 'picoftheday', 'portrait', 'photoart', 'shotoniphone', 'lens'],
  lifestyle: ['lifestyle', 'life', 'happy', 'inspiration', 'motivation', 'goals', 'positivevibes', 'mindset'],
  beauty: ['beauty', 'makeup', 'skincare', 'beautytips', 'glam', 'mua', 'cosmetics', 'beautyblogger'],
};

const NICHE_SUFFIXES = ['tips', 'daily', 'life', 'goals', 'lover', 'community', 'style', 'vibes', 'world', 'gram'];
const RELATED_MODIFIERS = ['love', 'best', 'top', 'new', 'my', 'real', 'daily', 'insta'];

export function useHashtagGenerator(): UseHashtagGeneratorReturn {
  const [result, setResult] = useState<HashtagResult | null>(null);

  const generate = useCallback((keywords: string, platform: Platform, niche: Niche) => {
    const keywordList = keywords
      .toLowerCase()
      .split(/[,\s]+/)
      .filter(k => k.length > 0)
      .map(k => k.replace(/[^a-z0-9]/g, ''));

    if (keywordList.length === 0) return;

    const popular: string[] = [];
    const nicheHashtags: string[] = [];
    const related: string[] = [];

    // Popular hashtags from niche
    const nicheBase = POPULAR_BASES[niche] || POPULAR_BASES.general;
    nicheBase.slice(0, 5).forEach(tag => popular.push(`#${tag}`));

    // Add keyword-based popular tags
    keywordList.slice(0, 3).forEach(keyword => {
      popular.push(`#${keyword}`);
      if (keyword.length > 3) {
        popular.push(`#${keyword}s`);
      }
    });

    // Niche hashtags (more specific)
    keywordList.forEach(keyword => {
      NICHE_SUFFIXES.slice(0, 3).forEach(suffix => {
        nicheHashtags.push(`#${keyword}${suffix}`);
      });
    });
    nicheBase.slice(3, 6).forEach(tag => {
      nicheHashtags.push(`#${tag}${NICHE_SUFFIXES[Math.floor(Math.random() * NICHE_SUFFIXES.length)]}`);
    });

    // Related hashtags
    keywordList.forEach(keyword => {
      RELATED_MODIFIERS.slice(0, 2).forEach(mod => {
        related.push(`#${mod}${keyword}`);
      });
    });
    related.push(`#${niche}`, `#${niche}life`, `#${niche}community`);

    // Dedupe and limit based on platform
    const limits = PLATFORM_LIMITS[platform];
    const allTags = [...new Set([...popular, ...nicheHashtags, ...related])];
    const limitedTags = allTags.slice(0, limits.maxHashtags);

    const hashtags: Hashtag[] = limitedTags.map(tag => {
      if (popular.includes(tag)) return { tag, category: 'popular' as const };
      if (nicheHashtags.includes(tag)) return { tag, category: 'niche' as const };
      return { tag, category: 'related' as const };
    });

    const formatted = limitedTags.join(' ');
    const totalCharacters = formatted.length;

    setResult({
      hashtags,
      popular: [...new Set(popular)].slice(0, 10),
      niche: [...new Set(nicheHashtags)].slice(0, 10),
      related: [...new Set(related)].slice(0, 10),
      totalCharacters,
      formatted,
    });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return {
    result,
    generate,
    reset,
    platformLimits: PLATFORM_LIMITS,
  };
}

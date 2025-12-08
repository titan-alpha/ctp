import { useState, useCallback } from 'react';

export interface KeywordStat {
  keyword: string;
  count: number;
  density: number;
}

export interface KeywordDensityResult {
  totalWords: number;
  uniqueWords: number;
  characterCount: number;
  sentenceCount: number;
  keywords: KeywordStat[];
  targetKeywordStats: KeywordStat | null;
}

interface UseKeywordDensityCheckerReturn {
  result: KeywordDensityResult | null;
  analyze: (text: string, targetKeyword?: string, topN?: number) => void;
  reset: () => void;
}

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had',
  'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
  'shall', 'can', 'need', 'dare', 'ought', 'used', 'it', 'its', 'this', 'that',
  'these', 'those', 'i', 'you', 'he', 'she', 'we', 'they', 'me', 'him', 'her', 'us',
  'them', 'my', 'your', 'his', 'our', 'their', 'what', 'which', 'who', 'whom',
  'where', 'when', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more',
  'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so',
  'than', 'too', 'very', 'just', 'also', 'now', 'here', 'there', 'then', 'once',
  'if', 'else', 'because', 'about', 'into', 'through', 'during', 'before', 'after',
  'above', 'below', 'between', 'under', 'again', 'further', 'any', 'up', 'down',
  'out', 'off', 'over', 'am', 'being', 'get', 'got', 'gets', 'let', 'make', 'made',
]);

function analyzeKeywordDensity(text: string, targetKeyword?: string, topN: number = 20): KeywordDensityResult {
  const cleanText = text.toLowerCase();
  const words = cleanText.match(/\b[a-z]+\b/g) || [];
  const totalWords = words.length;
  const characterCount = text.length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = sentences.length;

  // Count word frequencies (excluding stop words)
  const wordFrequency: Map<string, number> = new Map();

  words.forEach(word => {
    if (word.length > 2 && !STOP_WORDS.has(word)) {
      wordFrequency.set(word, (wordFrequency.get(word) || 0) + 1);
    }
  });

  // Calculate unique words
  const uniqueWords = new Set(words).size;

  // Sort by frequency and get top N
  const sortedKeywords = Array.from(wordFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([keyword, count]): KeywordStat => ({
      keyword,
      count,
      density: totalWords > 0 ? (count / totalWords) * 100 : 0,
    }));

  // Calculate target keyword stats
  let targetKeywordStats: KeywordStat | null = null;
  if (targetKeyword && targetKeyword.trim()) {
    const targetLower = targetKeyword.toLowerCase().trim();
    const targetWords = targetLower.split(/\s+/);

    if (targetWords.length === 1) {
      // Single word target
      const count = words.filter(w => w === targetLower).length;
      targetKeywordStats = {
        keyword: targetKeyword.trim(),
        count,
        density: totalWords > 0 ? (count / totalWords) * 100 : 0,
      };
    } else {
      // Multi-word phrase
      const regex = new RegExp(targetLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      const matches = text.match(regex) || [];
      targetKeywordStats = {
        keyword: targetKeyword.trim(),
        count: matches.length,
        density: totalWords > 0 ? (matches.length * targetWords.length / totalWords) * 100 : 0,
      };
    }
  }

  return {
    totalWords,
    uniqueWords,
    characterCount,
    sentenceCount,
    keywords: sortedKeywords,
    targetKeywordStats,
  };
}

export function useKeywordDensityChecker(): UseKeywordDensityCheckerReturn {
  const [result, setResult] = useState<KeywordDensityResult | null>(null);

  const analyze = useCallback((text: string, targetKeyword?: string, topN: number = 20) => {
    if (!text.trim()) {
      setResult(null);
      return;
    }
    const analysis = analyzeKeywordDensity(text, targetKeyword, topN);
    setResult(analysis);
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, analyze, reset };
}

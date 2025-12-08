import { useState, useCallback } from 'react';

interface ScoreBreakdown {
  wordCount: { score: number; value: number; ideal: string };
  powerWords: { score: number; count: number; words: string[] };
  emotionalWords: { score: number; count: number; words: string[] };
  numbers: { score: number; hasNumber: boolean };
  questionFormat: { score: number; isQuestion: boolean };
  structure: { score: number; details: string };
  readability: { score: number; details: string };
}

interface AnalysisResult {
  headline: string;
  score: number;
  grade: string;
  breakdown: ScoreBreakdown;
  suggestions: string[];
}

interface UseHeadlineAnalyzerReturn {
  result: AnalysisResult | null;
  analyze: (headline: string) => void;
  reset: () => void;
}

const POWER_WORDS = [
  'ultimate', 'proven', 'secret', 'exclusive', 'guaranteed', 'instant', 'powerful',
  'revolutionary', 'breakthrough', 'amazing', 'incredible', 'essential', 'critical',
  'urgent', 'limited', 'free', 'new', 'discover', 'unlock', 'master', 'boost',
  'transform', 'skyrocket', 'explode', 'supercharge', 'effortless', 'simple',
  'easy', 'quick', 'fast', 'best', 'top', 'first', 'only', 'complete', 'definitive',
  'shocking', 'surprising', 'unexpected', 'little-known', 'insider', 'expert',
];

const EMOTIONAL_WORDS = [
  'love', 'hate', 'fear', 'angry', 'happy', 'sad', 'excited', 'anxious', 'worried',
  'thrilled', 'devastated', 'frustrated', 'delighted', 'terrified', 'inspired',
  'motivated', 'passionate', 'heartbreaking', 'hilarious', 'stunning', 'brilliant',
  'horrible', 'wonderful', 'terrible', 'fantastic', 'awful', 'amazing', 'dreadful',
  'magnificent', 'disgusting', 'beautiful', 'ugly', 'perfect', 'worst', 'best',
  'crazy', 'insane', 'unbelievable', 'ridiculous', 'outrageous', 'mind-blowing',
];

function getGrade(score: number): string {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
}

function analyzeHeadline(headline: string): AnalysisResult {
  const words = headline.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const lowerHeadline = headline.toLowerCase();
  const lowerWords = words.map(w => w.toLowerCase().replace(/[^a-z]/g, ''));

  // Word count score (ideal: 6-12 words)
  let wordCountScore = 0;
  if (wordCount >= 6 && wordCount <= 12) {
    wordCountScore = 20;
  } else if (wordCount >= 4 && wordCount <= 14) {
    wordCountScore = 15;
  } else if (wordCount >= 2 && wordCount <= 18) {
    wordCountScore = 10;
  } else {
    wordCountScore = 5;
  }

  // Power words score (max 25 points)
  const foundPowerWords = POWER_WORDS.filter(pw => lowerWords.includes(pw) || lowerHeadline.includes(pw));
  const powerWordScore = Math.min(foundPowerWords.length * 8, 25);

  // Emotional words score (max 20 points)
  const foundEmotionalWords = EMOTIONAL_WORDS.filter(ew => lowerWords.includes(ew) || lowerHeadline.includes(ew));
  const emotionalWordScore = Math.min(foundEmotionalWords.length * 10, 20);

  // Numbers score (15 points if present)
  const hasNumber = /\d/.test(headline);
  const numberScore = hasNumber ? 15 : 0;

  // Question format score (10 points)
  const isQuestion = headline.trim().endsWith('?');
  const questionScore = isQuestion ? 10 : 0;

  // Structure score (max 5 points)
  let structureScore = 0;
  let structureDetails = '';
  const startsWithCapital = /^[A-Z]/.test(headline);
  const hasColon = headline.includes(':');
  const hasBrackets = /[\[\(]/.test(headline);

  if (startsWithCapital) structureScore += 2;
  if (hasColon || hasBrackets) structureScore += 3;

  if (hasColon) structureDetails = 'Uses colon format for clarity';
  else if (hasBrackets) structureDetails = 'Uses brackets for added context';
  else if (startsWithCapital) structureDetails = 'Properly capitalized';
  else structureDetails = 'Consider proper capitalization';

  // Readability score (max 5 points)
  let readabilityScore = 0;
  let readabilityDetails = '';
  const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / Math.max(wordCount, 1);

  if (avgWordLength >= 4 && avgWordLength <= 7) {
    readabilityScore = 5;
    readabilityDetails = 'Good word length balance';
  } else if (avgWordLength < 4) {
    readabilityScore = 3;
    readabilityDetails = 'Words may be too simple';
  } else {
    readabilityScore = 2;
    readabilityDetails = 'Some words may be too long';
  }

  const totalScore = Math.min(
    wordCountScore + powerWordScore + emotionalWordScore + numberScore + questionScore + structureScore + readabilityScore,
    100
  );

  // Generate suggestions
  const suggestions: string[] = [];

  if (wordCount < 6) suggestions.push('Add more words - aim for 6-12 words for optimal engagement');
  if (wordCount > 12) suggestions.push('Consider shortening - headlines with 6-12 words perform best');
  if (foundPowerWords.length === 0) suggestions.push('Add a power word like "proven", "ultimate", or "essential"');
  if (foundEmotionalWords.length === 0) suggestions.push('Include an emotional word to connect with readers');
  if (!hasNumber) suggestions.push('Add a number (e.g., "7 Ways..." or "5 Tips...") to increase clicks');
  if (!isQuestion && !hasColon) suggestions.push('Try using a question or colon format for more engagement');
  if (!startsWithCapital) suggestions.push('Capitalize the first letter of your headline');
  if (suggestions.length === 0) suggestions.push('Great headline! Consider A/B testing with variations');

  return {
    headline,
    score: totalScore,
    grade: getGrade(totalScore),
    breakdown: {
      wordCount: { score: wordCountScore, value: wordCount, ideal: '6-12 words' },
      powerWords: { score: powerWordScore, count: foundPowerWords.length, words: foundPowerWords },
      emotionalWords: { score: emotionalWordScore, count: foundEmotionalWords.length, words: foundEmotionalWords },
      numbers: { score: numberScore, hasNumber },
      questionFormat: { score: questionScore, isQuestion },
      structure: { score: structureScore, details: structureDetails },
      readability: { score: readabilityScore, details: readabilityDetails },
    },
    suggestions,
  };
}

export function useHeadlineAnalyzer(): UseHeadlineAnalyzerReturn {
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyze = useCallback((headline: string) => {
    if (!headline.trim()) return;
    const analysis = analyzeHeadline(headline);
    setResult(analysis);
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, analyze, reset };
}

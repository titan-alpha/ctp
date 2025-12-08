import { useState, useCallback } from 'react';

export type RhymeType = 'perfect' | 'near' | 'slant';

interface RhymeResult {
  perfect: string[];
  near: string[];
  slant: string[];
}

interface UseRhymeFinderReturn {
  result: RhymeResult | null;
  findRhymes: (word: string, syllableFilter?: number | null) => void;
  reset: () => void;
}

// Phonetic endings for rhyme matching
const PHONETIC_ENDINGS: Record<string, string[]> = {
  'ay': ['day', 'way', 'say', 'play', 'stay', 'pay', 'may', 'ray', 'bay', 'gray', 'pray', 'sway', 'clay', 'spray', 'delay', 'away', 'today', 'display', 'okay', 'highway'],
  'ee': ['be', 'see', 'me', 'free', 'tree', 'key', 'she', 'he', 'we', 'agree', 'degree', 'fee', 'knee', 'flea', 'plea', 'bee', 'sea', 'tea', 'pea', 'three'],
  'ight': ['night', 'light', 'right', 'fight', 'sight', 'might', 'bright', 'flight', 'tight', 'white', 'bite', 'kite', 'write', 'quite', 'spite', 'knight', 'slight', 'plight', 'fright', 'height'],
  'ow': ['know', 'show', 'grow', 'flow', 'slow', 'snow', 'blow', 'glow', 'throw', 'low', 'go', 'no', 'so', 'pro', 'row', 'bow', 'sow', 'toe', 'foe', 'woe'],
  'ound': ['sound', 'found', 'round', 'ground', 'bound', 'pound', 'wound', 'mound', 'hound', 'around', 'profound', 'compound', 'background', 'surround', 'astound', 'rebound', 'resound', 'abound', 'expound', 'confound'],
  'ove': ['love', 'dove', 'above', 'shove', 'glove', 'of', 'thereof', 'hereof', 'whereof'],
  'ake': ['make', 'take', 'wake', 'lake', 'cake', 'fake', 'shake', 'break', 'stake', 'snake', 'bake', 'rake', 'mistake', 'awake', 'flake', 'quake', 'sake', 'drake', 'forsake', 'overtake'],
  'ate': ['late', 'date', 'rate', 'state', 'fate', 'gate', 'wait', 'great', 'hate', 'mate', 'plate', 'create', 'debate', 'relate', 'translate', 'appreciate', 'celebrate', 'hesitate', 'integrate', 'ultimate'],
  'ine': ['line', 'time', 'mine', 'fine', 'wine', 'shine', 'sign', 'divine', 'define', 'combine', 'design', 'decline', 'incline', 'refine', 'confine', 'spine', 'pine', 'vine', 'dine', 'shrine'],
  'all': ['all', 'call', 'fall', 'ball', 'wall', 'tall', 'small', 'hall', 'mall', 'install', 'recall', 'overall', 'downfall', 'rainfall', 'baseball', 'football', 'waterfall', 'enthrall', 'appall', 'stall'],
  'ell': ['tell', 'well', 'sell', 'bell', 'spell', 'shell', 'smell', 'dwell', 'swell', 'fell', 'cell', 'hell', 'yell', 'compel', 'excel', 'expel', 'farewell', 'rebel', 'hotel', 'motel'],
  'ore': ['more', 'before', 'store', 'door', 'floor', 'shore', 'core', 'score', 'pour', 'war', 'explore', 'ignore', 'restore', 'adore', 'implore', 'deplore', 'encore', 'galore', 'offshore', 'folklore'],
  'ear': ['hear', 'year', 'fear', 'near', 'clear', 'dear', 'appear', 'tear', 'gear', 'beer', 'cheer', 'peer', 'steer', 'career', 'sincere', 'severe', 'volunteer', 'engineer', 'pioneer', 'atmosphere'],
  'art': ['heart', 'start', 'part', 'art', 'smart', 'cart', 'chart', 'dart', 'apart', 'depart', 'impart', 'restart', 'outsmart', 'counterpart', 'sweetheart', 'jumpstart', 'kickstart', 'flowchart', 'rampart', 'upstart'],
  'ain': ['rain', 'pain', 'train', 'brain', 'gain', 'main', 'chain', 'plain', 'strain', 'Spain', 'drain', 'grain', 'stain', 'vain', 'explain', 'remain', 'obtain', 'contain', 'maintain', 'sustain'],
  'and': ['hand', 'land', 'stand', 'band', 'sand', 'brand', 'grand', 'expand', 'demand', 'command', 'understand', 'withstand', 'firsthand', 'homeland', 'inland', 'island', 'mainland', 'woodland', 'wasteland', 'wonderland'],
  'ack': ['back', 'black', 'track', 'pack', 'stack', 'crack', 'attack', 'lack', 'snack', 'rack', 'jack', 'hack', 'whack', 'knack', 'feedback', 'setback', 'drawback', 'flashback', 'comeback', 'kickback'],
  'ess': ['less', 'press', 'stress', 'dress', 'guess', 'bless', 'mess', 'confess', 'address', 'express', 'impress', 'success', 'progress', 'process', 'access', 'possess', 'excess', 'recess', 'compress', 'suppress'],
  'ing': ['thing', 'bring', 'sing', 'ring', 'king', 'spring', 'string', 'swing', 'wing', 'sting', 'cling', 'fling', 'anything', 'everything', 'nothing', 'something', 'offspring', 'belonging', 'beginning', 'ending'],
  'ong': ['long', 'song', 'strong', 'wrong', 'along', 'belong', 'among', 'prolong', 'headstrong', 'lifelong', 'oblong', 'sarong', 'pingpong', 'singalong', 'tagalong', 'daylong', 'furlong', 'sidelong', 'yearlong', 'singsong'],
};

// Additional common word database
const COMMON_WORDS: string[] = [
  'love', 'time', 'life', 'world', 'hand', 'day', 'man', 'way', 'thing', 'word',
  'place', 'look', 'work', 'year', 'back', 'money', 'point', 'story', 'fact', 'night',
  'home', 'water', 'room', 'mother', 'area', 'school', 'power', 'country', 'problem', 'city',
  'family', 'friend', 'state', 'head', 'face', 'student', 'group', 'eye', 'door', 'health',
  'person', 'art', 'war', 'history', 'party', 'result', 'change', 'morning', 'reason', 'research',
  'girl', 'guy', 'moment', 'air', 'teacher', 'force', 'education', 'child', 'month', 'truth',
  'voice', 'body', 'market', 'sense', 'heart', 'mind', 'church', 'car', 'line', 'fire'
];

function getPhoneticEnding(word: string): string {
  const lowerWord = word.toLowerCase();

  // Check for known phonetic endings
  for (const ending of Object.keys(PHONETIC_ENDINGS)) {
    if (lowerWord.endsWith(ending)) {
      return ending;
    }
  }

  // Fallback: return last 2-3 characters
  if (lowerWord.length >= 3) {
    return lowerWord.slice(-3);
  }
  return lowerWord.slice(-2);
}

function countSyllables(word: string): number {
  const lowerWord = word.toLowerCase();
  if (lowerWord.length <= 3) return 1;

  const vowels = 'aeiouy';
  let count = 0;
  let prevWasVowel = false;

  for (let i = 0; i < lowerWord.length; i++) {
    const isVowel = vowels.includes(lowerWord[i]);
    if (isVowel && !prevWasVowel) {
      count++;
    }
    prevWasVowel = isVowel;
  }

  // Handle silent e
  if (lowerWord.endsWith('e') && count > 1) {
    count--;
  }

  return Math.max(1, count);
}

function findPerfectRhymes(word: string): string[] {
  const lowerWord = word.toLowerCase();
  const rhymes: string[] = [];

  // Check phonetic endings database
  for (const [ending, words] of Object.entries(PHONETIC_ENDINGS)) {
    if (lowerWord.endsWith(ending)) {
      words.forEach(w => {
        if (w.toLowerCase() !== lowerWord && !rhymes.includes(w)) {
          rhymes.push(w);
        }
      });
    }
  }

  // Also check if word appears in any list, find siblings
  for (const words of Object.values(PHONETIC_ENDINGS)) {
    if (words.some(w => w.toLowerCase() === lowerWord)) {
      words.forEach(w => {
        if (w.toLowerCase() !== lowerWord && !rhymes.includes(w)) {
          rhymes.push(w);
        }
      });
    }
  }

  return rhymes.slice(0, 30);
}

function findNearRhymes(word: string, perfectRhymes: string[]): string[] {
  const lowerWord = word.toLowerCase();
  const ending = lowerWord.slice(-2);
  const rhymes: string[] = [];

  // Find words with similar but not identical endings
  for (const [phoneticEnding, words] of Object.entries(PHONETIC_ENDINGS)) {
    // Skip if this is the perfect rhyme category
    if (lowerWord.endsWith(phoneticEnding)) continue;

    // Check for similar endings
    if (phoneticEnding.includes(ending.charAt(ending.length - 1))) {
      words.slice(0, 5).forEach(w => {
        if (w.toLowerCase() !== lowerWord && !perfectRhymes.includes(w) && !rhymes.includes(w)) {
          rhymes.push(w);
        }
      });
    }
  }

  return rhymes.slice(0, 20);
}

function findSlantRhymes(word: string, perfectRhymes: string[], nearRhymes: string[]): string[] {
  const lowerWord = word.toLowerCase();
  const rhymes: string[] = [];
  const lastConsonant = lowerWord.replace(/[aeiou]/g, '').slice(-1);

  // Find words with similar consonant sounds
  COMMON_WORDS.forEach(w => {
    const wConsonants = w.replace(/[aeiou]/g, '');
    if (
      w.toLowerCase() !== lowerWord &&
      !perfectRhymes.includes(w) &&
      !nearRhymes.includes(w) &&
      wConsonants.includes(lastConsonant) &&
      !rhymes.includes(w)
    ) {
      rhymes.push(w);
    }
  });

  return rhymes.slice(0, 15);
}

export function useRhymeFinder(): UseRhymeFinderReturn {
  const [result, setResult] = useState<RhymeResult | null>(null);

  const findRhymes = useCallback((word: string, syllableFilter?: number | null) => {
    const trimmedWord = word.trim().toLowerCase();
    if (!trimmedWord || trimmedWord.length < 2) return;

    let perfect = findPerfectRhymes(trimmedWord);
    let near = findNearRhymes(trimmedWord, perfect);
    let slant = findSlantRhymes(trimmedWord, perfect, near);

    // Apply syllable filter if provided
    if (syllableFilter && syllableFilter > 0) {
      perfect = perfect.filter(w => countSyllables(w) === syllableFilter);
      near = near.filter(w => countSyllables(w) === syllableFilter);
      slant = slant.filter(w => countSyllables(w) === syllableFilter);
    }

    setResult({ perfect, near, slant });
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return {
    result,
    findRhymes,
    reset,
  };
}

export { countSyllables };

import { useState, useCallback } from 'react';

export type DiffType = 'added' | 'removed' | 'modified';

export interface DiffItem {
  path: string;
  type: DiffType;
  oldValue?: unknown;
  newValue?: unknown;
}

export interface DiffStats {
  added: number;
  removed: number;
  modified: number;
  total: number;
}

interface UseJsonDiffReturn {
  json1: string;
  setJson1: (value: string) => void;
  json2: string;
  setJson2: (value: string) => void;
  diffs: DiffItem[];
  stats: DiffStats;
  error: string | null;
  isComparing: boolean;
  compare: () => void;
  reset: () => void;
}

function getType(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

function deepCompare(
  obj1: unknown,
  obj2: unknown,
  path: string,
  diffs: DiffItem[]
): void {
  const type1 = getType(obj1);
  const type2 = getType(obj2);

  if (type1 !== type2) {
    diffs.push({ path, type: 'modified', oldValue: obj1, newValue: obj2 });
    return;
  }

  if (type1 === 'object' && obj1 !== null && obj2 !== null) {
    const keys1 = Object.keys(obj1 as object);
    const keys2 = Object.keys(obj2 as object);
    const allKeys = new Set([...keys1, ...keys2]);

    for (const key of allKeys) {
      const newPath = path ? `${path}.${key}` : key;
      const val1 = (obj1 as Record<string, unknown>)[key];
      const val2 = (obj2 as Record<string, unknown>)[key];

      if (!(key in (obj1 as object))) {
        diffs.push({ path: newPath, type: 'added', newValue: val2 });
      } else if (!(key in (obj2 as object))) {
        diffs.push({ path: newPath, type: 'removed', oldValue: val1 });
      } else {
        deepCompare(val1, val2, newPath, diffs);
      }
    }
  } else if (type1 === 'array') {
    const arr1 = obj1 as unknown[];
    const arr2 = obj2 as unknown[];
    const maxLen = Math.max(arr1.length, arr2.length);

    for (let i = 0; i < maxLen; i++) {
      const newPath = `${path}[${i}]`;
      if (i >= arr1.length) {
        diffs.push({ path: newPath, type: 'added', newValue: arr2[i] });
      } else if (i >= arr2.length) {
        diffs.push({ path: newPath, type: 'removed', oldValue: arr1[i] });
      } else {
        deepCompare(arr1[i], arr2[i], newPath, diffs);
      }
    }
  } else if (obj1 !== obj2) {
    diffs.push({ path, type: 'modified', oldValue: obj1, newValue: obj2 });
  }
}

export function useJsonDiff(): UseJsonDiffReturn {
  const [json1, setJson1] = useState('');
  const [json2, setJson2] = useState('');
  const [diffs, setDiffs] = useState<DiffItem[]>([]);
  const [stats, setStats] = useState<DiffStats>({ added: 0, removed: 0, modified: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  const compare = useCallback(() => {
    setError(null);
    setIsComparing(true);

    try {
      if (!json1.trim() || !json2.trim()) {
        throw new Error('Please enter JSON in both fields');
      }

      let parsed1: unknown;
      let parsed2: unknown;

      try {
        parsed1 = JSON.parse(json1);
      } catch {
        throw new Error('Invalid JSON in the left panel');
      }

      try {
        parsed2 = JSON.parse(json2);
      } catch {
        throw new Error('Invalid JSON in the right panel');
      }

      const diffResults: DiffItem[] = [];
      deepCompare(parsed1, parsed2, '', diffResults);

      const newStats: DiffStats = {
        added: diffResults.filter(d => d.type === 'added').length,
        removed: diffResults.filter(d => d.type === 'removed').length,
        modified: diffResults.filter(d => d.type === 'modified').length,
        total: diffResults.length,
      };

      setDiffs(diffResults);
      setStats(newStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setDiffs([]);
      setStats({ added: 0, removed: 0, modified: 0, total: 0 });
    } finally {
      setIsComparing(false);
    }
  }, [json1, json2]);

  const reset = useCallback(() => {
    setJson1('');
    setJson2('');
    setDiffs([]);
    setStats({ added: 0, removed: 0, modified: 0, total: 0 });
    setError(null);
  }, []);

  return {
    json1,
    setJson1,
    json2,
    setJson2,
    diffs,
    stats,
    error,
    isComparing,
    compare,
    reset,
  };
}

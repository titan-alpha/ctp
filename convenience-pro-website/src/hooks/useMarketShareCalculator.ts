import { useState, useCallback } from 'react';

export interface Competitor {
  id: string;
  name: string;
  revenue: number;
}

export interface MarketShareResult {
  id: string;
  name: string;
  revenue: number;
  marketShare: number;
  color: string;
}

export interface UseMarketShareCalculatorReturn {
  competitors: Competitor[];
  totalMarketSize: number;
  results: MarketShareResult[];
  addCompetitor: () => void;
  removeCompetitor: (id: string) => void;
  updateCompetitor: (id: string, field: keyof Omit<Competitor, 'id'>, value: string | number) => void;
  setTotalMarketSize: (size: number) => void;
  calculateMarketShares: () => void;
  reset: () => void;
}

const COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
];

const generateId = () => Math.random().toString(36).substring(2, 9);

const initialCompetitors: Competitor[] = [
  { id: generateId(), name: 'Company A', revenue: 0 },
  { id: generateId(), name: 'Company B', revenue: 0 },
];

export function useMarketShareCalculator(): UseMarketShareCalculatorReturn {
  const [competitors, setCompetitors] = useState<Competitor[]>(initialCompetitors);
  const [totalMarketSize, setTotalMarketSize] = useState<number>(0);
  const [results, setResults] = useState<MarketShareResult[]>([]);

  const addCompetitor = useCallback(() => {
    const newCompetitor: Competitor = {
      id: generateId(),
      name: `Company ${String.fromCharCode(65 + competitors.length)}`,
      revenue: 0,
    };
    setCompetitors((prev) => [...prev, newCompetitor]);
  }, [competitors.length]);

  const removeCompetitor = useCallback((id: string) => {
    setCompetitors((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const updateCompetitor = useCallback(
    (id: string, field: keyof Omit<Competitor, 'id'>, value: string | number) => {
      setCompetitors((prev) =>
        prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
      );
    },
    []
  );

  const calculateMarketShares = useCallback(() => {
    if (totalMarketSize <= 0) {
      setResults([]);
      return;
    }

    const calculatedResults: MarketShareResult[] = competitors.map((competitor, index) => ({
      id: competitor.id,
      name: competitor.name,
      revenue: competitor.revenue,
      marketShare: totalMarketSize > 0 ? (competitor.revenue / totalMarketSize) * 100 : 0,
      color: COLORS[index % COLORS.length],
    }));

    const totalCompetitorRevenue = competitors.reduce((sum, c) => sum + c.revenue, 0);
    const othersRevenue = totalMarketSize - totalCompetitorRevenue;

    if (othersRevenue > 0) {
      calculatedResults.push({
        id: 'others',
        name: 'Others',
        revenue: othersRevenue,
        marketShare: (othersRevenue / totalMarketSize) * 100,
        color: '#9CA3AF',
      });
    }

    setResults(calculatedResults);
  }, [competitors, totalMarketSize]);

  const reset = useCallback(() => {
    setCompetitors([
      { id: generateId(), name: 'Company A', revenue: 0 },
      { id: generateId(), name: 'Company B', revenue: 0 },
    ]);
    setTotalMarketSize(0);
    setResults([]);
  }, []);

  return {
    competitors,
    totalMarketSize,
    results,
    addCompetitor,
    removeCompetitor,
    updateCompetitor,
    setTotalMarketSize,
    calculateMarketShares,
    reset,
  };
}

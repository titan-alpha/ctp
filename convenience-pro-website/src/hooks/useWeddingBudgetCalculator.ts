import { useState, useCallback, useMemo } from 'react';

export interface BudgetCategory {
  id: string;
  name: string;
  percentage: number;
  planned: number;
  actual: number;
}

// Industry-standard wedding budget percentages
export const DEFAULT_CATEGORIES: Omit<BudgetCategory, 'planned' | 'actual'>[] = [
  { id: 'venue', name: 'Venue & Catering', percentage: 45 },
  { id: 'photography', name: 'Photography & Videography', percentage: 12 },
  { id: 'attire', name: 'Attire & Beauty', percentage: 8 },
  { id: 'flowers', name: 'Flowers & Decor', percentage: 8 },
  { id: 'entertainment', name: 'Entertainment & Music', percentage: 8 },
  { id: 'invitations', name: 'Invitations & Stationery', percentage: 3 },
  { id: 'transportation', name: 'Transportation', percentage: 2 },
  { id: 'favors', name: 'Favors & Gifts', percentage: 2 },
  { id: 'officiant', name: 'Officiant & Ceremony', percentage: 2 },
  { id: 'misc', name: 'Miscellaneous', percentage: 10 },
];

export interface WeddingBudgetResult {
  totalBudget: number;
  totalPlanned: number;
  totalActual: number;
  remainingBudget: number;
  overUnder: number;
  categories: BudgetCategory[];
}

interface UseWeddingBudgetCalculatorReturn {
  result: WeddingBudgetResult | null;
  totalBudget: number;
  categories: BudgetCategory[];
  setTotalBudget: (budget: number) => void;
  updateCategoryActual: (id: string, actual: number) => void;
  updateCategoryPercentage: (id: string, percentage: number) => void;
  calculate: () => void;
  reset: () => void;
}

export function useWeddingBudgetCalculator(): UseWeddingBudgetCalculatorReturn {
  const [result, setResult] = useState<WeddingBudgetResult | null>(null);
  const [totalBudget, setTotalBudget] = useState<number>(30000);
  const [categories, setCategories] = useState<BudgetCategory[]>(
    DEFAULT_CATEGORIES.map((cat) => ({
      ...cat,
      planned: 0,
      actual: 0,
    }))
  );

  const updateCategoryActual = useCallback((id: string, actual: number) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, actual } : cat))
    );
  }, []);

  const updateCategoryPercentage = useCallback((id: string, percentage: number) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, percentage } : cat))
    );
  }, []);

  const calculate = useCallback(() => {
    if (totalBudget <= 0) return;

    const updatedCategories = categories.map((cat) => ({
      ...cat,
      planned: Math.round((totalBudget * cat.percentage) / 100),
    }));

    const totalPlanned = updatedCategories.reduce((sum, cat) => sum + cat.planned, 0);
    const totalActual = updatedCategories.reduce((sum, cat) => sum + cat.actual, 0);
    const remainingBudget = totalBudget - totalActual;
    const overUnder = totalActual - totalPlanned;

    setCategories(updatedCategories);
    setResult({
      totalBudget,
      totalPlanned,
      totalActual,
      remainingBudget,
      overUnder,
      categories: updatedCategories,
    });
  }, [totalBudget, categories]);

  const reset = useCallback(() => {
    setResult(null);
    setTotalBudget(30000);
    setCategories(
      DEFAULT_CATEGORIES.map((cat) => ({
        ...cat,
        planned: 0,
        actual: 0,
      }))
    );
  }, []);

  return {
    result,
    totalBudget,
    categories,
    setTotalBudget,
    updateCategoryActual,
    updateCategoryPercentage,
    calculate,
    reset,
  };
}

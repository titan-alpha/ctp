import { useState, useCallback, useMemo } from 'react';

export interface BudgetCategory {
  id: string;
  name: string;
  percentage: number;
  amount: number;
  perPerson: number;
}

interface UsePartyBudgetCalculatorReturn {
  guestCount: number;
  totalBudget: number;
  categories: BudgetCategory[];
  totalAllocated: number;
  remainingBudget: number;
  perPersonTotal: number;
  setGuestCount: (count: number) => void;
  setTotalBudget: (budget: number) => void;
  setCategoryPercentage: (id: string, percentage: number) => void;
  addCategory: (name: string) => void;
  removeCategory: (id: string) => void;
  reset: () => void;
}

const DEFAULT_CATEGORIES = [
  { id: 'food', name: 'Food & Drinks', percentage: 40 },
  { id: 'venue', name: 'Venue', percentage: 25 },
  { id: 'decorations', name: 'Decorations', percentage: 15 },
  { id: 'entertainment', name: 'Entertainment', percentage: 10 },
  { id: 'misc', name: 'Miscellaneous', percentage: 10 },
];

export function usePartyBudgetCalculator(): UsePartyBudgetCalculatorReturn {
  const [guestCount, setGuestCount] = useState(20);
  const [totalBudget, setTotalBudget] = useState(500);
  const [categoryData, setCategoryData] = useState(DEFAULT_CATEGORIES);

  const categories = useMemo((): BudgetCategory[] => {
    return categoryData.map((cat) => {
      const amount = (totalBudget * cat.percentage) / 100;
      const perPerson = guestCount > 0 ? amount / guestCount : 0;
      return {
        ...cat,
        amount: Math.round(amount * 100) / 100,
        perPerson: Math.round(perPerson * 100) / 100,
      };
    });
  }, [categoryData, totalBudget, guestCount]);

  const totalAllocated = useMemo(() => {
    return categories.reduce((sum, cat) => sum + cat.amount, 0);
  }, [categories]);

  const remainingBudget = useMemo(() => {
    return Math.round((totalBudget - totalAllocated) * 100) / 100;
  }, [totalBudget, totalAllocated]);

  const perPersonTotal = useMemo(() => {
    return guestCount > 0 ? Math.round((totalBudget / guestCount) * 100) / 100 : 0;
  }, [totalBudget, guestCount]);

  const setCategoryPercentage = useCallback((id: string, percentage: number) => {
    setCategoryData((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, percentage: Math.max(0, Math.min(100, percentage)) } : cat
      )
    );
  }, []);

  const addCategory = useCallback((name: string) => {
    const id = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    setCategoryData((prev) => [...prev, { id, name, percentage: 0 }]);
  }, []);

  const removeCategory = useCallback((id: string) => {
    setCategoryData((prev) => prev.filter((cat) => cat.id !== id));
  }, []);

  const reset = useCallback(() => {
    setGuestCount(20);
    setTotalBudget(500);
    setCategoryData(DEFAULT_CATEGORIES);
  }, []);

  return {
    guestCount,
    totalBudget,
    categories,
    totalAllocated,
    remainingBudget,
    perPersonTotal,
    setGuestCount,
    setTotalBudget,
    setCategoryPercentage,
    addCategory,
    removeCategory,
    reset,
  };
}

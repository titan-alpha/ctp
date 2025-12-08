import { useState, useCallback } from 'react';

export interface AgeDifferenceResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalMonths: number;
  olderDate: 'first' | 'second' | 'same';
}

interface UseAgeDifferenceCalculatorReturn {
  result: AgeDifferenceResult | null;
  date1: string;
  date2: string;
  setDate1: (date: string) => void;
  setDate2: (date: string) => void;
  calculate: () => void;
  reset: () => void;
}

function calculateDifference(d1: Date, d2: Date): AgeDifferenceResult {
  let startDate = d1;
  let endDate = d2;
  let olderDate: 'first' | 'second' | 'same' = 'first';

  if (d1.getTime() === d2.getTime()) {
    return { years: 0, months: 0, days: 0, totalDays: 0, totalMonths: 0, olderDate: 'same' };
  }

  if (d1 > d2) {
    startDate = d2;
    endDate = d1;
    olderDate = 'second';
  }

  const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  let years = endDate.getFullYear() - startDate.getFullYear();
  let months = endDate.getMonth() - startDate.getMonth();
  let days = endDate.getDate() - startDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const totalMonths = years * 12 + months;

  return { years, months, days, totalDays, totalMonths, olderDate };
}

export function useAgeDifferenceCalculator(): UseAgeDifferenceCalculatorReturn {
  const [result, setResult] = useState<AgeDifferenceResult | null>(null);
  const [date1, setDate1] = useState<string>('');
  const [date2, setDate2] = useState<string>('');

  const calculate = useCallback(() => {
    if (!date1 || !date2) return;

    const d1 = new Date(date1);
    const d2 = new Date(date2);

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return;

    const difference = calculateDifference(d1, d2);
    setResult(difference);
  }, [date1, date2]);

  const reset = useCallback(() => {
    setResult(null);
    setDate1('');
    setDate2('');
  }, []);

  return {
    result,
    date1,
    date2,
    setDate1,
    setDate2,
    calculate,
    reset,
  };
}

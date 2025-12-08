import { useState, useCallback, useMemo } from 'react';

export interface TimeEntry {
  id: string;
  project: string;
  client: string;
  description: string;
  hours: number;
  rate: number;
  date: string;
}

export interface ProjectSummary {
  project: string;
  client: string;
  totalHours: number;
  totalAmount: number;
  entries: TimeEntry[];
}

export interface ClientSummary {
  client: string;
  totalHours: number;
  totalAmount: number;
  projects: string[];
}

interface UseBillableHoursCalculatorReturn {
  entries: TimeEntry[];
  addEntry: (entry: Omit<TimeEntry, 'id'>) => void;
  removeEntry: (id: string) => void;
  updateEntry: (id: string, entry: Partial<Omit<TimeEntry, 'id'>>) => void;
  clearEntries: () => void;
  totalHours: number;
  totalAmount: number;
  projectBreakdown: ProjectSummary[];
  clientBreakdown: ClientSummary[];
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function useBillableHoursCalculator(): UseBillableHoursCalculatorReturn {
  const [entries, setEntries] = useState<TimeEntry[]>([]);

  const addEntry = useCallback((entry: Omit<TimeEntry, 'id'>) => {
    const newEntry: TimeEntry = {
      ...entry,
      id: generateId(),
    };
    setEntries((prev) => [...prev, newEntry]);
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const updateEntry = useCallback((id: string, updates: Partial<Omit<TimeEntry, 'id'>>) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, ...updates } : entry))
    );
  }, []);

  const clearEntries = useCallback(() => {
    setEntries([]);
  }, []);

  const totalHours = useMemo(() => {
    return entries.reduce((sum, entry) => sum + entry.hours, 0);
  }, [entries]);

  const totalAmount = useMemo(() => {
    return entries.reduce((sum, entry) => sum + entry.hours * entry.rate, 0);
  }, [entries]);

  const projectBreakdown = useMemo(() => {
    const projectMap = new Map<string, ProjectSummary>();

    entries.forEach((entry) => {
      const key = `${entry.project}|${entry.client}`;
      const existing = projectMap.get(key);

      if (existing) {
        existing.totalHours += entry.hours;
        existing.totalAmount += entry.hours * entry.rate;
        existing.entries.push(entry);
      } else {
        projectMap.set(key, {
          project: entry.project,
          client: entry.client,
          totalHours: entry.hours,
          totalAmount: entry.hours * entry.rate,
          entries: [entry],
        });
      }
    });

    return Array.from(projectMap.values()).sort((a, b) => b.totalAmount - a.totalAmount);
  }, [entries]);

  const clientBreakdown = useMemo(() => {
    const clientMap = new Map<string, ClientSummary>();

    entries.forEach((entry) => {
      const existing = clientMap.get(entry.client);

      if (existing) {
        existing.totalHours += entry.hours;
        existing.totalAmount += entry.hours * entry.rate;
        if (!existing.projects.includes(entry.project)) {
          existing.projects.push(entry.project);
        }
      } else {
        clientMap.set(entry.client, {
          client: entry.client,
          totalHours: entry.hours,
          totalAmount: entry.hours * entry.rate,
          projects: [entry.project],
        });
      }
    });

    return Array.from(clientMap.values()).sort((a, b) => b.totalAmount - a.totalAmount);
  }, [entries]);

  return {
    entries,
    addEntry,
    removeEntry,
    updateEntry,
    clearEntries,
    totalHours,
    totalAmount,
    projectBreakdown,
    clientBreakdown,
  };
}

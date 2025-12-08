import { useState, useCallback, useEffect } from 'react';

export interface AttendanceRecord {
  id: string;
  employeeName: string;
  date: string;
  clockIn: string | null;
  clockOut: string | null;
  hoursWorked: number | null;
  status: 'present' | 'absent' | 'late' | 'early-leave';
  notes: string;
}

export interface AttendanceStats {
  totalRecords: number;
  totalHours: number;
  avgHoursPerDay: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  earlyLeaveCount: number;
  attendanceRate: number;
}

interface UseAttendanceTrackerReturn {
  records: AttendanceRecord[];
  currentEmployee: string;
  setCurrentEmployee: (name: string) => void;
  clockIn: () => AttendanceRecord | null;
  clockOut: (recordId: string) => AttendanceRecord | null;
  markAbsent: (employeeName: string, date: string, notes?: string) => AttendanceRecord;
  deleteRecord: (id: string) => void;
  clearRecords: () => void;
  getStats: (employeeName?: string) => AttendanceStats;
  exportToCsv: () => string;
  todayRecord: AttendanceRecord | null;
}

const STORAGE_KEY = 'attendance-tracker-records';
const WORK_START_HOUR = 9; // 9 AM considered on-time

function generateId(): string {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function formatTime(date: Date): string {
  return date.toTimeString().slice(0, 5);
}

function calculateHours(clockIn: string, clockOut: string): number {
  const [inH, inM] = clockIn.split(':').map(Number);
  const [outH, outM] = clockOut.split(':').map(Number);
  const hours = (outH * 60 + outM - inH * 60 - inM) / 60;
  return Math.round(hours * 100) / 100;
}

function isLate(clockIn: string): boolean {
  const [hour, minute] = clockIn.split(':').map(Number);
  return hour > WORK_START_HOUR || (hour === WORK_START_HOUR && minute > 15);
}

export function useAttendanceTracker(): UseAttendanceTrackerReturn {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [currentEmployee, setCurrentEmployee] = useState<string>('');

  // Load from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setRecords(JSON.parse(stored));
        } catch {
          // Invalid data, start fresh
        }
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && records.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    }
  }, [records]);

  const todayRecord = records.find(
    (r) => r.employeeName === currentEmployee && r.date === formatDate(new Date()) && r.status !== 'absent'
  ) || null;

  const clockIn = useCallback((): AttendanceRecord | null => {
    if (!currentEmployee.trim()) return null;

    const now = new Date();
    const today = formatDate(now);
    const time = formatTime(now);

    // Check if already clocked in today
    const existing = records.find(
      (r) => r.employeeName === currentEmployee && r.date === today && r.clockIn && !r.clockOut
    );
    if (existing) return null;

    const record: AttendanceRecord = {
      id: generateId(),
      employeeName: currentEmployee,
      date: today,
      clockIn: time,
      clockOut: null,
      hoursWorked: null,
      status: isLate(time) ? 'late' : 'present',
      notes: '',
    };

    setRecords((prev) => [record, ...prev]);
    return record;
  }, [currentEmployee, records]);

  const clockOut = useCallback((recordId: string): AttendanceRecord | null => {
    const now = new Date();
    const time = formatTime(now);

    let updatedRecord: AttendanceRecord | null = null;

    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === recordId && r.clockIn && !r.clockOut) {
          const hours = calculateHours(r.clockIn, time);
          updatedRecord = {
            ...r,
            clockOut: time,
            hoursWorked: hours,
            status: hours < 8 && r.status !== 'late' ? 'early-leave' : r.status,
          };
          return updatedRecord;
        }
        return r;
      })
    );

    return updatedRecord;
  }, []);

  const markAbsent = useCallback(
    (employeeName: string, date: string, notes = ''): AttendanceRecord => {
      const record: AttendanceRecord = {
        id: generateId(),
        employeeName,
        date,
        clockIn: null,
        clockOut: null,
        hoursWorked: 0,
        status: 'absent',
        notes,
      };

      setRecords((prev) => [record, ...prev]);
      return record;
    },
    []
  );

  const deleteRecord = useCallback((id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const clearRecords = useCallback(() => {
    setRecords([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const getStats = useCallback(
    (employeeName?: string): AttendanceStats => {
      const filtered = employeeName
        ? records.filter((r) => r.employeeName === employeeName)
        : records;

      const totalRecords = filtered.length;
      const totalHours = filtered.reduce((sum, r) => sum + (r.hoursWorked || 0), 0);
      const presentCount = filtered.filter((r) => r.status === 'present').length;
      const absentCount = filtered.filter((r) => r.status === 'absent').length;
      const lateCount = filtered.filter((r) => r.status === 'late').length;
      const earlyLeaveCount = filtered.filter((r) => r.status === 'early-leave').length;

      const workDays = totalRecords - absentCount;
      const avgHoursPerDay = workDays > 0 ? Math.round((totalHours / workDays) * 100) / 100 : 0;
      const attendanceRate = totalRecords > 0 ? Math.round(((totalRecords - absentCount) / totalRecords) * 100) : 0;

      return {
        totalRecords,
        totalHours: Math.round(totalHours * 100) / 100,
        avgHoursPerDay,
        presentCount,
        absentCount,
        lateCount,
        earlyLeaveCount,
        attendanceRate,
      };
    },
    [records]
  );

  const exportToCsv = useCallback((): string => {
    const headers = ['Employee Name', 'Date', 'Clock In', 'Clock Out', 'Hours Worked', 'Status', 'Notes'];
    const rows = records.map((r) => [
      r.employeeName,
      r.date,
      r.clockIn || '-',
      r.clockOut || '-',
      r.hoursWorked?.toString() || '-',
      r.status,
      r.notes,
    ]);

    const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    return csvContent;
  }, [records]);

  return {
    records,
    currentEmployee,
    setCurrentEmployee,
    clockIn,
    clockOut,
    markAbsent,
    deleteRecord,
    clearRecords,
    getStats,
    exportToCsv,
    todayRecord,
  };
}

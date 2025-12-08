'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useAttendanceTracker, AttendanceRecord } from '@/hooks/useAttendanceTracker';

const FEATURES = [
  {
    title: 'Real-Time Tracking',
    description: 'Clock in and out with a single click. Automatically calculates hours worked and tracks late arrivals.',
  },
  {
    title: 'Persistent Storage',
    description: 'All attendance data is saved locally in your browser. Your records persist across sessions.',
  },
  {
    title: 'Export to CSV',
    description: 'Download your attendance history as a CSV file for payroll processing or record keeping.',
  },
];

const FAQS = [
  {
    question: 'How does the attendance tracker work?',
    answer: 'Enter an employee name and click "Clock In" to start tracking time. When the work session ends, click "Clock Out" to record the total hours worked. All data is stored locally in your browser.',
  },
  {
    question: 'What counts as a late arrival?',
    answer: 'Any clock-in time after 9:15 AM is automatically marked as "Late". The system considers 9:00 AM as the standard start time with a 15-minute grace period.',
  },
  {
    question: 'Can I track multiple employees?',
    answer: 'Yes, simply enter different employee names to track attendance for multiple people. Each employee\'s records are stored separately and can be filtered in the history view.',
  },
  {
    question: 'Is my attendance data secure?',
    answer: 'All data is stored locally in your browser\'s localStorage. No data is sent to any server. However, clearing browser data will erase your records, so export regularly.',
  },
  {
    question: 'How do I export my attendance records?',
    answer: 'Click the "Export to CSV" button to download all attendance records as a CSV file. This file can be opened in Excel, Google Sheets, or any spreadsheet application.',
  },
  {
    question: 'What does "Early Leave" status mean?',
    answer: 'If an employee clocks out with less than 8 hours worked (and wasn\'t marked late), the status is set to "Early Leave" to flag incomplete work days.',
  },
];

export function AttendanceTracker() {
  const {
    records,
    currentEmployee,
    setCurrentEmployee,
    clockIn,
    clockOut,
    deleteRecord,
    clearRecords,
    getStats,
    exportToCsv,
    todayRecord,
  } = useAttendanceTracker();

  const [filterEmployee, setFilterEmployee] = useState<string>('');
  const stats = getStats(filterEmployee || undefined);

  const handleClockIn = () => {
    if (!currentEmployee.trim()) {
      alert('Please enter an employee name');
      return;
    }
    clockIn();
  };

  const handleClockOut = () => {
    if (todayRecord) {
      clockOut(todayRecord.id);
    }
  };

  const handleExport = () => {
    const csv = exportToCsv();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const uniqueEmployees = [...new Set(records.map((r) => r.employeeName))];

  const filteredRecords = filterEmployee
    ? records.filter((r) => r.employeeName === filterEmployee)
    : records;

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Attendance Tracker',
    description: 'Track employee attendance, clock in/out times, calculate hours worked, and export records to CSV.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <SiteLayout toolName="Attendance Tracker" category="business-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        {/* Clock In/Out Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Clock In / Out
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Employee Name
            </label>
            <input
              type="text"
              value={currentEmployee}
              onChange={(e) => setCurrentEmployee(e.target.value)}
              placeholder="Enter employee name"
              className="w-full md:w-80 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleClockIn}
              disabled={!currentEmployee.trim() || (todayRecord && !todayRecord.clockOut)}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              Clock In
            </button>
            <button
              onClick={handleClockOut}
              disabled={!todayRecord || !!todayRecord.clockOut}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              Clock Out
            </button>
          </div>

          {todayRecord && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-blue-800 dark:text-blue-200">
                <strong>Today&apos;s Status:</strong> Clocked in at {todayRecord.clockIn}
                {todayRecord.clockOut && ` - Clocked out at ${todayRecord.clockOut} (${todayRecord.hoursWorked} hours)`}
              </p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Summary Statistics
            </h2>
            <select
              value={filterEmployee}
              onChange={(e) => setFilterEmployee(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Employees</option>
              {uniqueEmployees.map((emp) => (
                <option key={emp} value={emp}>{emp}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Records" value={stats.totalRecords} />
            <StatCard label="Total Hours" value={stats.totalHours} />
            <StatCard label="Avg Hours/Day" value={stats.avgHoursPerDay} />
            <StatCard label="Attendance Rate" value={`${stats.attendanceRate}%`} />
            <StatCard label="Present" value={stats.presentCount} color="green" />
            <StatCard label="Absent" value={stats.absentCount} color="red" />
            <StatCard label="Late" value={stats.lateCount} color="yellow" />
            <StatCard label="Early Leave" value={stats.earlyLeaveCount} color="orange" />
          </div>
        </div>

        {/* Attendance History */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Attendance History
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handleExport}
                disabled={records.length === 0}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
              >
                Export to CSV
              </button>
              {records.length > 0 && (
                <button
                  onClick={clearRecords}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {filteredRecords.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No attendance records yet. Start by clocking in.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-2 text-gray-700 dark:text-gray-300">Employee</th>
                    <th className="text-left py-3 px-2 text-gray-700 dark:text-gray-300">Date</th>
                    <th className="text-left py-3 px-2 text-gray-700 dark:text-gray-300">Clock In</th>
                    <th className="text-left py-3 px-2 text-gray-700 dark:text-gray-300">Clock Out</th>
                    <th className="text-left py-3 px-2 text-gray-700 dark:text-gray-300">Hours</th>
                    <th className="text-left py-3 px-2 text-gray-700 dark:text-gray-300">Status</th>
                    <th className="text-left py-3 px-2 text-gray-700 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => (
                    <RecordRow key={record.id} record={record} onDelete={deleteRecord} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {FEATURES.map((feature, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color?: string }) {
  const colorClasses = {
    green: 'text-green-600 dark:text-green-400',
    red: 'text-red-600 dark:text-red-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    orange: 'text-orange-600 dark:text-orange-400',
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${color ? colorClasses[color as keyof typeof colorClasses] : 'text-gray-900 dark:text-white'}`}>
        {value}
      </div>
    </div>
  );
}

function RecordRow({ record, onDelete }: { record: AttendanceRecord; onDelete: (id: string) => void }) {
  const statusColors = {
    present: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    absent: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    late: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'early-leave': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  };

  return (
    <tr className="border-b border-gray-100 dark:border-gray-700/50">
      <td className="py-3 px-2 text-gray-900 dark:text-white">{record.employeeName}</td>
      <td className="py-3 px-2 text-gray-900 dark:text-white">{record.date}</td>
      <td className="py-3 px-2 text-gray-900 dark:text-white">{record.clockIn || '-'}</td>
      <td className="py-3 px-2 text-gray-900 dark:text-white">{record.clockOut || '-'}</td>
      <td className="py-3 px-2 text-gray-900 dark:text-white">{record.hoursWorked ?? '-'}</td>
      <td className="py-3 px-2">
        <span className={`px-2 py-1 text-xs rounded-full ${statusColors[record.status]}`}>
          {record.status}
        </span>
      </td>
      <td className="py-3 px-2">
        <button
          onClick={() => onDelete(record.id)}
          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

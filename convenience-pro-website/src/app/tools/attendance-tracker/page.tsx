import { AttendanceTracker } from '@/components/tools/attendance-tracker';

export const metadata = {
  title: 'Attendance Tracker | Track Employee Clock In/Out Times',
  description: 'Free online attendance tracker to monitor employee clock in/out times, calculate hours worked, track late arrivals and absences, and export records to CSV.',
  keywords: ['attendance tracker', 'employee attendance', 'clock in clock out', 'time tracking', 'hours worked calculator', 'attendance management', 'employee time tracker'],
  openGraph: {
    title: 'Attendance Tracker | Track Employee Clock In/Out Times',
    description: 'Free online attendance tracker to monitor employee clock in/out times, calculate hours worked, track late arrivals and absences, and export records to CSV.',
    type: 'website',
    url: '/tools/attendance-tracker',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Attendance Tracker | Track Employee Clock In/Out Times',
    description: 'Free online attendance tracker to monitor employee clock in/out times, calculate hours worked, track late arrivals and absences, and export records to CSV.',
  },
};

export default function AttendanceTrackerPage() {
  return <AttendanceTracker />;
}

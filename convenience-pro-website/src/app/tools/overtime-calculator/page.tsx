import { OvertimeCalculator } from '@/components/tools/overtime-calculator';

export const metadata = {
  title: 'Overtime Calculator | Overtime Pay Calculator',
  description: 'Calculate overtime pay with time-and-a-half and double-time rates. Determine weekly earnings with regular and overtime hours.',
  keywords: ['overtime calculator', 'overtime pay calculator', 'time and a half', 'double time calculator', 'weekly pay calculator'],
  openGraph: {
    title: 'Overtime Calculator | Overtime Pay Calculator',
    description: 'Calculate overtime pay with time-and-a-half and double-time rates. Determine weekly earnings with regular and overtime hours.',
    type: 'website',
    url: '/tools/overtime-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Overtime Calculator | Overtime Pay Calculator',
    description: 'Calculate overtime pay with time-and-a-half and double-time rates. Determine weekly earnings with regular and overtime hours.',
  },
};

export default function OvertimeCalculatorPage() {
  return <OvertimeCalculator />;
}

import { EmployeeCostCalculator } from '@/components/tools/employee-cost-calculator';

export const metadata = {
  title: 'Employee Cost Calculator | Calculate True Employment Costs',
  description: 'Free employee cost calculator to determine the total cost of hiring. Calculate salary, benefits, employer taxes, and overhead expenses to find the true cost per employee.',
  keywords: ['employee cost calculator', 'employment cost', 'true cost of employee', 'employer taxes', 'benefits calculator', 'hiring cost', 'payroll calculator'],
  openGraph: {
    title: 'Employee Cost Calculator | Calculate True Employment Costs',
    description: 'Free employee cost calculator to determine the total cost of hiring. Calculate salary, benefits, employer taxes, and overhead expenses to find the true cost per employee.',
    type: 'website',
    url: '/tools/employee-cost-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Employee Cost Calculator | Calculate True Employment Costs',
    description: 'Free employee cost calculator to determine the total cost of hiring. Calculate salary, benefits, employer taxes, and overhead expenses to find the true cost per employee.',
  },
};

export default function EmployeeCostCalculatorPage() {
  return <EmployeeCostCalculator />;
}

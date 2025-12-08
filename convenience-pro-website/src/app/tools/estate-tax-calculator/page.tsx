import { EstateTaxCalculator } from '@/components/tools/estate-tax-calculator';

export const metadata = {
  title: 'Estate Tax Calculator | Federal & State Estate Tax Estimator',
  description: 'Calculate federal and state estate taxes, inheritance tax, and exemption amounts. Plan your estate with accurate tax projections.',
  keywords: ['estate tax calculator', 'inheritance tax', 'estate planning', 'federal estate tax', 'state estate tax', 'death tax calculator'],
  openGraph: {
    title: 'Estate Tax Calculator | Federal & State Estate Tax Estimator',
    description: 'Calculate federal and state estate taxes, inheritance tax, and exemption amounts. Plan your estate with accurate tax projections.',
    type: 'website',
    url: '/tools/estate-tax-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Estate Tax Calculator | Federal & State Estate Tax Estimator',
    description: 'Calculate federal and state estate taxes, inheritance tax, and exemption amounts. Plan your estate with accurate tax projections.',
  },
};

export default function EstateTaxCalculatorPage() {
  return <EstateTaxCalculator />;
}

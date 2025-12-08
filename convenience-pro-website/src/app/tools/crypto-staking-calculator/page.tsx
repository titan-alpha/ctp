import { CryptoStakingCalculator } from '@/components/tools/crypto-staking-calculator';

export const metadata = {
  title: 'Crypto Staking Calculator | Calculate Staking Rewards & APY',
  description: 'Calculate cryptocurrency staking rewards with compound and simple interest. See projected earnings, effective APY, and monthly breakdown for your staked crypto.',
  keywords: ['crypto staking calculator', 'staking rewards', 'APY calculator', 'compound interest crypto', 'staking earnings', 'cryptocurrency staking'],
  openGraph: {
    title: 'Crypto Staking Calculator | Calculate Staking Rewards & APY',
    description: 'Calculate cryptocurrency staking rewards with compound and simple interest. See projected earnings, effective APY, and monthly breakdown for your staked crypto.',
    type: 'website',
    url: '/tools/crypto-staking-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crypto Staking Calculator | Calculate Staking Rewards & APY',
    description: 'Calculate cryptocurrency staking rewards with compound and simple interest. See projected earnings, effective APY, and monthly breakdown for your staked crypto.',
  },
};

export default function CryptoStakingCalculatorPage() {
  return <CryptoStakingCalculator />;
}

import { AuctionBidCalculator } from '@/components/tools/auction-bid-calculator';

export const metadata = {
  title: 'Auction Bid Calculator | Calculate Max Bid with Buyer Premium',
  description: 'Calculate your maximum auction bid based on your budget and buyer premium percentage. Never overbid at auctions again with our free calculator.',
  keywords: ['auction bid calculator', 'buyer premium calculator', 'auction calculator', 'max bid calculator', 'auction fees', 'bidding calculator'],
  openGraph: {
    title: 'Auction Bid Calculator | Calculate Max Bid with Buyer Premium',
    description: 'Calculate your maximum auction bid based on your budget and buyer premium percentage. Never overbid at auctions again with our free calculator.',
    type: 'website',
    url: '/tools/auction-bid-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Auction Bid Calculator | Calculate Max Bid with Buyer Premium',
    description: 'Calculate your maximum auction bid based on your budget and buyer premium percentage. Never overbid at auctions again with our free calculator.',
  },
};

export default function AuctionBidCalculatorPage() {
  return <AuctionBidCalculator />;
}

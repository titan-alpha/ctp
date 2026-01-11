import type { Metadata } from 'next'
import ToolPage from '@/components/ToolPage'
import PaymentMethodPrivacyScanner from '@/components/tools/payment-method-privacy-scanner'

export const metadata: Metadata = {
  title: 'Payment Method Privacy Scanner | ConveniencePro',
  description: 'Analyze payment method privacy policies to understand transaction tracking and data sharing. Compare credit cards, PayPal, digital wallets for privacy. 100% private - all processing in your browser.',
  keywords: ['payment privacy', 'credit card', 'paypal', 'venmo', 'transaction tracking', 'data broker', 'privacy', 'glba'],
}

export default function PaymentMethodPrivacyScannerPage() {
  return (
    <ToolPage
      toolId="payment-method-privacy-scanner"
      title="Payment Method Privacy Scanner"
      description="Analyze payment methods (credit cards, PayPal, digital wallets) to understand transaction tracking and data sharing with merchants. Evaluates privacy policies of payment processors to identify what transaction data is shared, retained, or sold to data brokers. Calculate re-identification risks from transaction patterns."
      category="privacy-tools"
      icon="💳"
    >
      <PaymentMethodPrivacyScanner />
    </ToolPage>
  )
}

import type { Metadata } from 'next'
import ToolPage from '@/components/ToolPage'
import PrivacyShieldTransferValidator from '@/components/tools/privacy-shield-transfer-validator'

export const metadata: Metadata = {
  title: 'Privacy Shield Transfer Validator | ConveniencePro',
  description: 'Validate international data transfer mechanisms and GDPR Schrems II compliance. Check if Privacy Shield, SCCs, or BCRs are properly implemented. 100% private - all processing in your browser.',
  keywords: ['privacy shield', 'schrems ii', 'data transfer', 'gdpr', 'scc', 'international transfer', 'privacy', 'compliance'],
}

export default function PrivacyShieldTransferValidatorPage() {
  return (
    <ToolPage
      toolId="privacy-shield-transfer-validator"
      title="Privacy Shield Transfer Validator"
      description="Validate legal mechanisms for international data transfers post-Schrems II. Analyzes companies' data transfer disclosures (Standard Contractual Clauses, Binding Corporate Rules, adequacy decisions) and identifies problematic US/non-EU data transfers. Ensures compliance with GDPR Chapter V requirements and detects invalidated Privacy Shield usage."
      category="privacy-tools"
      icon="🛡️"
    >
      <PrivacyShieldTransferValidator />
    </ToolPage>
  )
}

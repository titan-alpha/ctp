'use client'

import { useState, useCallback } from 'react'

// =============================================================================
// TYPES
// =============================================================================

export interface TransferValidationResult {
  isValid: boolean
  mechanism: string
  issues: ValidationIssue[]
  recommendations: string[]
  riskScore: number
  schrems2Compliant: boolean
}

export interface ValidationIssue {
  severity: 'high' | 'medium' | 'low'
  title: string
  description: string
}

export interface UsePrivacyShieldTransferValidatorOptions {
  checkSchrems2: boolean
  includeRecommendations: boolean
  strictMode: boolean
}

// =============================================================================
// PATTERNS / CONSTANTS
// =============================================================================

const TRANSFER_MECHANISMS = {
  ADEQUACY_DECISION: /adequacy decision|adequate level of protection/i,
  SCC: /standard contractual clauses|scc|model clauses/i,
  BCR: /binding corporate rules|bcr/i,
  PRIVACY_SHIELD: /privacy shield|safe harbor/i,
  DEROGATION: /derogation|explicit consent|necessary for contract/i,
}

const US_INDICATORS = /united states|usa|u\.s\.|america|california|new york|aws.*us-east|google.*us-central/i

const HIGH_RISK_COUNTRIES = ['United States', 'China', 'Russia']

// =============================================================================
// HOOK
// =============================================================================

export function usePrivacyShieldTransferValidator() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<TransferValidationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [options, setOptionsState] = useState<UsePrivacyShieldTransferValidatorOptions>({
    checkSchrems2: true,
    includeRecommendations: true,
    strictMode: false,
  })

  const setOptions = useCallback((newOptions: Partial<UsePrivacyShieldTransferValidatorOptions>) => {
    setOptionsState(prev => ({ ...prev, ...newOptions }))
  }, [])

  const validateTransfer = useCallback(() => {
    if (!input.trim()) {
      setError('Please provide privacy policy or data transfer disclosure text')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const text = input.toLowerCase()
      const issues: ValidationIssue[] = []
      const recommendations: string[] = []
      let mechanism = 'Unknown'
      let riskScore = 0

      // Detect transfer mechanism
      if (TRANSFER_MECHANISMS.PRIVACY_SHIELD.test(input)) {
        mechanism = 'Privacy Shield (INVALIDATED)'
        issues.push({
          severity: 'high',
          title: 'Privacy Shield Invalid',
          description: 'Privacy Shield was invalidated by Schrems II (2020). This mechanism is no longer valid for EU-US data transfers.',
        })
        riskScore += 50
        recommendations.push('Update to Standard Contractual Clauses (SCCs) with appropriate safeguards')
        recommendations.push('Conduct Transfer Impact Assessment (TIA) for US transfers')
      }

      if (TRANSFER_MECHANISMS.SCC.test(input)) {
        mechanism = 'Standard Contractual Clauses'

        // Check for 2021 SCCs
        if (!/2021/.test(input) && options.strictMode) {
          issues.push({
            severity: 'medium',
            title: 'Outdated SCCs Possible',
            description: 'Ensure SCCs are the 2021 version adopted by the European Commission, not the older 2001/2004 versions.',
          })
          riskScore += 20
          recommendations.push('Verify use of 2021 Standard Contractual Clauses')
        }

        // Check for Transfer Impact Assessment mention
        if (!/(transfer impact assessment|tia|supplementary measures)/i.test(input)) {
          issues.push({
            severity: 'medium',
            title: 'Missing Transfer Impact Assessment',
            description: 'Schrems II requires Transfer Impact Assessments for transfers to countries without adequacy decisions.',
          })
          riskScore += 15
          recommendations.push('Conduct and document Transfer Impact Assessment')
          recommendations.push('Implement supplementary measures beyond SCCs')
        }
      }

      if (TRANSFER_MECHANISMS.BCR.test(input)) {
        mechanism = 'Binding Corporate Rules'
        riskScore += 5 // BCRs are generally acceptable
      }

      if (TRANSFER_MECHANISMS.ADEQUACY_DECISION.test(input)) {
        mechanism = 'Adequacy Decision'
        riskScore += 0 // Adequacy decisions are ideal
      }

      if (TRANSFER_MECHANISMS.DEROGATION.test(input)) {
        mechanism = 'Derogation'
        issues.push({
          severity: 'medium',
          title: 'Derogation-Based Transfer',
          description: 'Derogations should only be used occasionally, not for systematic transfers.',
        })
        riskScore += 25
        recommendations.push('Consider implementing SCCs for regular transfers')
      }

      // Check for US transfers
      if (US_INDICATORS.test(input)) {
        issues.push({
          severity: 'high',
          title: 'US Data Transfer Detected',
          description: 'Transfers to the US require special scrutiny post-Schrems II due to surveillance laws (FISA 702, EO 12333).',
        })
        riskScore += 30
        recommendations.push('Verify provider is not subject to US CLOUD Act')
        recommendations.push('Implement technical measures (encryption, pseudonymization)')
        recommendations.push('Consider EU-based alternatives')
      }

      // Check for encryption mentions
      if (!/encrypt/i.test(input)) {
        issues.push({
          severity: 'medium',
          title: 'No Encryption Mentioned',
          description: 'Data transfers should use encryption in transit and at rest as a supplementary measure.',
        })
        riskScore += 10
        recommendations.push('Ensure data is encrypted during transfer and storage')
      }

      // Check for data minimization
      if (!/data minimi[sz]ation|minimal data|necessary data/i.test(input)) {
        issues.push({
          severity: 'low',
          title: 'Data Minimization Not Mentioned',
          description: 'Transferring only necessary data reduces privacy risks.',
        })
        riskScore += 5
        recommendations.push('Apply data minimization principles to international transfers')
      }

      // Schrems II compliance check
      const schrems2Compliant = mechanism !== 'Privacy Shield (INVALIDATED)' &&
                                 riskScore < 40 &&
                                 !(US_INDICATORS.test(input) && riskScore > 50)

      if (!schrems2Compliant) {
        issues.push({
          severity: 'high',
          title: 'Potential Schrems II Non-Compliance',
          description: 'The data transfer mechanism may not comply with Schrems II requirements.',
        })
      }

      // General recommendations
      if (options.includeRecommendations) {
        recommendations.push('Review European Data Protection Board (EDPB) guidance on international transfers')
        recommendations.push('Document all international data transfers in Records of Processing Activities')
        if (riskScore > 30) {
          recommendations.push('Consider consulting a GDPR specialist for transfer validation')
        }
      }

      setResult({
        isValid: schrems2Compliant && riskScore < 30,
        mechanism,
        issues,
        recommendations: [...new Set(recommendations)], // Remove duplicates
        riskScore: Math.min(100, riskScore),
        schrems2Compliant,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Validation failed')
    } finally {
      setIsProcessing(false)
    }
  }, [input, options])

  const clear = useCallback(() => {
    setInput('')
    setResult(null)
    setError(null)
  }, [])

  const loadSample = useCallback(() => {
    const sample = `Data Transfer Disclosure

We transfer personal data to our cloud service provider located in the United States.
These transfers are protected by Standard Contractual Clauses adopted by the European Commission.

Our provider complies with industry-standard security measures including encryption of data
in transit and at rest. We have conducted a Transfer Impact Assessment and implemented
supplementary measures to ensure GDPR compliance.

Data transferred includes: name, email address, and usage analytics.`
    setInput(sample)
    setResult(null)
    setError(null)
  }, [])

  return {
    input,
    result,
    error,
    options,
    isProcessing,
    setInput,
    setOptions,
    validateTransfer,
    clear,
    loadSample,
  }
}

export default usePrivacyShieldTransferValidator

/**
 * Privacy Shield Transfer Validator
 *
 * CTP-compliant implementation for validating international data transfer mechanisms
 * and compliance with GDPR Schrems II requirements
 *
 * Execution Mode: client (100% browser-based)
 * Uses: Pattern matching, GDPR compliance rules, Schrems II validation
 *
 * Tier 2 Complexity: Legal analysis, policy parsing, compliance checking
 *
 * PRIVACY: All processing happens locally - no data transmitted
 */

import { success, failure } from '@conveniencepro/ctp-core'
import type { ToolResult } from '@conveniencepro/ctp-core'
import { getToolById } from '@/data/tools-registry-ctp'

// =============================================================================
// TYPES
// =============================================================================

interface PrivacyShieldTransferValidatorParams {
  input: string
  checkSchrems2?: boolean
  includeRecommendations?: boolean
  strictMode?: boolean
}

interface ValidationIssue {
  severity: 'high' | 'medium' | 'low'
  title: string
  description: string
}

interface PrivacyShieldTransferValidatorResult extends Record<string, unknown> {
  isValid: boolean
  mechanism: string
  issues: ValidationIssue[]
  recommendations: string[]
  riskScore: number
  schrems2Compliant: boolean
}

// =============================================================================
// TOOL DEFINITION
// =============================================================================

export const privacyShieldTransferValidatorDefinition = getToolById('privacy-shield-transfer-validator')

// =============================================================================
// TOOL IMPLEMENTATION
// =============================================================================

export async function privacyShieldTransferValidatorTool(
  params: PrivacyShieldTransferValidatorParams
): Promise<ToolResult> {
  const {
    input,
    checkSchrems2 = true,
    includeRecommendations = true,
    strictMode = false
  } = params

  if (!input) {
    return failure('Privacy policy text is required', 'MISSING_REQUIRED')
  }

  try {
    const text = input.toLowerCase()
    const issues: ValidationIssue[] = []
    const recommendations: string[] = []
    let mechanism = 'Unknown'
    let riskScore = 0

    // Transfer mechanism detection patterns
    const PRIVACY_SHIELD = /privacy shield|safe harbor/i
    const SCC = /standard contractual clauses|scc|model clauses/i
    const BCR = /binding corporate rules|bcr/i
    const ADEQUACY = /adequacy decision|adequate level of protection/i
    const DEROGATION = /derogation|explicit consent|necessary for contract/i
    const US_INDICATORS = /united states|usa|u\.s\.|america|california|new york|aws.*us-east|google.*us-central/i

    // Detect transfer mechanism
    if (PRIVACY_SHIELD.test(input)) {
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

    if (SCC.test(input)) {
      mechanism = 'Standard Contractual Clauses'

      if (!/2021/.test(input) && strictMode) {
        issues.push({
          severity: 'medium',
          title: 'Outdated SCCs Possible',
          description: 'Ensure SCCs are the 2021 version adopted by the European Commission.',
        })
        riskScore += 20
        recommendations.push('Verify use of 2021 Standard Contractual Clauses')
      }

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

    if (BCR.test(input)) {
      mechanism = 'Binding Corporate Rules'
      riskScore += 5
    }

    if (ADEQUACY.test(input)) {
      mechanism = 'Adequacy Decision'
      riskScore += 0
    }

    if (DEROGATION.test(input)) {
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
        description: 'Transfers to the US require special scrutiny post-Schrems II due to surveillance laws.',
      })
      riskScore += 30
      recommendations.push('Verify provider is not subject to US CLOUD Act')
      recommendations.push('Implement technical measures (encryption, pseudonymization)')
      recommendations.push('Consider EU-based alternatives')
    }

    // Check for encryption
    if (!/encrypt/i.test(input)) {
      issues.push({
        severity: 'medium',
        title: 'No Encryption Mentioned',
        description: 'Data transfers should use encryption as a supplementary measure.',
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

    const schrems2Compliant = mechanism !== 'Privacy Shield (INVALIDATED)' &&
                              riskScore < 40 &&
                              !(US_INDICATORS.test(input) && riskScore > 50)

    if (!schrems2Compliant && checkSchrems2) {
      issues.push({
        severity: 'high',
        title: 'Potential Schrems II Non-Compliance',
        description: 'The data transfer mechanism may not comply with Schrems II requirements.',
      })
    }

    if (includeRecommendations) {
      recommendations.push('Review EDPB guidance on international transfers')
      recommendations.push('Document all international data transfers in Records of Processing Activities')
      if (riskScore > 30) {
        recommendations.push('Consider consulting a GDPR specialist for transfer validation')
      }
    }

    return success<PrivacyShieldTransferValidatorResult>({
      isValid: schrems2Compliant && riskScore < 30,
      mechanism,
      issues,
      recommendations: [...new Set(recommendations)],
      riskScore: Math.min(100, riskScore),
      schrems2Compliant,
    })
  } catch (error) {
    return failure(
      `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'EXECUTION_ERROR'
    )
  }
}

export default privacyShieldTransferValidatorTool

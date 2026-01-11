'use client'

import { useState, useCallback } from 'react'

// =============================================================================
// TYPES
// =============================================================================

export interface PaymentPrivacyResult {
  paymentMethod: string
  privacyScore: number
  dataSharing: string[]
  transactionTracking: boolean
  dataBrokerSales: boolean
  recommendations: string[]
  complianceStatus: string
}

export interface UsePaymentMethodPrivacyScannerOptions {
  checkDataBrokers: boolean
  includeAlternatives: boolean
}

// =============================================================================
// PATTERNS / CONSTANTS
// =============================================================================

const PAYMENT_METHODS = {
  CREDIT_CARD: /credit card|visa|mastercard|amex|discover/i,
  PAYPAL: /paypal/i,
  VENMO: /venmo/i,
  CASHAPP: /cash app|cashapp/i,
  APPLE_PAY: /apple pay/i,
  GOOGLE_PAY: /google pay|gpay/i,
  CRYPTOCURRENCY: /bitcoin|ethereum|crypto/i,
  BANK_TRANSFER: /bank transfer|ach|wire transfer/i,
}

const PRIVACY_INDICATORS = {
  DATA_SHARING: /share.*data|third[- ]party|partners|affiliates/i,
  TRACKING: /track|monitor|analyze.*transaction/i,
  DATA_BROKER: /data broker|sell.*information|marketing.*purposes/i,
  ENCRYPTION: /encrypt|secure|ssl|tls/i,
}

// =============================================================================
// HOOK
// =============================================================================

export function usePaymentMethodPrivacyScanner() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<PaymentPrivacyResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [options, setOptionsState] = useState<UsePaymentMethodPrivacyScannerOptions>({
    checkDataBrokers: true,
    includeAlternatives: true,
  })

  const setOptions = useCallback((newOptions: Partial<UsePaymentMethodPrivacyScannerOptions>) => {
    setOptionsState(prev => ({ ...prev, ...newOptions }))
  }, [])

  const scanPrivacy = useCallback(() => {
    if (!input.trim()) {
      setError('Please provide payment method privacy policy text')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const text = input.toLowerCase()
      let paymentMethod = 'Unknown Payment Method'
      let privacyScore = 100
      const dataSharing: string[] = []
      const recommendations: string[] = []
      let transactionTracking = false
      let dataBrokerSales = false

      // Identify payment method
      for (const [method, pattern] of Object.entries(PAYMENT_METHODS)) {
        if (pattern.test(input)) {
          paymentMethod = method.replace(/_/g, ' ')
          break
        }
      }

      // Check for data sharing
      if (PRIVACY_INDICATORS.DATA_SHARING.test(input)) {
        dataSharing.push('Shares data with third parties')
        privacyScore -= 20
        recommendations.push('Review third-party data sharing partners')
      }

      // Check for transaction tracking
      if (PRIVACY_INDICATORS.TRACKING.test(input)) {
        transactionTracking = true
        privacyScore -= 15
        dataSharing.push('Tracks transaction history')
        recommendations.push('Limit transaction data collection where possible')
      }

      // Check for data broker sales
      if (options.checkDataBrokers && PRIVACY_INDICATORS.DATA_BROKER.test(input)) {
        dataBrokerSales = true
        privacyScore -= 30
        dataSharing.push('May sell data to data brokers')
        recommendations.push('Opt out of data sales if available')
        recommendations.push('Consider more privacy-preserving payment methods')
      }

      // Check for encryption
      if (!PRIVACY_INDICATORS.ENCRYPTION.test(input)) {
        privacyScore -= 15
        recommendations.push('Verify that payment data is encrypted')
      }

      // Check for specific high-risk patterns
      if (/marketing|advertis|target/i.test(input)) {
        privacyScore -= 10
        dataSharing.push('Uses transaction data for marketing')
        recommendations.push('Opt out of marketing communications')
      }

      // Determine compliance status
      let complianceStatus = 'Good'
      if (privacyScore < 50) {
        complianceStatus = 'Poor - High Privacy Risk'
      } else if (privacyScore < 70) {
        complianceStatus = 'Fair - Moderate Privacy Risk'
      }

      // Add general recommendations
      if (options.includeAlternatives) {
        if (privacyScore < 70) {
          recommendations.push('Consider using virtual credit card numbers for online purchases')
          recommendations.push('Evaluate privacy-focused payment alternatives')
        }
      }

      recommendations.push('Review privacy policy regularly for changes')
      recommendations.push('Enable all available privacy settings')

      setResult({
        paymentMethod,
        privacyScore: Math.max(0, privacyScore),
        dataSharing,
        transactionTracking,
        dataBrokerSales,
        recommendations,
        complianceStatus,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scanning failed')
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
    const sample = `Payment Privacy Policy

We use industry-standard encryption to protect your payment information. Transaction data is shared with our payment processor and banking partners for fraud prevention and regulatory compliance.

We may share anonymized transaction data with third-party partners for analytics and marketing purposes. Your payment information may be used to improve our services and provide personalized recommendations.

You can opt out of marketing communications at any time through your account settings.`
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
    scanPrivacy,
    clear,
    loadSample,
  }
}

export default usePaymentMethodPrivacyScanner

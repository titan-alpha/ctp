'use client'

import { useState } from 'react'
import usePrivacyShieldTransferValidator from '@/hooks/usePrivacyShieldTransferValidator'

export default function PrivacyShieldTransferValidator() {
  const {
    input,
    result,
    error,
    options,
    isProcessing,
    setInput,
    setOptions,
    validateTransfer,
    clear,
    loadSample
  } = usePrivacyShieldTransferValidator()

  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!result) return
    const text = `Privacy Shield Transfer Validation Report

Mechanism: ${result.mechanism}
Schrems II Compliant: ${result.schrems2Compliant ? 'Yes' : 'No'}
Risk Score: ${result.riskScore}/100
Overall Valid: ${result.isValid ? 'Yes' : 'No'}

Issues Found (${result.issues.length}):
${result.issues.map((issue, i) => `${i + 1}. [${issue.severity.toUpperCase()}] ${issue.title}
   ${issue.description}`).join('\n\n')}

Recommendations (${result.recommendations.length}):
${result.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}`

    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getRiskColor = (score: number) => {
    if (score >= 50) return 'text-red-700 dark:text-red-400'
    if (score >= 30) return 'text-orange-600 dark:text-orange-400'
    return 'text-green-700 dark:text-green-400'
  }

  const getRiskBgColor = (score: number) => {
    if (score >= 50) return 'bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-800'
    if (score >= 30) return 'bg-orange-100 dark:bg-orange-900/20 border-orange-300 dark:border-orange-800'
    return 'bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-800'
  }

  const getSeverityColor = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-800 text-red-900 dark:text-red-100'
      case 'medium':
        return 'bg-orange-100 dark:bg-orange-900/20 border-orange-300 dark:border-orange-800 text-orange-900 dark:text-orange-100'
      case 'low':
        return 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100'
    }
  }

  return (
    <div className="space-y-6">
      {/* Privacy Notice */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">100% Private & Secure</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">All validation happens in your browser. Your privacy policies never leave your device.</p>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="card">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Validation Options</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={options.checkSchrems2}
              onChange={(e) => setOptions({ checkSchrems2: e.target.checked })}
              className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Check Schrems II compliance</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={options.includeRecommendations}
              onChange={(e) => setOptions({ includeRecommendations: e.target.checked })}
              className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Include recommendations</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={options.strictMode}
              onChange={(e) => setOptions({ strictMode: e.target.checked })}
              className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Strict mode (additional checks)</span>
          </label>
        </div>
      </div>

      {/* Input */}
      <div className="card">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Privacy Policy or Data Transfer Disclosure
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono"
          rows={10}
          placeholder="Paste privacy policy text or data transfer disclosure here..."
        />
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Paste the section of a privacy policy that describes international data transfers
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={validateTransfer}
          disabled={isProcessing || !input.trim()}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Validating...' : 'Validate Transfer'}
        </button>
        <button onClick={clear} className="btn-secondary">
          Clear
        </button>
        <button onClick={loadSample} className="btn-secondary">
          Load Sample
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Summary Card */}
          <div className={`card border-2 ${getRiskBgColor(result.riskScore)}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Validation Summary</h3>
              <button
                onClick={handleCopy}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                {copied ? 'Copied!' : 'Copy Report'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Transfer Mechanism</div>
                <div className="font-medium text-gray-900 dark:text-gray-100">{result.mechanism}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Schrems II Compliant</div>
                <div className="font-medium">
                  {result.schrems2Compliant ? (
                    <span className="text-green-700 dark:text-green-400">✓ Yes</span>
                  ) : (
                    <span className="text-red-700 dark:text-red-400">✗ No</span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Risk Score</div>
                <div className={`font-bold text-lg ${getRiskColor(result.riskScore)}`}>
                  {result.riskScore}/100
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Overall Status</div>
                <div className="font-medium">
                  {result.isValid ? (
                    <span className="text-green-700 dark:text-green-400">✓ Valid</span>
                  ) : (
                    <span className="text-red-700 dark:text-red-400">✗ Issues Found</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Issues */}
          {result.issues.length > 0 && (
            <div className="card">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Issues Found ({result.issues.length})
              </h3>
              <div className="space-y-3">
                {result.issues.map((issue, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${getSeverityColor(issue.severity)}`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded bg-white/50 dark:bg-black/20">
                        {issue.severity}
                      </span>
                      <div className="flex-1">
                        <div className="font-medium mb-1">{issue.title}</div>
                        <div className="text-sm opacity-90">{issue.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {result.recommendations.length > 0 && (
            <div className="card">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Recommendations ({result.recommendations.length})
              </h3>
              <ul className="space-y-2">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

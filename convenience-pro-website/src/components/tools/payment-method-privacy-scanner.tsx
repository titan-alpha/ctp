'use client'

import { useState } from 'react'
import usePaymentMethodPrivacyScanner from '@/hooks/usePaymentMethodPrivacyScanner'

export default function PaymentMethodPrivacyScanner() {
  const {
    input,
    result,
    error,
    options,
    isProcessing,
    setInput,
    setOptions,
    scanPrivacy,
    clear,
    loadSample
  } = usePaymentMethodPrivacyScanner()

  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!result) return
    const text = `Payment Method Privacy Report

Payment Method: ${result.paymentMethod}
Privacy Score: ${result.privacyScore}/100
Compliance Status: ${result.complianceStatus}
Transaction Tracking: ${result.transactionTracking ? 'Yes' : 'No'}
Data Broker Sales: ${result.dataBrokerSales ? 'Yes' : 'No'}

Data Sharing Practices:
${result.dataSharing.map((item, i) => `${i + 1}. ${item}`).join('\n')}

Recommendations:
${result.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}`

    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-700 dark:text-green-400'
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-700 dark:text-red-400'
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">100% Private & Secure</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">All analysis happens in your browser. Your privacy policies never leave your device.</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Scan Options</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={options.checkDataBrokers}
              onChange={(e) => setOptions({ checkDataBrokers: e.target.checked })}
              className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Check for data broker sales</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={options.includeAlternatives}
              onChange={(e) => setOptions({ includeAlternatives: e.target.checked })}
              className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Suggest privacy alternatives</span>
          </label>
        </div>
      </div>

      <div className="card">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Payment Method Privacy Policy
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono"
          rows={10}
          placeholder="Paste payment method privacy policy here..."
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={scanPrivacy}
          disabled={isProcessing || !input.trim()}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Scanning...' : 'Scan Privacy'}
        </button>
        <button onClick={clear} className="btn-secondary">
          Clear
        </button>
        <button onClick={loadSample} className="btn-secondary">
          Load Sample
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Privacy Analysis</h3>
              <button
                onClick={handleCopy}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                {copied ? 'Copied!' : 'Copy Report'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Payment Method</div>
                <div className="font-medium text-gray-900 dark:text-gray-100">{result.paymentMethod}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Privacy Score</div>
                <div className={`font-bold text-lg ${getScoreColor(result.privacyScore)}`}>
                  {result.privacyScore}/100
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Compliance Status</div>
                <div className="font-medium text-gray-900 dark:text-gray-100">{result.complianceStatus}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Data Broker Sales</div>
                <div className="font-medium">
                  {result.dataBrokerSales ? (
                    <span className="text-red-700 dark:text-red-400">⚠ Detected</span>
                  ) : (
                    <span className="text-green-700 dark:text-green-400">✓ Not Detected</span>
                  )}
                </div>
              </div>
            </div>

            {result.dataSharing.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data Sharing Practices</h4>
                <ul className="space-y-1">
                  {result.dataSharing.map((item, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                      <span className="text-orange-600 dark:text-orange-400">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

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

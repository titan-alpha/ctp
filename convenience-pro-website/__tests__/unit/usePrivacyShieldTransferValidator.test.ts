import { renderHook, act } from '@testing-library/react'
import usePrivacyShieldTransferValidator from '@/hooks/usePrivacyShieldTransferValidator'

describe('usePrivacyShieldTransferValidator', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => usePrivacyShieldTransferValidator())

    expect(result.current.input).toBe('')
    expect(result.current.result).toBeNull()
    expect(result.current.error).toBeNull()
    expect(result.current.isProcessing).toBe(false)
    expect(result.current.options.checkSchrems2).toBe(true)
    expect(result.current.options.includeRecommendations).toBe(true)
  })

  it('should validate transfer with SCCs successfully', () => {
    const { result } = renderHook(() => usePrivacyShieldTransferValidator())

    act(() => {
      result.current.setInput('We use Standard Contractual Clauses (2021) for data transfers with Transfer Impact Assessment.')
    })

    act(() => {
      result.current.validateTransfer()
    })

    expect(result.current.result).toBeTruthy()
    expect(result.current.result?.mechanism).toBe('Standard Contractual Clauses')
    expect(result.current.result?.schrems2Compliant).toBe(true)
    expect(result.current.error).toBeNull()
  })

  it('should detect Privacy Shield as invalid', () => {
    const { result } = renderHook(() => usePrivacyShieldTransferValidator())

    act(() => {
      result.current.setInput('We transfer data under Privacy Shield framework.')
    })

    act(() => {
      result.current.validateTransfer()
    })

    expect(result.current.result).toBeTruthy()
    expect(result.current.result?.mechanism).toBe('Privacy Shield (INVALIDATED)')
    expect(result.current.result?.issues.some(issue => issue.title === 'Privacy Shield Invalid')).toBe(true)
    expect(result.current.result?.riskScore).toBeGreaterThan(40)
  })

  it('should detect US transfers and flag them', () => {
    const { result } = renderHook(() => usePrivacyShieldTransferValidator())

    act(() => {
      result.current.setInput('Data is transferred to United States servers with Standard Contractual Clauses.')
    })

    act(() => {
      result.current.validateTransfer()
    })

    expect(result.current.result).toBeTruthy()
    expect(result.current.result?.issues.some(issue => issue.title === 'US Data Transfer Detected')).toBe(true)
    expect(result.current.result?.riskScore).toBeGreaterThan(0)
  })

  it('should handle error when input is empty', () => {
    const { result } = renderHook(() => usePrivacyShieldTransferValidator())

    act(() => {
      result.current.validateTransfer()
    })

    expect(result.current.error).toBeTruthy()
    expect(result.current.result).toBeNull()
  })

  it('should clear state', () => {
    const { result } = renderHook(() => usePrivacyShieldTransferValidator())

    act(() => {
      result.current.setInput('test policy')
      result.current.validateTransfer()
    })

    act(() => {
      result.current.clear()
    })

    expect(result.current.input).toBe('')
    expect(result.current.result).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('should update options', () => {
    const { result } = renderHook(() => usePrivacyShieldTransferValidator())

    act(() => {
      result.current.setOptions({ strictMode: true })
    })

    expect(result.current.options.strictMode).toBe(true)
    expect(result.current.options.checkSchrems2).toBe(true) // Should preserve other options
  })

  it('should load sample data', () => {
    const { result } = renderHook(() => usePrivacyShieldTransferValidator())

    act(() => {
      result.current.loadSample()
    })

    expect(result.current.input.length).toBeGreaterThan(0)
    expect(result.current.input).toContain('Standard Contractual Clauses')
  })

  it('should detect missing encryption', () => {
    const { result } = renderHook(() => usePrivacyShieldTransferValidator())

    act(() => {
      result.current.setInput('We transfer data with Standard Contractual Clauses but no security measures.')
    })

    act(() => {
      result.current.validateTransfer()
    })

    expect(result.current.result).toBeTruthy()
    expect(result.current.result?.issues.some(issue => issue.title === 'No Encryption Mentioned')).toBe(true)
  })

  it('should provide recommendations', () => {
    const { result } = renderHook(() => usePrivacyShieldTransferValidator())

    act(() => {
      result.current.setInput('We use Standard Contractual Clauses for transfers to the United States.')
    })

    act(() => {
      result.current.validateTransfer()
    })

    expect(result.current.result).toBeTruthy()
    expect(result.current.result?.recommendations.length).toBeGreaterThan(0)
  })

  it('should calculate risk score correctly', () => {
    const { result } = renderHook(() => usePrivacyShieldTransferValidator())

    act(() => {
      result.current.setInput('We use Privacy Shield for data transfers to USA.')
    })

    act(() => {
      result.current.validateTransfer()
    })

    expect(result.current.result).toBeTruthy()
    expect(result.current.result?.riskScore).toBeGreaterThan(50)
    expect(result.current.result?.riskScore).toBeLessThanOrEqual(100)
  })
})

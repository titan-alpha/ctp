import { renderHook, act } from '@testing-library/react'
import usePaymentMethodPrivacyScanner from '@/hooks/usePaymentMethodPrivacyScanner'

describe('usePaymentMethodPrivacyScanner', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => usePaymentMethodPrivacyScanner())

    expect(result.current.input).toBe('')
    expect(result.current.result).toBeNull()
    expect(result.current.error).toBeNull()
    expect(result.current.isProcessing).toBe(false)
  })

  it('should scan privacy policy successfully', () => {
    const { result } = renderHook(() => usePaymentMethodPrivacyScanner())

    act(() => {
      result.current.setInput('We use encryption to protect your credit card information.')
    })

    act(() => {
      result.current.scanPrivacy()
    })

    expect(result.current.result).toBeTruthy()
    expect(result.current.result?.privacyScore).toBeGreaterThan(0)
    expect(result.current.error).toBeNull()
  })

  it('should detect data broker sales', () => {
    const { result } = renderHook(() => usePaymentMethodPrivacyScanner())

    act(() => {
      result.current.setInput('We may sell your transaction information to data brokers for marketing purposes.')
    })

    act(() => {
      result.current.scanPrivacy()
    })

    expect(result.current.result).toBeTruthy()
    expect(result.current.result?.dataBrokerSales).toBe(true)
    expect(result.current.result?.privacyScore).toBeLessThan(80)
  })

  it('should detect transaction tracking', () => {
    const { result } = renderHook(() => usePaymentMethodPrivacyScanner())

    act(() => {
      result.current.setInput('We track and monitor all your transactions for analytics.')
    })

    act(() => {
      result.current.scanPrivacy()
    })

    expect(result.current.result).toBeTruthy()
    expect(result.current.result?.transactionTracking).toBe(true)
  })

  it('should handle error when input is empty', () => {
    const { result } = renderHook(() => usePaymentMethodPrivacyScanner())

    act(() => {
      result.current.scanPrivacy()
    })

    expect(result.current.error).toBeTruthy()
    expect(result.current.result).toBeNull()
  })

  it('should clear state', () => {
    const { result } = renderHook(() => usePaymentMethodPrivacyScanner())

    act(() => {
      result.current.setInput('test policy')
      result.current.scanPrivacy()
    })

    act(() => {
      result.current.clear()
    })

    expect(result.current.input).toBe('')
    expect(result.current.result).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('should update options', () => {
    const { result } = renderHook(() => usePaymentMethodPrivacyScanner())

    act(() => {
      result.current.setOptions({ checkDataBrokers: false })
    })

    expect(result.current.options.checkDataBrokers).toBe(false)
  })

  it('should load sample data', () => {
    const { result } = renderHook(() => usePaymentMethodPrivacyScanner())

    act(() => {
      result.current.loadSample()
    })

    expect(result.current.input.length).toBeGreaterThan(0)
  })

  it('should provide recommendations', () => {
    const { result } = renderHook(() => usePaymentMethodPrivacyScanner())

    act(() => {
      result.current.setInput('Basic payment privacy policy without encryption.')
    })

    act(() => {
      result.current.scanPrivacy()
    })

    expect(result.current.result).toBeTruthy()
    expect(result.current.result?.recommendations.length).toBeGreaterThan(0)
  })
})

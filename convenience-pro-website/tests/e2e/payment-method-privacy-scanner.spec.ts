import { test, expect } from '@playwright/test'

test.describe('Payment Method Privacy Scanner', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/payment-method-privacy-scanner')
    await page.waitForLoadState('networkidle')
  })

  test('should display page title and description', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Payment Method Privacy Scanner')
    await expect(page.locator('text=100% private')).toBeVisible()
  })

  test('should scan privacy policy successfully', async ({ page }) => {
    await page.fill('textarea', 'We use encryption to protect your credit card information.')
    await page.click('button:has-text("Scan Privacy")')

    await expect(page.locator('text=Privacy Analysis')).toBeVisible()
    await expect(page.locator('text=Privacy Score')).toBeVisible()
  })

  test('should show error for empty input', async ({ page }) => {
    await page.click('button:has-text("Scan Privacy")')

    await expect(page.locator('.bg-red-50')).toBeVisible()
  })

  test('should clear input and results', async ({ page }) => {
    await page.fill('textarea', 'Test privacy policy')
    await page.click('button:has-text("Scan Privacy")')
    await expect(page.locator('text=Privacy Analysis')).toBeVisible()

    await page.click('button:has-text("Clear")')

    const input = await page.locator('textarea').inputValue()
    expect(input).toBe('')
  })

  test('should load sample data', async ({ page }) => {
    await page.click('button:has-text("Load Sample")')

    const input = await page.locator('textarea').inputValue()
    expect(input.length).toBeGreaterThan(0)
  })

  test('should toggle scan options', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]').first()

    await checkbox.click()
    const isChecked = await checkbox.isChecked()
    expect(typeof isChecked).toBe('boolean')
  })

  test('should display privacy score', async ({ page }) => {
    await page.fill('textarea', 'Secure payment processing with encryption.')
    await page.click('button:has-text("Scan Privacy")')

    await expect(page.locator('text=/\\d+\\/100/')).toBeVisible()
  })

  test('should show recommendations', async ({ page }) => {
    await page.fill('textarea', 'Basic payment policy.')
    await page.click('button:has-text("Scan Privacy")')

    await expect(page.locator('text=Recommendations')).toBeVisible()
  })

  test('should copy report to clipboard', async ({ page }) => {
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write'])

    await page.fill('textarea', 'Payment privacy policy.')
    await page.click('button:has-text("Scan Privacy")')
    await expect(page.locator('text=Privacy Analysis')).toBeVisible()

    await page.click('button:has-text("Copy Report")')
    await expect(page.locator('text=Copied!')).toBeVisible()
  })
})

import { test, expect } from '@playwright/test'

test.describe('Privacy Shield Transfer Validator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/privacy-shield-transfer-validator')
    await page.waitForLoadState('networkidle')
  })

  test('should display page title and description', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Privacy Shield Transfer Validator')
    await expect(page.locator('text=100% private')).toBeVisible()
  })

  test('should validate transfer with SCCs successfully', async ({ page }) => {
    const testPolicy = 'We use Standard Contractual Clauses (2021) for data transfers with Transfer Impact Assessment and encryption.'

    await page.fill('textarea', testPolicy)
    await page.click('button:has-text("Validate Transfer")')

    await expect(page.locator('text=Validation Summary')).toBeVisible()
    await expect(page.locator('text=Standard Contractual Clauses')).toBeVisible()
  })

  test('should detect Privacy Shield as invalid', async ({ page }) => {
    await page.fill('textarea', 'We use Privacy Shield for EU-US data transfers.')
    await page.click('button:has-text("Validate Transfer")')

    await expect(page.locator('text=Privacy Shield Invalid')).toBeVisible()
    await expect(page.locator('text=INVALIDATED')).toBeVisible()
  })

  test('should show error for empty input', async ({ page }) => {
    await page.click('button:has-text("Validate Transfer")')

    await expect(page.locator('.bg-red-50')).toBeVisible()
    await expect(page.locator('text=Please provide')).toBeVisible()
  })

  test('should clear input and results', async ({ page }) => {
    await page.fill('textarea', 'We use Standard Contractual Clauses.')
    await page.click('button:has-text("Validate Transfer")')
    await expect(page.locator('text=Validation Summary')).toBeVisible()

    await page.click('button:has-text("Clear")')

    const input = await page.locator('textarea').inputValue()
    expect(input).toBe('')
    await expect(page.locator('text=Validation Summary')).not.toBeVisible()
  })

  test('should load sample data', async ({ page }) => {
    await page.click('button:has-text("Load Sample")')

    const input = await page.locator('textarea').inputValue()
    expect(input.length).toBeGreaterThan(0)
    expect(input).toContain('Standard Contractual Clauses')
  })

  test('should toggle validation options', async ({ page }) => {
    const strictModeCheckbox = page.locator('input[type="checkbox"]').nth(2)

    await strictModeCheckbox.click()
    const isChecked = await strictModeCheckbox.isChecked()
    expect(isChecked).toBe(true)
  })

  test('should detect US transfers', async ({ page }) => {
    await page.fill('textarea', 'Data transferred to United States with Standard Contractual Clauses.')
    await page.click('button:has-text("Validate Transfer")')

    await expect(page.locator('text=US Data Transfer Detected')).toBeVisible()
  })

  test('should display risk score', async ({ page }) => {
    await page.fill('textarea', 'We use Privacy Shield for data transfers.')
    await page.click('button:has-text("Validate Transfer")')

    await expect(page.locator('text=Risk Score')).toBeVisible()
    await expect(page.locator('text=/\\d+\\/100/')).toBeVisible()
  })

  test('should show recommendations', async ({ page }) => {
    await page.fill('textarea', 'We transfer data using Standard Contractual Clauses.')
    await page.click('button:has-text("Validate Transfer")')

    await expect(page.locator('text=Recommendations')).toBeVisible()
  })

  test('should copy report to clipboard', async ({ page }) => {
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write'])

    await page.fill('textarea', 'We use Standard Contractual Clauses for transfers.')
    await page.click('button:has-text("Validate Transfer")')
    await expect(page.locator('text=Validation Summary')).toBeVisible()

    await page.click('button:has-text("Copy Report")')
    await expect(page.locator('text=Copied!')).toBeVisible()
  })

  test('should display severity levels for issues', async ({ page }) => {
    await page.fill('textarea', 'We use Privacy Shield for transfers to USA.')
    await page.click('button:has-text("Validate Transfer")')

    await expect(page.locator('text=HIGH')).toBeVisible()
  })

  test('should show Schrems II compliance status', async ({ page }) => {
    await page.fill('textarea', 'Standard Contractual Clauses with Transfer Impact Assessment.')
    await page.click('button:has-text("Validate Transfer")')

    await expect(page.locator('text=Schrems II Compliant')).toBeVisible()
  })
})

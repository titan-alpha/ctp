# Agent Onboarding Guide
**Version:** 1.0
**Last Updated:** 2025-11-30

Welcome to the ConveniencePro tool building team! This document provides everything you need to build high-quality tools for our platform.

---

## Table of Contents
1. [Quick Start](#quick-start)
2. [Required Reading](#required-reading)
3. [Testing Requirements](#testing-requirements)
4. [Design & UI Standards](#design--ui-standards)
5. [Common Patterns](#common-patterns)
6. [Checklist](#checklist)

---

## Quick Start

### Your Mission
Build a tool following our exact specifications. Every tool must have:
- 3 files: page.tsx, component.tsx, hook.ts
- All required UI sections (7 total)
- Complete test coverage
- Registration in tools-index.ts

### Critical Documents
1. **TOOL_BUILDING_REQUIREMENTS.md** - Complete specifications (READ THIS FIRST)
2. **MISSING_TOOLS_MASTER_LIST.md** - List of tools to build
3. **This document** - Testing and workflow guidance

---

## Required Reading

Before starting, you MUST read:
- `/agent-space/TOOL_BUILDING_REQUIREMENTS.md` - Complete tool requirements
- `/docs/EDITOR_QUALITY_STANDARDS.md` - Quality standards
- `/docs/PATTERN_EXAMPLES.md` - Pattern examples

Reference existing tools in `/src/app/tools/` for examples.

---

## Testing Requirements

### Test Directory Structure
```
tests/
├── unit/
│   └── hooks/
│       └── useToolName.test.ts
├── integration/
│   └── tools/
│       └── tool-name.test.tsx
└── e2e/
    └── tool-name.spec.ts
```

### 1. Unit Tests (MANDATORY)

**Location:** `tests/unit/hooks/useToolName.test.ts`

**Requirements:**
- Test the hook in isolation
- Minimum 5 test cases
- Cover happy path and error cases
- Test all exported functions

**Template:**
```typescript
import { renderHook, act } from '@testing-library/react'
import useToolName from '@/hooks/useToolName'

describe('useToolName', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useToolName())
    expect(result.current.input).toBe('')
    expect(result.current.output).toBe('')
    expect(result.current.error).toBeNull()
  })

  it('should process input correctly', () => {
    const { result } = renderHook(() => useToolName())

    act(() => {
      result.current.setInput('test input')
    })

    expect(result.current.output).toBe('expected output')
    expect(result.current.error).toBeNull()
  })

  it('should handle errors gracefully', () => {
    const { result } = renderHook(() => useToolName())

    act(() => {
      result.current.setInput('invalid input that causes error')
    })

    expect(result.current.error).toBeTruthy()
    expect(result.current.output).toBe('')
  })

  it('should reset state correctly', () => {
    const { result } = renderHook(() => useToolName())

    act(() => {
      result.current.setInput('test')
    })

    act(() => {
      result.current.reset()
    })

    expect(result.current.input).toBe('')
    expect(result.current.output).toBe('')
    expect(result.current.error).toBeNull()
  })

  it('should copy to clipboard', async () => {
    const { result } = renderHook(() => useToolName())

    // Mock clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    })

    act(() => {
      result.current.setInput('test')
    })

    await act(async () => {
      await result.current.copyToClipboard()
    })

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('expected output')
  })
})
```

### 2. Integration Tests (MANDATORY)

**Location:** `tests/integration/tools/tool-name.test.tsx`

**Requirements:**
- Test component + hook integration
- Verify all UI sections render
- Test user interactions end-to-end
- Minimum 3 test cases

**Template:**
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ToolComponent from '@/components/tools/tool-name'

// Mock SiteLayout to avoid layout dependencies
jest.mock('@/components/layout/SiteLayout', () => {
  return function MockSiteLayout({ children }: { children: React.ReactNode }) {
    return <div>{children}</div>
  }
})

describe('ToolName Integration Tests', () => {
  it('should render all required sections', () => {
    render(<ToolComponent />)

    // Verify H1 title
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Tool Name')

    // Verify FAQ section
    expect(screen.getByText(/Frequently Asked Questions/i)).toBeInTheDocument()

    // Verify Related Tools section
    expect(screen.getByText(/Related Tools/i)).toBeInTheDocument()

    // Verify Features section (check for at least 3 features)
    const features = screen.getAllByText(/feature/i)
    expect(features.length).toBeGreaterThanOrEqual(3)
  })

  it('should process user input correctly', async () => {
    render(<ToolComponent />)

    // Find input field
    const input = screen.getByPlaceholderText(/enter/i) as HTMLInputElement

    // Type input
    fireEvent.change(input, { target: { value: 'test input' } })

    // Wait for processing
    await waitFor(() => {
      expect(screen.getByText(/expected output/i)).toBeInTheDocument()
    })
  })

  it('should handle file upload (for file-based tools)', async () => {
    render(<ToolComponent />)

    // Create mock file
    const file = new File(['file contents'], 'test.txt', { type: 'text/plain' })

    // Find file input
    const input = screen.getByLabelText(/upload/i) as HTMLInputElement

    // Upload file
    fireEvent.change(input, { target: { files: [file] } })

    // Verify file name appears
    await waitFor(() => {
      expect(screen.getByText(/test\.txt/i)).toBeInTheDocument()
    })
  })

  it('should display errors appropriately', async () => {
    render(<ToolComponent />)

    const input = screen.getByPlaceholderText(/enter/i) as HTMLInputElement

    // Trigger error condition
    fireEvent.change(input, { target: { value: 'invalid input' } })

    // Verify error message displays
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })

  it('should copy output to clipboard', async () => {
    // Mock clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    })

    render(<ToolComponent />)

    const input = screen.getByPlaceholderText(/enter/i) as HTMLInputElement
    fireEvent.change(input, { target: { value: 'test' } })

    // Find and click copy button
    const copyButton = screen.getByText(/copy/i)
    fireEvent.click(copyButton)

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled()
    })
  })
})
```

### 3. E2E Tests with Playwright (MANDATORY for converters)

**Location:** `tests/e2e/tool-name.spec.ts`

**Requirements:**
- Test in real Chromium browser
- Verify page loads correctly
- Test complete user workflow
- Take screenshots on failure

**Setup:**
Playwright is configured for Chromium testing in `/playwright.config.ts`

**Template:**
```typescript
import { test, expect } from '@playwright/test'
import path from 'path'

test.describe('ToolName E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to tool page
    await page.goto('/tools/tool-slug')

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle')
  })

  test('should load page with all sections', async ({ page }) => {
    // Verify H1 title
    await expect(page.locator('h1')).toContainText('Tool Name')

    // Verify FAQ section exists
    await expect(page.locator('text=Frequently Asked Questions')).toBeVisible()

    // Verify Related Tools section
    await expect(page.locator('text=Related Tools')).toBeVisible()

    // Take screenshot for verification
    await page.screenshot({ path: 'screenshots/tool-name-loaded.png' })
  })

  test('should process text input correctly', async ({ page }) => {
    // Find input field
    const input = page.locator('input[type="text"]').first()

    // Type input
    await input.fill('test input')

    // Wait for output to appear
    await expect(page.locator('text=expected output')).toBeVisible({ timeout: 5000 })
  })

  test('should handle file upload and conversion', async ({ page }) => {
    // Create test file path
    const testFile = path.join(__dirname, '../fixtures/test-file.webp')

    // Upload file
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(testFile)

    // Verify file name appears
    await expect(page.locator('text=test-file.webp')).toBeVisible()

    // Click convert button
    await page.locator('button:has-text("Convert")').click()

    // Wait for conversion complete
    await expect(page.locator('text=Download')).toBeVisible({ timeout: 10000 })

    // Screenshot the result
    await page.screenshot({ path: 'screenshots/tool-name-converted.png' })
  })

  test('should download converted file', async ({ page }) => {
    const testFile = path.join(__dirname, '../fixtures/test-file.webp')

    await page.locator('input[type="file"]').setInputFiles(testFile)
    await page.locator('button:has-text("Convert")').click()

    // Wait for download button
    await page.locator('button:has-text("Download")').waitFor()

    // Start waiting for download before clicking
    const downloadPromise = page.waitForEvent('download')
    await page.locator('button:has-text("Download")').click()
    const download = await downloadPromise

    // Verify download filename
    expect(download.suggestedFilename()).toMatch(/\.(jpg|png|pdf)$/)
  })

  test('should display error for invalid input', async ({ page }) => {
    const input = page.locator('input[type="text"]').first()

    // Enter invalid input
    await input.fill('!!!invalid@@@')

    // Verify error message appears
    await expect(page.locator('text=/error/i')).toBeVisible()
  })

  test('should reset form correctly', async ({ page }) => {
    const input = page.locator('input[type="text"]').first()

    await input.fill('test input')

    // Click reset/clear button
    await page.locator('button:has-text("Clear")').click()

    // Verify input is cleared
    await expect(input).toHaveValue('')
  })
})
```

### Running Tests

```bash
# Run all unit tests
npm run test

# Run specific unit test
npm run test -- useToolName.test.ts

# Run integration tests
npm run test:integration

# Run E2E tests with Playwright
npm run test:e2e

# Run E2E tests in headed mode (see browser)
npm run test:e2e:headed

# Generate test coverage report
npm run test:coverage
```

---

## Design & UI Standards

### Required CSS Classes
All tools MUST use these exact classes:

**Buttons:**
```tsx
<button className="btn-primary">Primary Action</button>
<button className="btn-secondary">Secondary Action</button>
```

**Cards:**
```tsx
<div className="card">Content</div>
```

**Input Fields:**
```tsx
<input
  type="text"
  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
/>

<textarea
  className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-y"
/>
```

**Error Messages:**
```tsx
<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
  <div className="flex items-start">
    <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
    <p className="text-red-800">{error}</p>
  </div>
</div>
```

### Ad Placeholder Locations
Ad placeholders will be added by the platform automatically. Do NOT include ad code in your tool.

Ads appear:
- After H1 header (managed by SiteLayout)
- Between features and FAQ section (managed by SiteLayout)
- After related tools (managed by SiteLayout)

---

## Common Patterns

### Pattern 1: Simple Text Transformer
**Example:** Base64 Encoder, Case Converter

**Flow:**
1. User enters text
2. Hook processes immediately (useCallback)
3. Output displays instantly
4. Copy to clipboard button

**Reference:** `/src/components/tools/base64-encoder.tsx`

### Pattern 2: File Converter
**Example:** WebP to PNG, PDF to JPG

**Flow:**
1. Drag-and-drop or file upload
2. Validation (file type + size)
3. Convert button
4. Processing indicator
5. Preview + download

**Reference:** `/src/components/tools/webp-to-png.tsx`

### Pattern 3: Generator
**Example:** QR Code, Password Generator

**Flow:**
1. Configuration options
2. Generate button
3. Preview result
4. Download/copy options

**Reference:** `/src/components/tools/qr-code-generator.tsx`

---

## Categorization

### Available Categories
- `text-tools` - Text manipulation, formatting, analysis
- `converters` - File format conversions
- `image-tools` - Image editing, optimization
- `calculators` - Math, finance, health calculators
- `generators` - QR codes, passwords, data generation
- `validators` - Data validation tools
- `web-tools` - Web development utilities
- `analyzers` - Analysis and measurement tools

### How to Determine Category
1. **Primary function** - What does the tool mainly do?
2. **User intent** - Why would someone use this?
3. **Similar tools** - What category are related tools in?

### Registration Process
Add tool to `/src/data/tools-index.ts` in alphabetical order:

```typescript
'tool-slug': {
  name: 'Tool Name',
  category: 'category-name',
  description: 'Brief description (max 120 chars)'
},
```

---

## Checklist

Before submitting your tool:

### Files Created
- [ ] `/src/app/tools/[slug]/page.tsx` exists
- [ ] `/src/components/tools/[name].tsx` exists
- [ ] `/src/hooks/use[Name].ts` exists

### Component Requirements
- [ ] SchemaMarkup (SoftwareApplication) included
- [ ] SchemaMarkup (FAQPage) with 4-5 questions
- [ ] H1 title and description
- [ ] Main tool card with functionality
- [ ] Features section (3 features)
- [ ] FAQ section (matches schema)
- [ ] Related Tools section (3 tools)
- [ ] SiteLayout wrapper present
- [ ] All text uses proper escaping (&apos; not ')

### Code Quality
- [ ] TypeScript with no errors
- [ ] All interfaces defined
- [ ] useCallback for functions
- [ ] Memory cleanup (URL.revokeObjectURL)
- [ ] Error handling implemented
- [ ] File size limits validated
- [ ] No console.log statements
- [ ] Privacy statement included

### Testing
- [ ] Unit tests written (min 5 cases)
- [ ] Integration tests written (min 3 cases)
- [ ] E2E tests written (for converters)
- [ ] All tests passing

### Registration
- [ ] Tool added to tools-index.ts
- [ ] Correct category assigned
- [ ] No duplicate entries
- [ ] Description under 120 chars

---

## Getting Help

If you encounter issues:

1. **Check existing tools** - Find a similar tool and follow its pattern
2. **Read the requirements** - Most questions are answered in TOOL_BUILDING_REQUIREMENTS.md
3. **Review test examples** - This document has complete test templates
4. **Check build errors** - Run `npm run build` to catch TypeScript errors

---

## Success Criteria

Your tool is complete when:
1. All checklist items checked
2. All tests passing
3. TypeScript compiles with no errors
4. Tool registered in tools-index.ts
5. Follows design standards exactly

Good luck building! 🚀

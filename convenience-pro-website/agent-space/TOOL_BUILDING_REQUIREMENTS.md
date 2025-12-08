# Tool Building Requirements & Standards
**Version:** 1.0
**Last Updated:** 2025-11-30

This document outlines the MANDATORY requirements for building any tool in the ConveniencePro utility tools website.

---

## Table of Contents
1. [File Structure](#file-structure)
2. [Required Components](#required-components)
3. [SEO & Metadata Requirements](#seo--metadata-requirements)
4. [Design & UI Standards](#design--ui-standards)
5. [Code Quality Standards](#code-quality-standards)
6. [Testing Requirements](#testing-requirements)
7. [Registration & Deployment](#registration--deployment)
8. [Examples & Templates](#examples--templates)

---

## File Structure

Every tool MUST have exactly 3 files:

```
utility-tools-website/src/
├── app/tools/[tool-slug]/
│   └── page.tsx                    # Next.js page with metadata
├── components/tools/
│   └── [tool-name].tsx             # Main UI component
└── hooks/
    └── use[ToolName].ts            # Business logic hook
```

### Example: Base64 Encoder
```
src/
├── app/tools/base64-encoder/
│   └── page.tsx
├── components/tools/
│   └── base64-encoder.tsx
└── hooks/
    └── useBase64.ts
```

---

## Required Components

### 1. Page Component (`page.tsx`)

**Template:**
```typescript
import ToolComponent from '@/components/tools/tool-name';

export const metadata = {
  title: 'Tool Name | Action Description',
  description: 'Detailed description including main features. 100% free and private.',
  keywords: ['keyword1', 'keyword2', 'keyword3'],
  openGraph: {
    title: 'Tool Name | Action Description',
    description: 'OG description',
    type: 'website',
    url: '/tools/tool-slug',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tool Name',
    description: 'Twitter description',
  },
};

export default function ToolPage() {
  return <ToolComponent />;
}
```

### 2. Component (`tool-name.tsx`)

**REQUIRED Sections (in order):**

1. **Schema Markup** - MUST include SoftwareApplication + FAQPage
2. **SiteLayout Wrapper** - MUST wrap entire tool
3. **Tool Header** - H1 title + description
4. **Main Tool Card** - Input/output/controls
5. **Features Section** - 3-column grid highlighting features
6. **FAQ Section** - Minimum 4-5 questions
7. **Related Tools** - 3 related tool links

**Template Structure:**
```typescript
'use client'

import SiteLayout from '@/components/layout/SiteLayout'
import { SchemaMarkup } from '@/components/seo'
import useToolHook from '@/hooks/useToolHook'
import { useState } from 'react'

export default function ToolName() {
  const { /* hook destructuring */ } = useToolHook()
  const [copied, setCopied] = useState(false)

  return (
    <>
      {/* 1. SCHEMA MARKUP - REQUIRED */}
      <SchemaMarkup
        type="SoftwareApplication"
        name="Tool Name"
        description="Tool description for schema"
        category="UtilitiesApplication"
      />

      <SchemaMarkup
        type="FAQPage"
        faqItems={[
          {
            question: "Question 1?",
            answer: "Answer 1"
          },
          // Minimum 4 FAQ items
        ]}
      />

      {/* 2. SITE LAYOUT WRAPPER - REQUIRED */}
      <SiteLayout toolName="Tool Name" category="category-slug">

        {/* 3. TOOL HEADER - REQUIRED */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tool Name
          </h1>
          <p className="text-lg text-gray-600">
            Tool description. 100% free and private - all processing happens in your browser.
          </p>
        </div>

        {/* 4. MAIN TOOL CARD - REQUIRED */}
        <div className="card mb-8">
          {/* Tool functionality goes here */}
        </div>

        {/* 5. FEATURES SECTION - REQUIRED */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              {/* Icon SVG */}
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Feature Title</h3>
            <p className="text-sm text-gray-600">Feature description</p>
          </div>
          {/* 3 features total */}
        </div>

        {/* 6. FAQ SECTION - REQUIRED */}
        <div className="card mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {/* FAQ items */}
          </div>
        </div>

        {/* 7. RELATED TOOLS - REQUIRED */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 3 related tool links */}
          </div>
        </div>

      </SiteLayout>
    </>
  )
}
```

### 3. Hook (`useToolName.ts`)

**Template:**
```typescript
'use client'

import { useState, useCallback } from 'react'

interface UseToolNameReturn {
  // Define return interface
}

export default function useToolName(): UseToolNameReturn {
  const [state, setState] = useState('')

  // All business logic goes here
  // Use useCallback for functions

  return {
    // Return all state and functions
  }
}
```

---

## SEO & Metadata Requirements

### Page Metadata (REQUIRED)
- **title**: Tool Name + action verb + benefit (max 60 chars)
- **description**: Clear description with features (max 160 chars)
- **keywords**: Array of 5-10 relevant keywords
- **openGraph**: Full OG tags for social sharing
- **twitter**: Twitter card metadata

### Schema Markup (REQUIRED)
1. **SoftwareApplication** schema - Every tool
2. **FAQPage** schema - Minimum 4-5 questions
3. Questions must match FAQ section content

### FAQ Requirements
- Minimum 4-5 questions
- Cover: What is it, How to use, Features, Privacy, Common issues
- Use &apos; for apostrophes (JSX escaping)
- Keep answers concise (2-3 sentences)

---

## Design & UI Standards

### Color Palette
```css
Primary: #0ea5e9 (sky-500)
Primary Hover: #0284c7 (sky-600)
Background: #ffffff
Card Background: #f9fafb (gray-50)
Border: #e5e7eb (gray-200)
Text Primary: #111827 (gray-900)
Text Secondary: #6b7280 (gray-500)
```

### Typography
- **H1**: text-4xl font-bold text-gray-900
- **H2**: text-2xl font-bold text-gray-900
- **H3**: font-semibold text-gray-900
- **Body**: text-gray-600
- **Small**: text-sm text-gray-600

### Spacing
- **Section margins**: mb-8 or mb-12
- **Card padding**: p-6
- **Grid gaps**: gap-6 or gap-4
- **Element spacing**: mb-2, mb-3, mb-4

### Buttons
```tsx
// Primary Button
<button className="btn-primary">
  Action
</button>

// Secondary Button
<button className="btn-secondary">
  Action
</button>

// Custom Primary (if needed)
<button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
  Action
</button>
```

### Cards
```tsx
<div className="card mb-8">
  {/* Content */}
</div>
```

### Input Fields
```tsx
<input
  type="text"
  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
  placeholder="Enter text..."
/>

<textarea
  className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-y"
  placeholder="Enter text..."
/>
```

### Icons
Use Heroicons (included in project):
```tsx
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="..." />
</svg>
```

---

## Code Quality Standards

### TypeScript Requirements
- All files MUST use TypeScript
- Define interfaces for all return types
- Use type annotations for parameters
- No `any` types (use `unknown` if needed)

### React Best Practices
- Use `'use client'` directive for client components
- Use `useCallback` for functions passed as props
- Use `useMemo` for expensive computations
- Implement proper cleanup in `useEffect`

### Memory Management
```typescript
// ALWAYS clean up object URLs
useEffect(() => {
  return () => {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl)
    }
  }
}, [objectUrl])
```

### Error Handling
```typescript
try {
  // Operation
  setOutput(result)
  setError(null)
} catch (err) {
  setError('User-friendly error message')
  setOutput('')
}
```

### File Upload Pattern
```typescript
const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  // Validate file type
  if (!file.type.startsWith('expected/type')) {
    setError('Invalid file type')
    return
  }

  // Validate file size (10MB example)
  if (file.size > 10 * 1024 * 1024) {
    setError('File too large (max 10MB)')
    return
  }

  // Process file
}, [])
```

---

## Testing Requirements

### Unit Tests (REQUIRED)
Location: `tests/unit/hooks/useToolName.test.ts`

```typescript
import { renderHook, act } from '@testing-library/react'
import useToolName from '@/hooks/useToolName'

describe('useToolName', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useToolName())
    expect(result.current.input).toBe('')
  })

  it('should process input correctly', () => {
    const { result } = renderHook(() => useToolName())
    act(() => {
      result.current.setInput('test')
    })
    expect(result.current.output).toBe('expected output')
  })

  // Minimum 5 test cases per tool
})
```

### Integration Tests (REQUIRED)
Location: `tests/integration/tools/tool-name.test.tsx`

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import ToolComponent from '@/components/tools/tool-name'

describe('ToolName Integration', () => {
  it('should render all required sections', () => {
    render(<ToolComponent />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByText(/Frequently Asked Questions/i)).toBeInTheDocument()
  })

  it('should process user input end-to-end', () => {
    render(<ToolComponent />)
    const input = screen.getByPlaceholderText(/enter/i)
    fireEvent.change(input, { target: { value: 'test' } })
    expect(screen.getByText(/expected output/i)).toBeInTheDocument()
  })
})
```

### E2E Tests (REQUIRED for converters)
Location: `tests/e2e/tool-name.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

test.describe('ToolName E2E', () => {
  test('should load and function correctly', async ({ page }) => {
    await page.goto('/tools/tool-slug')
    await expect(page.locator('h1')).toContainText('Tool Name')

    // Test main functionality
    await page.fill('input[type="text"]', 'test input')
    await expect(page.locator('[data-testid="output"]')).toContainText('expected')
  })
})
```

---

## Registration & Deployment

### 1. Register in tools-index.ts

File: `src/data/tools-index.ts`

Add entry in alphabetical order:
```typescript
'tool-slug': {
  name: 'Tool Name',
  category: 'category-name',
  description: 'Tool description (max 120 chars)'
},
```

### 2. Category Determination

Available categories:
- `text-tools` - Text manipulation, formatting, analysis
- `converters` - File format conversions
- `image-tools` - Image editing, optimization
- `calculators` - Math, finance, health calculators
- `generators` - QR codes, passwords, data generation
- `validators` - Data validation tools
- `web-tools` - Web development utilities

### 3. Verify Registration

Run after adding to tools-index.ts:
```bash
# Verify tool is registered
grep "tool-slug" src/data/tools-index.ts

# Check for duplicates
cat src/data/tools-index.ts | grep "tool-slug" | wc -l  # Should be 1
```

---

## Examples & Templates

### Reference Implementations

**Simple Tool Example:**
- File: `src/components/tools/base64-encoder.tsx`
- Pattern: Input → Process → Output
- Features: Mode toggle, copy, clear

**Complex Tool Example:**
- File: `src/components/tools/string-obfuscator.tsx`
- Pattern: Multiple methods, customization
- Features: Method selector, config options, bidirectional

**Canvas-Based Tool:**
- File: `src/components/tools/text-to-handwriting.tsx`
- Pattern: Canvas rendering, download
- Features: Live preview, customization, export

---

## Checklist Before Submission

- [ ] All 3 files created (page.tsx, component.tsx, hook.ts)
- [ ] Schema markup included (SoftwareApplication + FAQPage)
- [ ] All 7 required sections present
- [ ] Tool registered in tools-index.ts
- [ ] Unit tests written (minimum 5 test cases)
- [ ] Integration tests written
- [ ] E2E tests written (for converters)
- [ ] TypeScript with no errors
- [ ] No console.log statements
- [ ] Error handling implemented
- [ ] File size limits validated
- [ ] Memory cleanup implemented
- [ ] Privacy statement in description
- [ ] Related tools section populated

---

## Common Mistakes to Avoid

1. **Missing 'use client' directive** - All tool components are client-side
2. **Forgetting Schema Markup** - Both SoftwareApplication AND FAQPage required
3. **Not revoking object URLs** - Causes memory leaks
4. **Using any type** - Use proper TypeScript types
5. **Skipping tests** - Tests are MANDATORY
6. **Wrong category in tools-index.ts** - Choose appropriate category
7. **Missing privacy statement** - Always include "100% free and private"
8. **Hardcoded colors** - Use Tailwind classes
9. **Not validating file uploads** - Check type AND size
10. **Missing FAQ escaping** - Use &apos; not '

---

## Additional Resources

- **Editor Standards**: `/docs/EDITOR_QUALITY_STANDARDS.md`
- **Pattern Examples**: `/docs/PATTERN_EXAMPLES.md`
- **Architecture Guide**: `/docs/ARCHITECTURE-WAVE-14-TOOLS.md`
- **Existing Tools**: `/src/app/tools/` - Browse for examples
- **Testing Guide**: `/docs/testing/` - Testing documentation

---

**Remember:** Every tool MUST meet ALL requirements in this document. No exceptions.

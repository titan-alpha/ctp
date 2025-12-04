# ConveniencePro CTP Migration Plan
## Complete Strategy for Migrating 388 Tools

**Date:** 2025-12-03
**Status:** Phase 1 Complete (10/388 tools migrated)
**Remaining:** 378 tools

---

## Executive Summary

This document outlines the comprehensive strategy for migrating all 388 browser-native tools from the current UnifiedTool format to the ConveniencePro Tool Protocol (CTP) standard. The migration will enable:

- **API access** for all tools via REST endpoints
- **AI integration** via Model Context Protocol (MCP) manifests
- **SDK embedding** for external websites
- **Auto-generated documentation** (OpenAPI, interactive docs)
- **Consistent architecture** across web UI, API, and external integrations

All tools maintain 100% browser-native execution - no server-side data processing.

---

## Current Infrastructure Analysis

### Tool Inventory

| Category | Count | Percentage | Complexity |
|----------|-------|------------|------------|
| **Calculators** | 86 | 22.2% | Medium |
| **Text Tools** | 81 | 20.9% | Low-Medium |
| **Converters** | 69 | 17.8% | Medium-High |
| **Generators** | 47 | 12.1% | Medium |
| **Image Tools** | 42 | 10.8% | High |
| **AI Tools** | 36 | 9.3% | Medium-High |
| **Analyzers** | 10 | 2.6% | Medium |
| **PDF Tools** | 9 | 2.3% | High |
| **TOTAL** | **388** | **100%** | - |

### Implementation Structure

Each tool currently consists of:

1. **Tool Definition** (`src/data/tools/*.ts`) - Metadata, keywords, job roles
2. **Custom Hook** (`src/hooks/use*.ts`) - Business logic, state management
3. **Tool Component** (`src/components/tools/*.tsx`) - UI implementation
4. **Tool Page** (`src/app/tools/*/page.tsx`) - Next.js page wrapper

**Current Counts:**
- 388 tool definitions
- 429 custom hooks
- 406 tool components
- 336 tool pages

**CTP Migration Progress:**
- 10 tools in CTP registry (`tools-registry-ctp.ts`)
- 1 CTP implementation (`src/tools/base64-encoder.ts`)
- 1 CTP hook (`src/hooks/useBase64Ctp.ts`)

---

## Tool Complexity Classification

### Tier 1: Simple (Low Complexity) - ~80 tools
**Browser APIs:** Text manipulation, simple calculations, encoding/decoding

**Examples:**
- base64-encoder, url-encoder, hash-generator
- case-converter, character-counter, word-counter
- uuid-generator, password-generator
- json-formatter, json-validator, yaml-validator
- hex-to-rgba, rgb-to-hex

**Implementation:**
- Pure JavaScript/TypeScript functions
- Browser Web APIs only (btoa, atob, crypto.subtle)
- No external dependencies
- Execution time: <100ms

**Migration Time:** 15-30 minutes per tool

### Tier 2: Medium (Moderate Complexity) - ~180 tools
**Algorithms:** Calculations, data transformations, pattern matching

**Examples:**
- All calculator tools (BMI, loan, mortgage, compound interest)
- Generators (QR code, barcode, color palette, dummy data)
- Text analyzers (reading time, keyword density, headline analyzer)
- CSV/JSON converters, data formatters
- Regular expression tools

**Implementation:**
- Algorithm-based logic
- May use lightweight libraries (qrcode, bwip-js for barcodes)
- Multiple input parameters
- Complex validation logic

**Migration Time:** 30-60 minutes per tool

### Tier 3: Complex (High Complexity) - ~100 tools
**Heavy Processing:** Image/audio manipulation, format conversions

**Examples:**
- Image converters (PNG, JPG, WebP, AVIF transformations)
- Image adjusters (brightness, contrast, saturation, filters)
- Audio converters (MP3, WAV, AAC, OGG)
- Audio processors (trim, fade, merge, normalize)
- Markdown processors, syntax highlighters
- AI tools (prompt analyzer, token counter using tiktoken)

**Implementation:**
- Canvas API for image processing
- Web Audio API for audio
- FFmpeg.wasm for format conversions
- Transformer.js for AI features
- Complex state management

**Migration Time:** 1-2 hours per tool

### Tier 4: Very Complex (IDE-Level) - ~28 tools
**Full Applications:** Complete editing environments

**Examples:**
- Video Editor IDE (timeline, tracks, effects)
- Image Editor IDE (layers, tools, filters)
- Audio DAW IDE (multitrack, effects, mixing)
- Presentation Editor (slides, animations, templates)
- Diagram Editor (flowcharts, shapes, connectors)
- Form Builder (drag-drop, validation, preview)
- Email Template Editor (MJML, visual design)
- 3D Model Viewer (Three.js, camera controls)
- LaTeX Editor (live preview, math rendering)

**Implementation:**
- Complex state machines
- Canvas/WebGL rendering
- Real-time preview systems
- Undo/redo stacks
- Export to multiple formats
- Heavy use of external libraries

**Migration Time:** 3-8 hours per tool

---

## Migration Architecture

### CTP Tool Implementation Pattern

```typescript
// 1. Tool Definition (tools-registry-ctp.ts)
{
  id: 'tool-name',
  name: 'Tool Display Name',
  description: 'Tool description...',
  category: 'category-name',
  tags: ['tag1', 'tag2'],
  method: 'POST' | 'GET',
  parameters: [...],
  outputDescription: '...',
  example: { input: {...}, output: {...} },
  executionMode: 'client',
  icon: '🔧',
  hasApi: true,
  isEmbeddable: true,
  hasAiSupport: true
}

// 2. Tool Implementation (src/tools/tool-name.ts)
import { success, failure } from '@conveniencepro/ctp-core'
import type { ToolResult } from '@conveniencepro/ctp-core'

export function toolNameTool(params: Params): ToolResult<Result> {
  // Validation
  if (!params.required) {
    return failure('Error message', 'ERROR_CODE')
  }

  try {
    // Browser-native execution
    const result = executeLogic(params)

    return success<Result>({
      result,
      metadata: {...}
    })
  } catch (error) {
    return failure('Execution failed', 'EXECUTION_ERROR')
  }
}

// 3. React Hook (src/hooks/useToolNameCtp.ts)
import { useToolExecution } from '@/hooks/useToolExecution'
import toolNameTool from '@/tools/tool-name'

export function useToolNameCtp() {
  return useToolExecution(toolNameTool, {
    // initial params
  }, {
    autoExecute: true,
    debounceMs: 300
  })
}

// 4. API Registration (src/app/api/tools/[toolId]/route.ts)
const TOOL_IMPLEMENTATIONS: Record<string, Function> = {
  'tool-name': toolNameTool,
  // ... other tools
}
```

### Key Design Principles

1. **Single Source of Truth:** `tools-registry-ctp.ts` drives everything
2. **Browser-Native:** All execution uses Web APIs (no server processing)
3. **Type Safety:** Full TypeScript types throughout
4. **Error Handling:** CTP error format with codes
5. **Backward Compatibility:** Existing UI components continue to work
6. **Progressive Enhancement:** Tools gain API/AI capabilities without UI changes

---

## Migration Phases

### Phase 1: Foundation ✅ COMPLETE
**Status:** Completed 2025-12-03
**Tools:** 10 (2.6%)

**Achievements:**
- ✅ Installed CTP packages
- ✅ Created `tools-registry-ctp.ts` with 10 tools
- ✅ Implemented first CTP tool (base64-encoder)
- ✅ Created generic `useToolExecution` hook
- ✅ Built API endpoints (`/api/tools`, `/api/tools/[toolId]`)
- ✅ Generated OpenAPI specification
- ✅ Generated MCP manifest
- ✅ Tested all endpoints successfully

**Tools Migrated:**
1. base64-encoder
2. url-encoder
3. hash-generator
4. json-formatter
5. uuid-generator
6. case-converter
7. lorem-ipsum-generator
8. markdown-preview
9. color-picker
10. regex-tester

### Phase 2: Simple Text Tools (Tier 1)
**Target:** 70 additional tools (80 total, 20.6%)
**Timeline:** 2-3 weeks
**Priority:** HIGH

**Tools to Migrate:**
- All remaining encoding/decoding tools (15 tools)
  - binary-converter, hex-encoder, morse-code, ascii-converter
  - html-encoder, xml-encoder, csv-escape
- Text transformation tools (25 tools)
  - character-counter, word-counter, line-counter
  - duplicate-remover, find-replace, text-cleaner
  - whitespace-remover, line-sorter, reverse-text
  - text-to-binary, text-to-hex, text-diff
- Hash & crypto tools (10 tools)
  - md5-generator, sha1-generator, sha256-generator
  - hmac-generator, bcrypt-hash-generator
- JSON/YAML/XML tools (15 tools)
  - json-validator, json-minifier, json-beautifier
  - yaml-validator, yaml-to-json, json-to-yaml
  - xml-validator, xml-formatter, xml-to-json
- Other simple tools (5 tools)
  - slugify, random-number, dice-roller

**Implementation Strategy:**
- Group by similarity (all encoders together, all validators together)
- Create template generators for common patterns
- Implement in batches of 10
- Test batch before moving to next

### Phase 3: Generators & Basic Calculators (Tier 2a)
**Target:** 60 additional tools (140 total, 36.1%)
**Timeline:** 3-4 weeks
**Priority:** HIGH

**Tools to Migrate:**
- Generator tools (30 tools)
  - password-generator, api-key-generator, jwt-generator
  - qr-code-generator, barcode-generator
  - gradient-generator, pattern-generator
  - fake-data-generator, lorem-ipsum-advanced
  - color-palette-generator, username-generator
- Basic calculators (30 tools)
  - percentage-calculator, tip-calculator
  - unit-converter, temperature-converter
  - age-calculator, date-calculator, time-calculator
  - discount-calculator, sales-tax-calculator

**Implementation Strategy:**
- Leverage existing generator patterns
- Share common components (QR code, barcode libraries)
- Batch calculators by domain (financial, time/date, unit conversions)

### Phase 4: Advanced Calculators (Tier 2b)
**Target:** 60 additional tools (200 total, 51.5%)
**Timeline:** 3-4 weeks
**Priority:** MEDIUM-HIGH

**Tools to Migrate:**
- Financial calculators (40 tools)
  - loan-calculator, mortgage-calculator, auto-loan
  - compound-interest, amortization, apr-calculator
  - investment-calculator, roi-calculator
  - retirement-calculator, 401k-calculator
  - inflation-calculator, net-worth
- Health/fitness calculators (20 tools)
  - bmi-calculator, bmr-calculator, tdee-calculator
  - calorie-calculator, macro-calculator, protein-calculator
  - body-fat-calculator, ideal-weight
  - pregnancy-calculator, due-date, fertility

**Implementation Strategy:**
- Create shared financial calculation library
- Standardize input/output formats
- Implement formula validation

### Phase 5: Analyzers & Medium Complexity Text Tools (Tier 2c)
**Target:** 40 additional tools (240 total, 61.9%)
**Timeline:** 2-3 weeks
**Priority:** MEDIUM

**Tools to Migrate:**
- Text analyzers (20 tools)
  - reading-time-calculator, readability-score
  - keyword-density, word-frequency
  - sentiment-analyzer, grammar-checker
  - plagiarism-detector, text-summarizer
- Code analyzers (10 tools)
  - json-diff, json-path-evaluator
  - regex-tester-advanced, cron-expression
  - sql-formatter, html-minifier
- Other analyzers (10 tools)
  - seo-analyzer, meta-tag-analyzer
  - open-graph-validator, robots-txt

**Implementation Strategy:**
- Leverage existing NLP libraries where needed
- Create shared analysis utilities
- Implement caching for expensive operations

### Phase 6: AI Tools (Tier 2-3)
**Target:** 26 additional tools (266 total, 68.6%)
**Timeline:** 3-4 weeks
**Priority:** MEDIUM

**Tools to Migrate:**
- AI utility tools (26 tools remaining)
  - prompt-analyzer, token-counter (using tiktoken)
  - ai-cost-calculator, batch-cost-estimator
  - few-shot-manager, prompt-template-library
  - system-prompt-builder, context-manager
  - All remaining AI tools from ai-tools.ts

**Implementation Strategy:**
- Integrate transformers.js for browser-based AI
- Use tiktoken for token counting
- Create shared AI utilities module
- Handle async operations properly

### Phase 7: Simple Image & Audio Tools (Tier 2-3)
**Target:** 40 additional tools (306 total, 78.9%)
**Timeline:** 4-5 weeks
**Priority:** MEDIUM

**Tools to Migrate:**
- Simple image tools (25 tools)
  - image-resizer, image-compressor, image-cropper
  - image-rotator, image-flipper
  - brightness-adjuster, contrast-adjuster, saturation
  - blur-filter, sharpen-filter, grayscale
- Audio tools (15 tools)
  - audio-trimmer, audio-merger, audio-fade
  - audio-normalizer, volume-adjuster
  - pitch-shifter, speed-changer

**Implementation Strategy:**
- Use Canvas API for image processing
- Use Web Audio API for audio
- Create shared image/audio utility libraries
- Implement worker threads for heavy processing

### Phase 8: Format Converters (Tier 3)
**Target:** 50 additional tools (356 total, 91.8%)
**Timeline:** 5-6 weeks
**Priority:** LOW-MEDIUM

**Tools to Migrate:**
- Image converters (25 tools)
  - All PNG/JPG/WebP/AVIF/GIF conversions
  - SVG to PNG, ICO to PNG, TIFF conversions
- Audio converters (15 tools)
  - MP3/WAV/AAC/OGG/FLAC conversions
  - Sample rate conversions, bit depth
- Video converters (10 tools)
  - Basic video format conversions
  - GIF to MP4, video trimming

**Implementation Strategy:**
- Integrate FFmpeg.wasm for format conversions
- Handle large files with chunking
- Implement progress tracking
- Add quality/size options

### Phase 9: PDF Tools (Tier 3)
**Target:** 9 additional tools (365 total, 94.1%)
**Timeline:** 2-3 weeks
**Priority:** LOW-MEDIUM

**Tools to Migrate:**
- pdf-merger, pdf-splitter
- pdf-compressor, pdf-to-image
- image-to-pdf, pdf-to-text
- pdf-watermark, pdf-encryptor
- pdf-page-remover

**Implementation Strategy:**
- Use pdf-lib for PDF manipulation
- Use pdfjs for rendering
- Handle large PDFs efficiently

### Phase 10: Complex IDE Tools (Tier 4)
**Target:** 23 additional tools (388 total, 100%)
**Timeline:** 8-10 weeks
**Priority:** LOW

**Tools to Migrate:**
- video-editor-ide
- image-editor-ide
- audio-daw-ide
- presentation-editor
- diagram-editor
- form-builder
- email-template-editor
- subtitle-editor
- gif-editor
- 3d-model-viewer
- latex-editor
- code-playground
- spreadsheet-editor
- chart-builder
- animation-editor
- svg-editor-advanced
- icon-editor
- logo-maker
- infographic-designer
- meme-generator-advanced
- screenshot-annotator
- screen-recorder
- whiteboard-collaborative

**Implementation Strategy:**
- Each tool is a mini-application
- Requires dedicated focus per tool
- May need architecture discussions
- Consider separating UI from core logic
- Implement comprehensive testing
- Document extensively

---

## Automation Strategy

### Code Generation Scripts

#### 1. Registry Entry Generator
```bash
# Generate CTP registry entry from existing Tool definition
node scripts/generate-ctp-registry-entry.js <tool-id>
```

**Output:**
- Converts UnifiedTool → ExtendedToolDefinition
- Maps UI field types to CTP parameter types
- Generates example input/output
- Adds hasApi, isEmbeddable, hasAiSupport flags

#### 2. Tool Implementation Generator
```bash
# Generate CTP tool implementation skeleton
node scripts/generate-ctp-tool.js <tool-id>
```

**Output:**
- Creates `src/tools/<tool-id>.ts` with TypeScript types
- Includes parameter validation
- Adds success/failure handling
- Imports necessary dependencies

#### 3. Hook Generator
```bash
# Generate CTP-compatible React hook
node scripts/generate-ctp-hook.js <tool-id>
```

**Output:**
- Creates `src/hooks/use<ToolName>Ctp.ts`
- Wraps tool function with useToolExecution
- Maintains existing hook interface for compatibility
- Adds clipboard copy functionality

#### 4. Batch Migration Script
```bash
# Migrate multiple tools at once
node scripts/batch-migrate-ctp.js --category=text-tools --tier=1 --limit=10
```

**Features:**
- Filter by category, tier, complexity
- Generate all files for multiple tools
- Update TOOL_IMPLEMENTATIONS registry automatically
- Run validation checks
- Generate migration report

### Migration Validation

#### Automated Tests
```bash
# Test CTP tool implementation
npm run test:ctp <tool-id>
```

**Checks:**
- Parameter validation works
- Success/failure cases handled
- Output matches schema
- Error codes are correct
- Performance benchmarks met

#### API Testing
```bash
# Test API endpoint
npm run test:api <tool-id>
```

**Checks:**
- GET/POST methods work
- Query params parsed correctly
- JSON body parsed correctly
- CORS headers present
- Response matches OpenAPI spec

#### Integration Testing
```bash
# Test full integration (UI → Hook → Tool → API)
npm run test:integration <tool-id>
```

**Checks:**
- Existing UI component still works
- Hook returns expected results
- API endpoint accessible
- MCP manifest includes tool
- OpenAPI spec updated

---

## Migration Workflow

### Per-Tool Checklist

**1. Preparation (5 mins)**
- [ ] Read existing tool definition in `data/tools/*.ts`
- [ ] Review existing hook in `src/hooks/use*.ts`
- [ ] Identify browser APIs needed
- [ ] Check for external dependencies
- [ ] Classify complexity tier

**2. CTP Registry Entry (10 mins)**
- [ ] Create entry in `tools-registry-ctp.ts`
- [ ] Define parameters with types
- [ ] Add input/output examples
- [ ] Set flags (hasApi, isEmbeddable, hasAiSupport)
- [ ] Add icon and embed config

**3. Tool Implementation (15-180 mins depending on tier)**
- [ ] Create `src/tools/<tool-id>.ts`
- [ ] Import CTP types
- [ ] Define parameter interfaces
- [ ] Define result interfaces
- [ ] Implement validation logic
- [ ] Implement core algorithm
- [ ] Return success with metadata
- [ ] Handle errors with failure
- [ ] Add JSDoc comments
- [ ] Test manually in Node

**4. React Hook (10 mins)**
- [ ] Create `src/hooks/use<ToolName>Ctp.ts`
- [ ] Import useToolExecution
- [ ] Import tool function
- [ ] Configure auto-execute, debounce
- [ ] Maintain existing interface
- [ ] Test in UI component

**5. API Registration (5 mins)**
- [ ] Add to TOOL_IMPLEMENTATIONS in `route.ts`
- [ ] Test GET endpoint
- [ ] Test POST endpoint
- [ ] Verify CORS headers

**6. Documentation (10 mins)**
- [ ] Tool auto-documented via OpenAPI
- [ ] Tool auto-included in MCP manifest
- [ ] Add usage examples if complex
- [ ] Update migration tracking

**7. Testing & Validation (10 mins)**
- [ ] Run automated tests
- [ ] Test via web UI
- [ ] Test via API (curl/Postman)
- [ ] Test error handling
- [ ] Verify performance acceptable

**8. Commit (2 mins)**
- [ ] Git add all files
- [ ] Git commit with message format:
  ```
  feat(ctp): Migrate <tool-name> to CTP

  - Add CTP registry entry
  - Implement <tool-id> tool function
  - Create use<ToolName>Ctp hook
  - Register in API implementations
  - Tier X complexity
  ```

### Batch Workflow

For batches of 10 similar tools:

**1. Planning (30 mins)**
- Group similar tools
- Identify shared patterns
- Create reusable utilities
- Plan execution order

**2. Implementation (varies by tier)**
- Implement tools one by one
- Reuse patterns across batch
- Commit after each tool or after batch

**3. Batch Testing (30 mins)**
- Test all tools in batch
- Verify API endpoints
- Check OpenAPI spec
- Validate MCP manifest

**4. Documentation (15 mins)**
- Update migration tracker
- Note any issues/learnings
- Document new patterns

---

## Success Metrics

### Per Phase
- **Completion Rate:** Tools migrated / Total tools in phase
- **Quality Score:** Tests passing / Total tests
- **Performance:** Average execution time < 2x original
- **API Reliability:** 99.9% success rate
- **Type Safety:** 100% TypeScript coverage

### Overall Project
- **Migration Progress:** 388 tools total
  - Phase 1: 10 tools (2.6%) ✅
  - Target by Phase 5: 240 tools (61.9%)
  - Target by Phase 9: 365 tools (94.1%)
  - Target by Phase 10: 388 tools (100%)

- **API Coverage:** All migrated tools accessible via API
- **AI Integration:** All tools discoverable via MCP
- **SDK Readiness:** All tools embeddable externally
- **Documentation:** 100% auto-generated from registry

---

## Risk Mitigation

### Technical Risks

**Risk: Complex tools may not fit CTP pattern**
- Mitigation: Extend CTP types as needed
- Fallback: Keep complex tools in hybrid mode
- Example: Video editor may need streaming responses

**Risk: Performance degradation**
- Mitigation: Benchmark each tool during migration
- Target: < 2x performance overhead
- Solution: Optimize hot paths, use workers

**Risk: Breaking existing UI**
- Mitigation: Maintain backward compatibility
- Strategy: Wrapper hooks preserve interfaces
- Testing: Integration tests catch regressions

### Process Risks

**Risk: Migration fatigue (388 tools is a lot)**
- Mitigation: Automate as much as possible
- Break into manageable phases
- Celebrate milestones (every 50 tools)

**Risk: Scope creep (improving while migrating)**
- Mitigation: Pure migration first, improvements later
- Rule: No feature additions during migration
- Focus: Match existing functionality exactly

**Risk: Quality issues in bulk migration**
- Mitigation: Batch testing after every 10 tools
- Automated validation catches errors
- Manual spot checks on random samples

---

## Timeline Estimates

| Phase | Tools | Duration | Cumulative | Progress |
|-------|-------|----------|------------|----------|
| 1 | 10 | ✅ Complete | 10 | 2.6% |
| 2 | 70 | 2-3 weeks | 80 | 20.6% |
| 3 | 60 | 3-4 weeks | 140 | 36.1% |
| 4 | 60 | 3-4 weeks | 200 | 51.5% |
| 5 | 40 | 2-3 weeks | 240 | 61.9% |
| 6 | 26 | 3-4 weeks | 266 | 68.6% |
| 7 | 40 | 4-5 weeks | 306 | 78.9% |
| 8 | 50 | 5-6 weeks | 356 | 91.8% |
| 9 | 9 | 2-3 weeks | 365 | 94.1% |
| 10 | 23 | 8-10 weeks | 388 | 100% |

**Total Estimated Duration:** 33-47 weeks (7.5-11 months)

**With Automation & Parallelization:** 20-30 weeks (5-7 months)

**Accelerated Timeline (2-3 developers):** 12-20 weeks (3-5 months)

---

## Resource Requirements

### Developer Time

**Solo Developer:**
- Average 45 mins per Tier 1 tool
- Average 1.5 hours per Tier 2 tool
- Average 3 hours per Tier 3 tool
- Average 6 hours per Tier 4 tool

**With Automation:**
- Reduce Tier 1 to 30 mins
- Reduce Tier 2 to 1 hour
- Reduce Tier 3 to 2 hours
- Tier 4 remains 6 hours (too complex to automate)

### Infrastructure

**Development:**
- Local development environment (current)
- Staging environment for API testing
- CI/CD pipeline for automated testing

**Testing:**
- Unit tests for tool functions
- Integration tests for API endpoints
- E2E tests for critical workflows

---

## Next Steps

### Immediate (Week 1)
1. ✅ Complete Phase 1 (DONE)
2. Create automation scripts
   - Registry entry generator
   - Tool implementation generator
   - Hook generator
   - Batch migration script
3. Set up CI/CD pipeline for CTP tools
4. Create migration tracking dashboard

### Short-term (Weeks 2-4)
1. Start Phase 2: Simple text tools
2. Implement first batch of 10 tools
3. Test automation scripts
4. Refine migration workflow
5. Document patterns and learnings

### Medium-term (Months 2-4)
1. Complete Phases 2-5 (240 tools total)
2. Establish migration rhythm
3. Parallel work on automation improvements
4. Regular progress reviews

### Long-term (Months 5-7)
1. Complete Phases 6-10 (all 388 tools)
2. Comprehensive testing and validation
3. Performance optimization
4. Documentation finalization
5. Production deployment

---

## Appendix

### Tool Complexity Decision Tree

```
Is it pure text transformation?
├─ Yes → Is it < 50 lines of logic?
│  ├─ Yes → Tier 1 (Simple)
│  └─ No → Tier 2 (Medium)
└─ No → Does it use Canvas/Audio/Video APIs?
   ├─ Yes → Is it a full editor?
   │  ├─ Yes → Tier 4 (Very Complex)
   │  └─ No → Tier 3 (Complex)
   └─ No → Does it have > 5 parameters?
      ├─ Yes → Tier 2 (Medium)
      └─ No → Tier 1 (Simple)
```

### CTP Registry Template

```typescript
{
  id: 'tool-id',
  name: 'Tool Name',
  description: 'Brief description...',
  category: 'category-name',
  tags: ['tag1', 'tag2', 'tag3'],
  method: 'POST',
  parameters: [
    {
      name: 'paramName',
      type: 'text' | 'textarea' | 'number' | 'boolean' | 'select',
      label: 'Display Label',
      description: 'Parameter description',
      required: true | false,
      default: 'default value',
      placeholder: 'placeholder text',
      options: [{ value: 'val', label: 'Label' }] // for select
    }
  ],
  outputDescription: 'What the tool returns',
  example: {
    input: { paramName: 'example value' },
    output: { success: true, result: 'example output' }
  },
  executionMode: 'client',
  icon: '🔧',
  embedUrl: '/embed/tool-id',
  hasApi: true,
  isEmbeddable: true,
  hasAiSupport: true,
  embed: {
    minHeight: 300,
    defaultWidth: 600,
    defaultHeight: 400,
    supportsAutoResize: true
  }
}
```

---

**Document Version:** 1.0
**Last Updated:** 2025-12-03
**Next Review:** After Phase 2 completion

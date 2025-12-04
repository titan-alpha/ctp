# MCP Artifact Architecture

> Making ConveniencePro tools accessible to LLMs through the Model Context Protocol

## Executive Summary

This document describes an architecture for exposing ConveniencePro's 290+ utility tools to Large Language Models (LLMs) via the Model Context Protocol (MCP). Rather than traditional server-side tool execution, we leverage a novel **"Tool as Artifact"** pattern where LLMs fetch self-contained tool bundles and render them directly in their UI (Claude Artifacts, ChatGPT Canvas, etc.).

**Key insight**: LLMs already render interactive HTML/CSS/JS in sandboxed environments. We can deliver production-tested tools as portable micro-apps, eliminating hallucinated implementations while preserving client-side privacy.

---

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Solution Overview](#solution-overview)
3. [Architecture](#architecture)
4. [Technical Specification](#technical-specification)
5. [Bundle Format](#bundle-format)
6. [MCP Server API](#mcp-server-api)
7. [Tool Stratification](#tool-stratification)
8. [Build Pipeline](#build-pipeline)
9. [Security Considerations](#security-considerations)
10. [Rollout Strategy](#rollout-strategy)
11. [Future Considerations](#future-considerations)

---

## Problem Statement

### The Current Landscape

When users ask LLMs for help with utility tasks (converting text cases, merging PDFs, calculating loan payments), the LLM typically:

1. **Generates ad-hoc code** - Often buggy, untested, or incomplete
2. **Describes manual steps** - Sends users elsewhere
3. **Hallucinates solutions** - Confidently wrong implementations

### ConveniencePro's Position

ConveniencePro offers 290+ production-tested, privacy-first utility tools. These tools:

- Run entirely client-side (no server uploads)
- Are battle-tested with real users
- Cover text, calculators, file processing, generators, and advanced editors

### The Gap

There's no standard way for LLMs to:
1. **Discover** that these tools exist
2. **Deliver** these tools to users
3. **Ensure** users get working implementations

### Why Traditional MCP Doesn't Fit

Standard MCP tools are server-executed:

```
LLM → MCP Server → Execute tool → Return result
```

This model doesn't work for ConveniencePro because:

- **Privacy**: File-based tools would require server uploads
- **Complexity**: Interactive UIs can't be reduced to input→output
- **Scale**: Porting 290+ tools to server execution is prohibitive

---

## Solution Overview

### The "Tool as Artifact" Pattern

Instead of executing tools server-side, we deliver tool source code for client-side rendering:

```
┌─────────────────────────────────────────────────────────────────┐
│  1. User asks LLM for help with a task                          │
│     "I need to convert this text to camelCase"                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  2. LLM queries ConveniencePro MCP registry                     │
│     GET /tools/search?q=convert+text+camelCase                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  3. Registry returns matching tool with bundle URL              │
│     { id: "case-converter", bundleUrl: "/.../bundle.html" }     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  4. LLM fetches bundle and renders as artifact                  │
│     ┌─────────────────────────────────────────────────────┐     │
│     │  Case Converter                                     │     │
│     │  [Enter text...                                ]    │     │
│     │  [UPPER] [lower] [Title] [camelCase] [snake_case]   │     │
│     │  Result: ...                                        │     │
│     └─────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  5. User interacts with tool directly in chat interface         │
│     All processing happens client-side in browser sandbox       │
└─────────────────────────────────────────────────────────────────┘
```

### Why This Works

| Advantage | Explanation |
|-----------|-------------|
| **Works today** | Claude Artifacts, ChatGPT Canvas already support interactive HTML |
| **No hallucination** | LLM delivers tested code, not generated guesses |
| **Privacy preserved** | Runs in browser sandbox; files never leave device |
| **No server compute** | Just static file hosting for bundles |
| **Guaranteed functional** | Production-tested tools, not ad-hoc implementations |
| **LLM can adapt** | Can modify code for edge cases if needed |

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        LLM Clients                              │
│         (Claude, ChatGPT, custom agents, IDEs)                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ MCP Protocol (Streamable HTTP)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    MCP Server                                   │
│                 mcp.conveniencepro.cc                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Discovery  │  │   Search    │  │    Bundle Serving       │  │
│  │   /tools    │  │/tools/search│  │      /bundles/*         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Tool Registry (290+ tools)                 │    │
│  │   Metadata, schemas, categories, semantic embeddings    │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Static files (CDN)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Bundle Storage                               │
│              Self-contained HTML tool bundles                   │
│                                                                 │
│   case-converter.html  │  pdf-merger.html  │  bmi-calculator.html
│   hash-generator.html  │  qr-generator.html │  json-formatter.html
│   ...                                                           │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility |
|-----------|----------------|
| **MCP Server** | Handle MCP protocol, route requests, serve metadata |
| **Tool Registry** | Store tool definitions, categories, search embeddings |
| **Bundle Storage** | Host self-contained HTML bundles (CDN-backed) |
| **Build Pipeline** | Transform React components into standalone bundles |

---

## Technical Specification

### Tool Definition Schema

Each tool in the registry follows this schema:

```typescript
interface ToolDefinition {
  // Identity
  id: string;                    // Unique identifier (kebab-case)
  name: string;                  // Human-readable name
  description: string;           // What the tool does (for LLM understanding)

  // Classification
  category: ToolCategory;        // Primary category
  subcategory?: string;          // Optional subcategory
  keywords: string[];            // Search keywords

  // Artifact Configuration
  artifact: {
    bundleUrl: string;           // URL to self-contained HTML
    bundleSize: number;          // Size in bytes
    bundleHash: string;          // SHA-256 for integrity
    dependencies: string[];      // External CDN scripts (if any)
    capabilities: Capability[];  // Required browser APIs
  };

  // For traditional MCP compatibility (optional)
  inputSchema?: JSONSchema7;     // JSON Schema for inputs
  outputSchema?: JSONSchema7;    // JSON Schema for outputs

  // Usage guidance
  usage: {
    instructions: string;        // How to use the tool
    sampleInput?: string;        // Example input
    limitations?: string[];      // Known limitations
  };

  // Metadata
  version: string;               // Semantic version
  lastUpdated: string;           // ISO 8601 date
  tier: ToolTier;                // Complexity tier (see stratification)
}

type ToolCategory =
  | 'text'
  | 'calculators'
  | 'converters'
  | 'generators'
  | 'image'
  | 'pdf'
  | 'audio'
  | 'video'
  | 'editors'
  | 'analyzers';

type Capability =
  | 'clipboard'                  // navigator.clipboard API
  | 'file-input'                 // File input elements
  | 'file-download'              // Blob download
  | 'canvas'                     // Canvas API
  | 'web-audio'                  // Web Audio API
  | 'webgl'                      // WebGL for 3D
  | 'wasm';                      // WebAssembly

type ToolTier = 1 | 2 | 3 | 4;   // See Tool Stratification section
```

### Example Tool Definitions

**Tier 1 - Simple Text Tool:**

```json
{
  "id": "case-converter",
  "name": "Case Converter",
  "description": "Convert text between uppercase, lowercase, title case, camelCase, snake_case, kebab-case, PascalCase, CONSTANT_CASE, and sentence case",
  "category": "text",
  "keywords": ["case", "text", "convert", "uppercase", "lowercase", "camel", "snake", "kebab", "pascal", "title"],
  "artifact": {
    "bundleUrl": "https://mcp.conveniencepro.cc/bundles/case-converter.html",
    "bundleSize": 4200,
    "bundleHash": "sha256-abc123...",
    "dependencies": [],
    "capabilities": ["clipboard"]
  },
  "usage": {
    "instructions": "Enter or paste text in the input area, then click any conversion button to transform it. Click 'Copy' to copy the result.",
    "sampleInput": "hello world example"
  },
  "version": "1.0.0",
  "lastUpdated": "2025-11-30",
  "tier": 1
}
```

**Tier 3 - File Processing Tool:**

```json
{
  "id": "pdf-merger",
  "name": "PDF Merger",
  "description": "Combine multiple PDF files into a single document. Drag and drop to reorder pages before merging.",
  "category": "pdf",
  "keywords": ["pdf", "merge", "combine", "join", "concatenate", "document"],
  "artifact": {
    "bundleUrl": "https://mcp.conveniencepro.cc/bundles/pdf-merger.html",
    "bundleSize": 45000,
    "bundleHash": "sha256-def456...",
    "dependencies": [
      "https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js"
    ],
    "capabilities": ["file-input", "file-download"]
  },
  "usage": {
    "instructions": "Drop or select multiple PDF files, drag to reorder them, then click 'Merge PDFs' to combine into a single document.",
    "limitations": [
      "Maximum 50 files per merge",
      "Maximum 100MB total size",
      "Encrypted PDFs must be unlocked first"
    ]
  },
  "version": "1.2.0",
  "lastUpdated": "2025-11-30",
  "tier": 3
}
```

---

## Bundle Format

### Requirements

Each bundle must be a **self-contained HTML file** that:

1. Works without any server communication
2. Includes all CSS inline
3. Includes all JavaScript inline (or references CDN for large deps)
4. Functions in sandboxed iframe environments
5. Supports dark mode (most LLM UIs are dark)
6. Is responsive (artifact widths vary)

### Template Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{Tool Name} - ConveniencePro</title>

  <!-- External dependencies (if any) -->
  <script src="https://cdn.example.com/library.min.js"></script>

  <style>
    /* CSS Custom Properties for theming */
    :root {
      --cp-bg: #0a0a0a;
      --cp-surface: #1a1a1a;
      --cp-surface-hover: #252525;
      --cp-border: #333;
      --cp-text: #fafafa;
      --cp-text-muted: #888;
      --cp-primary: #3b82f6;
      --cp-primary-hover: #2563eb;
      --cp-success: #22c55e;
      --cp-error: #ef4444;
      --cp-radius: 8px;
      --cp-font: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    /* Reset */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    /* Base styles */
    body {
      font-family: var(--cp-font);
      background: var(--cp-bg);
      color: var(--cp-text);
      padding: 16px;
      min-height: 100vh;
      line-height: 1.5;
    }

    /* Component styles... */
  </style>
</head>
<body>
  <div class="cp-container">
    <header class="cp-header">
      <h1>{Tool Name}</h1>
      <p class="cp-description">{Brief description}</p>
    </header>

    <main class="cp-main">
      <!-- Tool UI -->
    </main>

    <footer class="cp-footer">
      <span class="cp-attribution">Powered by ConveniencePro</span>
    </footer>
  </div>

  <script>
    // Tool logic (inline)
    (function() {
      'use strict';

      // Implementation...

    })();
  </script>
</body>
</html>
```

### Styling Guidelines

| Property | Value | Rationale |
|----------|-------|-----------|
| Background | `#0a0a0a` | Matches dark mode UIs |
| Surface | `#1a1a1a` | Subtle elevation |
| Border | `#333` | Visible but not harsh |
| Text | `#fafafa` | High contrast |
| Primary | `#3b82f6` | Accessible blue |
| Border radius | `8px` | Modern, rounded |
| Font | `system-ui` | Native feel |
| Padding | `16px` | Comfortable spacing |

### Size Guidelines

| Tier | Target Size | Max Size |
|------|-------------|----------|
| 1 | < 5KB | 10KB |
| 2 | < 20KB | 50KB |
| 3 | < 50KB | 100KB |
| 4 | < 100KB | 200KB* |

*Tier 4 tools may exceed limits; provide lite versions or URL fallback.

---

## MCP Server API

### Base URL

```
https://mcp.conveniencepro.cc
```

### Endpoints

#### List All Tools

```http
GET /tools
```

**Response:**

```json
{
  "tools": [
    {
      "id": "case-converter",
      "name": "Case Converter",
      "description": "Convert text between cases...",
      "category": "text",
      "tier": 1,
      "artifact": {
        "bundleUrl": "https://mcp.conveniencepro.cc/bundles/case-converter.html",
        "bundleSize": 4200
      }
    }
    // ... more tools
  ],
  "total": 290,
  "categories": [
    { "id": "text", "name": "Text Tools", "count": 45 },
    { "id": "calculators", "name": "Calculators", "count": 36 },
    // ...
  ]
}
```

#### Search Tools

```http
GET /tools/search?q={query}&category={category}&limit={limit}
```

**Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `q` | string | Natural language search query |
| `category` | string | Filter by category (optional) |
| `limit` | number | Max results (default: 10, max: 50) |

**Response:**

```json
{
  "query": "convert pdf to images",
  "results": [
    {
      "id": "pdf-to-image",
      "name": "PDF to Image Converter",
      "description": "Convert PDF pages to PNG or JPEG images",
      "relevance": 0.94,
      "artifact": { ... }
    },
    {
      "id": "pdf-to-png",
      "name": "PDF to PNG",
      "relevance": 0.89,
      "artifact": { ... }
    }
  ],
  "total": 5
}
```

#### Get Tool Details

```http
GET /tools/{id}
```

**Response:**

```json
{
  "id": "case-converter",
  "name": "Case Converter",
  "description": "Convert text between uppercase, lowercase, title case...",
  "category": "text",
  "keywords": ["case", "text", "convert", ...],
  "artifact": {
    "bundleUrl": "https://mcp.conveniencepro.cc/bundles/case-converter.html",
    "bundleSize": 4200,
    "bundleHash": "sha256-abc123...",
    "dependencies": [],
    "capabilities": ["clipboard"]
  },
  "usage": {
    "instructions": "Enter or paste text...",
    "sampleInput": "hello world"
  },
  "version": "1.0.0",
  "lastUpdated": "2025-11-30",
  "tier": 1
}
```

#### Get Tool Bundle

```http
GET /bundles/{id}.html
```

**Response:** Raw HTML file

**Headers:**
```
Content-Type: text/html; charset=utf-8
Cache-Control: public, max-age=86400
ETag: "abc123..."
```

#### MCP Protocol Endpoint

```http
POST /mcp
```

Standard MCP Streamable HTTP endpoint for protocol-compliant clients.

---

## Tool Stratification

Tools are organized into four tiers based on complexity, dependencies, and bundle size.

### Tier 1: Simple Tools

**Characteristics:**
- No external dependencies
- Pure JavaScript logic
- Stateless operations
- Small bundle (< 10KB)

**Examples:**
- Case converter
- Word/character counter
- Hash generators (MD5, SHA)
- Base64 encoder/decoder
- Password generator
- UUID generator
- Lorem ipsum generator

**Count:** ~80 tools

---

### Tier 2: Visual Tools

**Characteristics:**
- Uses Canvas API
- May have small inline libraries
- Moderate bundle (< 50KB)

**Examples:**
- Color picker
- Gradient generator
- QR code generator
- Image filters (grayscale, sepia)
- JSON/YAML formatter with syntax highlighting
- Markdown preview

**Count:** ~60 tools

---

### Tier 3: Document Tools

**Characteristics:**
- Requires CDN dependencies
- File input/output
- Larger bundle (< 100KB + deps)

**Examples:**
- PDF merger (pdf-lib)
- PDF splitter
- PDF to image converter
- Image resizer/converter
- XLSX viewer
- DOCX converter

**Dependencies:**
- `pdf-lib` - PDF manipulation
- `xlsx` - Spreadsheet parsing
- `docx` - Word document generation

**Count:** ~70 tools

---

### Tier 4: Advanced Editors

**Characteristics:**
- Heavy dependencies (MB+)
- Complex interactive UIs
- May require WebAssembly
- May exceed artifact limits

**Examples:**
- Code editor (Monaco)
- Audio DAW (Tone.js)
- Video editor (FFmpeg.wasm)
- 3D model viewer (Three.js)
- Spreadsheet editor

**Strategy:**
1. Provide "lite" versions with reduced functionality
2. Fall back to URL handoff for full versions
3. Load dependencies dynamically

**Count:** ~80 tools

---

### Stratification Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Tier 4: Advanced Editors          [████████░░] ~80 tools      │
│  Heavy deps, may need fallback                                  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Tier 3: Document Tools            [███████░░░] ~70 tools      │
│  CDN deps, file I/O                                             │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Tier 2: Visual Tools              [██████░░░░] ~60 tools      │
│  Canvas API, small libs                                         │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Tier 1: Simple Tools              [████████░░] ~80 tools      │
│  No deps, pure JS                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Build Pipeline

### Overview

```
Source (React/TypeScript)          Output (Self-contained HTML)
─────────────────────────          ────────────────────────────

src/components/tools/              dist/bundles/
├── case-converter.tsx      →      ├── case-converter.html
├── pdf-merger.tsx          →      ├── pdf-merger.html
├── bmi-calculator.tsx      →      ├── bmi-calculator.html
└── ...                            └── ...

src/hooks/                         (logic bundled into HTML)
├── useCaseConverter.ts     →
├── usePdfMerger.ts         →
└── ...
```

### Build Approaches

#### Approach A: Vanilla Rewrites (Tier 1-2)

For simple tools, maintain separate vanilla JS versions optimized for bundling.

```
src/
├── components/tools/           # React versions (website)
│   └── case-converter.tsx
└── bundles/                    # Vanilla versions (MCP)
    └── case-converter/
        ├── index.html
        ├── styles.css
        └── script.js
```

Build script concatenates into single HTML file.

#### Approach B: React Compilation (Tier 2-3)

Compile React components to standalone bundles using esbuild.

```typescript
// scripts/build-bundle.ts
import { build } from 'esbuild';

async function buildBundle(toolId: string) {
  const result = await build({
    entryPoints: [`src/components/tools/${toolId}.tsx`],
    bundle: true,
    minify: true,
    format: 'iife',
    globalName: 'Tool',
    write: false,
    loader: { '.css': 'text' },
  });

  const js = result.outputFiles[0].text;
  const template = await Bun.file('scripts/bundle-template.html').text();

  const html = template
    .replace('{{TOOL_NAME}}', getToolName(toolId))
    .replace('{{SCRIPT}}', js);

  await Bun.write(`dist/bundles/${toolId}.html`, html);
}
```

#### Approach C: Hybrid (Recommended)

- **Tier 1-2:** Vanilla JS for smallest bundles
- **Tier 3-4:** Compiled React for complex UIs

### Build Commands

```bash
# Build all bundles
npm run build:bundles

# Build specific tier
npm run build:bundles -- --tier=1

# Build single tool
npm run build:bundle -- case-converter

# Watch mode for development
npm run build:bundles -- --watch
```

### Output Validation

Each bundle is validated for:

1. **Size limits** - Tier-appropriate max size
2. **Self-containment** - No broken references
3. **Functionality** - Automated browser tests
4. **Accessibility** - Basic a11y checks
5. **Security** - No eval(), no external fetches (except declared deps)

---

## Security Considerations

### Bundle Security

| Concern | Mitigation |
|---------|------------|
| XSS in bundles | CSP headers, sanitized outputs |
| Malicious dependencies | Pin CDN versions, SRI hashes |
| Data exfiltration | No undeclared external fetches |
| Code injection | No `eval()`, no `innerHTML` with user data |

### MCP Server Security

| Concern | Mitigation |
|---------|------------|
| Abuse/DoS | Rate limiting, caching |
| Unauthorized access | Optional API keys for high-volume |
| Registry poisoning | Signed bundles, hash verification |

### Bundle Integrity

Each bundle includes a SHA-256 hash in its metadata:

```json
{
  "artifact": {
    "bundleHash": "sha256-K7gNU3sdo+OL0wNhqoVWhr3g6s1xYv72ol/pe/Unols="
  }
}
```

LLM clients can verify bundle integrity before rendering.

### Sandbox Assumptions

Bundles assume they run in sandboxed iframes with:

- No access to parent window
- No access to cookies/localStorage (or isolated)
- Limited network access (only declared CDN deps)
- No geolocation, camera, microphone

---

## Rollout Strategy

### Phase 1: Foundation (Weeks 1-2)

**Goals:**
- Set up MCP server infrastructure
- Build pipeline for Tier 1 tools
- Create 10-20 proof-of-concept bundles

**Deliverables:**
- [ ] MCP server skeleton (Hono/Express)
- [ ] Bundle build script
- [ ] Tool registry with metadata
- [ ] 20 Tier 1 bundles
- [ ] Basic `/tools` and `/tools/search` endpoints

**Validation:**
- Test bundles in Claude Artifacts manually
- Verify MCP protocol compliance

---

### Phase 2: Tier 1 Complete (Weeks 3-4)

**Goals:**
- Complete all ~80 Tier 1 tools
- Add semantic search
- Register with MCP registries

**Deliverables:**
- [ ] All Tier 1 bundles (80 tools)
- [ ] Semantic search with embeddings
- [ ] GitHub MCP Registry submission
- [ ] Documentation site

**Validation:**
- End-to-end testing with Claude
- Performance benchmarks

---

### Phase 3: Tier 2-3 (Weeks 5-8)

**Goals:**
- Build Tier 2 visual tools
- Build Tier 3 document tools
- Handle CDN dependencies

**Deliverables:**
- [ ] All Tier 2 bundles (60 tools)
- [ ] All Tier 3 bundles (70 tools)
- [ ] Dependency management system
- [ ] Bundle size optimization

**Validation:**
- Test file upload/download in artifacts
- Cross-browser testing

---

### Phase 4: Tier 4 & Polish (Weeks 9-12)

**Goals:**
- Address Tier 4 advanced editors
- Implement fallback strategies
- Production hardening

**Deliverables:**
- [ ] Tier 4 lite versions where possible
- [ ] URL fallback for oversized tools
- [ ] CDN deployment
- [ ] Monitoring and analytics
- [ ] Rate limiting and caching

**Validation:**
- Load testing
- Security audit

---

## Future Considerations

### Result Communication

For tools that produce outputs (converted files, calculated results), consider:

1. **postMessage to parent** - If artifact sandbox allows
2. **Copy to clipboard** - User manually pastes
3. **Download file** - User has file locally
4. **Callback URL** - Tool pings webhook with result ID

### Tool Composition

LLMs could chain multiple tools:

```
User: "Convert this PDF to images, then make them grayscale"

LLM:
1. Renders pdf-to-image tool → user gets PNG files
2. Renders image-grayscale tool → user uploads PNGs → gets grayscale versions
```

Future: Enable automatic piping between tools.

### Customization

LLMs could modify bundles for specific needs:

```
User: "I need a password generator but only lowercase letters"

LLM: Fetches password-generator bundle, modifies character set, renders
```

### Analytics

Track (anonymously):
- Which tools are most requested
- Search queries that return no results (gap analysis)
- Bundle load failures
- Geographic distribution

### Monetization

Options for sustainability:
- Sponsored tool placements
- Premium tier with priority/SLA
- White-label licensing for enterprises

### Standards Contribution

Propose "artifact execution" as MCP extension:

```typescript
interface ArtifactExecution {
  type: 'artifact';
  bundleUrl: string;
  bundleSize: number;
  bundleHash: string;
  capabilities: string[];
}
```

---

## Appendix A: Sample Bundle (Case Converter)

See [/bundles/examples/case-converter.html](/bundles/examples/case-converter.html) for a complete reference implementation.

## Appendix B: MCP Protocol Compliance

This implementation follows the MCP specification (2025-03-26) with Streamable HTTP transport. See [modelcontextprotocol.io](https://modelcontextprotocol.io) for protocol details.

## Appendix C: Related Documents

- [Tool Registry Schema](/docs/tool-registry-schema.md)
- [Bundle Style Guide](/docs/bundle-style-guide.md)
- [Build Pipeline Reference](/docs/build-pipeline.md)

---

*Last updated: 2025-11-30*
*Version: 1.0.0*

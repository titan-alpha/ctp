# ConveniencePro Tool Protocol (CTP) Specification

**Version:** 1.0.0
**Status:** Draft
**Last Updated:** 2025-01-15

## Abstract

The ConveniencePro Tool Protocol (CTP) defines a standardized interface for building, discovering, executing, and embedding browser-native developer tools. CTP extends principles from the Model Context Protocol (MCP) while being specifically optimized for web-based utility tools that operate entirely client-side with optional server execution.

## Table of Contents

1. [Introduction](#1-introduction)
2. [Design Principles](#2-design-principles)
3. [Protocol Overview](#3-protocol-overview)
4. [Tool Definition](#4-tool-definition)
5. [Parameter Schema](#5-parameter-schema)
6. [Tool Execution](#6-tool-execution)
7. [Discovery Mechanisms](#7-discovery-mechanisms)
8. [Embedding Protocol](#8-embedding-protocol)
9. [Security Model](#9-security-model)
10. [Conformance](#10-conformance)
11. [Appendices](#11-appendices)

---

## 1. Introduction

### 1.1 Purpose

CTP provides a unified protocol for:

- **Defining** tools with rich metadata and validation rules
- **Executing** tools in browser or server environments
- **Discovering** tools through multiple standardized formats
- **Embedding** tools in third-party websites with automatic style matching

### 1.2 Scope

This specification covers:

- Tool definition schema and semantics
- Parameter validation and type coercion
- Execution model and result formats
- Discovery document formats (OpenAPI, AI tools manifest, llms.txt)
- Embedding SDK behavior and communication protocol

### 1.3 Terminology

| Term | Definition |
|------|------------|
| **Tool** | A self-contained utility that accepts input, performs a transformation, and produces output |
| **Tool Definition** | The complete metadata and schema describing a tool |
| **Parameter** | A named input value with type and validation constraints |
| **Tool Function** | The executable implementation of a tool |
| **Registry** | A collection of registered tools available for execution |
| **Embed** | An iframe-based tool instance rendered on a third-party page |
| **Autosense** | Automatic detection of host page styling |

### 1.4 Notational Conventions

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119](https://tools.ietf.org/html/rfc2119).

---

## 2. Design Principles

### 2.1 Browser-Native First

CTP tools SHOULD be implementable entirely in the browser using standard Web APIs. Server execution MUST be an optional enhancement, not a requirement.

### 2.2 Privacy by Design

Tools MUST NOT transmit user data to external servers unless:
- Explicitly documented in the tool definition
- Required for the tool's core functionality (e.g., API testing)
- Consented to by the user

### 2.3 Progressive Enhancement

Tools SHOULD work in degraded mode when advanced features are unavailable. For example, a hash generator SHOULD work with synchronous fallbacks when Web Crypto is unavailable.

### 2.4 Semantic Interoperability

Tool definitions MUST contain sufficient metadata for:
- AI models to understand and invoke tools
- Search engines to index tool functionality
- Embedding systems to integrate tools seamlessly

### 2.5 Minimal Configuration

Default behavior SHOULD be sensible. Users SHOULD be able to use tools without configuration. Advanced options SHOULD be optional.

---

## 3. Protocol Overview

### 3.1 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CTP Architecture                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │  ctp-core    │    │ ctp-runtime  │    │ctp-discovery │       │
│  │              │    │              │    │              │       │
│  │  • Types     │───▶│  • Registry  │───▶│  • OpenAPI   │       │
│  │  • Schemas   │    │  • Client    │    │  • AI Tools  │       │
│  │  • Validate  │    │  • Server    │    │  • llms.txt  │       │
│  └──────────────┘    └──────────────┘    └──────────────┘       │
│         │                   │                                    │
│         │                   ▼                                    │
│         │            ┌──────────────┐                           │
│         └───────────▶│   ctp-sdk    │                           │
│                      │              │                           │
│                      │  • Embed     │                           │
│                      │  • Autosense │                           │
│                      │  • Message   │                           │
│                      └──────────────┘                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Package Responsibilities

| Package | Responsibility |
|---------|---------------|
| `@conveniencepro/ctp-core` | Core types, interfaces, and validation utilities |
| `@conveniencepro/ctp-runtime` | Tool registry and execution environments |
| `@conveniencepro/ctp-discovery` | Discovery document generators |
| `@conveniencepro/ctp-sdk` | Embeddable SDK with autosense |

### 3.3 Data Flow

1. **Definition** → Tool is defined with metadata and schema
2. **Registration** → Tool is registered with function implementation
3. **Validation** → Input parameters are validated against schema
4. **Execution** → Tool function is invoked with normalized parameters
5. **Result** → Structured result is returned

---

## 4. Tool Definition

### 4.1 Structure

A Tool Definition is a JSON object with the following properties:

```typescript
interface ToolDefinition {
  // Required fields
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  method: 'GET' | 'POST';
  parameters: ParameterSchema[];
  outputDescription: string;
  example: ToolExample;

  // Optional fields
  version?: string;
  icon?: string;
  keywords?: string[];
  relatedTools?: string[];
  aiInstructions?: string;
  rateLimit?: RateLimitConfig;
  executionMode?: 'client' | 'server' | 'hybrid';
  requiresAuth?: boolean;
  deprecated?: boolean;
  deprecationMessage?: string;
}
```

### 4.2 Field Definitions

#### 4.2.1 `id` (Required)

- **Type:** `string`
- **Pattern:** `^[a-z0-9]+(-[a-z0-9]+)*$`
- **Description:** Unique identifier for the tool. MUST be lowercase, alphanumeric, hyphen-separated.
- **Example:** `"json-formatter"`, `"base64-encoder"`

#### 4.2.2 `name` (Required)

- **Type:** `string`
- **Max Length:** 50
- **Description:** Human-readable display name.
- **Example:** `"JSON Formatter"`

#### 4.2.3 `description` (Required)

- **Type:** `string`
- **Max Length:** 500
- **Description:** Detailed description of tool functionality. SHOULD include primary use cases.
- **Example:** `"Format, validate, and beautify JSON data with customizable indentation."`

#### 4.2.4 `category` (Required)

- **Type:** `string`
- **Description:** Primary category for organization.
- **Standard Values:** `"formatters"`, `"encoders"`, `"generators"`, `"converters"`, `"validators"`, `"analyzers"`, `"editors"`

#### 4.2.5 `tags` (Required)

- **Type:** `string[]`
- **Description:** Searchable tags for discoverability.
- **Example:** `["json", "format", "beautify", "validate"]`

#### 4.2.6 `method` (Required)

- **Type:** `"GET" | "POST"`
- **Description:** HTTP method when tool is exposed as API endpoint.
- **Rules:**
  - Use `GET` for idempotent operations with small inputs
  - Use `POST` for operations with large inputs or side effects

#### 4.2.7 `parameters` (Required)

- **Type:** `ParameterSchema[]`
- **Description:** Array of parameter definitions. See [Section 5](#5-parameter-schema).

#### 4.2.8 `outputDescription` (Required)

- **Type:** `string`
- **Description:** Description of what the tool outputs.
- **Example:** `"Formatted JSON string with proper indentation"`

#### 4.2.9 `example` (Required)

- **Type:** `ToolExample`
- **Description:** Example input/output for documentation and testing.

```typescript
interface ToolExample {
  input: Record<string, unknown>;
  output: unknown;
  description?: string;
}
```

#### 4.2.10 `executionMode` (Optional)

- **Type:** `"client" | "server" | "hybrid"`
- **Default:** `"client"`
- **Description:**
  - `client` - Runs entirely in browser
  - `server` - Requires server-side execution
  - `hybrid` - Can run in either environment

#### 4.2.11 `aiInstructions` (Optional)

- **Type:** `string`
- **Description:** Special instructions for AI models invoking this tool.
- **Example:** `"When formatting JSON, always use 2-space indentation unless user specifies otherwise."`

### 4.3 Validation Rules

1. `id` MUST be unique within a registry
2. `name` MUST NOT be empty
3. `parameters` MUST NOT have duplicate names
4. `example.input` MUST be valid according to `parameters` schema
5. At least one `tag` SHOULD be provided

---

## 5. Parameter Schema

### 5.1 Structure

```typescript
interface ParameterSchema {
  // Required fields
  name: string;
  type: FieldType;
  label: string;
  description: string;
  required: boolean;

  // Optional fields
  defaultValue?: unknown;
  placeholder?: string;
  options?: SelectOption[];
  validation?: ValidationConstraints;
  dependsOn?: DependencyRule[];
  group?: string;
  order?: number;
  hidden?: boolean;
  aiHint?: string;
}
```

### 5.2 Field Types

| Type | Description | HTML Equivalent |
|------|-------------|-----------------|
| `text` | Single-line text | `<input type="text">` |
| `textarea` | Multi-line text | `<textarea>` |
| `number` | Numeric value | `<input type="number">` |
| `boolean` | True/false | `<input type="checkbox">` |
| `select` | Dropdown selection | `<select>` |
| `json` | JSON input with validation | Custom |
| `file` | File upload | `<input type="file">` |
| `color` | Color picker | `<input type="color">` |
| `date` | Date picker | `<input type="date">` |
| `datetime` | DateTime picker | `<input type="datetime-local">` |
| `url` | URL input | `<input type="url">` |
| `email` | Email input | `<input type="email">` |

### 5.3 Validation Constraints

```typescript
interface ValidationConstraints {
  // String constraints
  minLength?: number;
  maxLength?: number;
  pattern?: string;

  // Number constraints
  min?: number;
  max?: number;
  step?: number;

  // Array constraints
  minItems?: number;
  maxItems?: number;

  // File constraints
  accept?: string[];
  maxSize?: number;

  // Custom validation
  custom?: string; // JavaScript expression
}
```

### 5.4 Select Options

```typescript
interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}
```

### 5.5 Dependencies

Parameters can depend on other parameters:

```typescript
interface DependencyRule {
  field: string;
  condition: 'equals' | 'notEquals' | 'contains' | 'exists';
  value?: unknown;
}
```

**Example:**
```json
{
  "name": "customIndent",
  "type": "number",
  "dependsOn": [
    { "field": "indentStyle", "condition": "equals", "value": "custom" }
  ]
}
```

### 5.6 AI Hints

The `aiHint` field provides guidance for AI models:

```json
{
  "name": "format",
  "type": "select",
  "aiHint": "Choose 'minified' for production code, 'pretty' for debugging"
}
```

---

## 6. Tool Execution

### 6.1 Execution Flow

```
Input Parameters
      │
      ▼
┌─────────────┐
│ Normalize   │ ─── Convert URLSearchParams/FormData to Record
└─────────────┘
      │
      ▼
┌─────────────┐
│ Validate    │ ─── Check required fields, types, constraints
└─────────────┘
      │
      ▼
┌─────────────┐
│ Execute     │ ─── Run tool function
└─────────────┘
      │
      ▼
┌─────────────┐
│ Format      │ ─── Structure result
└─────────────┘
      │
      ▼
   ToolResult
```

### 6.2 Parameter Normalization

Input parameters can be provided in multiple formats:

| Input Format | Normalization |
|--------------|---------------|
| `Record<string, unknown>` | Used as-is |
| `URLSearchParams` | Converted to Record |
| `FormData` | Converted to Record with file handling |

**Normalization Rules:**

1. String values are preserved
2. JSON strings are parsed for `json` type parameters
3. Empty strings become `undefined` for optional parameters
4. Boolean strings (`"true"`, `"false"`) are converted
5. Numeric strings are converted for `number` type

### 6.3 Tool Result

```typescript
interface ToolResult<T = Record<string, unknown>> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: string;
  metadata?: {
    executionTime?: number;
    inputSize?: number;
    outputSize?: number;
    cached?: boolean;
    warnings?: string[];
  };
}
```

### 6.4 Error Codes

| Code | Description |
|------|-------------|
| `INVALID_INPUT` | Input validation failed |
| `MISSING_REQUIRED` | Required parameter missing |
| `TYPE_ERROR` | Type coercion failed |
| `CONSTRAINT_VIOLATION` | Validation constraint failed |
| `EXECUTION_ERROR` | Runtime error during execution |
| `TIMEOUT` | Execution timeout exceeded |
| `RATE_LIMITED` | Rate limit exceeded |

### 6.5 Dual Execution Model

CTP supports execution in two environments:

#### 6.5.1 Client Runtime (Browser)

```typescript
import { ClientRuntime } from '@conveniencepro/ctp-runtime/client';

// Uses Web Crypto API
await ClientRuntime.sha256('hello');

// Uses btoa/atob
ClientRuntime.base64Encode('hello');

// Uses crypto.randomUUID()
ClientRuntime.generateUUID();
```

#### 6.5.2 Server Runtime (Node.js)

```typescript
import { ServerRuntime } from '@conveniencepro/ctp-runtime/server';

// Uses crypto module
await ServerRuntime.sha256('hello');

// Uses Buffer
ServerRuntime.base64Encode('hello');

// Uses crypto.randomUUID()
ServerRuntime.generateUUID();
```

### 6.6 Registry API

```typescript
interface ToolRegistry {
  register<T>(definition: ToolDefinition, fn: ToolFunction<T>): void;
  get(id: string): ToolRegistryEntry | undefined;
  has(id: string): boolean;
  execute<T>(id: string, params: NormalizedParams): Promise<ToolResult<T>>;
  list(): ToolDefinition[];
  getByCategory(category: string): ToolDefinition[];
  search(query: string): ToolDefinition[];
}
```

---

## 7. Discovery Mechanisms

### 7.1 Overview

CTP tools are discoverable through multiple standardized formats:

| Format | Purpose | File |
|--------|---------|------|
| OpenAPI | API documentation | `openapi.yaml` |
| AI Tools | AI model integration | `ai-tools.json` |
| CTP Manifest | Native CTP format | `ctp-manifest.json` |
| llms.txt | LLM context | `llms.txt` |
| ChatGPT Plugin | ChatGPT integration | `ai-plugin.json` |

### 7.2 OpenAPI 3.1

Tools are exposed as OpenAPI endpoints:

```yaml
openapi: 3.1.0
info:
  title: ConveniencePro Tools API
  version: 1.0.0
paths:
  /api/tools/json-formatter:
    post:
      operationId: json-formatter
      summary: JSON Formatter
      description: Format, validate, and beautify JSON data
      requestBody:
        content:
          application/json:
            schema:
              type: object
              required: [json]
              properties:
                json:
                  type: string
                  description: JSON string to format
                indent:
                  type: integer
                  default: 2
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ToolResult'
```

### 7.3 AI Tools Manifest

```json
{
  "version": "1.0",
  "name": "ConveniencePro Tools",
  "description": "Developer utility tools",
  "tools": [
    {
      "id": "json-formatter",
      "name": "JSON Formatter",
      "description": "Format and beautify JSON data",
      "category": "formatters",
      "inputSchema": {
        "type": "object",
        "required": ["json"],
        "properties": {
          "json": { "type": "string" }
        }
      },
      "invocationUrl": "https://conveniencepro.cc/api/tools/json-formatter"
    }
  ]
}
```

### 7.4 CTP Manifest

Native CTP format with full metadata:

```json
{
  "ctpVersion": "1.0.0",
  "name": "ConveniencePro",
  "baseUrl": "https://conveniencepro.cc",
  "tools": [
    {
      "id": "json-formatter",
      "name": "JSON Formatter",
      "description": "...",
      "category": "formatters",
      "tags": ["json", "format"],
      "parameters": [
        {
          "name": "json",
          "type": "textarea",
          "label": "JSON Input",
          "required": true
        }
      ],
      "executionMode": "client",
      "embedUrl": "/embed/json-formatter"
    }
  ]
}
```

### 7.5 llms.txt

Human and AI readable documentation:

```
# ConveniencePro Tools

> Developer utility tools available at https://conveniencepro.cc

## Available Tools

### JSON Formatter
Format, validate, and beautify JSON data.
- Endpoint: POST /api/tools/json-formatter
- Parameters: json (required), indent (optional, default: 2)

### Base64 Encoder
Encode or decode Base64 strings.
- Endpoint: POST /api/tools/base64-encoder
- Parameters: input (required), mode (encode|decode)
```

### 7.6 Discovery Endpoints

| Endpoint | Content |
|----------|---------|
| `/.well-known/ai-plugin.json` | ChatGPT plugin manifest |
| `/api/openapi.yaml` | OpenAPI specification |
| `/api/ai-tools.json` | AI tools manifest |
| `/ctp-manifest.json` | CTP native manifest |
| `/llms.txt` | LLM context file |

---

## 8. Embedding Protocol

### 8.1 Overview

CTP tools can be embedded in third-party websites using iframes with automatic style matching.

### 8.2 Embed URL Format

```
{baseUrl}/embed/{toolId}?{styleParams}
```

**Style Parameters:**

| Parameter | Description | Example |
|-----------|-------------|---------|
| `theme` | Light or dark | `dark` |
| `accent` | Accent color | `#6366f1` |
| `bg` | Background color | `#1f2937` |
| `text` | Text color | `#f9fafb` |
| `font` | Font family | `Inter, sans-serif` |
| `fontSize` | Base font size | `16` |
| `radius` | Border radius | `8` |
| `shadow` | Shadow intensity | `subtle` |
| `density` | UI density | `normal` |

### 8.3 Autosense

The SDK automatically detects host page styling:

```typescript
interface DetectedStyles {
  theme: 'light' | 'dark';
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  baseFontSize: number;
  borderRadius: number;
  framework?: string;
}
```

**Detection Methods:**

1. **Theme:** CSS `prefers-color-scheme`, `.dark` class, `data-theme` attribute, background luminance
2. **Framework:** CSS variables (`--tw-`, `--bs-`), class patterns (`.btn-primary`)
3. **Colors:** CSS variables, computed styles
4. **Typography:** `getComputedStyle()` on body

**Supported Frameworks:**

- Tailwind CSS
- Bootstrap
- Chakra UI
- Material UI (MUI)
- shadcn/ui
- Ant Design

### 8.4 Embed Communication

Embeds communicate with the parent page via `postMessage`:

```typescript
interface EmbedMessage {
  type: 'ready' | 'resize' | 'result' | 'error' | 'updateStyles';
  payload?: unknown;
}
```

**Message Flow:**

1. **ready** - Embed has loaded and is ready
2. **resize** - Request parent to resize iframe
3. **result** - Tool has produced output
4. **error** - Error occurred
5. **updateStyles** - Parent requests style update

### 8.5 Security

1. **Origin Validation:** Messages MUST be validated against expected origin
2. **CSP:** Embeds SHOULD set appropriate Content-Security-Policy
3. **Permissions:** Clipboard access requires explicit `allow` attribute

```html
<iframe
  src="https://conveniencepro.cc/embed/json-formatter"
  allow="clipboard-write"
  sandbox="allow-scripts allow-same-origin"
></iframe>
```

### 8.6 SDK API

```typescript
// Create embed
const controller = embed('container', 'json-formatter', {
  autosense: true,
  watchTheme: true,
  onReady: (ctrl) => {},
  onResult: (result) => {},
});

// Update styles
controller.updateStyles({ theme: 'dark' });

// Destroy
controller.destroy();
```

---

## 9. Security Model

### 9.1 Threat Model

| Threat | Mitigation |
|--------|------------|
| XSS | Input sanitization, CSP |
| Data Exfiltration | No external requests by default |
| CSRF | Origin validation |
| Injection | Parameter validation |

### 9.2 Input Validation

All inputs MUST be validated:

1. Type checking
2. Length limits
3. Pattern matching
4. Sanitization for display

### 9.3 Execution Isolation

- Browser tools run in page context
- Embeds are isolated via iframes
- Server tools run in sandboxed processes

### 9.4 Data Handling

1. User data MUST NOT be logged
2. User data MUST NOT be transmitted without consent
3. Sensitive outputs SHOULD be clearable

---

## 10. Conformance

### 10.1 Conformance Levels

| Level | Requirements |
|-------|--------------|
| **CTP Basic** | Valid tool definitions, basic execution |
| **CTP Standard** | Basic + discovery documents |
| **CTP Full** | Standard + embedding + autosense |

### 10.2 Validation

Implementations can be validated using:

1. JSON Schema validation of definitions
2. Discovery document schema validation
3. Runtime behavior tests

### 10.3 Interoperability

Conforming implementations MUST:

1. Accept valid CTP tool definitions
2. Produce valid CTP tool results
3. Generate valid discovery documents

---

## 11. Appendices

### 11.1 JSON Schema

See `/schemas/tool-definition.schema.json` for the complete JSON Schema.

### 11.2 Reference Implementation

The reference implementation is available at:
- `@conveniencepro/ctp-core`
- `@conveniencepro/ctp-runtime`
- `@conveniencepro/ctp-discovery`
- `@conveniencepro/ctp-sdk`

### 11.3 Examples

See `/examples/` directory for complete tool implementations.

### 11.4 Changelog

#### Version 1.0.0 (2025-01-15)

- Initial release
- Core protocol definition
- Discovery mechanisms
- Embedding SDK

---

## Acknowledgments

CTP builds on concepts from:

- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
- [OpenAPI Specification](https://www.openapis.org/)
- [JSON Schema](https://json-schema.org/)

---

© 2025 ConveniencePro. Licensed under MIT.

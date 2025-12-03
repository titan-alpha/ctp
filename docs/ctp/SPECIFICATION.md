# ConveniencePro Tool Protocol Specification

**Version:** 1.0.0
**Status:** Draft
**Date:** 2025-01-15
**Authors:** ConveniencePro Team

---

## Abstract

The ConveniencePro Tool Protocol (CTP) defines a standardized interface for building, discovering, executing, and embedding browser-native developer tools. CTP extends the Model Context Protocol (MCP) with features optimized for client-side utility tools that operate with complete user privacy.

This specification defines:

1. Tool definition schema and semantics
2. Parameter types and validation rules
3. Execution model and result formats
4. Discovery document specifications
5. Embedding protocol and autosense behavior
6. Security requirements

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Conformance](#2-conformance)
3. [Terminology](#3-terminology)
4. [Protocol Overview](#4-protocol-overview)
5. [Tool Definition](#5-tool-definition)
6. [Parameter Schema](#6-parameter-schema)
7. [Tool Execution](#7-tool-execution)
8. [Tool Results](#8-tool-results)
9. [Discovery](#9-discovery)
10. [Embedding](#10-embedding)
11. [Security](#11-security)
12. [IANA Considerations](#12-iana-considerations)

---

## 1. Introduction

### 1.1 Purpose

CTP provides a unified protocol for defining utility tools that can be:

- **Executed** in browser or server environments
- **Discovered** through multiple standardized formats
- **Embedded** in third-party websites with automatic styling
- **Invoked** by AI models through natural language

### 1.2 Goals

1. **Privacy by Default**: Tools SHOULD execute client-side when possible
2. **MCP Compatibility**: Tools MUST be convertible to MCP format
3. **AI-Friendly**: Discovery documents MUST be LLM-consumable
4. **Framework Agnostic**: No runtime dependencies required

### 1.3 Scope

This specification covers:

- Tool definition format
- Parameter and result schemas
- Discovery document formats
- Embedding behavior
- Security requirements

Out of scope:

- Specific tool implementations
- UI/UX guidelines
- Pricing or licensing models

---

## 2. Conformance

### 2.1 Requirements Notation

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119](https://tools.ietf.org/html/rfc2119).

### 2.2 Conformance Levels

| Level | Requirements |
|-------|--------------|
| **CTP Basic** | Valid tool definitions, basic execution |
| **CTP Standard** | Basic + discovery documents + validation |
| **CTP Full** | Standard + embedding + autosense |

### 2.3 Validation

Implementations MAY use the provided JSON Schemas for validation:

- `tool-definition.schema.json`
- `tool-result.schema.json`
- `ctp-manifest.schema.json`
- `embed-config.schema.json`

---

## 3. Terminology

| Term | Definition |
|------|------------|
| **Tool** | A self-contained utility that accepts input and produces output |
| **Tool Definition** | Complete metadata and schema describing a tool |
| **Parameter** | A named input with type and validation constraints |
| **Tool Function** | The executable implementation of a tool |
| **Registry** | A collection of registered tools |
| **Embed** | An iframe-based tool instance on a third-party page |
| **Autosense** | Automatic detection of host page styling |
| **Bundle** | Self-contained HTML file for client-side execution |

---

## 4. Protocol Overview

### 4.1 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Tool Consumers                              │
│  (AI Models, Websites, CLI Tools, MCP Clients)                  │
└─────────────────────────────────────────────────────────────────┘
                              │
           ┌──────────────────┼──────────────────┐
           │                  │                  │
    ┌──────▼──────┐    ┌──────▼──────┐    ┌─────▼─────┐
    │  Discovery  │    │  Execution  │    │ Embedding │
    │             │    │             │    │           │
    │  OpenAPI    │    │  Registry   │    │  Iframe   │
    │  AI Tools   │    │  Client RT  │    │  Autosense│
    │  llms.txt   │    │  Server RT  │    │  Messages │
    └─────────────┘    └─────────────┘    └───────────┘
                              │
                    ┌─────────▼─────────┐
                    │  Tool Definitions │
                    │                   │
                    │  id, parameters,  │
                    │  validation, etc. │
                    └───────────────────┘
```

### 4.2 Data Flow

1. **Definition**: Tool is defined with metadata and parameter schema
2. **Registration**: Tool is registered with an implementation function
3. **Discovery**: Tool is exposed via discovery documents
4. **Invocation**: Consumer calls tool with parameters
5. **Validation**: Parameters are validated against schema
6. **Execution**: Tool function executes (client or server)
7. **Result**: Structured result is returned

---

## 5. Tool Definition

### 5.1 Schema

A Tool Definition is a JSON object with the following structure:

```typescript
interface ToolDefinition {
  // Identity (Required)
  id: string;
  name: string;
  description: string;

  // Classification (Required)
  category: Category;
  tags: string[];

  // API Configuration (Required)
  method: 'GET' | 'POST';
  parameters: ParameterSchema[];

  // Documentation (Required)
  outputDescription: string;
  example: ToolExample;

  // Optional Fields
  version?: string;
  icon?: string;
  keywords?: string[];
  relatedTools?: string[];
  aiInstructions?: string;
  executionMode?: ExecutionMode;
  rateLimit?: RateLimitConfig;
  deprecated?: boolean;
  deprecationMessage?: string;
}
```

### 5.2 Field Definitions

#### 5.2.1 `id` (Required)

Unique identifier for the tool.

- **Type**: `string`
- **Format**: Lowercase alphanumeric with hyphens
- **Pattern**: `^[a-z0-9]+(-[a-z0-9]+)*$`
- **Max Length**: 100 characters
- **Examples**: `json-formatter`, `base64-encoder`, `uuid-generator`

The `id` MUST be unique within a registry and SHOULD be descriptive of the tool's function.

#### 5.2.2 `name` (Required)

Human-readable display name.

- **Type**: `string`
- **Max Length**: 50 characters
- **Examples**: `JSON Formatter`, `Base64 Encoder`

#### 5.2.3 `description` (Required)

Detailed description of tool functionality.

- **Type**: `string`
- **Max Length**: 500 characters
- **Requirements**:
  - MUST describe primary use case
  - SHOULD include key features
  - MAY include limitations

#### 5.2.4 `category` (Required)

Primary category for organization.

- **Type**: `string`
- **Allowed Values**:
  - `formatters` - Tools that format or beautify data
  - `encoders` - Encoding/decoding tools
  - `generators` - Tools that generate data
  - `converters` - Format conversion tools
  - `validators` - Validation tools
  - `analyzers` - Analysis tools
  - `editors` - Interactive editors
  - `utilities` - General utilities

#### 5.2.5 `tags` (Required)

Searchable tags for discoverability.

- **Type**: `string[]`
- **Min Items**: 1
- **Max Item Length**: 30 characters
- **Requirements**: Tags MUST be lowercase

#### 5.2.6 `method` (Required)

HTTP method for API exposure.

- **Type**: `'GET' | 'POST'`
- **Guidelines**:
  - Use `GET` for idempotent operations with small inputs
  - Use `POST` for operations with large inputs or file uploads

#### 5.2.7 `parameters` (Required)

Array of parameter definitions. See [Section 6](#6-parameter-schema).

#### 5.2.8 `outputDescription` (Required)

Description of tool output.

- **Type**: `string`
- **Max Length**: 200 characters

#### 5.2.9 `example` (Required)

Example input/output for documentation and testing.

```typescript
interface ToolExample {
  input: Record<string, unknown>;
  output: unknown;
  description?: string;
}
```

The `example.input` MUST be valid according to the parameter schema.

#### 5.2.10 `executionMode` (Optional)

Where the tool can execute.

- **Type**: `'client' | 'server' | 'hybrid'`
- **Default**: `'client'`
- **Definitions**:
  - `client`: Executes entirely in browser (recommended for privacy)
  - `server`: Requires server-side execution
  - `hybrid`: Can execute in either environment

#### 5.2.11 `aiInstructions` (Optional)

Special instructions for AI models invoking this tool.

- **Type**: `string`
- **Max Length**: 1000 characters
- **Usage**: Included in discovery documents for LLM context

### 5.3 Validation Rules

1. `id` MUST be unique within a registry
2. `name` MUST NOT be empty
3. `parameters` MUST NOT have duplicate names
4. `example.input` MUST validate against `parameters`
5. At least one `tag` MUST be provided

---

## 6. Parameter Schema

### 6.1 Structure

```typescript
interface ParameterSchema {
  // Identity (Required)
  name: string;
  type: FieldType;
  label: string;
  description: string;
  required: boolean;

  // Values (Optional)
  defaultValue?: unknown;
  placeholder?: string;
  options?: SelectOption[];  // For 'select' type

  // Validation (Optional)
  validation?: ValidationConstraints;

  // UI Hints (Optional)
  dependsOn?: DependencyRule[];
  group?: string;
  order?: number;
  hidden?: boolean;

  // AI Hints (Optional)
  aiHint?: string;
}
```

### 6.2 Field Types

| Type | Description | JSON Schema | HTML Equivalent |
|------|-------------|-------------|-----------------|
| `text` | Single-line text | `string` | `<input type="text">` |
| `textarea` | Multi-line text | `string` | `<textarea>` |
| `number` | Numeric value | `number` | `<input type="number">` |
| `boolean` | True/false | `boolean` | `<input type="checkbox">` |
| `select` | Dropdown | `string` with `enum` | `<select>` |
| `json` | JSON string | `string` | Custom editor |
| `file` | File upload | `string` (base64) | `<input type="file">` |
| `color` | Color picker | `string` | `<input type="color">` |
| `date` | Date picker | `string` (ISO 8601) | `<input type="date">` |
| `datetime` | DateTime | `string` (ISO 8601) | `<input type="datetime-local">` |
| `url` | URL input | `string` (URI) | `<input type="url">` |
| `email` | Email input | `string` (email) | `<input type="email">` |

### 6.3 Validation Constraints

```typescript
interface ValidationConstraints {
  // String constraints
  minLength?: number;
  maxLength?: number;
  pattern?: string;  // Regex

  // Number constraints
  min?: number;
  max?: number;
  step?: number;

  // Array constraints
  minItems?: number;
  maxItems?: number;

  // File constraints
  accept?: string[];   // MIME types
  maxSize?: number;    // Bytes

  // Custom validation
  custom?: string;     // Expression
}
```

### 6.4 Select Options

```typescript
interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}
```

### 6.5 Parameter Dependencies

Parameters can conditionally display based on other parameters:

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
    { "field": "indentType", "condition": "equals", "value": "custom" }
  ]
}
```

---

## 7. Tool Execution

### 7.1 Execution Flow

```
Input (URLSearchParams | FormData | Record)
                    │
                    ▼
            ┌───────────────┐
            │  Normalize    │  Convert to Record<string, unknown>
            └───────┬───────┘
                    │
                    ▼
            ┌───────────────┐
            │  Validate     │  Check required, types, constraints
            └───────┬───────┘
                    │
                    ▼
            ┌───────────────┐
            │  Execute      │  Run tool function
            └───────┬───────┘
                    │
                    ▼
            ┌───────────────┐
            │  Format       │  Structure result
            └───────┬───────┘
                    │
                    ▼
              ToolResult
```

### 7.2 Parameter Normalization

Inputs MUST be normalized to `Record<string, unknown>`:

| Input Type | Normalization |
|------------|---------------|
| `Record<string, unknown>` | Used as-is |
| `URLSearchParams` | Convert to Record |
| `FormData` | Convert to Record |

**Normalization Rules:**

1. Empty strings become `undefined` for optional parameters
2. String `"true"`/`"false"` convert to boolean for `boolean` type
3. Numeric strings convert to numbers for `number` type
4. JSON strings are parsed for `json` type

### 7.3 Tool Function Signature

```typescript
type ToolFunction<T> = (
  params: Record<string, unknown>
) => ToolResult<T> | Promise<ToolResult<T>>;
```

Tool functions:

- MUST accept normalized parameters
- MUST return a `ToolResult` (sync or async)
- SHOULD NOT throw exceptions (return error result instead)
- MUST be idempotent for `GET` method tools

### 7.4 Execution Modes

#### 7.4.1 Client Execution

For `executionMode: 'client'`:

- Tool executes in browser
- Uses Web Crypto API for cryptographic operations
- Uses `btoa`/`atob` for Base64
- MUST NOT make external network requests
- User data NEVER leaves the browser

#### 7.4.2 Server Execution

For `executionMode: 'server'`:

- Tool executes on server
- Uses Node.js `crypto` module
- May access external resources
- MUST validate and sanitize all inputs

#### 7.4.3 Hybrid Execution

For `executionMode: 'hybrid'`:

- Client execution preferred
- Server fallback when client capabilities insufficient
- Implementation SHOULD detect environment

---

## 8. Tool Results

### 8.1 Result Schema

```typescript
interface ToolResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: ErrorCode;
  metadata?: ResultMetadata;
}

interface ResultMetadata {
  executionTime?: number;  // Milliseconds
  inputSize?: number;      // Bytes
  outputSize?: number;     // Bytes
  cached?: boolean;
  warnings?: string[];
}
```

### 8.2 Success Result

```typescript
{
  success: true,
  data: {
    formatted: "{\n  \"key\": \"value\"\n}",
    lineCount: 3
  },
  metadata: {
    executionTime: 5,
    inputSize: 15,
    outputSize: 25
  }
}
```

### 8.3 Error Result

```typescript
{
  success: false,
  error: "Invalid JSON: Unexpected token",
  errorCode: "INVALID_INPUT",
  metadata: {
    executionTime: 1
  }
}
```

### 8.4 Error Codes

| Code | Description |
|------|-------------|
| `INVALID_INPUT` | Input validation failed |
| `MISSING_REQUIRED` | Required parameter missing |
| `TYPE_ERROR` | Type coercion failed |
| `CONSTRAINT_VIOLATION` | Validation constraint failed |
| `EXECUTION_ERROR` | Runtime error |
| `TIMEOUT` | Execution timeout |
| `RATE_LIMITED` | Rate limit exceeded |
| `UNAUTHORIZED` | Authentication required |
| `NOT_FOUND` | Tool not found |
| `INTERNAL_ERROR` | Internal server error |

---

## 9. Discovery

### 9.1 Overview

CTP tools are discoverable through multiple formats:

| Format | File | Purpose |
|--------|------|---------|
| CTP Manifest | `/.well-known/ctp-manifest.json` | Native CTP format |
| OpenAPI | `/api/openapi.yaml` | API documentation |
| AI Tools | `/api/ai-tools.json` | AI model integration |
| llms.txt | `/llms.txt` | LLM context |
| ChatGPT Plugin | `/.well-known/ai-plugin.json` | ChatGPT integration |

### 9.2 CTP Manifest

```typescript
interface CTManifest {
  ctpVersion: '1.0.0';
  name: string;
  description?: string;
  baseUrl: string;
  apiPath?: string;      // Default: '/api/tools'
  embedPath?: string;    // Default: '/embed'
  tools: ManifestTool[];
  categories?: CategoryInfo[];
  capabilities?: ServiceCapabilities;
}

interface ManifestTool {
  id: string;
  name: string;
  description: string;
  category: string;
  tags?: string[];
  method: 'GET' | 'POST';
  parameters?: ParameterSchema[];
  executionMode?: ExecutionMode;
  apiEndpoint?: string;
  embedUrl?: string;
}
```

### 9.3 OpenAPI 3.1

Tools are exposed as OpenAPI operations:

```yaml
openapi: 3.1.0
info:
  title: ConveniencePro Tools
  version: 1.0.0
paths:
  /api/tools/json-formatter:
    post:
      operationId: json-formatter
      summary: JSON Formatter
      description: Format and beautify JSON data
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [json]
              properties:
                json:
                  type: string
                  description: JSON to format
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ToolResult'
```

### 9.4 llms.txt

Human and AI readable format:

```
# ConveniencePro Tools

> 290+ developer utility tools at https://conveniencepro.cc
> All tools run client-side for complete privacy.

## Categories

- formatters: JSON, XML, SQL formatting
- encoders: Base64, URL, HTML encoding
- generators: UUID, password, hash generation

## Tools

### json-formatter
Format, validate, and beautify JSON data.
- Endpoint: POST /api/tools/json-formatter
- Parameters:
  - json (string, required): JSON to format
  - indent (enum: 2|4, optional): Indentation spaces
- Example: {"json": "{\"a\":1}", "indent": "2"}
```

### 9.5 Discovery Endpoint Requirements

Services implementing CTP SHOULD serve:

| Endpoint | Content-Type | Required |
|----------|--------------|----------|
| `/.well-known/ctp-manifest.json` | `application/json` | Yes |
| `/api/openapi.yaml` | `text/yaml` | Recommended |
| `/llms.txt` | `text/plain` | Recommended |

---

## 10. Embedding

### 10.1 Overview

CTP tools can be embedded in third-party websites using iframes with automatic style matching.

### 10.2 Embed URL Format

```
{baseUrl}/embed/{toolId}?{styleParams}
```

**Style Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `theme` | `light\|dark` | Color theme |
| `accent` | `string` | Accent color (hex) |
| `bg` | `string` | Background color |
| `text` | `string` | Text color |
| `font` | `string` | Font family |
| `fontSize` | `number` | Base font size (px) |
| `radius` | `number` | Border radius (px) |
| `shadow` | `none\|subtle\|medium\|large` | Shadow intensity |
| `density` | `compact\|normal\|comfortable` | UI density |

### 10.3 Embed Configuration

```typescript
interface EmbedConfig {
  // Tool
  toolId: string;
  baseUrl?: string;

  // Dimensions
  width?: string | number;
  height?: string | number;
  minHeight?: string | number;

  // Styling
  theme?: 'light' | 'dark';
  accentColor?: string;
  // ... other style properties

  // Behavior
  autosense?: boolean;     // Auto-detect styles (default: true)
  watchTheme?: boolean;    // React to theme changes (default: true)
  loading?: 'lazy' | 'eager';
  allowClipboard?: boolean;

  // Callbacks
  onReady?: (controller: EmbedController) => void;
  onResult?: (result: unknown) => void;
  onError?: (error: Error) => void;
}
```

### 10.4 Autosense

Autosense automatically detects host page styling:

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

| Property | Detection Approach |
|----------|-------------------|
| `theme` | `prefers-color-scheme`, `.dark` class, `data-theme`, background luminance |
| `framework` | CSS variables (`--tw-`, `--bs-`), class patterns |
| `accentColor` | `--primary`, `--accent` CSS variables, button colors |
| `fontFamily` | `getComputedStyle(document.body).fontFamily` |

**Supported Frameworks:**

- Tailwind CSS (`--tw-*`)
- Bootstrap (`--bs-*`)
- Chakra UI (`--chakra-*`)
- Material UI (`--mui-*`)
- shadcn/ui (`--primary`, `--background`)
- Ant Design (`--ant-*`)

### 10.5 Embed Communication

Embeds communicate via `postMessage`:

```typescript
interface EmbedMessage {
  type: 'ready' | 'resize' | 'result' | 'error' | 'updateStyles';
  payload?: unknown;
}
```

**Message Flow:**

1. **ready**: Embed loaded and initialized
2. **resize**: Request parent to resize iframe
3. **result**: Tool produced output
4. **error**: Error occurred
5. **updateStyles**: Parent requests style update

**Security:**

- Messages MUST validate origin against expected base URL
- Embeds SHOULD set restrictive CSP headers

### 10.6 Embed Controller

```typescript
interface EmbedController {
  id: string;
  toolId: string;
  container: HTMLElement;
  iframe: HTMLIFrameElement | null;
  config: EmbedConfig;
  ready: boolean;

  updateStyles(styles: Partial<DetectedStyles>): void;
  reload(): void;
  destroy(): void;
}
```

---

## 11. Security

### 11.1 Input Validation

All inputs MUST be validated:

1. **Type Checking**: Ensure correct data types
2. **Length Limits**: Enforce min/max constraints
3. **Pattern Matching**: Validate against regex patterns
4. **Sanitization**: Escape for safe display

### 11.2 Client-Side Security

For `executionMode: 'client'`:

- MUST NOT use `eval()` or `new Function()`
- MUST NOT use `innerHTML` with user data
- MUST NOT make external network requests
- SHOULD use CSP to restrict capabilities

### 11.3 Server-Side Security

For `executionMode: 'server'`:

- MUST validate all inputs before processing
- MUST sanitize outputs to prevent XSS
- MUST implement rate limiting
- SHOULD log security-relevant events

### 11.4 Embedding Security

- Embeds run in sandboxed iframes
- `allow` attribute controls permissions
- Origin validation for all messages
- CSP headers on embed responses

```html
<iframe
  src="https://conveniencepro.cc/embed/json-formatter"
  allow="clipboard-write"
  sandbox="allow-scripts allow-same-origin"
></iframe>
```

### 11.5 Data Handling

1. User data MUST NOT be logged
2. User data MUST NOT be transmitted without consent
3. Results SHOULD be clearable from UI
4. No persistent storage of user inputs

---

## 12. IANA Considerations

### 12.1 Media Types

This specification does not define new media types. Standard types are used:

- `application/json` for JSON documents
- `text/yaml` for OpenAPI specifications
- `text/plain` for llms.txt
- `text/html` for embed bundles

### 12.2 Well-Known URIs

CTP defines the following well-known URI:

- `/.well-known/ctp-manifest.json` - CTP service manifest

---

## Appendix A: JSON Schema

The complete JSON schemas are available at:

- `schemas/tool-definition.schema.json`
- `schemas/tool-result.schema.json`
- `schemas/ctp-manifest.schema.json`
- `schemas/embed-config.schema.json`

## Appendix B: Reference Implementation

The reference implementation is available as npm packages:

- `@conveniencepro/ctp-core`
- `@conveniencepro/ctp-runtime`
- `@conveniencepro/ctp-discovery`
- `@conveniencepro/ctp-sdk`

## Appendix C: Changelog

### Version 1.0.0 (2025-01-15)

- Initial specification release
- Tool definition schema
- Parameter types and validation
- Discovery document formats
- Embedding protocol
- Security requirements

---

## References

- [RFC 2119](https://tools.ietf.org/html/rfc2119) - Key words for use in RFCs
- [Model Context Protocol](https://modelcontextprotocol.io/) - Base protocol
- [JSON Schema 2020-12](https://json-schema.org/draft/2020-12/schema)
- [OpenAPI 3.1](https://spec.openapis.org/oas/v3.1.0)

---

© 2025 ConveniencePro. This specification is released under MIT License.

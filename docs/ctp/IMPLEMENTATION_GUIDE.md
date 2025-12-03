# CTP Implementation Guide

This guide walks you through implementing CTP-compliant tools from scratch.

---

## Table of Contents

1. [Quick Start](#1-quick-start)
2. [Tool Definition](#2-tool-definition)
3. [Parameter Design](#3-parameter-design)
4. [Implementation Patterns](#4-implementation-patterns)
5. [Testing](#5-testing)
6. [Discovery Integration](#6-discovery-integration)
7. [Embedding](#7-embedding)
8. [Best Practices](#8-best-practices)

---

## 1. Quick Start

### Installation

```bash
npm install @conveniencepro/ctp-core @conveniencepro/ctp-runtime
```

### Minimal Example

```typescript
import { defineTool, success } from '@conveniencepro/ctp-core';
import { registerTool, executeTool } from '@conveniencepro/ctp-runtime';

// 1. Define the tool
const uppercaseTool = defineTool({
  id: 'uppercase',
  name: 'Uppercase',
  description: 'Convert text to uppercase',
  category: 'utilities',
  tags: ['text', 'case', 'uppercase'],
  method: 'POST',
  parameters: [
    {
      name: 'text',
      type: 'text',
      label: 'Text',
      description: 'Text to convert',
      required: true,
    },
  ],
  outputDescription: 'Uppercase text',
  example: {
    input: { text: 'hello' },
    output: { result: 'HELLO' },
  },
});

// 2. Register with implementation
registerTool(uppercaseTool, (params) => {
  const text = params.text as string;
  return success({ result: text.toUpperCase() });
});

// 3. Execute
const result = await executeTool('uppercase', { text: 'hello world' });
console.log(result.data.result); // "HELLO WORLD"
```

---

## 2. Tool Definition

### Required Fields

Every tool MUST have these fields:

```typescript
const tool = defineTool({
  // Unique identifier (lowercase, hyphenated)
  id: 'json-formatter',

  // Display name
  name: 'JSON Formatter',

  // Detailed description (for users and AI)
  description: 'Format, validate, and beautify JSON data with customizable indentation.',

  // Category for organization
  category: 'formatters',

  // Searchable tags
  tags: ['json', 'format', 'beautify', 'validate'],

  // HTTP method for API
  method: 'POST',

  // Input parameters (see Section 3)
  parameters: [...],

  // What the tool outputs
  outputDescription: 'Formatted JSON string',

  // Example for docs and testing
  example: {
    input: { json: '{"a":1}', indent: '2' },
    output: { formatted: '{\n  "a": 1\n}' },
  },
});
```

### Optional Fields

```typescript
const tool = defineTool({
  // ... required fields ...

  // Semantic version
  version: '1.0.0',

  // Icon (emoji or identifier)
  icon: '📋',

  // Additional search keywords
  keywords: ['prettify', 'lint'],

  // Related tool IDs
  relatedTools: ['json-validator', 'json-minifier'],

  // Special instructions for AI models
  aiInstructions: 'Use 2-space indent for display, 0 for minification.',

  // Where tool can execute
  executionMode: 'client', // 'client' | 'server' | 'hybrid'

  // Rate limiting (for server execution)
  rateLimit: {
    requests: 100,
    window: 60, // seconds
  },

  // Deprecation info
  deprecated: false,
  deprecationMessage: undefined,
});
```

### Categories

Choose the most appropriate category:

| Category | Use For |
|----------|---------|
| `formatters` | Beautifying, formatting data |
| `encoders` | Encoding/decoding (Base64, URL, HTML) |
| `generators` | Creating data (UUID, password, hash) |
| `converters` | Converting between formats |
| `validators` | Validating data |
| `analyzers` | Analyzing/inspecting data |
| `editors` | Interactive editing |
| `utilities` | General purpose |

---

## 3. Parameter Design

### Parameter Structure

```typescript
interface ParameterSchema {
  name: string;        // Identifier (camelCase)
  type: FieldType;     // Input type
  label: string;       // Display label
  description: string; // Help text
  required: boolean;   // Is required?

  // Optional
  defaultValue?: unknown;
  placeholder?: string;
  options?: SelectOption[];    // For 'select' type
  validation?: ValidationConstraints;
  dependsOn?: DependencyRule[];
  aiHint?: string;
}
```

### Field Types

#### Text Input

```typescript
{
  name: 'input',
  type: 'text',
  label: 'Input Text',
  description: 'Single line of text',
  required: true,
  placeholder: 'Enter text...',
  validation: {
    minLength: 1,
    maxLength: 100,
    pattern: '^[a-zA-Z]+$', // Letters only
  },
}
```

#### Textarea

```typescript
{
  name: 'json',
  type: 'textarea',
  label: 'JSON Input',
  description: 'Multi-line JSON data',
  required: true,
  validation: {
    minLength: 1,
    maxLength: 1000000, // 1MB
  },
}
```

#### Number

```typescript
{
  name: 'count',
  type: 'number',
  label: 'Count',
  description: 'Number of items',
  required: false,
  defaultValue: 10,
  validation: {
    min: 1,
    max: 100,
    step: 1,
  },
}
```

#### Boolean

```typescript
{
  name: 'includeHeaders',
  type: 'boolean',
  label: 'Include Headers',
  description: 'Include column headers in output',
  required: false,
  defaultValue: true,
}
```

#### Select

```typescript
{
  name: 'algorithm',
  type: 'select',
  label: 'Algorithm',
  description: 'Hash algorithm to use',
  required: false,
  defaultValue: 'SHA-256',
  options: [
    { value: 'SHA-1', label: 'SHA-1', description: 'Legacy (not secure)' },
    { value: 'SHA-256', label: 'SHA-256', description: 'Recommended' },
    { value: 'SHA-512', label: 'SHA-512', description: 'Strongest' },
  ],
  aiHint: 'Use SHA-256 unless user specifies otherwise',
}
```

#### JSON

```typescript
{
  name: 'config',
  type: 'json',
  label: 'Configuration',
  description: 'JSON configuration object',
  required: false,
  defaultValue: '{}',
  placeholder: '{"key": "value"}',
}
```

### Conditional Parameters

Show parameters based on other values:

```typescript
{
  name: 'indentType',
  type: 'select',
  label: 'Indent Type',
  options: [
    { value: 'spaces', label: 'Spaces' },
    { value: 'tabs', label: 'Tabs' },
    { value: 'custom', label: 'Custom' },
  ],
},
{
  name: 'customIndent',
  type: 'number',
  label: 'Custom Indent Size',
  required: true,
  dependsOn: [
    { field: 'indentType', condition: 'equals', value: 'custom' }
  ],
}
```

---

## 4. Implementation Patterns

### Synchronous Tool

```typescript
import { success, failure } from '@conveniencepro/ctp-core';

const jsonFormatterFn = (params) => {
  const json = params.json as string;
  const indent = parseInt(params.indent as string) || 2;

  try {
    const parsed = JSON.parse(json);
    const formatted = JSON.stringify(parsed, null, indent);

    return success({
      formatted,
      valid: true,
      lineCount: formatted.split('\n').length,
    });
  } catch (e) {
    return failure(`Invalid JSON: ${e.message}`, 'INVALID_INPUT');
  }
};
```

### Asynchronous Tool

```typescript
const hashGeneratorFn = async (params) => {
  const input = params.input as string;
  const algorithm = (params.algorithm as string) || 'SHA-256';

  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return success({ hash, algorithm });
  } catch (e) {
    return failure(`Hash generation failed: ${e.message}`, 'EXECUTION_ERROR');
  }
};
```

### With Metadata

```typescript
const toolFn = (params) => {
  const startTime = performance.now();

  // ... processing ...

  return {
    success: true,
    data: { result },
    metadata: {
      executionTime: performance.now() - startTime,
      inputSize: JSON.stringify(params).length,
      outputSize: JSON.stringify(result).length,
      warnings: someCondition ? ['Warning message'] : undefined,
    },
  };
};
```

### Error Handling

```typescript
const toolFn = (params) => {
  // Validation errors
  if (!params.input) {
    return failure('Input is required', 'MISSING_REQUIRED');
  }

  // Type errors
  if (typeof params.input !== 'string') {
    return failure('Input must be a string', 'TYPE_ERROR');
  }

  // Constraint violations
  if (params.input.length > 1000000) {
    return failure('Input exceeds maximum size', 'CONSTRAINT_VIOLATION');
  }

  try {
    // Processing...
    return success({ result });
  } catch (e) {
    // Runtime errors
    return failure(`Processing failed: ${e.message}`, 'EXECUTION_ERROR');
  }
};
```

---

## 5. Testing

### Unit Testing

```typescript
import { describe, test, expect } from 'vitest';
import { jsonFormatterFn, jsonFormatterDefinition } from './json-formatter';
import { validateToolDefinition, validateParameters } from '@conveniencepro/ctp-core';

describe('JSON Formatter', () => {
  test('definition is valid', () => {
    const result = validateToolDefinition(jsonFormatterDefinition);
    expect(result.valid).toBe(true);
  });

  test('formats valid JSON', () => {
    const result = jsonFormatterFn({ json: '{"a":1}', indent: '2' });
    expect(result.success).toBe(true);
    expect(result.data.formatted).toBe('{\n  "a": 1\n}');
  });

  test('returns error for invalid JSON', () => {
    const result = jsonFormatterFn({ json: 'not json' });
    expect(result.success).toBe(false);
    expect(result.errorCode).toBe('INVALID_INPUT');
  });

  test('validates parameters', () => {
    const result = validateParameters(
      jsonFormatterDefinition.parameters,
      { json: '', indent: '2' }
    );
    expect(result.valid).toBe(false);
  });
});
```

### Integration Testing

```typescript
import { createRegistry } from '@conveniencepro/ctp-runtime';
import { jsonFormatterDefinition, jsonFormatterFn } from './json-formatter';

test('tool executes through registry', async () => {
  const registry = createRegistry();
  registry.register(jsonFormatterDefinition, jsonFormatterFn);

  const result = await registry.execute('json-formatter', {
    json: '{"test":true}',
  });

  expect(result.success).toBe(true);
});
```

---

## 6. Discovery Integration

### Generate Discovery Files

```typescript
import { generateAllDiscoveryFiles } from '@conveniencepro/ctp-discovery';
import { getAllDefinitions } from '@conveniencepro/ctp-runtime';

const tools = getAllDefinitions();

const files = generateAllDiscoveryFiles(tools, {
  name: 'My Tools',
  description: 'Collection of utility tools',
  baseUrl: 'https://mytools.example.com',
  pathPrefix: '/api/tools',
});

// files.ctpManifest - JSON string
// files.openapi - YAML string
// files.aiTools - JSON string
// files.llmsTxt - Text string
// files.llmsFullTxt - Detailed text
```

### Serve Discovery Endpoints

```typescript
// Express.js example
import express from 'express';

app.get('/.well-known/ctp-manifest.json', (req, res) => {
  res.type('application/json').send(files.ctpManifest);
});

app.get('/api/openapi.yaml', (req, res) => {
  res.type('text/yaml').send(files.openapi);
});

app.get('/llms.txt', (req, res) => {
  res.type('text/plain').send(files.llmsTxt);
});
```

---

## 7. Embedding

### SDK Usage

```typescript
import { embed } from '@conveniencepro/ctp-sdk';

const controller = embed('container-id', 'json-formatter', {
  autosense: true,        // Auto-detect styles
  watchTheme: true,       // React to theme changes
  onReady: (ctrl) => {
    console.log('Embed ready');
  },
  onResult: (result) => {
    console.log('Got result:', result);
  },
});

// Update styles
controller.updateStyles({ theme: 'dark' });

// Cleanup
controller.destroy();
```

### HTML Data Attributes

```html
<div
  data-ctp-tool="json-formatter"
  data-ctp-theme="dark"
  data-ctp-accent="#3b82f6"
  data-ctp-autosense="true"
></div>

<script src="https://cdn.jsdelivr.net/npm/@conveniencepro/ctp-sdk"></script>
```

### Creating Embeddable Bundles

For client-execution tools, create self-contained HTML:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    :root {
      --bg: var(--ctp-bg, #0a0a0a);
      --text: var(--ctp-text, #fafafa);
      --accent: var(--ctp-accent, #3b82f6);
    }
    body { background: var(--bg); color: var(--text); }
    /* ... tool styles ... */
  </style>
</head>
<body>
  <div id="app">
    <!-- Tool UI -->
  </div>
  <script>
    // Tool implementation
    // Read URL params for styling
    const params = new URLSearchParams(location.search);
    if (params.get('theme') === 'dark') {
      document.documentElement.style.setProperty('--ctp-bg', '#0a0a0a');
    }

    // Notify parent when ready
    parent.postMessage({ type: 'ready' }, '*');

    // Send results to parent
    function sendResult(data) {
      parent.postMessage({ type: 'result', payload: data }, '*');
    }
  </script>
</body>
</html>
```

---

## 8. Best Practices

### Tool Design

1. **Single Responsibility**: Each tool does one thing well
2. **Sensible Defaults**: Work without configuration
3. **Clear Naming**: `id` describes function (`json-formatter`, not `format1`)
4. **Comprehensive Description**: Help AI understand usage

### Parameter Design

1. **Required First**: Put required params before optional
2. **Smart Defaults**: Most common use case works with defaults
3. **Helpful Placeholders**: Show expected format
4. **Clear Constraints**: Document limits upfront

### Implementation

1. **Validate Early**: Check inputs before processing
2. **Fail Gracefully**: Return structured errors, don't throw
3. **Include Metadata**: Execution time, sizes help debugging
4. **Stay Idempotent**: Same input = same output

### Security

1. **Never `eval()`**: No dynamic code execution
2. **Sanitize Display**: Escape HTML in outputs
3. **Limit Sizes**: Prevent resource exhaustion
4. **No External Calls**: Client tools stay local

### Documentation

1. **Working Examples**: Include real input/output
2. **AI Instructions**: Help LLMs use tools correctly
3. **Related Tools**: Link alternatives

---

## Next Steps

- Read the [SPECIFICATION.md](./SPECIFICATION.md) for complete protocol details
- See [examples/](./examples/) for full tool implementations
- Check [MCP_COMPLIANCE.md](./MCP_COMPLIANCE.md) for MCP integration

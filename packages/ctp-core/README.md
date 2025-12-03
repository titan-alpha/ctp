# @conveniencepro/ctp-core

Core types and interfaces for the **ConveniencePro Tool Protocol (CTP)**.

CTP is a protocol for defining, discovering, and executing browser-native utility tools. It extends MCP (Model Context Protocol) principles to client-side execution with a privacy-first design.

## Installation

```bash
npm install @conveniencepro/ctp-core
# or
yarn add @conveniencepro/ctp-core
# or
pnpm add @conveniencepro/ctp-core
```

## Quick Start

```typescript
import {
  defineTool,
  success,
  failure,
  type ToolDefinition,
  type ToolFunction,
} from '@conveniencepro/ctp-core';

// Define a tool with full type safety
const myToolDefinition = defineTool({
  id: 'my-tool',
  name: 'My Tool',
  description: 'A simple example tool',
  category: 'examples',
  tags: ['example', 'demo'],
  method: 'GET',
  parameters: [
    {
      name: 'input',
      type: 'text',
      label: 'Input',
      description: 'The input text to process',
      required: true,
      placeholder: 'Enter text...',
    },
  ],
  outputDescription: 'Returns the processed text',
  example: {
    input: { input: 'hello' },
    output: { success: true, result: 'HELLO' },
  },
});

// Implement the tool function
const myTool: ToolFunction = (params) => {
  const input = params.input;

  if (!input) {
    return failure('Missing required parameter: input');
  }

  return success({
    result: input.toUpperCase(),
    length: input.length,
  });
};
```

## Core Types

### ToolDefinition

The primary interface for defining a CTP-compliant tool:

```typescript
interface ToolDefinition {
  id: string;                    // Unique identifier (URL-safe)
  name: string;                  // Human-readable name
  description: string;           // Tool description
  category: string;              // Category for organization
  tags: string[];                // Discovery tags
  method: 'GET' | 'POST';        // HTTP method
  parameters: ParameterSchema[]; // Input parameters
  outputDescription: string;     // Output format description
  example: ToolExample;          // Example input/output
  // ... additional optional fields
}
```

### ParameterSchema

Defines a single parameter:

```typescript
interface ParameterSchema {
  name: string;        // Parameter name
  type: FieldType;     // 'text' | 'textarea' | 'number' | 'boolean' | 'select' | 'json' | ...
  label: string;       // Display label
  description: string; // Parameter description
  required: boolean;   // Is required?
  default?: unknown;   // Default value
  // ... validation constraints
}
```

### ToolResult

All tools return this format:

```typescript
type ToolResult<T> =
  | { success: true; [key: string]: unknown }
  | { success: false; error: string; errorCode?: string };
```

## Validation

Validate tool definitions and parameters at runtime:

```typescript
import {
  validateToolDefinition,
  validateParameters,
  normalizeParams,
} from '@conveniencepro/ctp-core';

// Validate a tool definition
const result = validateToolDefinition(myDefinition);
if (!result.valid) {
  console.error('Validation errors:', result.errors);
}

// Validate parameters
const params = normalizeParams(new URLSearchParams('input=hello'));
const paramResult = validateParameters(params, myDefinition);
```

## Helper Functions

```typescript
import {
  success,
  failure,
  safeExecute,
  getProtocolInfo,
} from '@conveniencepro/ctp-core';

// Create success/failure results
const okResult = success({ data: 'processed' });
const errResult = failure('Something went wrong', 'ERR_INVALID_INPUT');

// Safe execution with validation
const result = await safeExecute(myTool, params, myDefinition);

// Get protocol info
const info = getProtocolInfo();
// { name: 'ConveniencePro Tool Protocol', version: '1.0.0', ... }
```

## Type Utilities

```typescript
import type {
  ToolFunction,
  ToolFunctionAsync,
  NormalizedParams,
  ToolId,
} from '@conveniencepro/ctp-core';

import { createToolId, isValidToolId } from '@conveniencepro/ctp-core';

// Branded tool IDs for type safety
const toolId = createToolId('json-format'); // ToolId type

// Validate ID format
isValidToolId('my-tool');     // true
isValidToolId('MyTool');      // false (must be lowercase)
isValidToolId('my_tool');     // false (no underscores)
```

## Protocol Version

```typescript
import { CTP_VERSION } from '@conveniencepro/ctp-core';

console.log(CTP_VERSION); // '1.0.0'
```

## Related Packages

- `@conveniencepro/ctp-runtime` - Tool execution runtime (browser & Node.js)
- `@conveniencepro/ctp-discovery` - Manifest generation (OpenAPI, AI tools)
- `@conveniencepro/ctp-sdk` - Embeddable SDK for websites

## License

MIT © ConveniencePro

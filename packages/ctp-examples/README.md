# @conveniencepro/ctp-examples

Example tool implementations for the **ConveniencePro Tool Protocol (CTP)**.

## Overview

This package provides reference implementations demonstrating CTP best practices:

- **JSON Formatter** - Synchronous tool with multiple parameters
- **Base64 Encoder** - Bidirectional tool with conditional parameters
- **Hash Generator** - Async tool using Web Crypto API

## Installation

```bash
npm install @conveniencepro/ctp-examples
# or
yarn add @conveniencepro/ctp-examples
```

## Usage

### Create Registry with Example Tools

```typescript
import { createExampleRegistry } from '@conveniencepro/ctp-examples';

const registry = createExampleRegistry();

// Execute a tool
const result = await registry.execute('json-formatter', {
  json: '{"name":"test"}',
  indent: '2',
});

console.log(result.data.formatted);
```

### Add to Existing Registry

```typescript
import { createRegistry } from '@conveniencepro/ctp-runtime';
import { registerExampleTools } from '@conveniencepro/ctp-examples';

const registry = createRegistry();
registerExampleTools(registry);

// Your tools + example tools now available
```

### Use Individual Tools

```typescript
import {
  jsonFormatterDefinition,
  jsonFormatterFn,
  base64EncoderDefinition,
  base64EncoderFn,
  hashGeneratorDefinition,
  hashGeneratorFn,
} from '@conveniencepro/ctp-examples';

// Register only specific tools
registry.register(jsonFormatterDefinition, jsonFormatterFn);
```

### Get Tool Definitions

```typescript
import { getToolDefinitions, getToolById } from '@conveniencepro/ctp-examples';

// Get all definitions
const definitions = getToolDefinitions();

// Get specific tool
const jsonFormatter = getToolById('json-formatter');
```

## Example Tools

### JSON Formatter

**ID:** `json-formatter`
**Category:** `formatters`

Format, validate, and beautify JSON data.

**Parameters:**
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `json` | textarea | Yes | - | JSON string to format |
| `indent` | select | No | `2` | Indentation (0, 2, 4, tab) |
| `sortKeys` | boolean | No | `false` | Sort keys alphabetically |

**Example:**
```typescript
const result = await registry.execute('json-formatter', {
  json: '{"b":2,"a":1}',
  indent: '2',
  sortKeys: true,
});

// Output:
// {
//   "a": 1,
//   "b": 2
// }
```

---

### Base64 Encoder/Decoder

**ID:** `base64-encoder`
**Category:** `encoders`

Encode text to Base64 or decode Base64 to text.

**Parameters:**
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `input` | textarea | Yes | - | Text or Base64 string |
| `mode` | select | No | `encode` | Operation mode |
| `urlSafe` | boolean | No | `false` | Use URL-safe variant |

**Example:**
```typescript
// Encode
const encoded = await registry.execute('base64-encoder', {
  input: 'Hello, World!',
  mode: 'encode',
});
// Output: SGVsbG8sIFdvcmxkIQ==

// Decode
const decoded = await registry.execute('base64-encoder', {
  input: 'SGVsbG8sIFdvcmxkIQ==',
  mode: 'decode',
});
// Output: Hello, World!
```

---

### Hash Generator

**ID:** `hash-generator`
**Category:** `generators`

Generate cryptographic hashes using SHA algorithms.

**Parameters:**
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `input` | textarea | Yes | - | Text to hash |
| `algorithm` | select | No | `SHA-256` | Hash algorithm |
| `format` | select | No | `hex` | Output format |

**Example:**
```typescript
const result = await registry.execute('hash-generator', {
  input: 'hello world',
  algorithm: 'SHA-256',
  format: 'hex',
});
// Output: b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9
```

## Creating Your Own Tools

Use these examples as templates. Key patterns:

### 1. Define Types

```typescript
interface MyToolResult {
  output: string;
  // ...
}
```

### 2. Create Definition

```typescript
const myToolDefinition: ToolDefinition = {
  id: 'my-tool',
  name: 'My Tool',
  description: '...',
  category: 'utilities',
  tags: ['example'],
  method: 'POST',
  parameters: [...],
  outputDescription: '...',
  example: { input: {...}, output: {...} },
};
```

### 3. Implement Function

```typescript
const myToolFn: ToolFunction<MyToolResult> = (params) => {
  // Validate
  if (!params.input) {
    return { success: false, error: '...', errorCode: 'MISSING_REQUIRED' };
  }

  // Process
  const output = processInput(params.input);

  // Return
  return {
    success: true,
    data: { output },
    metadata: { executionTime: 0 },
  };
};
```

### 4. Export Both

```typescript
export default { definition: myToolDefinition, fn: myToolFn };
```

## Related Packages

- `@conveniencepro/ctp-core` - Core types
- `@conveniencepro/ctp-runtime` - Execution runtime
- `@conveniencepro/ctp-spec` - Protocol specification

## License

MIT © ConveniencePro

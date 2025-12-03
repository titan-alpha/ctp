# @conveniencepro/ctp-runtime

Dual execution runtime for the **ConveniencePro Tool Protocol (CTP)**.

Provides tool registration, execution, and utilities for both browser and Node.js environments.

## Installation

```bash
npm install @conveniencepro/ctp-runtime
# or
yarn add @conveniencepro/ctp-runtime
# or
pnpm add @conveniencepro/ctp-runtime
```

## Quick Start

```typescript
import {
  registerTool,
  executeTool,
  tool,
  success,
  failure,
} from '@conveniencepro/ctp-runtime';

// Register a tool using the fluent builder
tool()
  .id('reverse-text')
  .name('Reverse Text')
  .description('Reverse the characters in text')
  .category('text')
  .tags('text', 'reverse', 'transform')
  .param({
    name: 'text',
    type: 'textarea',
    label: 'Input Text',
    description: 'Text to reverse',
    required: true,
  })
  .output('Returns reversed text')
  .example({ text: 'hello' }, { success: true, result: 'olleh' })
  .implement((params) => {
    if (!params.text) {
      return failure('Missing required parameter: text');
    }
    return success({
      result: params.text.split('').reverse().join(''),
      originalLength: params.text.length,
    });
  })
  .register();

// Execute the tool
const result = await executeTool('reverse-text', { text: 'Hello World' });
console.log(result);
// { success: true, result: 'dlroW olleH', originalLength: 11, _meta: {...} }
```

## Environment-Specific Imports

### Browser Runtime

```typescript
import {
  base64Encode,
  base64Decode,
  sha256,
  sha512,
  generateUUID,
  ClientRuntime,
  createClientRuntime,
} from '@conveniencepro/ctp-runtime/client';

// Encoding
const encoded = base64Encode('Hello World');
const decoded = base64Decode(encoded);

// Hashing (async - uses Web Crypto)
const hash = await sha256('password');

// UUID
const uuid = generateUUID();
```

### Server Runtime (Node.js)

```typescript
import {
  base64Encode,
  base64Decode,
  sha256,
  md5,
  hashSync,
  generateUUID,
  generateUUIDSync,
  ServerRuntime,
  createServerRuntime,
} from '@conveniencepro/ctp-runtime/server';

// Encoding (sync)
const encoded = base64Encode('Hello World');

// Hashing (sync available)
const hash = hashSync('password', 'sha256');

// UUID (sync available)
const uuid = generateUUIDSync();
```

## Tool Registry

### Create and Use a Registry

```typescript
import { createRegistry } from '@conveniencepro/ctp-runtime/registry';

// Create a custom registry
const registry = createRegistry();

// Register tools
registry.register(myToolDefinition, myToolFunction);

// Execute tools
const result = await registry.execute('my-tool', { input: 'test' });

// Query tools
const tools = registry.list();
const definitions = registry.definitions();
const textTools = registry.getByCategory('text');
const hashTools = registry.searchByTags(['hash', 'crypto']);
```

### Global Registry

```typescript
import {
  registerTool,
  executeTool,
  getTool,
  hasTool,
  listTools,
  getAllDefinitions,
  getGlobalRegistry,
} from '@conveniencepro/ctp-runtime';

// All these use a shared global registry
registerTool(definition, implementation);
const result = await executeTool('tool-id', params);
const exists = hasTool('tool-id');
const allTools = listTools();
```

## Batch Execution

```typescript
import { executeBatch, executeSequential } from '@conveniencepro/ctp-runtime';

// Execute multiple tools in parallel
const results = await executeBatch([
  { id: 'req-1', toolId: 'hash-sha256', params: { text: 'password1' } },
  { id: 'req-2', toolId: 'hash-sha256', params: { text: 'password2' } },
  { id: 'req-3', toolId: 'base64-encode', params: { text: 'hello' } },
]);

// Execute sequentially (stops on first failure)
const sequential = await executeSequential([
  { id: 'step-1', toolId: 'validate-input', params: { ... } },
  { id: 'step-2', toolId: 'process-data', params: { ... } },
  { id: 'step-3', toolId: 'save-result', params: { ... } },
]);
```

## Tool Builder

Fluent API for defining tools:

```typescript
import { tool } from '@conveniencepro/ctp-runtime';

const definition = tool<{ result: string; count: number }>()
  .id('count-words')
  .name('Word Counter')
  .description('Count words in text')
  .category('text')
  .tags('text', 'count', 'words')
  .method('POST')
  .param({
    name: 'text',
    type: 'textarea',
    label: 'Input Text',
    description: 'Text to count words in',
    required: true,
    rows: 5,
  })
  .output('Returns word count')
  .example(
    { text: 'hello world' },
    { success: true, result: '2 words', count: 2 }
  )
  .implement((params) => {
    const words = params.text?.trim().split(/\s+/).filter(Boolean) ?? [];
    return {
      success: true,
      result: `${words.length} words`,
      count: words.length,
    };
  })
  .register();
```

## Universal Utilities

These work in both browser and Node.js:

```typescript
import {
  urlEncode,
  urlDecode,
  htmlEncode,
  htmlDecode,
  isValidUUID,
  formatJSON,
  minifyJSON,
  getTextStats,
  convertCase,
  detectEnvironment,
  isBrowser,
  isNode,
} from '@conveniencepro/ctp-runtime';

// Environment detection
const env = detectEnvironment(); // 'browser' | 'node' | 'unknown'

// URL encoding
const encoded = urlEncode('hello world');

// JSON formatting
const formatted = formatJSON('{"a":1}');

// Text stats
const stats = getTextStats('Hello World');
// { characters: 11, words: 2, lines: 1, ... }

// Case conversion
const camel = convertCase('hello world', 'camel'); // 'helloWorld'
const snake = convertCase('HelloWorld', 'snake');  // 'hello_world'
```

## Related Packages

- `@conveniencepro/ctp-core` - Core types and interfaces
- `@conveniencepro/ctp-discovery` - Manifest generation
- `@conveniencepro/ctp-sdk` - Embeddable SDK

## License

MIT © ConveniencePro

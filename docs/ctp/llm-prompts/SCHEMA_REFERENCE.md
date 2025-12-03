# CTP Schema Quick Reference

> **Purpose:** Compact reference for LLMs generating CTP tools. Use alongside TOOL_GENERATOR.md.

---

## Tool Definition (Required Fields)

```typescript
{
  id: string,           // "json-formatter" (lowercase-hyphenated)
  name: string,         // "JSON Formatter" (max 50 chars)
  description: string,  // "Format JSON data" (max 500 chars)
  category: Category,   // see below
  tags: string[],       // ["json", "format"]
  method: "GET" | "POST",
  parameters: Parameter[],
  outputDescription: string,
  example: { input: object, output: any }
}
```

## Categories

```
formatters | encoders | generators | converters | validators | analyzers | editors | utilities
```

## Parameter Types

| Type | For | Example |
|------|-----|---------|
| `text` | Single line | Name, title |
| `textarea` | Multi-line | JSON, code |
| `number` | Numbers | Count, size |
| `boolean` | Yes/no | Include flag |
| `select` | Choices | Algorithm |
| `json` | JSON object | Config |
| `file` | Upload | Image |
| `color` | Color | #hex |
| `date` | Date | 2025-01-15 |
| `url` | URL | https://... |
| `email` | Email | user@... |

## Parameter Schema

```typescript
{
  name: string,        // "inputText"
  type: FieldType,     // "textarea"
  label: string,       // "Input Text"
  description: string, // "Text to process"
  required: boolean,   // true

  // Optional:
  defaultValue?: any,
  placeholder?: string,
  options?: [{ value, label, description? }],  // for select
  validation?: {
    minLength?, maxLength?, pattern?,  // strings
    min?, max?, step?                  // numbers
  },
  aiHint?: string
}
```

## Result Format

```typescript
// Success
{ success: true, data: T, metadata?: { executionTime?, warnings? } }

// Error
{ success: false, error: string, errorCode: ErrorCode }
```

## Error Codes

```
INVALID_INPUT | MISSING_REQUIRED | TYPE_ERROR | CONSTRAINT_VIOLATION | EXECUTION_ERROR | TIMEOUT
```

## Minimal Tool Template

```typescript
import type { ToolDefinition, ToolFunction, ToolResult } from '@conveniencepro/ctp-core';

interface MyResult { output: string; }

export const myToolDefinition: ToolDefinition = {
  id: 'my-tool',
  name: 'My Tool',
  description: 'Does something useful',
  category: 'utilities',
  tags: ['example'],
  method: 'POST',
  parameters: [{
    name: 'input',
    type: 'text',
    label: 'Input',
    description: 'The input value',
    required: true,
  }],
  outputDescription: 'The processed output',
  example: { input: { input: 'hello' }, output: { output: 'HELLO' } },
};

export const myToolFn: ToolFunction<MyResult> = (params) => {
  const input = params.input as string;
  if (!input) return { success: false, error: 'Required', errorCode: 'MISSING_REQUIRED' };
  return { success: true, data: { output: input.toUpperCase() } };
};

export default { definition: myToolDefinition, fn: myToolFn };
```

## Common Patterns

### Select with Options

```typescript
{
  name: 'format',
  type: 'select',
  label: 'Format',
  description: 'Output format',
  required: false,
  defaultValue: 'json',
  options: [
    { value: 'json', label: 'JSON' },
    { value: 'xml', label: 'XML' },
  ],
}
```

### Number with Constraints

```typescript
{
  name: 'count',
  type: 'number',
  label: 'Count',
  description: 'Number of items',
  required: false,
  defaultValue: 10,
  validation: { min: 1, max: 100 },
}
```

### Conditional Parameter

```typescript
{
  name: 'customValue',
  type: 'text',
  label: 'Custom Value',
  description: 'Enter custom value',
  required: true,
  dependsOn: [{ field: 'type', condition: 'equals', value: 'custom' }],
}
```

### Async Function

```typescript
export const myToolFn: ToolFunction<MyResult> = async (params) => {
  const result = await someAsyncOperation(params.input);
  return { success: true, data: result };
};
```

## Security Rules

- ❌ No `eval()` or `new Function()`
- ❌ No `innerHTML` with user data
- ❌ No external fetch (client mode)
- ✅ Always validate inputs
- ✅ Return structured errors
- ✅ Use try/catch for operations

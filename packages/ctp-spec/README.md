# @conveniencepro/ctp-spec

Formal specification and JSON schemas for the **ConveniencePro Tool Protocol (CTP)**.

## Overview

This package contains:

- **SPEC.md** - Complete protocol specification
- **JSON Schemas** - Validation schemas for all CTP documents
- **Type Constants** - Standard values and type definitions

## Installation

```bash
npm install @conveniencepro/ctp-spec
# or
yarn add @conveniencepro/ctp-spec
```

## JSON Schemas

### Tool Definition Schema

Validates tool definition documents:

```json
{
  "$ref": "https://conveniencepro.cc/schemas/tool-definition.schema.json"
}
```

### Tool Result Schema

Validates tool execution results:

```json
{
  "$ref": "https://conveniencepro.cc/schemas/tool-result.schema.json"
}
```

### CTP Manifest Schema

Validates service manifests:

```json
{
  "$ref": "https://conveniencepro.cc/schemas/ctp-manifest.schema.json"
}
```

### Embed Config Schema

Validates embed configurations:

```json
{
  "$ref": "https://conveniencepro.cc/schemas/embed-config.schema.json"
}
```

## Usage

### Using with AJV

```typescript
import Ajv from 'ajv';
import toolDefinitionSchema from '@conveniencepro/ctp-spec/schemas/tool-definition.schema.json';

const ajv = new Ajv();
const validate = ajv.compile(toolDefinitionSchema);

const isValid = validate(myToolDefinition);
if (!isValid) {
  console.error(validate.errors);
}
```

### Importing Constants

```typescript
import {
  CTP_SPEC_VERSION,
  FIELD_TYPES,
  CATEGORIES,
  ERROR_CODES,
} from '@conveniencepro/ctp-spec';

// Type-safe field type
const fieldType: FieldType = 'textarea';

// All standard categories
console.log(CATEGORIES);
// ['formatters', 'encoders', 'generators', ...]
```

## Schema Files

| File | Description |
|------|-------------|
| `tool-definition.schema.json` | Complete tool definition validation |
| `tool-result.schema.json` | Tool execution result format |
| `ctp-manifest.schema.json` | Service manifest format |
| `embed-config.schema.json` | Embed configuration options |

## Specification

The complete CTP specification is available in [SPEC.md](./SPEC.md).

### Quick Reference

**Field Types:**
- `text`, `textarea`, `number`, `boolean`, `select`
- `json`, `file`, `color`, `date`, `datetime`, `url`, `email`

**Categories:**
- `formatters`, `encoders`, `generators`, `converters`
- `validators`, `analyzers`, `editors`, `utilities`

**Execution Modes:**
- `client` - Browser-only execution
- `server` - Server-required execution
- `hybrid` - Either environment

**Error Codes:**
- `INVALID_INPUT`, `MISSING_REQUIRED`, `TYPE_ERROR`
- `CONSTRAINT_VIOLATION`, `EXECUTION_ERROR`, `TIMEOUT`
- `RATE_LIMITED`, `UNAUTHORIZED`, `NOT_FOUND`, `INTERNAL_ERROR`

## Related Packages

- `@conveniencepro/ctp-core` - Core types and validation
- `@conveniencepro/ctp-runtime` - Execution runtime
- `@conveniencepro/ctp-discovery` - Discovery generators
- `@conveniencepro/ctp-sdk` - Embeddable SDK

## License

MIT © ConveniencePro

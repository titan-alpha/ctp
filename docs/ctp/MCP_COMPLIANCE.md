# CTP and MCP Compliance

**Version:** 1.0.0
**MCP Version:** 2025-06-18

This document describes how the ConveniencePro Tool Protocol (CTP) aligns with and extends the Model Context Protocol (MCP).

---

## Overview

CTP is designed as a **compatible extension** of MCP, meaning:

1. **Any CTP tool can be exposed as an MCP tool** with straightforward conversion
2. **CTP services can act as MCP servers** using standard MCP transports
3. **Additional CTP features** are layered on top without breaking MCP compatibility

---

## MCP Tool Definition Mapping

### Field Mapping

| CTP Field | MCP Field | Conversion |
|-----------|-----------|------------|
| `id` | `name` | Direct (CTP id format is MCP-compatible) |
| `name` | `title` | Direct |
| `description` | `description` | Direct |
| `parameters[]` | `inputSchema` | Convert to JSON Schema object |
| `example.output` | `outputSchema` | Optional, convert to JSON Schema |
| `aiInstructions` | `annotations._meta.aiInstructions` | Custom metadata |
| `executionMode` | `annotations.readOnlyHint` | `client` → readOnly: true |

### CTP Tool Definition

```typescript
// CTP Format
{
  id: 'json-formatter',
  name: 'JSON Formatter',
  description: 'Format and beautify JSON data',
  category: 'formatters',
  tags: ['json', 'format'],
  method: 'POST',
  parameters: [
    {
      name: 'json',
      type: 'textarea',
      label: 'JSON Input',
      description: 'JSON string to format',
      required: true,
      validation: { minLength: 1 }
    },
    {
      name: 'indent',
      type: 'select',
      label: 'Indentation',
      description: 'Number of spaces',
      required: false,
      defaultValue: '2',
      options: [
        { value: '2', label: '2 spaces' },
        { value: '4', label: '4 spaces' }
      ]
    }
  ],
  outputDescription: 'Formatted JSON string',
  example: {
    input: { json: '{"a":1}', indent: '2' },
    output: { formatted: '{\n  "a": 1\n}' }
  }
}
```

### Equivalent MCP Tool Definition

```typescript
// MCP Format (converted from CTP)
{
  name: 'json-formatter',
  title: 'JSON Formatter',
  description: 'Format and beautify JSON data',
  inputSchema: {
    type: 'object',
    properties: {
      json: {
        type: 'string',
        description: 'JSON string to format',
        minLength: 1
      },
      indent: {
        type: 'string',
        description: 'Number of spaces',
        enum: ['2', '4'],
        default: '2'
      }
    },
    required: ['json']
  },
  outputSchema: {
    type: 'object',
    properties: {
      formatted: {
        type: 'string',
        description: 'Formatted JSON string'
      }
    }
  },
  annotations: {
    readOnlyHint: true,  // CTP client-mode tools don't modify state
    idempotentHint: true,
    _meta: {
      ctpVersion: '1.0.0',
      category: 'formatters',
      tags: ['json', 'format']
    }
  }
}
```

---

## Parameter Type Conversion

CTP parameter types map to JSON Schema as follows:

| CTP Type | JSON Schema | Additional Properties |
|----------|-------------|----------------------|
| `text` | `{ type: 'string' }` | `minLength`, `maxLength`, `pattern` |
| `textarea` | `{ type: 'string' }` | Same as text |
| `number` | `{ type: 'number' }` | `minimum`, `maximum`, `multipleOf` |
| `boolean` | `{ type: 'boolean' }` | |
| `select` | `{ type: 'string', enum: [...] }` | Values from `options` |
| `json` | `{ type: 'string', format: 'json' }` | Custom format |
| `file` | `{ type: 'string', format: 'binary' }` | `contentMediaType` |
| `color` | `{ type: 'string', pattern: '^#[0-9a-fA-F]{6}$' }` | |
| `date` | `{ type: 'string', format: 'date' }` | |
| `datetime` | `{ type: 'string', format: 'date-time' }` | |
| `url` | `{ type: 'string', format: 'uri' }` | |
| `email` | `{ type: 'string', format: 'email' }` | |

### Conversion Function

```typescript
function ctpParameterToJsonSchema(param: ParameterSchema): JSONSchema {
  const schema: JSONSchema = {
    description: param.description,
  };

  switch (param.type) {
    case 'text':
    case 'textarea':
      schema.type = 'string';
      if (param.validation?.minLength) schema.minLength = param.validation.minLength;
      if (param.validation?.maxLength) schema.maxLength = param.validation.maxLength;
      if (param.validation?.pattern) schema.pattern = param.validation.pattern;
      break;

    case 'number':
      schema.type = 'number';
      if (param.validation?.min) schema.minimum = param.validation.min;
      if (param.validation?.max) schema.maximum = param.validation.max;
      break;

    case 'boolean':
      schema.type = 'boolean';
      break;

    case 'select':
      schema.type = 'string';
      schema.enum = param.options?.map(o => o.value);
      break;

    case 'json':
      schema.type = 'string';
      schema.format = 'json';
      break;

    // ... additional types
  }

  if (param.defaultValue !== undefined) {
    schema.default = param.defaultValue;
  }

  return schema;
}
```

---

## Transport Compatibility

### MCP Transports Supported

CTP services can expose tools via both MCP transport mechanisms:

#### 1. Streamable HTTP (Recommended for CTP)

```
Client                           CTP/MCP Server
  │                                    │
  │  POST /mcp                         │
  │  { method: 'initialize', ... }     │
  │ ──────────────────────────────────▶│
  │                                    │
  │  { capabilities: { tools: {} } }   │
  │ ◀──────────────────────────────────│
  │                                    │
  │  POST /mcp                         │
  │  { method: 'tools/list' }          │
  │ ──────────────────────────────────▶│
  │                                    │
  │  { tools: [...] }                  │
  │ ◀──────────────────────────────────│
  │                                    │
  │  POST /mcp                         │
  │  { method: 'tools/call',           │
  │    params: { name: 'json-formatter',│
  │              arguments: {...} } }  │
  │ ──────────────────────────────────▶│
  │                                    │
  │  { content: [{ type: 'text', ...}] │
  │ ◀──────────────────────────────────│
```

#### 2. stdio (For CLI Integration)

```bash
# Start CTP server with stdio transport
npx @conveniencepro/ctp-server --transport stdio

# MCP client connects via stdin/stdout
```

### CTP-Specific Endpoints

In addition to MCP's `/mcp` endpoint, CTP servers provide:

| Endpoint | Purpose | MCP Equivalent |
|----------|---------|----------------|
| `/api/tools/{id}` | Direct tool execution | `tools/call` |
| `/embed/{id}` | Embeddable iframe | None (CTP extension) |
| `/.well-known/ctp-manifest.json` | CTP manifest | Partial `tools/list` |

---

## Capability Negotiation

### CTP Server Capabilities

```typescript
// MCP initialize response with CTP extensions
{
  protocolVersion: '2025-06-18',
  capabilities: {
    tools: {
      listChanged: true
    },
    // CTP extensions in experimental namespace
    experimental: {
      ctp: {
        version: '1.0.0',
        features: [
          'embedding',      // Supports iframe embedding
          'autosense',      // Automatic style detection
          'clientExecution', // Browser-side execution
          'dualRuntime'     // Client + server execution
        ]
      }
    }
  },
  serverInfo: {
    name: 'ConveniencePro',
    version: '1.0.0'
  }
}
```

### Feature Detection

Clients can check for CTP features:

```typescript
async function checkCTPSupport(client: MCPClient): Promise<boolean> {
  const result = await client.initialize();
  return result.capabilities?.experimental?.ctp?.version !== undefined;
}
```

---

## Tool Execution Model

### MCP Standard Execution

MCP tools execute server-side and return results:

```typescript
// MCP tools/call request
{
  method: 'tools/call',
  params: {
    name: 'json-formatter',
    arguments: {
      json: '{"a":1}',
      indent: '2'
    }
  }
}

// MCP tools/call response
{
  content: [
    {
      type: 'text',
      text: '{\n  "a": 1\n}'
    }
  ]
}
```

### CTP Dual Execution

CTP extends this with execution mode hints:

```typescript
// CTP tool definition includes execution mode
{
  id: 'json-formatter',
  executionMode: 'client', // 'client' | 'server' | 'hybrid'
  // ...
}
```

**Execution Mode Behavior:**

| Mode | MCP Behavior | CTP Behavior |
|------|--------------|--------------|
| `client` | Server executes | Browser executes (privacy) |
| `server` | Server executes | Server executes |
| `hybrid` | Server executes | Client preferred, server fallback |

### Client Execution Protocol

For `client` mode tools, CTP provides the tool bundle for browser execution:

```typescript
// 1. Client requests tool bundle
GET /embed/json-formatter?format=bundle

// 2. Server returns self-contained HTML
<!DOCTYPE html>
<html>
<head>...</head>
<body>
  <!-- Tool UI -->
  <script>
    // Tool logic runs in browser
    // No server communication needed
  </script>
</body>
</html>

// 3. Tool executes entirely client-side
// 4. Results stay in browser (privacy preserved)
```

---

## Discovery Document Compatibility

### MCP tools/list Response

```typescript
// Standard MCP discovery
{
  tools: [
    {
      name: 'json-formatter',
      title: 'JSON Formatter',
      description: 'Format and beautify JSON',
      inputSchema: { /* JSON Schema */ }
    }
  ]
}
```

### CTP Extended Discovery

CTP provides additional discovery formats:

#### OpenAPI 3.1

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
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/JsonFormatterInput'
```

#### AI Tools Manifest

```json
{
  "version": "1.0",
  "tools": [
    {
      "id": "json-formatter",
      "name": "JSON Formatter",
      "description": "Format and beautify JSON",
      "inputSchema": { /* JSON Schema */ },
      "invocationUrl": "https://api.conveniencepro.cc/tools/json-formatter"
    }
  ]
}
```

#### llms.txt

```
# ConveniencePro Tools

## json-formatter
Format and beautify JSON data.
- POST /api/tools/json-formatter
- Parameters: json (required), indent (optional: 2|4)
```

---

## Annotations Mapping

### MCP Tool Annotations

```typescript
interface ToolAnnotations {
  readOnlyHint?: boolean;    // Doesn't modify environment
  destructiveHint?: boolean; // Updates are destructive
  idempotentHint?: boolean;  // Repeated calls safe
  openWorldHint?: boolean;   // Interacts externally
}
```

### CTP to MCP Annotation Conversion

```typescript
function ctpToMCPAnnotations(tool: ToolDefinition): ToolAnnotations {
  return {
    // Client-only tools are inherently read-only
    readOnlyHint: tool.executionMode === 'client',

    // CTP tools are generally non-destructive
    destructiveHint: false,

    // Pure function tools are idempotent
    idempotentHint: tool.executionMode === 'client',

    // Client tools don't access external resources
    openWorldHint: tool.executionMode !== 'client',
  };
}
```

---

## Result Format Compatibility

### MCP Tool Result

```typescript
// MCP result format
{
  content: [
    {
      type: 'text',
      text: 'Formatted result'
    }
  ],
  isError?: boolean
}
```

### CTP Tool Result

```typescript
// CTP result format
{
  success: true,
  data: {
    formatted: '{\n  "a": 1\n}',
    lineCount: 3
  },
  metadata: {
    executionTime: 5,
    inputSize: 7,
    outputSize: 15
  }
}
```

### Conversion

```typescript
function ctpResultToMCP(result: ToolResult<unknown>): MCPToolResult {
  if (!result.success) {
    return {
      content: [{ type: 'text', text: result.error || 'Unknown error' }],
      isError: true
    };
  }

  return {
    content: [
      {
        type: 'text',
        text: typeof result.data === 'string'
          ? result.data
          : JSON.stringify(result.data, null, 2)
      }
    ]
  };
}
```

---

## Implementation Checklist

To create an MCP-compatible CTP server:

### Required

- [ ] Implement `initialize` method with protocol version negotiation
- [ ] Implement `tools/list` returning converted tool definitions
- [ ] Implement `tools/call` for tool execution
- [ ] Support JSON-RPC 2.0 message format
- [ ] Handle `notifications/initialized` after handshake

### Recommended

- [ ] Support both stdio and HTTP transports
- [ ] Include CTP features in `experimental.ctp` capability
- [ ] Provide `listChanged` notifications when tools update
- [ ] Include annotations for tool behavior hints

### Optional CTP Extensions

- [ ] Serve embeddable bundles at `/embed/{id}`
- [ ] Provide OpenAPI spec at `/api/openapi.yaml`
- [ ] Provide AI tools manifest at `/api/ai-tools.json`
- [ ] Provide llms.txt at `/llms.txt`
- [ ] Support autosense style parameters in embeds

---

## Version Compatibility Matrix

| CTP Version | MCP Version | Compatibility |
|-------------|-------------|---------------|
| 1.0.0 | 2025-06-18 | Full |
| 1.0.0 | 2024-11-05 | Full (no annotations) |

---

## References

- [MCP Specification 2025-06-18](https://modelcontextprotocol.io/specification/2025-06-18)
- [MCP Tools Documentation](https://modelcontextprotocol.io/specification/2025-06-18/server/tools)
- [JSON Schema 2020-12](https://json-schema.org/draft/2020-12/schema)

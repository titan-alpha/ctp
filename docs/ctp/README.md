# ConveniencePro Tool Protocol (CTP)

**Version:** 1.0.0
**Status:** Draft Specification
**Repository:** [github.com/conveniencepro/ctp-spec](https://github.com/conveniencepro/ctp-spec)

---

## Overview

The **ConveniencePro Tool Protocol (CTP)** is an open specification for defining, discovering, executing, and embedding browser-native developer tools. CTP extends the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) with features specifically designed for client-side utility tools that prioritize privacy.

### Key Features

- **Privacy-First**: Tools execute entirely client-side—user data never leaves the browser
- **MCP-Compatible**: Full alignment with MCP tool definitions and discovery patterns
- **Dual Execution**: Tools can run in browser (Web Crypto) or server (Node.js)
- **Embeddable**: Iframe-based embedding with automatic style matching (autosense)
- **AI-Ready**: Discovery documents optimized for LLM consumption

---

## Quick Start

### For Tool Developers

Create a CTP-compliant tool in minutes:

```typescript
import { defineTool, success, failure } from '@conveniencepro/ctp-core';
import { registerTool } from '@conveniencepro/ctp-runtime';

// Define your tool
const myTool = defineTool({
  id: 'my-tool',
  name: 'My Tool',
  description: 'Does something useful',
  category: 'utilities',
  tags: ['example'],
  method: 'POST',
  parameters: [
    {
      name: 'input',
      type: 'text',
      label: 'Input',
      description: 'The input value',
      required: true,
    },
  ],
  outputDescription: 'The processed result',
  example: {
    input: { input: 'hello' },
    output: { result: 'HELLO' },
  },
});

// Implement and register
registerTool(myTool, (params) => {
  const input = params.input as string;
  return success({ result: input.toUpperCase() });
});
```

### For LLMs Generating Tools

See [LLM Tool Generator](./llm-prompts/TOOL_GENERATOR.md) for a document you can provide directly to any LLM to generate CTP-compliant tools.

---

## Documentation

### Core Specification

| Document | Description |
|----------|-------------|
| [SPECIFICATION.md](./SPECIFICATION.md) | Complete formal specification |
| [MCP_COMPLIANCE.md](./MCP_COMPLIANCE.md) | MCP compatibility and extensions |
| [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) | Developer implementation guide |

### LLM-Consumable Documents

| Document | Description |
|----------|-------------|
| [llm-prompts/TOOL_GENERATOR.md](./llm-prompts/TOOL_GENERATOR.md) | Complete prompt for LLMs to generate tools |
| [llm-prompts/SCHEMA_REFERENCE.md](./llm-prompts/SCHEMA_REFERENCE.md) | Quick reference for tool schemas |
| [llm-prompts/EXAMPLES.md](./llm-prompts/EXAMPLES.md) | Example implementations |

### JSON Schemas

| Schema | Description |
|--------|-------------|
| [schemas/tool-definition.schema.json](./schemas/tool-definition.schema.json) | Tool definition validation |
| [schemas/tool-result.schema.json](./schemas/tool-result.schema.json) | Execution result validation |
| [schemas/ctp-manifest.schema.json](./schemas/ctp-manifest.schema.json) | Service manifest validation |
| [schemas/embed-config.schema.json](./schemas/embed-config.schema.json) | Embed configuration validation |

### Examples

| Example | Description |
|---------|-------------|
| [examples/json-formatter.md](./examples/json-formatter.md) | Complete JSON Formatter tool |
| [examples/base64-encoder.md](./examples/base64-encoder.md) | Base64 Encoder/Decoder tool |
| [examples/hash-generator.md](./examples/hash-generator.md) | Async Hash Generator tool |

---

## Reference Implementation

The reference implementation is provided as npm packages:

| Package | Description | npm |
|---------|-------------|-----|
| `@conveniencepro/ctp-core` | Core types and validation | [![npm](https://img.shields.io/npm/v/@conveniencepro/ctp-core)](https://npmjs.com/package/@conveniencepro/ctp-core) |
| `@conveniencepro/ctp-runtime` | Tool registry and execution | [![npm](https://img.shields.io/npm/v/@conveniencepro/ctp-runtime)](https://npmjs.com/package/@conveniencepro/ctp-runtime) |
| `@conveniencepro/ctp-discovery` | Discovery document generators | [![npm](https://img.shields.io/npm/v/@conveniencepro/ctp-discovery)](https://npmjs.com/package/@conveniencepro/ctp-discovery) |
| `@conveniencepro/ctp-sdk` | Embeddable SDK | [![npm](https://img.shields.io/npm/v/@conveniencepro/ctp-sdk)](https://npmjs.com/package/@conveniencepro/ctp-sdk) |
| `@conveniencepro/ctp-spec` | Specification constants | [![npm](https://img.shields.io/npm/v/@conveniencepro/ctp-spec)](https://npmjs.com/package/@conveniencepro/ctp-spec) |
| `@conveniencepro/ctp-examples` | Example implementations | [![npm](https://img.shields.io/npm/v/@conveniencepro/ctp-examples)](https://npmjs.com/package/@conveniencepro/ctp-examples) |

### Installation

```bash
# Core packages
npm install @conveniencepro/ctp-core @conveniencepro/ctp-runtime

# Optional: Discovery generators
npm install @conveniencepro/ctp-discovery

# Optional: Embedding SDK
npm install @conveniencepro/ctp-sdk
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CTP Protocol Architecture                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │                    SPECIFICATION LAYER                       │   │
│   │  • Tool Definition Schema    • Parameter Validation          │   │
│   │  • Result Format             • Error Codes                   │   │
│   │  • Discovery Documents       • Embedding Protocol            │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│           ┌──────────────────┼──────────────────┐                   │
│           │                  │                  │                   │
│   ┌───────▼───────┐  ┌───────▼───────┐  ┌──────▼──────┐            │
│   │   ctp-core    │  │  ctp-runtime  │  │ctp-discovery│            │
│   │               │  │               │  │             │            │
│   │  Types        │  │  Registry     │  │  OpenAPI    │            │
│   │  Validators   │  │  Client RT    │  │  AI Tools   │            │
│   │  Helpers      │  │  Server RT    │  │  llms.txt   │            │
│   └───────┬───────┘  └───────┬───────┘  └─────────────┘            │
│           │                  │                                      │
│           └────────┬─────────┘                                      │
│                    │                                                │
│           ┌────────▼────────┐                                       │
│           │    ctp-sdk      │                                       │
│           │                 │                                       │
│           │  Embed Manager  │                                       │
│           │  Autosense      │                                       │
│           │  Theme Watcher  │                                       │
│           └─────────────────┘                                       │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## MCP Compatibility

CTP is designed as a **superset of MCP tool definitions**. Any CTP tool definition can be converted to an MCP-compatible format:

| CTP Field | MCP Equivalent | Notes |
|-----------|---------------|-------|
| `id` | `name` | Direct mapping |
| `name` | `title` | Display name |
| `description` | `description` | Direct mapping |
| `parameters` | `inputSchema.properties` | Converted to JSON Schema |
| `example.output` | `outputSchema` | Optional in MCP |

See [MCP_COMPLIANCE.md](./MCP_COMPLIANCE.md) for complete compatibility details.

---

## Discovery Endpoints

CTP services should expose these discovery endpoints:

| Endpoint | Format | Description |
|----------|--------|-------------|
| `/.well-known/ctp-manifest.json` | JSON | CTP native manifest |
| `/api/openapi.yaml` | YAML | OpenAPI 3.1 specification |
| `/api/ai-tools.json` | JSON | AI tools manifest |
| `/llms.txt` | Text | LLM context document |
| `/.well-known/ai-plugin.json` | JSON | ChatGPT plugin manifest |

---

## Contributing

We welcome contributions to the CTP specification:

1. **Specification Changes**: Open an issue to discuss proposed changes
2. **Reference Implementation**: Submit PRs to the packages repository
3. **Documentation**: Improve examples and guides

### Specification Process

1. Propose changes via GitHub issue
2. Discuss with maintainers and community
3. Submit RFC document for significant changes
4. Implementation in reference packages
5. Specification document update

---

## Related Resources

- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) - Base protocol
- [ConveniencePro](https://conveniencepro.cc) - Reference implementation
- [MCP Artifact Architecture](../mcp-artifact-architecture.md) - Design rationale
- [Browser LLM Architecture](../browser-llm-architecture.md) - Client-side AI integration

---

## License

This specification is released under the [MIT License](../../LICENSE).

---

© 2025 ConveniencePro. All rights reserved.

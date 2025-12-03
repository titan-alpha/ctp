# ConveniencePro Documentation

Developer documentation, architecture decisions, and protocol specifications.

---

## Quick Links

| Resource | Description |
|----------|-------------|
| [ConveniencePro Website](https://conveniencepro.cc) | Live tool suite |
| [CTP Specification](./ctp/README.md) | Tool Protocol specification |
| [npm Packages](https://www.npmjs.com/org/conveniencepro) | Published packages |

---

## Documentation Index

### Specifications

Protocol specifications for building interoperable tools.

| Specification | Version | Description |
|---------------|---------|-------------|
| [**ConveniencePro Tool Protocol (CTP)**](./ctp/README.md) | 1.0.0 | Open specification for browser-native developer tools |
| [CTP Formal Specification](./ctp/SPECIFICATION.md) | 1.0.0 | Complete protocol reference |
| [MCP Compliance](./ctp/MCP_COMPLIANCE.md) | - | Model Context Protocol compatibility |

### Architecture

System design and architectural decision records.

| Document | Description |
|----------|-------------|
| [MCP Artifact Architecture](./mcp-artifact-architecture.md) | "Tool as Artifact" pattern for LLM integration |
| [Browser LLM Architecture](./browser-llm-architecture.md) | Client-side LLM inference with WebGPU |

### Implementation Guides

Practical guides for developers.

| Guide | Description |
|-------|-------------|
| [CTP Implementation Guide](./ctp/IMPLEMENTATION_GUIDE.md) | Building CTP-compliant tools |
| [LLM Tool Generator](./ctp/llm-prompts/TOOL_GENERATOR.md) | Prompt document for AI tool generation |

### Reference

Technical references and schemas.

| Resource | Description |
|----------|-------------|
| [JSON Schemas](./ctp/schemas/) | Validation schemas for CTP |
| [Tool Examples](./ctp/examples/) | Reference implementations |
| [LLM Quick Reference](./ctp/llm-prompts/SCHEMA_REFERENCE.md) | Compact schema reference |

---

## For AI/LLM Users

To generate CTP-compliant tools using an AI model:

1. Copy the contents of [llm-prompts/TOOL_GENERATOR.md](./ctp/llm-prompts/TOOL_GENERATOR.md)
2. Paste it into your AI conversation
3. Ask the AI to create the tool you need

The AI will generate complete, standards-compliant tool implementations.

---

## Documentation Structure

```
docs/
├── README.md                         ← You are here
├── mcp-artifact-architecture.md      # MCP integration design
├── browser-llm-architecture.md       # Browser LLM design
└── ctp/                              # ConveniencePro Tool Protocol
    ├── README.md                     # CTP overview
    ├── SPECIFICATION.md              # Formal specification
    ├── MCP_COMPLIANCE.md             # MCP compatibility
    ├── IMPLEMENTATION_GUIDE.md       # Developer guide
    ├── schemas/                      # JSON validation schemas
    ├── llm-prompts/                  # AI-consumable documents
    └── examples/                     # Reference implementations
```

---

## Related Repositories

| Repository | Description |
|------------|-------------|
| `packages/ctp-core` | Core types and validation |
| `packages/ctp-runtime` | Tool execution runtime |
| `packages/ctp-discovery` | Discovery document generators |
| `packages/ctp-sdk` | Embeddable SDK |
| `packages/ctp-spec` | Specification constants |
| `packages/ctp-examples` | Example tools |

---

## Contributing

See individual specification documents for contribution guidelines.

For CTP specification changes, see the [CTP README](./ctp/README.md#contributing).

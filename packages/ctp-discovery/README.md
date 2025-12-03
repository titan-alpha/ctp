# @conveniencepro/ctp-discovery

Discovery manifest generators for the **ConveniencePro Tool Protocol (CTP)**.

Generate OpenAPI specs, AI tools manifests, llms.txt files, and more from your tool definitions.

## Installation

```bash
npm install @conveniencepro/ctp-discovery
# or
yarn add @conveniencepro/ctp-discovery
# or
pnpm add @conveniencepro/ctp-discovery
```

## Quick Start

```typescript
import { generateAllDiscoveryFiles, getRecommendedFilePaths } from '@conveniencepro/ctp-discovery';

// Your tool definitions
const tools = [
  {
    id: 'base64-encode',
    name: 'Base64 Encode',
    description: 'Encode text to Base64',
    category: 'encoding',
    tags: ['encoding', 'base64'],
    method: 'GET',
    parameters: [
      {
        name: 'text',
        type: 'textarea',
        label: 'Text',
        description: 'Text to encode',
        required: true,
      },
    ],
    outputDescription: 'Returns encoded Base64 string',
    example: {
      input: { text: 'Hello' },
      output: { success: true, encoded: 'SGVsbG8=' },
    },
  },
  // ... more tools
];

// Generate all discovery files
const files = generateAllDiscoveryFiles(tools, {
  baseUrl: 'https://my-tools.com',
  name: 'My Tools',
  description: 'Awesome utility tools',
});

// Get recommended file paths
const paths = getRecommendedFilePaths();

// Write files
// files.openapiYaml   -> .well-known/openapi.yaml
// files.aiToolsJson   -> .well-known/ai-tools.json
// files.llmsTxt       -> llms.txt
// files.llmsFullTxt   -> llms-full.txt
```

## OpenAPI Generation

Generate OpenAPI 3.1 specifications:

```typescript
import { generateOpenAPI, generateOpenAPIYAML } from '@conveniencepro/ctp-discovery/openapi';

// Generate as JavaScript object
const spec = generateOpenAPI(tools, {
  title: 'My Tools API',
  description: 'API for my utility tools',
  baseUrl: 'https://api.example.com',
  pathPrefix: '/v1/tools',
  includeExamples: true,
  groupByCategory: true,
});

// Generate as YAML string
const yaml = generateOpenAPIYAML(tools, options);
```

### OpenAPI Options

```typescript
interface OpenAPIGeneratorOptions {
  title?: string;           // API title
  description?: string;     // API description
  version?: string;         // API version
  baseUrl?: string;         // Base URL
  pathPrefix?: string;      // Path prefix (default: '/run')
  includeExamples?: boolean; // Include examples
  groupByCategory?: boolean; // Group by category as tags
  contact?: { name, url, email };
  license?: { name, url };
}
```

## AI Tools Manifest

Generate manifests for AI/LLM integration:

```typescript
import {
  generateAIToolsManifest,
  generateCTManifest,
  generateChatGPTPlugin,
} from '@conveniencepro/ctp-discovery/ai-tools';

// AI Tools manifest (generic format)
const aiTools = generateAIToolsManifest(tools, {
  name: 'My Tools',
  baseUrl: 'https://api.example.com',
});

// CTP manifest (ConveniencePro format)
const ctManifest = generateCTManifest(tools, {
  providerName: 'My Company',
  providerUrl: 'https://example.com',
});

// ChatGPT plugin manifest
const chatgptPlugin = generateChatGPTPlugin({
  nameForHuman: 'My Tools',
  nameForModel: 'mytools',
  openapiUrl: 'https://example.com/.well-known/openapi.yaml',
});
```

## LLMs.txt Generation

Generate context files for LLMs:

```typescript
import {
  generateLLMsTxt,
  generateLLMsFullTxt,
  generateToolsMarkdown,
} from '@conveniencepro/ctp-discovery/llms-txt';

// Concise version (llms.txt)
const llmsTxt = generateLLMsTxt(tools, {
  name: 'My Tools',
  baseUrl: 'https://api.example.com',
  groupByCategory: true,
});

// Detailed version (llms-full.txt)
const llmsFullTxt = generateLLMsFullTxt(tools, {
  includeExamples: true,
  maxLineWidth: 80,
});

// Markdown documentation
const markdown = generateToolsMarkdown(tools, {
  includeExamples: true,
});
```

## Output Formats

### llms.txt (Concise)

```text
# ConveniencePro
# Browser-native utility tools API
# Base URL: https://conveniencepro.cc

## Encoding
- Base64 Encode (base64-encode): Encode text to Base64
  Endpoint: GET /run/base64-encode
  Required: text
```

### llms-full.txt (Detailed)

```text
================================================================================
                           ConveniencePro Tools
================================================================================

### Base64 Encode
ID: base64-encode
Description: Encode text to Base64
Method: GET
Endpoint: /run/base64-encode

Parameters:
  - text (textarea) [REQUIRED]
    Text to encode
```

### OpenAPI 3.1

```yaml
openapi: 3.1.0
info:
  title: ConveniencePro Tools API
  version: 1.0.0
paths:
  /run/base64-encode:
    get:
      operationId: base64_encode
      summary: Base64 Encode
      parameters:
        - name: text
          in: query
          required: true
          schema:
            type: string
```

## Recommended Directory Structure

```
public/
├── .well-known/
│   ├── openapi.yaml       # OpenAPI specification
│   ├── openapi.json       # OpenAPI (JSON format)
│   ├── ai-tools.json      # AI tools manifest
│   ├── ai-plugin.json     # ChatGPT plugin manifest
│   └── ctp-manifest.json  # CTP manifest
├── llms.txt               # Concise LLM context
└── llms-full.txt          # Detailed LLM context
```

## Build Integration

Generate discovery files during build:

```typescript
// scripts/generate-discovery.ts
import { writeFileSync, mkdirSync } from 'fs';
import { generateAllDiscoveryFiles, getRecommendedFilePaths } from '@conveniencepro/ctp-discovery';
import { tools } from '../src/data/tools';

const files = generateAllDiscoveryFiles(tools, {
  baseUrl: process.env.BASE_URL,
});

const paths = getRecommendedFilePaths();

// Ensure directories exist
mkdirSync('public/.well-known', { recursive: true });

// Write files
writeFileSync(`public/${paths.openapiYaml}`, files.openapiYaml);
writeFileSync(`public/${paths.aiToolsJson}`, files.aiToolsJson);
writeFileSync(`public/${paths.llmsTxt}`, files.llmsTxt);
writeFileSync(`public/${paths.llmsFullTxt}`, files.llmsFullTxt);

console.log('Discovery files generated!');
```

## Related Packages

- `@conveniencepro/ctp-core` - Core types and interfaces
- `@conveniencepro/ctp-runtime` - Tool execution runtime
- `@conveniencepro/ctp-sdk` - Embeddable SDK

## License

MIT © ConveniencePro

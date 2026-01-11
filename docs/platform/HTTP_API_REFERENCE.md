# ConveniencePro HTTP API Reference

**Version:** 1.0.0
**Last Updated:** December 4, 2025
**Service:** https://conveniencepro.cc

---

## Table of Contents

1. [Overview](#overview)
2. [Privacy & Execution Notice](#privacy--execution-notice)
3. [Base URL](#base-url)
4. [Authentication](#authentication)
5. [Request Format](#request-format)
6. [Response Format](#response-format)
7. [Error Codes](#error-codes)
8. [Usage Examples](#usage-examples)
9. [Rate Limiting](#rate-limiting)
10. [Best Practices](#best-practices)
11. [Alternatives](#alternatives)

---

## Overview

The ConveniencePro HTTP API provides programmatic access to all 385 developer utility tools through standard REST endpoints. This allows language-agnostic integration from any platform that can make HTTP requests.

**Key Features:**
- RESTful POST endpoints for all tools
- JSON request/response format
- OpenAPI 3.1 specification available
- CORS-enabled for browser requests
- No authentication required (rate limits apply)

---

## Privacy & Execution Notice

### ⚠️ CRITICAL: Server-Side Execution

**When you use the ConveniencePro HTTP API, your data is transmitted over the network to our servers where tools are executed server-side.**

This means:

- ⚠️ **Data is sent to the server** via HTTP POST request body
- ⚠️ **Processing occurs on the server**, not in your browser
- ⚠️ **Server logs may contain request data** for debugging and monitoring
- ⚠️ **Network traffic can be intercepted** (always use HTTPS)
- ⚠️ **You must trust ConveniencePro** as the server operator

### When to Use HTTP API

**✅ Suitable for:**
- Non-sensitive data processing (formatting, validation, conversion)
- CI/CD pipelines and automation scripts
- Server-to-server communication
- Language-agnostic integrations (Python, Go, Ruby, etc.)
- Environments where you trust ConveniencePro

**❌ Avoid for:**
- **Passwords and API keys**
- **Personal Identifiable Information (PII)**
- **Proprietary code or trade secrets**
- **Medical or financial data**
- **Air-gapped or offline environments**
- **GDPR-sensitive operations**

### Maximum Privacy Alternative

For sensitive data, use **direct tool imports** instead:

```typescript
import base64Encoder from '@conveniencepro/ctp-tools/base64-encoder'

// Executes 100% in browser, data never leaves your machine
const result = base64Encoder({ text: 'sensitive data' })
```

**See also:**
- [Execution Modes & Data Flow](./EXECUTION_MODES_AND_DATA_FLOW.md) for detailed privacy information
- [Minimal Logging Pattern](./MINIMAL_LOGGING_PATTERN.md) for technical details on how we minimize logging on Vercel

---

## Base URL

```
https://conveniencepro.cc/api
```

All API requests should be made to this base URL with the appropriate tool endpoint appended.

### Endpoint Pattern

```
POST /api/tools/{tool-id}
```

Where `{tool-id}` is the tool's unique identifier (e.g., `base64-encoder`, `json-formatter`).

---

## Authentication

**Current Status:** No authentication required.

Rate limiting is enforced based on IP address. Future versions may introduce:
- API key authentication
- OAuth 2.0 for enterprise customers
- User accounts with higher rate limits

---

## Request Format

### HTTP Method

All tool executions use **POST** requests with JSON bodies.

### Headers

```http
Content-Type: application/json
```

### Request Body

```json
{
  "param1": "value1",
  "param2": "value2"
}
```

Parameters are tool-specific. See the OpenAPI specification at `/api/openapi.json` for complete parameter schemas.

### Example Request

```http
POST /api/tools/base64-encoder HTTP/1.1
Host: conveniencepro.cc
Content-Type: application/json

{
  "text": "Hello World"
}
```

---

## Response Format

All responses follow the CTP (ConveniencePro Tool Protocol) standard result format.

### Success Response

**HTTP Status:** 200 OK

```json
{
  "success": true,
  "data": {
    "result": "...",
    "metadata": {}
  }
}
```

### Error Response

**HTTP Status:** 400 Bad Request (client error) or 500 Internal Server Error (server error)

```json
{
  "success": false,
  "error": "Human-readable error message",
  "errorCode": "ERROR_CODE"
}
```

---

## Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `MISSING_REQUIRED` | Required parameter missing | 400 |
| `INVALID_INPUT` | Invalid parameter value | 400 |
| `VALIDATION_ERROR` | Input validation failed | 400 |
| `EXECUTION_ERROR` | Tool execution failed | 500 |
| `NOT_FOUND` | Tool not found | 404 |
| `RATE_LIMIT_EXCEEDED` | Too many requests | 429 |
| `TIMEOUT` | Request timeout | 504 |
| `INTERNAL_ERROR` | Unexpected server error | 500 |

---

## Usage Examples

### cURL

```bash
curl -X POST https://conveniencepro.cc/api/tools/base64-encoder \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello World"}'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "encoded": "SGVsbG8gV29ybGQ=",
    "originalLength": 11
  }
}
```

### JavaScript/TypeScript (Fetch)

```typescript
async function callTool(toolId: string, params: Record<string, unknown>) {
  const response = await fetch(`https://conveniencepro.cc/api/tools/${toolId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(`Tool error: ${result.error} (${result.errorCode})`);
  }

  return result.data;
}

// Usage
const data = await callTool('json-formatter', {
  json: '{"name":"John","age":30}',
  indent: '2',
});

console.log(data.formatted);
```

### Python (requests)

```python
import requests

def call_tool(tool_id: str, params: dict):
    response = requests.post(
        f'https://conveniencepro.cc/api/tools/{tool_id}',
        headers={'Content-Type': 'application/json'},
        json=params
    )

    result = response.json()

    if not result['success']:
        raise Exception(f"Tool error: {result['error']} ({result.get('errorCode', 'UNKNOWN')})")

    return result['data']

# Usage
data = call_tool('hash-generator', {
    'text': 'Hello World',
    'algorithm': 'sha256'
})

print(data['hash'])
```

### Node.js (Axios)

```javascript
const axios = require('axios');

async function callTool(toolId, params) {
  try {
    const response = await axios.post(
      `https://conveniencepro.cc/api/tools/${toolId}`,
      params,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.error);
    }

    return response.data.data;
  } catch (error) {
    if (error.response) {
      console.error('API Error:', error.response.data.error);
    } else {
      console.error('Network Error:', error.message);
    }
    throw error;
  }
}

// Usage
(async () => {
  const result = await callTool('url-parser', {
    url: 'https://example.com:8080/path?key=value'
  });

  console.log(result);
})();
```

### Go

```go
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "net/http"
)

type ToolResult struct {
    Success bool                   `json:"success"`
    Data    map[string]interface{} `json:"data,omitempty"`
    Error   string                 `json:"error,omitempty"`
    ErrorCode string               `json:"errorCode,omitempty"`
}

func callTool(toolID string, params map[string]interface{}) (*ToolResult, error) {
    url := fmt.Sprintf("https://conveniencepro.cc/api/tools/%s", toolID)

    jsonData, err := json.Marshal(params)
    if err != nil {
        return nil, err
    }

    resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    var result ToolResult
    if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
        return nil, err
    }

    if !result.Success {
        return nil, fmt.Errorf("tool error: %s (%s)", result.Error, result.ErrorCode)
    }

    return &result, nil
}

func main() {
    result, err := callTool("base64-encoder", map[string]interface{}{
        "text": "Hello World",
    })

    if err != nil {
        panic(err)
    }

    fmt.Printf("Encoded: %v\n", result.Data["encoded"])
}
```

### Ruby

```ruby
require 'net/http'
require 'json'

def call_tool(tool_id, params)
  uri = URI("https://conveniencepro.cc/api/tools/#{tool_id}")

  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true

  request = Net::HTTP::Post.new(uri.path, 'Content-Type' => 'application/json')
  request.body = params.to_json

  response = http.request(request)
  result = JSON.parse(response.body)

  unless result['success']
    raise "Tool error: #{result['error']} (#{result['errorCode']})"
  end

  result['data']
end

# Usage
data = call_tool('base64-encoder', { text: 'Hello World' })
puts data['encoded']
```

---

## Rate Limiting

### Default Limits

**Current rate limits (subject to change):**
- **100 requests per minute** per IP address
- **1000 requests per hour** per IP address

### Rate Limit Headers

Rate limit information is included in response headers:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1733356800
```

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Total requests allowed in window |
| `X-RateLimit-Remaining` | Requests remaining in current window |
| `X-RateLimit-Reset` | Unix timestamp when limit resets |

### Handling Rate Limits

When rate limited, you'll receive:

**HTTP Status:** 429 Too Many Requests

```json
{
  "success": false,
  "error": "Rate limit exceeded. Try again in 45 seconds.",
  "errorCode": "RATE_LIMIT_EXCEEDED"
}
```

**Recommended retry strategy:**

```typescript
async function callWithBackoff(toolId, params, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await callTool(toolId, params);
    } catch (error) {
      if (error.response?.status === 429) {
        const resetTime = error.response.headers['x-ratelimit-reset'];
        const waitTime = Math.max(resetTime - Date.now() / 1000, 0) * 1000;
        await new Promise(r => setTimeout(r, waitTime));
      } else {
        throw error;
      }
    }
  }
  throw new Error('Max retries exceeded');
}
```

---

## Best Practices

### 1. Always Check `success` Field

```typescript
const result = await callTool('tool-id', params);

if (result.success) {
  // Use result.data
  console.log(result.data);
} else {
  // Handle error
  console.error(result.error, result.errorCode);
}
```

### 2. Set Appropriate Timeouts

```typescript
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 30000);

try {
  const response = await fetch(url, {
    method: 'POST',
    signal: controller.signal,
    // ...
  });
} finally {
  clearTimeout(timeout);
}
```

### 3. Implement Exponential Backoff

```typescript
async function callWithRetry(toolId, params, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await callTool(toolId, params);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
    }
  }
}
```

### 4. Use Parallel Requests (with caution)

```typescript
// Respect rate limits when parallelizing
const results = await Promise.all([
  callTool('tool-1', params1),
  callTool('tool-2', params2),
  callTool('tool-3', params3),
]);
```

### 5. Cache Results

For deterministic tools with the same inputs:

```typescript
const cache = new Map();

async function callWithCache(toolId, params) {
  const key = JSON.stringify({ toolId, params });

  if (cache.has(key)) {
    return cache.get(key);
  }

  const result = await callTool(toolId, params);
  cache.set(key, result);
  return result;
}
```

---

## Alternatives

For better privacy, performance, or offline capability, consider these alternatives:

### 1. Direct Import (Browser/Node.js)

**Maximum privacy - Data never leaves your machine**

```bash
npm install @conveniencepro/ctp-tools
```

```typescript
import { base64Encoder } from '@conveniencepro/ctp-tools'

// 100% local execution
const result = base64Encoder({ text: 'sensitive data' })
```

### 2. NPM Runtime Package

```bash
npm install @conveniencepro/ctp-runtime
```

```typescript
import { createRuntime, ToolRegistry } from '@conveniencepro/ctp-runtime'
import base64Encoder from '@conveniencepro/ctp-tools/base64-encoder'

const registry = new ToolRegistry()
registry.register(base64Encoder.definition, base64Encoder.fn)

const runtime = createRuntime(registry)
const result = await runtime.execute('base64-encoder', { text: 'data' })
```

### 3. Embedded Widgets

```html
<iframe
  src="https://conveniencepro.cc/embed/base64-encoder"
  width="600"
  height="400"
></iframe>
```

### 4. MCP (Model Context Protocol) Integration

For AI assistants like Claude:

```json
{
  "mcpServers": {
    "conveniencepro": {
      "command": "npx",
      "args": ["-y", "@conveniencepro/mcp-server"]
    }
  }
}
```

---

## Additional Resources

### API Discovery

- **OpenAPI Specification:** https://conveniencepro.cc/api/openapi.json
- **MCP Manifest:** https://conveniencepro.cc/.well-known/mcp.json
- **Tool List:** https://conveniencepro.cc/api/tools

### Documentation

- **CTP Specification:** https://github.com/titan-alpha/convenience-pro/docs/ctp/SPECIFICATION.md
- **Execution Modes:** https://github.com/titan-alpha/convenience-pro/docs/platform/EXECUTION_MODES_AND_DATA_FLOW.md
- **System Architecture:** https://github.com/titan-alpha/convenience-pro/docs/platform/SYSTEM_ARCHITECTURE_OVERVIEW.md

### Import Tools

- **Postman Collection:** Available via OpenAPI import
- **Insomnia Workspace:** Available via OpenAPI import
- **Swagger UI:** https://conveniencepro.cc/api-docs

### Support

- **GitHub Issues:** https://github.com/titan-alpha/convenience-pro/issues
- **API Status:** https://status.conveniencepro.cc
- **Community Discord:** https://discord.gg/conveniencepro

---

**Last Updated:** December 4, 2025
**API Version:** 1.0.0
**Documentation Version:** 1.0.0

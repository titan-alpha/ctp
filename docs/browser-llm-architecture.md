# Browser-Based LLM Architecture

> Running Llama 3.2 1B Instruct locally in the browser with WebLLM

## Executive Summary

This document specifies the architecture for running a Large Language Model entirely within the user's browser, eliminating server dependencies and completing ConveniencePro's privacy-first vision. By combining WebLLM with Llama 3.2 1B Instruct, users get an AI assistant that can discover and invoke any of our 290+ tools—all running locally on their device.

**The Complete Picture:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    User's Browser                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Llama 3.2 1B Instruct                      │    │
│  │              (WebLLM + WebGPU)                          │    │
│  │              ~879MB VRAM | ~10 tok/s                    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                  │
│                              │ Tool Discovery & Invocation      │
│                              ↓                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Tool Registry (Local JSON)                 │    │
│  │              290+ tools with metadata                   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                  │
│                              │ Renders Selected Tool            │
│                              ↓                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Tool Bundle (Self-contained HTML)          │    │
│  │              Runs in sandboxed container                │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  🔒 Everything runs locally. No data leaves the device.        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Table of Contents

1. [Why Browser-Based LLM](#why-browser-based-llm)
2. [Technical Foundation](#technical-foundation)
3. [Model Selection](#model-selection)
4. [Architecture Design](#architecture-design)
5. [Implementation Specification](#implementation-specification)
6. [Tool Integration](#tool-integration)
7. [User Experience Flow](#user-experience-flow)
8. [Performance Optimization](#performance-optimization)
9. [Browser Compatibility](#browser-compatibility)
10. [Offline Capability](#offline-capability)
11. [Limitations & Mitigations](#limitations--mitigations)
12. [Implementation Roadmap](#implementation-roadmap)

---

## Why Browser-Based LLM

### The Privacy Promise

ConveniencePro's core value proposition is **"no uploads"**—all file processing happens client-side. Adding a cloud-based LLM would break this promise. A browser-based LLM completes the vision:

| Component | Server Required | Data Leaves Device |
|-----------|-----------------|-------------------|
| Tool UI | No | No |
| File Processing | No | No |
| LLM Inference | **No** | **No** |

### Benefits

1. **Complete Privacy** - Conversations never leave the device
2. **Zero Latency** - No network round-trips for inference
3. **Offline Capable** - Works without internet after initial load
4. **No API Costs** - No per-token charges
5. **No Rate Limits** - Users can query as much as they want
6. **Differentiation** - Unique offering vs. cloud-dependent competitors

### The Unlock

Recent advances make this feasible:

- **WebGPU** - GPU acceleration in browsers (Chrome 113+, Firefox 141+, Safari 26+)
- **WebLLM** - Production-ready inference engine from MLC-AI
- **Llama 3.2 1B** - Capable small model optimized for edge deployment
- **Quantization** - 4-bit models reduce size to ~700-900MB

---

## Technical Foundation

### WebLLM

[WebLLM](https://github.com/mlc-ai/web-llm) is an open-source, high-performance in-browser LLM inference engine.

**Key Features:**

| Feature | Description |
|---------|-------------|
| WebGPU Acceleration | Hardware-accelerated inference on user's GPU |
| OpenAI-Compatible API | Familiar interface (`chat.completions.create`) |
| Web Worker Support | Non-blocking UI during inference |
| Streaming | Real-time token generation |
| Caching | Models cached in browser storage |
| Offline | Works without network after model download |

**Architecture:**

```
┌─────────────────────────────────────────────────────────────────┐
│                        WebLLM Stack                             │
├─────────────────────────────────────────────────────────────────┤
│  JavaScript API (OpenAI-compatible)                             │
├─────────────────────────────────────────────────────────────────┤
│  MLC Runtime (WebAssembly)                                      │
├─────────────────────────────────────────────────────────────────┤
│  WebGPU Kernels (GPU compute shaders)                           │
├─────────────────────────────────────────────────────────────────┤
│  Browser WebGPU Implementation                                  │
├─────────────────────────────────────────────────────────────────┤
│  GPU Hardware (User's device)                                   │
└─────────────────────────────────────────────────────────────────┘
```

### WebGPU

WebGPU is the successor to WebGL, providing modern GPU compute capabilities in browsers.

**Why WebGPU for LLMs:**

- Direct GPU memory access
- Compute shaders (not just graphics)
- Better memory management
- Higher throughput than WebGL/WASM-only approaches

---

## Model Selection

### Llama 3.2 1B Instruct

We use **Llama-3.2-1B-Instruct-q4f16_1-MLC** specifically compiled for WebLLM.

**Model Specifications:**

| Attribute | Value |
|-----------|-------|
| Parameters | 1 Billion |
| Quantization | 4-bit (q4f16_1) |
| Download Size | ~700-800 MB |
| VRAM Required | ~879 MB |
| Context Window | 4,096 tokens (configurable to 128K) |
| Output Limit | 2,048 tokens |
| Source | [mlc-ai/Llama-3.2-1B-Instruct-q4f16_1-MLC](https://huggingface.co/mlc-ai/Llama-3.2-1B-Instruct-q4f16_1-MLC) |

**Why Llama 3.2 1B:**

1. **Size** - Small enough for browser download (~700MB)
2. **Capability** - Instruction-tuned, good at following directions
3. **Speed** - ~10-20 tokens/second on modern GPUs
4. **License** - Llama 3.2 Community License (commercial use OK)
5. **MLC Support** - Pre-compiled for WebLLM

**Capability Profile:**

| Task | Quality |
|------|---------|
| Tool Selection | Excellent - can match user intent to tool descriptions |
| Instruction Following | Excellent - follows system prompts reliably |
| Summarization | Good - can summarize tool results |
| Code Generation | Limited - not primary use case |
| Complex Reasoning | Limited - 1B parameter constraint |
| Multilingual | Moderate - English primary, some other languages |

---

## Architecture Design

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     ConveniencePro + LLM                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Main Thread                           │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │   │
│  │  │  React UI   │  │ Chat Panel  │  │  Tool Renderer  │   │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
│           │                  │                  ↑               │
│           │                  │                  │               │
│           │            postMessage         Tool HTML            │
│           │                  │                  │               │
│           │                  ↓                  │               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Web Worker                            │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │              WebLLM Engine                          │ │   │
│  │  │  ┌───────────────┐  ┌─────────────────────────────┐ │ │   │
│  │  │  │ Llama 3.2 1B  │  │     Tool Registry           │ │ │   │
│  │  │  │   (WebGPU)    │  │  (Embedded JSON + Search)   │ │ │   │
│  │  │  └───────────────┘  └─────────────────────────────┘ │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                         CacheStorage                            │
│                    (Model weights cached)                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility |
|-----------|----------------|
| **React UI** | Main application shell, routing, layout |
| **Chat Panel** | User input, message display, streaming output |
| **Tool Renderer** | Sandboxed iframe for tool bundles |
| **Web Worker** | LLM inference (non-blocking) |
| **WebLLM Engine** | Model loading, inference, token generation |
| **Tool Registry** | 290+ tools with searchable metadata |
| **CacheStorage** | Persistent model weight storage |

### Data Flow

```
User Input
    │
    ↓
┌─────────────────┐
│   Chat Panel    │ ──────────────────────────────────┐
└─────────────────┘                                   │
    │                                                 │
    │ postMessage({ type: 'chat', content: '...' })   │
    ↓                                                 │
┌─────────────────┐                                   │
│   Web Worker    │                                   │
│  ┌───────────┐  │                                   │
│  │  WebLLM   │  │                                   │
│  └───────────┘  │                                   │
│       │         │                                   │
│       ↓         │                                   │
│  ┌───────────┐  │                                   │
│  │  Tool     │  │                                   │
│  │  Search   │  │                                   │
│  └───────────┘  │                                   │
└─────────────────┘                                   │
    │                                                 │
    │ postMessage({ type: 'tool', id: '...' })        │
    │ postMessage({ type: 'stream', token: '...' })   │
    ↓                                                 │
┌─────────────────┐                                   │
│  Tool Renderer  │ ←─────────────────────────────────┘
│  (iframe)       │   Fetch bundle, render tool
└─────────────────┘
```

---

## Implementation Specification

### Package Dependencies

```json
{
  "dependencies": {
    "@mlc-ai/web-llm": "^0.2.80"
  }
}
```

### Model Configuration

```typescript
// src/lib/llm/config.ts

import { AppConfig, prebuiltAppConfig } from "@mlc-ai/web-llm";

export const LLM_CONFIG: AppConfig = {
  model_list: [
    {
      model: "https://huggingface.co/mlc-ai/Llama-3.2-1B-Instruct-q4f16_1-MLC",
      model_id: "Llama-3.2-1B-Instruct-q4f16_1-MLC",
      model_lib:
        "https://raw.githubusercontent.com/user/repo/main/lib/Llama-3.2-1B-Instruct-q4f16_1-webgpu.wasm",
      vram_required_MB: 879,
      low_resource_required: true,
    },
  ],
  use_web_worker: true,
};

export const SELECTED_MODEL = "Llama-3.2-1B-Instruct-q4f16_1-MLC";
```

### Web Worker Implementation

```typescript
// src/lib/llm/worker.ts

import * as webllm from "@mlc-ai/web-llm";
import { TOOL_REGISTRY } from "../data/tool-registry";
import { LLM_CONFIG, SELECTED_MODEL } from "./config";

let engine: webllm.MLCEngineInterface | null = null;

// System prompt that teaches the model about available tools
const SYSTEM_PROMPT = `You are a helpful assistant for ConveniencePro, a privacy-first utility tools website. You help users find and use the right tool for their needs.

You have access to ${TOOL_REGISTRY.length} tools across categories: text, calculators, converters, generators, image, pdf, audio, video, and editors.

When a user needs a tool:
1. Search the available tools to find the best match
2. Respond with the tool recommendation in this exact format:
   [TOOL:tool-id] Brief explanation of why this tool helps.

Example:
User: "I need to convert text to uppercase"
Assistant: [TOOL:case-converter] The Case Converter tool can transform your text to UPPERCASE, lowercase, Title Case, and other formats instantly.

If no tool matches, help the user with general advice.
Always be concise. The user wants to accomplish a task, not read essays.`;

// Initialize engine
async function initEngine(onProgress: (progress: number) => void) {
  engine = await webllm.CreateMLCEngine(SELECTED_MODEL, {
    appConfig: LLM_CONFIG,
    initProgressCallback: (report) => {
      onProgress(report.progress);
    },
  });
}

// Search tools based on query
function searchTools(query: string): typeof TOOL_REGISTRY {
  const queryLower = query.toLowerCase();
  const words = queryLower.split(/\s+/);

  return TOOL_REGISTRY
    .map(tool => {
      let score = 0;
      const searchText = `${tool.name} ${tool.description} ${tool.keywords.join(' ')}`.toLowerCase();

      for (const word of words) {
        if (searchText.includes(word)) score += 1;
        if (tool.keywords.some(k => k.includes(word))) score += 2;
        if (tool.name.toLowerCase().includes(word)) score += 3;
      }

      return { tool, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ tool }) => tool);
}

// Generate augmented prompt with tool context
function augmentPromptWithTools(userMessage: string): string {
  const relevantTools = searchTools(userMessage);

  if (relevantTools.length === 0) {
    return userMessage;
  }

  const toolContext = relevantTools
    .map(t => `- ${t.id}: ${t.name} - ${t.description}`)
    .join('\n');

  return `Available tools for this query:
${toolContext}

User request: ${userMessage}`;
}

// Handle chat completion
async function handleChat(
  messages: webllm.ChatCompletionMessageParam[],
  onToken: (token: string) => void,
  onComplete: (response: string) => void,
  onToolMatch: (toolId: string) => void
) {
  if (!engine) {
    throw new Error("Engine not initialized");
  }

  // Augment the last user message with tool context
  const augmentedMessages = messages.map((msg, i) => {
    if (i === messages.length - 1 && msg.role === 'user') {
      return { ...msg, content: augmentPromptWithTools(msg.content as string) };
    }
    return msg;
  });

  // Add system prompt
  const fullMessages: webllm.ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...augmentedMessages,
  ];

  let fullResponse = "";

  const stream = await engine.chat.completions.create({
    messages: fullMessages,
    temperature: 0.7,
    max_tokens: 512,
    stream: true,
  });

  for await (const chunk of stream) {
    const token = chunk.choices[0]?.delta?.content || "";
    fullResponse += token;
    onToken(token);

    // Check for tool invocation pattern
    const toolMatch = fullResponse.match(/\[TOOL:([a-z0-9-]+)\]/);
    if (toolMatch) {
      onToolMatch(toolMatch[1]);
    }
  }

  onComplete(fullResponse);
}

// Message handler
self.onmessage = async (event: MessageEvent) => {
  const { type, payload } = event.data;

  switch (type) {
    case "init":
      await initEngine((progress) => {
        self.postMessage({ type: "init-progress", payload: progress });
      });
      self.postMessage({ type: "init-complete" });
      break;

    case "chat":
      await handleChat(
        payload.messages,
        (token) => self.postMessage({ type: "token", payload: token }),
        (response) => self.postMessage({ type: "complete", payload: response }),
        (toolId) => self.postMessage({ type: "tool-match", payload: toolId })
      );
      break;

    case "search-tools":
      const results = searchTools(payload.query);
      self.postMessage({ type: "search-results", payload: results });
      break;
  }
};
```

### React Hook for LLM

```typescript
// src/hooks/useBrowserLLM.ts

import { useState, useEffect, useCallback, useRef } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface UseBrowserLLMReturn {
  isLoading: boolean;
  isReady: boolean;
  loadProgress: number;
  messages: Message[];
  isGenerating: boolean;
  currentToolId: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  error: string | null;
}

export function useBrowserLLM(): UseBrowserLLMReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentToolId, setCurrentToolId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const workerRef = useRef<Worker | null>(null);
  const streamingResponseRef = useRef('');

  // Initialize worker and load model
  useEffect(() => {
    const worker = new Worker(
      new URL('../lib/llm/worker.ts', import.meta.url),
      { type: 'module' }
    );

    workerRef.current = worker;

    worker.onmessage = (event: MessageEvent) => {
      const { type, payload } = event.data;

      switch (type) {
        case 'init-progress':
          setLoadProgress(payload);
          break;
        case 'init-complete':
          setIsLoading(false);
          setIsReady(true);
          break;
        case 'token':
          streamingResponseRef.current += payload;
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage?.role === 'assistant') {
              lastMessage.content = streamingResponseRef.current;
            }
            return newMessages;
          });
          break;
        case 'tool-match':
          setCurrentToolId(payload);
          break;
        case 'complete':
          setIsGenerating(false);
          streamingResponseRef.current = '';
          break;
        case 'error':
          setError(payload);
          setIsGenerating(false);
          break;
      }
    };

    // Start loading the model
    setIsLoading(true);
    worker.postMessage({ type: 'init' });

    return () => {
      worker.terminate();
    };
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!workerRef.current || !isReady || isGenerating) return;

    setCurrentToolId(null);
    setIsGenerating(true);
    streamingResponseRef.current = '';

    // Add user message
    const userMessage: Message = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);

    // Add empty assistant message for streaming
    const assistantMessage: Message = { role: 'assistant', content: '' };
    setMessages(prev => [...prev, assistantMessage]);

    // Send to worker
    workerRef.current.postMessage({
      type: 'chat',
      payload: {
        messages: [...messages, userMessage].map(m => ({
          role: m.role,
          content: m.content,
        })),
      },
    });
  }, [isReady, isGenerating, messages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setCurrentToolId(null);
  }, []);

  return {
    isLoading,
    isReady,
    loadProgress,
    messages,
    isGenerating,
    currentToolId,
    sendMessage,
    clearMessages,
    error,
  };
}
```

### Chat UI Component

```typescript
// src/components/llm/ChatPanel.tsx

'use client';

import { useState, useRef, useEffect } from 'react';
import { useBrowserLLM } from '@/hooks/useBrowserLLM';
import { ToolRenderer } from './ToolRenderer';

export function ChatPanel() {
  const {
    isLoading,
    isReady,
    loadProgress,
    messages,
    isGenerating,
    currentToolId,
    sendMessage,
    clearMessages,
    error,
  } = useBrowserLLM();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && isReady && !isGenerating) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="chat-panel chat-panel--loading">
        <div className="loading-container">
          <h3>Loading AI Assistant</h3>
          <p>Downloading Llama 3.2 1B model...</p>
          <div className="progress-bar">
            <div
              className="progress-bar__fill"
              style={{ width: `${loadProgress * 100}%` }}
            />
          </div>
          <p className="progress-text">{Math.round(loadProgress * 100)}%</p>
          <p className="loading-note">
            First load downloads ~800MB. Cached for future visits.
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="chat-panel chat-panel--error">
        <h3>Unable to load AI</h3>
        <p>{error}</p>
        <p>Your browser may not support WebGPU. Try Chrome 113+ or Edge 113+.</p>
      </div>
    );
  }

  return (
    <div className="chat-panel">
      {/* Messages */}
      <div className="messages">
        {messages.length === 0 && (
          <div className="welcome-message">
            <h3>ConveniencePro AI Assistant</h3>
            <p>Running locally in your browser. No data leaves your device.</p>
            <p>Try: "I need to merge some PDFs" or "Convert text to uppercase"</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`message message--${msg.role}`}>
            <div className="message__content">
              {msg.content}
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="generating-indicator">
            <span className="dot" /><span className="dot" /><span className="dot" />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Tool Renderer */}
      {currentToolId && (
        <ToolRenderer toolId={currentToolId} />
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What do you need help with?"
          disabled={!isReady || isGenerating}
        />
        <button type="submit" disabled={!isReady || isGenerating || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}
```

### Tool Renderer Component

```typescript
// src/components/llm/ToolRenderer.tsx

'use client';

import { useState, useEffect } from 'react';
import { BUNDLE_BASE_URL } from '@/lib/llm/config';

interface ToolRendererProps {
  toolId: string;
}

export function ToolRenderer({ toolId }: ToolRendererProps) {
  const [bundleHtml, setBundleHtml] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBundle() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${BUNDLE_BASE_URL}/${toolId}.html`);
        if (!response.ok) throw new Error('Bundle not found');
        const html = await response.text();
        setBundleHtml(html);
      } catch (err) {
        setError(`Could not load tool: ${toolId}`);
      } finally {
        setIsLoading(false);
      }
    }

    loadBundle();
  }, [toolId]);

  if (isLoading) {
    return <div className="tool-renderer tool-renderer--loading">Loading tool...</div>;
  }

  if (error) {
    return <div className="tool-renderer tool-renderer--error">{error}</div>;
  }

  return (
    <div className="tool-renderer">
      <div className="tool-renderer__header">
        <span className="tool-badge">Tool: {toolId}</span>
        <button
          className="tool-close"
          onClick={() => {/* Close handler */}}
        >
          ×
        </button>
      </div>
      <iframe
        className="tool-renderer__frame"
        srcDoc={bundleHtml || ''}
        sandbox="allow-scripts allow-downloads"
        title={`Tool: ${toolId}`}
      />
    </div>
  );
}
```

---

## Tool Integration

### Tool Registry Format

The LLM needs access to tool metadata for intelligent matching:

```typescript
// src/lib/llm/tool-registry.ts

export interface ToolEntry {
  id: string;
  name: string;
  description: string;
  category: string;
  keywords: string[];
  bundleUrl: string;
}

export const TOOL_REGISTRY: ToolEntry[] = [
  {
    id: "case-converter",
    name: "Case Converter",
    description: "Convert text between uppercase, lowercase, title case, camelCase, snake_case, and more",
    category: "text",
    keywords: ["case", "text", "uppercase", "lowercase", "camel", "snake", "convert"],
    bundleUrl: "/bundles/case-converter.html"
  },
  {
    id: "pdf-merger",
    name: "PDF Merger",
    description: "Combine multiple PDF files into a single document",
    category: "pdf",
    keywords: ["pdf", "merge", "combine", "join", "document"],
    bundleUrl: "/bundles/pdf-merger.html"
  },
  // ... 288 more tools
];
```

### Search Algorithm

Simple but effective keyword matching:

```typescript
function searchTools(query: string, registry: ToolEntry[]): ToolEntry[] {
  const queryWords = query.toLowerCase().split(/\s+/);

  const scored = registry.map(tool => {
    let score = 0;
    const haystack = `${tool.name} ${tool.description} ${tool.keywords.join(' ')}`.toLowerCase();

    for (const word of queryWords) {
      // Exact keyword match: +3
      if (tool.keywords.includes(word)) score += 3;
      // Name contains word: +2
      else if (tool.name.toLowerCase().includes(word)) score += 2;
      // Description/haystack contains word: +1
      else if (haystack.includes(word)) score += 1;
    }

    return { tool, score };
  });

  return scored
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(x => x.tool);
}
```

### LLM Tool Selection Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  User: "I need to convert some PDFs to images"                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  1. Search tool registry for: "convert PDFs images"             │
│     Results:                                                    │
│     - pdf-to-image (score: 8)                                   │
│     - pdf-to-png (score: 6)                                     │
│     - image-converter (score: 3)                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  2. Augment prompt with tool context:                           │
│     "Available tools:                                           │
│      - pdf-to-image: Convert PDF pages to images                │
│      - pdf-to-png: Convert PDF to PNG format                    │
│      User request: I need to convert some PDFs to images"       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  3. LLM generates response:                                     │
│     "[TOOL:pdf-to-image] This tool converts each page of        │
│      your PDF into a separate image. Just drop your PDF         │
│      and choose your preferred format (PNG, JPG)."              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  4. UI detects [TOOL:pdf-to-image], renders tool bundle         │
└─────────────────────────────────────────────────────────────────┘
```

---

## User Experience Flow

### First Visit

```
┌─────────────────────────────────────────────────────────────────┐
│  1. User navigates to conveniencepro.cc/assistant               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  2. Check WebGPU support                                        │
│     ├─ Supported → Continue                                     │
│     └─ Not supported → Show fallback (tool directory)           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  3. Download Llama 3.2 1B (~800MB)                              │
│     - Show progress bar                                         │
│     - Explain one-time download                                 │
│     - Time: 30-120 seconds depending on connection              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  4. Model cached in CacheStorage                                │
│     - Persists across sessions                                  │
│     - ~800MB browser storage used                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  5. Chat interface ready                                        │
│     - User can start chatting                                   │
│     - Responses stream in real-time                             │
└─────────────────────────────────────────────────────────────────┘
```

### Subsequent Visits

```
┌─────────────────────────────────────────────────────────────────┐
│  1. User returns to /assistant                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  2. Model loaded from CacheStorage                              │
│     - Time: 2-5 seconds                                         │
│     - No network required                                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  3. Ready to chat immediately                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Performance Optimization

### Web Worker Isolation

Run LLM inference in a Web Worker to prevent UI blocking:

```typescript
// Main thread stays responsive
const worker = new Worker('/llm-worker.js');

// Heavy computation happens in worker
worker.postMessage({ type: 'chat', messages: [...] });

// Streaming tokens update UI smoothly
worker.onmessage = (e) => {
  if (e.data.type === 'token') {
    appendToken(e.data.payload);
  }
};
```

### Lazy Loading

Only load the LLM when user navigates to assistant:

```typescript
// Dynamic import - no LLM code in main bundle
const ChatPanel = dynamic(() => import('@/components/llm/ChatPanel'), {
  loading: () => <LoadingSpinner />,
  ssr: false, // WebGPU requires browser
});
```

### Model Caching

WebLLM automatically caches in CacheStorage:

```typescript
// Check if model is cached
const cache = await caches.open('webllm');
const cached = await cache.match(modelUrl);

if (cached) {
  // Load from cache (~2-5s)
} else {
  // Download from network (~30-120s)
}
```

### Token Streaming

Stream tokens for perceived performance:

```typescript
// User sees response building character by character
for await (const chunk of stream) {
  const token = chunk.choices[0]?.delta?.content || '';
  yield token; // Immediate display
}
```

### Expected Performance

| Metric | Value | Notes |
|--------|-------|-------|
| First load | 30-120s | Download ~800MB model |
| Subsequent load | 2-5s | Load from cache |
| Time to first token | 200-500ms | After prompt sent |
| Token generation | 8-20 tok/s | Depends on GPU |
| Response latency | 2-8s | For typical responses |

---

## Browser Compatibility

### WebGPU Support (2025)

| Browser | Status | Version |
|---------|--------|---------|
| Chrome | Stable | 113+ |
| Edge | Stable | 113+ |
| Firefox | Stable | 141+ (Windows), coming to Mac/Linux |
| Safari | Beta | 26+ (macOS, iOS, iPadOS) |
| Chrome Android | Stable | 121+ (Android 12+) |

### Feature Detection

```typescript
async function checkWebGPUSupport(): Promise<{
  supported: boolean;
  reason?: string;
}> {
  // Check if WebGPU API exists
  if (!navigator.gpu) {
    return {
      supported: false,
      reason: 'WebGPU not available in this browser'
    };
  }

  // Try to get adapter
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    return {
      supported: false,
      reason: 'No WebGPU adapter found (GPU may not be supported)'
    };
  }

  // Check for required features
  const device = await adapter.requestDevice();
  if (!device) {
    return {
      supported: false,
      reason: 'Could not create WebGPU device'
    };
  }

  return { supported: true };
}
```

### Fallback Strategy

For browsers without WebGPU:

```typescript
const { supported, reason } = await checkWebGPUSupport();

if (!supported) {
  // Option 1: Show tool directory (no AI)
  router.push('/tools');

  // Option 2: Offer cloud API option (breaks privacy)
  // showCloudFallbackDialog();

  // Option 3: Show browser upgrade message
  showBrowserUpgradeMessage(reason);
}
```

---

## Offline Capability

### How It Works

After first visit:

1. **Model weights** - Cached in CacheStorage (~800MB)
2. **Tool bundles** - Cached via Service Worker
3. **Tool registry** - Embedded in JS bundle

### Service Worker Integration

```typescript
// sw.ts
const CACHE_NAME = 'conveniencepro-v1';
const BUNDLE_CACHE = 'tool-bundles-v1';

// Cache tool bundles on first access
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/bundles/')) {
    event.respondWith(
      caches.open(BUNDLE_CACHE).then(cache =>
        cache.match(event.request).then(response =>
          response || fetch(event.request).then(networkResponse => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          })
        )
      )
    );
  }
});
```

### Offline UX

```typescript
// Detect offline state
const [isOnline, setIsOnline] = useState(navigator.onLine);

useEffect(() => {
  const handleOnline = () => setIsOnline(true);
  const handleOffline = () => setIsOnline(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}, []);

// Show offline indicator
{!isOnline && (
  <div className="offline-banner">
    You're offline. AI and cached tools still work!
  </div>
)}
```

---

## Limitations & Mitigations

### Model Limitations

| Limitation | Impact | Mitigation |
|------------|--------|------------|
| 1B parameters | Limited reasoning | Focus on tool selection, not complex tasks |
| 4K context default | Can't process long documents | Summarize inputs, chunk if needed |
| No real-time knowledge | Outdated information | Tools provide current functionality |
| English-primary | Limited multilingual | Focus on English market initially |

### Technical Limitations

| Limitation | Impact | Mitigation |
|------------|--------|------------|
| ~800MB download | Slow first load | Progress indicator, caching |
| ~1GB VRAM needed | Excludes low-end devices | Graceful fallback |
| WebGPU required | Not all browsers | Feature detection, fallback |
| Battery drain | Mobile concern | Warn users, auto-stop |

### UX Mitigations

```typescript
// 1. Memory warning for low-end devices
const memory = (navigator as any).deviceMemory; // GB
if (memory && memory < 4) {
  showWarning('Your device may have difficulty running the AI assistant.');
}

// 2. Battery warning on mobile
if ('getBattery' in navigator) {
  const battery = await (navigator as any).getBattery();
  if (battery.level < 0.2 && !battery.charging) {
    showWarning('Low battery. AI assistant uses significant power.');
  }
}

// 3. Data warning for metered connections
const connection = (navigator as any).connection;
if (connection?.saveData || connection?.effectiveType === 'slow-2g') {
  showWarning('Large download required (~800MB). Use WiFi if possible.');
}
```

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)

- [ ] Set up WebLLM integration
- [ ] Create Web Worker infrastructure
- [ ] Implement basic chat UI
- [ ] Test model loading and inference
- [ ] Add progress indicators

**Deliverables:**
- Working chat with Llama 3.2 1B
- Model caching functional
- Basic error handling

### Phase 2: Tool Integration (Week 3-4)

- [ ] Create tool registry JSON
- [ ] Implement tool search algorithm
- [ ] Add tool-aware system prompt
- [ ] Build tool renderer component
- [ ] Test tool invocation flow

**Deliverables:**
- LLM can recommend tools
- Tools render inline
- End-to-end flow working

### Phase 3: Polish (Week 5-6)

- [ ] Add offline support
- [ ] Implement fallbacks
- [ ] Performance optimization
- [ ] Browser compatibility testing
- [ ] Mobile testing

**Deliverables:**
- Production-ready assistant
- Works offline
- Graceful degradation

### Phase 4: Launch (Week 7-8)

- [ ] Beta testing
- [ ] Documentation
- [ ] Analytics integration
- [ ] Public launch

---

## Appendix A: WebGPU Detection Code

```typescript
export async function detectWebGPU(): Promise<WebGPUStatus> {
  if (typeof navigator === 'undefined') {
    return { available: false, reason: 'Not in browser environment' };
  }

  if (!('gpu' in navigator)) {
    return { available: false, reason: 'WebGPU API not present' };
  }

  try {
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      return { available: false, reason: 'No GPU adapter available' };
    }

    const adapterInfo = await adapter.requestAdapterInfo();

    return {
      available: true,
      vendor: adapterInfo.vendor,
      architecture: adapterInfo.architecture,
      device: adapterInfo.device,
    };
  } catch (error) {
    return { available: false, reason: String(error) };
  }
}
```

## Appendix B: Model Size Reference

| Model | Quantization | Size | VRAM |
|-------|--------------|------|------|
| Llama 3.2 1B | q4f16_1 | ~700MB | ~879MB |
| Llama 3.2 1B | q4f32_1 | ~800MB | ~1GB |
| Llama 3.2 3B | q4f16_1 | ~1.8GB | ~2.2GB |
| Phi-3 Mini | q4f16_1 | ~2.2GB | ~2.8GB |

## Appendix C: Related Documents

- [MCP Artifact Architecture](/docs/mcp-artifact-architecture.md)
- [Tool Bundle Format](/docs/bundle-style-guide.md)

---

*Last updated: 2025-11-30*
*Version: 1.0.0*

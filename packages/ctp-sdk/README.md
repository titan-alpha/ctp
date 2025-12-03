# @conveniencepro/ctp-sdk

Embeddable SDK for **ConveniencePro Tool Protocol (CTP)** tools.

Integrate CTP tools into any website with automatic style matching and theme detection.

## Installation

### NPM/Yarn

```bash
npm install @conveniencepro/ctp-sdk
# or
yarn add @conveniencepro/ctp-sdk
```

### CDN (Browser)

```html
<script src="https://cdn.jsdelivr.net/npm/@conveniencepro/ctp-sdk/dist/sdk.global.js"></script>
```

Or use unpkg:

```html
<script src="https://unpkg.com/@conveniencepro/ctp-sdk/dist/sdk.global.js"></script>
```

## Quick Start

### Method 1: Auto-Discovery (Easiest)

```html
<!-- Add data attributes to your container -->
<div data-ctp-tool="json-formatter"></div>

<!-- Include the SDK (it auto-initializes) -->
<script src="https://cdn.jsdelivr.net/npm/@conveniencepro/ctp-sdk"></script>
```

### Method 2: Programmatic

```html
<div id="tool-container"></div>

<script src="https://cdn.jsdelivr.net/npm/@conveniencepro/ctp-sdk"></script>
<script>
  ConveniencePro.embed('tool-container', 'json-formatter', {
    theme: 'dark',
    accentColor: '#ff5500',
  });
</script>
```

### Method 3: ES Module

```typescript
import { embed } from '@conveniencepro/ctp-sdk';

const controller = embed('container', 'json-formatter', {
  autosense: true,
  onReady: (ctrl) => console.log('Embed ready!'),
  onResult: (result) => console.log('Result:', result),
});
```

## Features

### Autosense

Automatically detect and match the host page's styling:

```typescript
import { embed, detectStyles } from '@conveniencepro/ctp-sdk';

// Auto-detect styles (default behavior)
embed('container', 'tool-id', { autosense: true });

// Manual detection
const styles = detectStyles(document.body);
console.log(styles);
// {
//   theme: 'dark',
//   accentColor: '#6366f1',
//   fontFamily: 'Inter, sans-serif',
//   borderRadius: 8,
//   framework: 'tailwind',
//   ...
// }
```

### Theme Watching

Automatically update when the page theme changes:

```typescript
embed('container', 'tool-id', {
  autosense: true,
  watchTheme: true, // React to theme changes
});
```

### Framework Detection

The SDK detects these CSS frameworks:
- Tailwind CSS
- Bootstrap
- Chakra UI
- Material UI (MUI)
- shadcn/ui
- Ant Design

## Configuration

### Data Attributes

```html
<div
  data-ctp-tool="json-formatter"
  data-ctp-base-url="https://conveniencepro.cc"
  data-ctp-theme="dark"
  data-ctp-accent="#ff5500"
  data-ctp-width="100%"
  data-ctp-height="500px"
  data-ctp-min-height="400px"
  data-ctp-autosense="true"
  data-ctp-watch-theme="true"
></div>
```

### JavaScript Options

```typescript
interface EmbedConfig {
  // Tool configuration
  toolId?: string;
  baseUrl?: string;
  embedPath?: string;

  // Dimensions
  width?: string | number;
  height?: string | number;
  minHeight?: string | number;

  // Styling (override autosense)
  theme?: 'light' | 'dark';
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
  baseFontSize?: number;
  borderRadius?: number;
  shadow?: 'none' | 'subtle' | 'medium' | 'large';
  density?: 'compact' | 'normal' | 'comfortable';

  // Behavior
  autosense?: boolean;      // Auto-detect styles (default: true)
  watchTheme?: boolean;     // Watch for theme changes (default: true)
  loading?: 'lazy' | 'eager';
  allowClipboard?: boolean;

  // Callbacks
  onReady?: (embed: EmbedController) => void;
  onResult?: (result: unknown) => void;
  onError?: (error: Error) => void;
}
```

## Embed Controller

The `embed()` function returns a controller for managing the embed:

```typescript
const controller = embed('container', 'tool-id');

// Check if ready
console.log(controller.ready);

// Update styles dynamically
controller.updateStyles({
  theme: 'dark',
  accentColor: '#ff0000',
});

// Reload the embed
controller.reload();

// Destroy the embed
controller.destroy();
```

## Managing Multiple Embeds

```typescript
import {
  embed,
  getEmbed,
  getAllEmbeds,
  destroyAllEmbeds,
} from '@conveniencepro/ctp-sdk';

// Create multiple embeds
const embed1 = embed('container1', 'json-formatter');
const embed2 = embed('container2', 'base64-encoder');

// Get an embed by ID
const found = getEmbed(embed1.id);

// Get all active embeds
const all = getAllEmbeds();

// Destroy all embeds
destroyAllEmbeds();
```

## Style Detection Utilities

```typescript
import {
  detectStyles,
  detectColorScheme,
  detectFramework,
  detectAccentColor,
  detectFontFamily,
  detectBorderRadius,
  createThemeObserver,
} from '@conveniencepro/ctp-sdk';

// Detect individual properties
const theme = detectColorScheme();       // 'light' | 'dark'
const framework = detectFramework();      // 'tailwind' | 'bootstrap' | ...
const accent = detectAccentColor();       // '#6366f1'
const font = detectFontFamily();          // 'Inter, sans-serif'
const radius = detectBorderRadius();      // 8

// Watch for theme changes
const unsubscribe = createThemeObserver((newTheme) => {
  console.log('Theme changed to:', newTheme);
});

// Stop watching
unsubscribe();
```

## Available Tools

Popular tools you can embed:

| Tool ID | Description |
|---------|-------------|
| `json-formatter` | Format and beautify JSON |
| `base64-encoder` | Base64 encoding/decoding |
| `hash-generator` | SHA-256, MD5, etc. |
| `uuid-generator` | Generate UUIDs |
| `color-converter` | Convert between color formats |
| `regex-tester` | Test regular expressions |
| `case-converter` | Convert text case |
| `timestamp-converter` | Unix/ISO timestamp conversion |

See the full list at [conveniencepro.cc/tools](https://conveniencepro.cc/tools).

## Examples

### React

```tsx
import { useEffect, useRef } from 'react';
import { embed, EmbedController } from '@conveniencepro/ctp-sdk';

function ToolEmbed({ toolId }: { toolId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<EmbedController | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      controllerRef.current = embed(containerRef.current, toolId, {
        autosense: true,
      });
    }

    return () => {
      controllerRef.current?.destroy();
    };
  }, [toolId]);

  return <div ref={containerRef} />;
}
```

### Vue

```vue
<template>
  <div ref="container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { embed, type EmbedController } from '@conveniencepro/ctp-sdk';

const container = ref<HTMLElement>();
let controller: EmbedController | null = null;

onMounted(() => {
  if (container.value) {
    controller = embed(container.value, 'json-formatter');
  }
});

onUnmounted(() => {
  controller?.destroy();
});
</script>
```

## Related Packages

- `@conveniencepro/ctp-core` - Core types and interfaces
- `@conveniencepro/ctp-runtime` - Tool execution runtime
- `@conveniencepro/ctp-discovery` - Manifest generation

## License

MIT © ConveniencePro

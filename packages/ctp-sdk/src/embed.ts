/**
 * ConveniencePro Tool Protocol (CTP) - Embed Module
 *
 * Embed CTP tools in any website using iframes with style matching.
 *
 * @module @conveniencepro/ctp-sdk/embed
 */

import { detectStyles, createThemeObserver, DetectedStyles } from './autosense';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Embed configuration options
 */
export interface EmbedConfig extends Partial<DetectedStyles> {
  /** Tool ID to embed */
  toolId?: string;
  /** Base URL for the embed service */
  baseUrl?: string;
  /** Path to embed endpoint */
  embedPath?: string;
  /** Width of the embed */
  width?: string | number;
  /** Height of the embed */
  height?: string | number;
  /** Minimum height */
  minHeight?: string | number;
  /** Enable autosense (auto-detect styles) */
  autosense?: boolean;
  /** Watch for theme changes */
  watchTheme?: boolean;
  /** Loading indicator */
  loading?: 'lazy' | 'eager';
  /** Allow clipboard access */
  allowClipboard?: boolean;
  /** Custom CSS classes for the container */
  className?: string;
  /** Callback when embed is ready */
  onReady?: (embed: EmbedController) => void;
  /** Callback when tool completes */
  onResult?: (result: unknown) => void;
  /** Callback on error */
  onError?: (error: Error) => void;
}

/**
 * Embed controller for managing the embed
 */
export interface EmbedController {
  /** Unique embed ID */
  id: string;
  /** Tool ID */
  toolId: string;
  /** Container element */
  container: HTMLElement;
  /** Iframe element */
  iframe: HTMLIFrameElement | null;
  /** Current configuration */
  config: EmbedConfig;
  /** Whether the embed is ready */
  ready: boolean;
  /** Update embed styles */
  updateStyles: (styles: Partial<DetectedStyles>) => void;
  /** Destroy the embed */
  destroy: () => void;
  /** Reload the embed */
  reload: () => void;
}

/**
 * Message types for iframe communication
 */
interface EmbedMessage {
  type: 'ready' | 'resize' | 'result' | 'error' | 'updateStyles';
  payload?: unknown;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const DEFAULT_BASE_URL = 'https://conveniencepro.cc';
const DEFAULT_EMBED_PATH = '/embed';

const DEFAULT_CONFIG: Partial<EmbedConfig> = {
  width: '100%',
  height: 'auto',
  minHeight: '400px',
  autosense: true,
  watchTheme: true,
  loading: 'lazy',
  allowClipboard: true,
};

// =============================================================================
// EMBED MANAGER
// =============================================================================

/**
 * Map of active embeds
 */
const activeEmbeds = new Map<string, EmbedController>();

/**
 * Generate unique embed ID
 */
function generateEmbedId(): string {
  return `ctp-embed-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Build embed URL with configuration
 */
function buildEmbedUrl(toolId: string, config: EmbedConfig): string {
  const baseUrl = config.baseUrl || DEFAULT_BASE_URL;
  const embedPath = config.embedPath || DEFAULT_EMBED_PATH;
  const url = new URL(`${embedPath}/${toolId}`, baseUrl);

  // Add style parameters
  const styleParams: Array<[string, string | number | undefined]> = [
    ['theme', config.theme],
    ['accent', config.accentColor],
    ['bg', config.backgroundColor],
    ['text', config.textColor],
    ['font', config.fontFamily],
    ['fontSize', config.baseFontSize],
    ['radius', config.borderRadius],
    ['shadow', config.shadow],
    ['density', config.density],
  ];

  for (const [key, value] of styleParams) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

/**
 * Create an iframe element for the embed
 */
function createIframe(embedId: string, url: string, config: EmbedConfig): HTMLIFrameElement {
  const iframe = document.createElement('iframe');

  iframe.id = embedId;
  iframe.src = url;
  iframe.style.width = typeof config.width === 'number' ? `${config.width}px` : (config.width || '100%');
  iframe.style.height = config.height === 'auto'
    ? (typeof config.minHeight === 'number' ? `${config.minHeight}px` : (config.minHeight || '400px'))
    : (typeof config.height === 'number' ? `${config.height}px` : config.height);
  iframe.style.minHeight = typeof config.minHeight === 'number' ? `${config.minHeight}px` : (config.minHeight || '400px');
  iframe.style.border = 'none';
  iframe.style.borderRadius = config.borderRadius ? `${config.borderRadius}px` : '8px';
  iframe.style.overflow = 'hidden';
  iframe.style.display = 'block';

  // Attributes
  iframe.setAttribute('loading', config.loading || 'lazy');
  iframe.setAttribute('allowtransparency', 'true');
  iframe.setAttribute('title', `ConveniencePro - ${config.toolId}`);

  // Permissions
  const allow: string[] = [];
  if (config.allowClipboard) {
    allow.push('clipboard-write');
  }
  if (allow.length > 0) {
    iframe.setAttribute('allow', allow.join('; '));
  }

  return iframe;
}

// =============================================================================
// MAIN EMBED FUNCTION
// =============================================================================

/**
 * Embed a CTP tool in a container
 *
 * @param container - Container element or ID
 * @param toolId - Tool ID to embed
 * @param options - Configuration options
 * @returns Embed controller
 */
export function embed(
  container: string | HTMLElement,
  toolId: string,
  options: Partial<EmbedConfig> = {}
): EmbedController {
  // Resolve container element
  const containerEl = typeof container === 'string'
    ? document.getElementById(container)
    : container;

  if (!containerEl) {
    throw new Error(`Container not found: ${container}`);
  }

  // Merge configuration
  const config: EmbedConfig = {
    ...DEFAULT_CONFIG,
    ...options,
    toolId,
  };

  // Generate unique ID
  const embedId = generateEmbedId();

  // Detect styles if autosense is enabled
  let detectedStyles: Partial<DetectedStyles> = {};
  if (config.autosense) {
    detectedStyles = detectStyles(containerEl);
  }

  // Merge detected styles with explicit config (explicit takes priority)
  const finalConfig: EmbedConfig = {
    ...detectedStyles,
    ...config,
  };

  // Build URL
  const embedUrl = buildEmbedUrl(toolId, finalConfig);

  // Create iframe
  const iframe = createIframe(embedId, embedUrl, finalConfig);

  // Apply container class if provided
  if (config.className) {
    containerEl.classList.add(...config.className.split(' '));
  }

  // Create controller
  const controller: EmbedController = {
    id: embedId,
    toolId,
    container: containerEl,
    iframe: null,
    config: finalConfig,
    ready: false,

    updateStyles(styles: Partial<DetectedStyles>) {
      Object.assign(this.config, styles);
      if (this.iframe?.contentWindow) {
        this.iframe.contentWindow.postMessage({
          type: 'updateStyles',
          payload: styles,
        }, '*');
      }
    },

    destroy() {
      if (themeCleanup) themeCleanup();
      if (this.iframe) {
        this.iframe.remove();
      }
      activeEmbeds.delete(embedId);
      window.removeEventListener('message', messageHandler);
    },

    reload() {
      if (this.iframe) {
        const newUrl = buildEmbedUrl(toolId, this.config);
        this.iframe.src = newUrl;
      }
    },
  };

  // Message handler for iframe communication
  const messageHandler = (event: MessageEvent) => {
    // Validate origin
    const expectedOrigin = new URL(config.baseUrl || DEFAULT_BASE_URL).origin;
    if (event.origin !== expectedOrigin) return;

    const message = event.data as EmbedMessage;
    if (!message || typeof message.type !== 'string') return;

    switch (message.type) {
      case 'ready':
        controller.ready = true;
        config.onReady?.(controller);
        break;

      case 'resize':
        if (controller.iframe && message.payload && typeof message.payload === 'object') {
          const { height } = message.payload as { height: number };
          if (height) {
            controller.iframe.style.height = `${height}px`;
          }
        }
        break;

      case 'result':
        config.onResult?.(message.payload);
        break;

      case 'error':
        config.onError?.(new Error(String(message.payload)));
        break;
    }
  };

  window.addEventListener('message', messageHandler);

  // Watch for theme changes if enabled
  let themeCleanup: (() => void) | null = null;
  if (config.watchTheme) {
    themeCleanup = createThemeObserver((theme) => {
      controller.updateStyles({ theme });
    });
  }

  // Append iframe to container
  containerEl.appendChild(iframe);
  controller.iframe = iframe;

  // Store in active embeds
  activeEmbeds.set(embedId, controller);

  return controller;
}

/**
 * Get an active embed by ID
 */
export function getEmbed(embedId: string): EmbedController | undefined {
  return activeEmbeds.get(embedId);
}

/**
 * Get all active embeds
 */
export function getAllEmbeds(): EmbedController[] {
  return Array.from(activeEmbeds.values());
}

/**
 * Destroy all active embeds
 */
export function destroyAllEmbeds(): void {
  for (const embed of activeEmbeds.values()) {
    embed.destroy();
  }
}

// =============================================================================
// AUTO-DISCOVERY
// =============================================================================

/**
 * Auto-discover and embed tools from data attributes
 *
 * Looks for elements with `data-ctp-tool` attribute:
 * ```html
 * <div data-ctp-tool="json-formatter" data-ctp-theme="dark"></div>
 * ```
 */
export function autoDiscover(): EmbedController[] {
  if (typeof document === 'undefined') return [];

  const elements = document.querySelectorAll<HTMLElement>('[data-ctp-tool]');
  const controllers: EmbedController[] = [];

  elements.forEach(el => {
    const toolId = el.getAttribute('data-ctp-tool');
    if (!toolId) return;

    // Parse data attributes
    const config: Partial<EmbedConfig> = {};

    const attrMap: Record<string, keyof EmbedConfig> = {
      'data-ctp-base-url': 'baseUrl',
      'data-ctp-theme': 'theme',
      'data-ctp-accent': 'accentColor',
      'data-ctp-width': 'width',
      'data-ctp-height': 'height',
      'data-ctp-min-height': 'minHeight',
      'data-ctp-autosense': 'autosense',
      'data-ctp-watch-theme': 'watchTheme',
    };

    for (const [attr, key] of Object.entries(attrMap)) {
      const value = el.getAttribute(attr);
      if (value !== null) {
        if (key === 'autosense' || key === 'watchTheme') {
          (config as Record<string, unknown>)[key] = value !== 'false';
        } else {
          (config as Record<string, unknown>)[key] = value;
        }
      }
    }

    try {
      const controller = embed(el, toolId, config);
      controllers.push(controller);
    } catch (error) {
      console.error(`[CTP SDK] Failed to embed tool "${toolId}":`, error);
    }
  });

  return controllers;
}

/**
 * Initialize SDK with auto-discovery
 */
export function init(): EmbedController[] {
  if (typeof document === 'undefined') return [];

  // Run auto-discovery when DOM is ready
  if (document.readyState === 'loading') {
    const controllers: EmbedController[] = [];
    document.addEventListener('DOMContentLoaded', () => {
      controllers.push(...autoDiscover());
    });
    return controllers;
  }

  return autoDiscover();
}

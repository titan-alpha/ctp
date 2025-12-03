/**
 * @conveniencepro/ctp-sdk
 *
 * Embeddable SDK for ConveniencePro tools.
 * Integrate CTP tools into any website with automatic style matching.
 *
 * @packageDocumentation
 * @module @conveniencepro/ctp-sdk
 * @version 1.0.0
 */

// =============================================================================
// AUTOSENSE EXPORTS
// =============================================================================

export {
  // Types
  type DetectedStyles,
  type FrameworkPattern,
  type ThemeChangeCallback,

  // Constants
  FRAMEWORK_PATTERNS,

  // Detection functions
  detectFramework,
  detectColorScheme,
  detectAccentColor,
  detectFontFamily,
  detectBaseFontSize,
  detectBorderRadius,
  detectStyles,

  // Theme observer
  createThemeObserver,
} from './autosense';

// =============================================================================
// EMBED EXPORTS
// =============================================================================

export {
  // Types
  type EmbedConfig,
  type EmbedController,

  // Main functions
  embed,
  getEmbed,
  getAllEmbeds,
  destroyAllEmbeds,

  // Auto-discovery
  autoDiscover,
  init,
} from './embed';

// =============================================================================
// SDK VERSION
// =============================================================================

/**
 * SDK version
 */
export const SDK_VERSION = '1.0.0';

// =============================================================================
// CONVENIENCE EXPORTS
// =============================================================================

import { embed, init as initEmbeds, EmbedConfig, EmbedController } from './embed';
import { detectStyles, DetectedStyles } from './autosense';

/**
 * ConveniencePro SDK namespace
 */
export const ConveniencePro = {
  /**
   * SDK version
   */
  version: SDK_VERSION,

  /**
   * Embed a tool
   */
  embed,

  /**
   * Initialize SDK with auto-discovery
   */
  init: initEmbeds,

  /**
   * Detect styles from the page
   */
  detectStyles,
};

/**
 * Default export for convenience
 */
export default ConveniencePro;

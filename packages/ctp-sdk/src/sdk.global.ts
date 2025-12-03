/**
 * ConveniencePro SDK - Global Browser Build
 *
 * This file creates the global ConveniencePro object when loaded via script tag.
 *
 * Usage:
 * ```html
 * <script src="https://cdn.jsdelivr.net/npm/@conveniencepro/ctp-sdk/dist/sdk.global.js"></script>
 * <script>
 *   ConveniencePro.embed('container', 'json-formatter');
 * </script>
 * ```
 */

import {
  embed,
  init,
  autoDiscover,
  getEmbed,
  getAllEmbeds,
  destroyAllEmbeds,
  detectStyles,
  detectColorScheme,
  detectFramework,
  detectAccentColor,
  createThemeObserver,
  SDK_VERSION,
  type EmbedConfig,
  type EmbedController,
  type DetectedStyles,
} from './index';

/**
 * Global ConveniencePro SDK interface
 */
interface ConvenienceProSDK {
  version: string;
  embed: typeof embed;
  init: typeof init;
  autoDiscover: typeof autoDiscover;
  getEmbed: typeof getEmbed;
  getAllEmbeds: typeof getAllEmbeds;
  destroyAllEmbeds: typeof destroyAllEmbeds;
  detectStyles: typeof detectStyles;
  detectColorScheme: typeof detectColorScheme;
  detectFramework: typeof detectFramework;
  detectAccentColor: typeof detectAccentColor;
  createThemeObserver: typeof createThemeObserver;
}

/**
 * Create the global SDK object
 */
const ConveniencePro: ConvenienceProSDK = {
  version: SDK_VERSION,
  embed,
  init,
  autoDiscover,
  getEmbed,
  getAllEmbeds,
  destroyAllEmbeds,
  detectStyles,
  detectColorScheme,
  detectFramework,
  detectAccentColor,
  createThemeObserver,
};

// Expose to global scope
declare global {
  interface Window {
    ConveniencePro: ConvenienceProSDK;
  }
}

if (typeof window !== 'undefined') {
  window.ConveniencePro = ConveniencePro;

  // Auto-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      ConveniencePro.init();
    });
  } else {
    // DOM already loaded
    ConveniencePro.init();
  }
}

export default ConveniencePro;

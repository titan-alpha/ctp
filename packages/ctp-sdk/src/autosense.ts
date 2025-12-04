/**
 * ConveniencePro Tool Protocol (CTP) - Autosense Module
 *
 * Automatically detect and match the host page's styling.
 * Supports Tailwind, Bootstrap, Chakra, MUI, shadcn, and custom CSS.
 *
 * @module @conveniencepro/ctp-sdk/autosense
 */

// =============================================================================
// TYPES
// =============================================================================

/**
 * Detected style configuration
 */
export interface DetectedStyles {
  theme: 'light' | 'dark';
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  secondaryTextColor: string;
  borderColor: string;
  inputBackground: string;
  fontFamily: string;
  baseFontSize: number;
  borderRadius: number;
  borderWidth: number;
  shadow: 'none' | 'subtle' | 'medium' | 'large';
  density: 'compact' | 'normal' | 'comfortable';
  framework?: string;
}

/**
 * Framework detection patterns
 */
export interface FrameworkPattern {
  name: string;
  selectors: string[];
  cssVars: string[];
}

// =============================================================================
// FRAMEWORK PATTERNS
// =============================================================================

/**
 * Known CSS framework detection patterns
 */
export const FRAMEWORK_PATTERNS: FrameworkPattern[] = [
  {
    name: 'tailwind',
    selectors: ['[class*="bg-"]', '[class*="text-"]', '[class*="rounded-"]'],
    cssVars: ['--tw-'],
  },
  {
    name: 'bootstrap',
    selectors: ['.btn-primary', '.form-control', '.card'],
    cssVars: ['--bs-'],
  },
  {
    name: 'chakra',
    selectors: ['[data-chakra-component]', '.chakra-'],
    cssVars: ['--chakra-'],
  },
  {
    name: 'mui',
    selectors: ['.MuiButton-root', '.MuiPaper-root', '.MuiTypography-root'],
    cssVars: ['--mui-'],
  },
  {
    name: 'shadcn',
    selectors: ['[data-slot]', '[data-state]'],
    cssVars: ['--primary', '--background', '--foreground', '--card'],
  },
  {
    name: 'ant-design',
    selectors: ['.ant-btn', '.ant-input', '.ant-card'],
    cssVars: ['--ant-'],
  },
];

// =============================================================================
// DETECTION FUNCTIONS
// =============================================================================

/**
 * Detect the CSS framework used on the page
 */
export function detectFramework(): string | null {
  if (typeof document === 'undefined') return null;

  for (const pattern of FRAMEWORK_PATTERNS) {
    // Check selectors
    for (const selector of pattern.selectors) {
      try {
        if (document.querySelector(selector)) {
          return pattern.name;
        }
      } catch {
        // Invalid selector, skip
      }
    }

    // Check CSS variables
    for (const cssVar of pattern.cssVars) {
      // Check if any CSS variable with this prefix exists
      const allProps = Array.from(document.styleSheets)
        .flatMap(sheet => {
          try {
            return Array.from(sheet.cssRules);
          } catch {
            return [];
          }
        })
        .filter(rule => rule instanceof CSSStyleRule)
        .flatMap(rule => (rule as CSSStyleRule).style.cssText)
        .join('');

      if (allProps.includes(cssVar)) {
        return pattern.name;
      }
    }
  }

  return null;
}

/**
 * Detect the color scheme (light/dark mode)
 */
export function detectColorScheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';

  // Check media query preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  // Check common dark mode indicators
  const html = document.documentElement;
  const body = document.body;

  if (
    html.classList.contains('dark') ||
    body.classList.contains('dark') ||
    html.getAttribute('data-theme') === 'dark' ||
    body.getAttribute('data-theme') === 'dark' ||
    html.getAttribute('data-mode') === 'dark'
  ) {
    return 'dark';
  }

  // Check background color luminance
  const bgColor = getComputedStyle(body).backgroundColor;
  const luminance = getColorLuminance(bgColor);
  if (luminance < 0.5) {
    return 'dark';
  }

  return 'light';
}

/**
 * Get luminance of a color (0-1)
 */
function getColorLuminance(color: string): number {
  const rgb = parseColor(color);
  if (!rgb) return 1;

  const [r, g, b] = rgb.map(v => {
    const normalized = v / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Parse a color string to RGB array
 */
function parseColor(color: string): [number, number, number] | null {
  // Handle rgb/rgba
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return [parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3])];
  }

  // Handle hex
  const hexMatch = color.match(/^#([0-9a-f]{3,8})$/i);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
    ];
  }

  return null;
}

/**
 * Get CSS variable value
 */
function getCSSVariable(name: string, fallback: string): string {
  if (typeof document === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

/**
 * Detect accent/primary color
 */
export function detectAccentColor(): string {
  if (typeof document === 'undefined') return '#2563eb';

  // Try common CSS variable names
  const varNames = [
    '--primary',
    '--accent',
    '--color-primary',
    '--bs-primary',
    '--chakra-colors-blue-500',
    '--mui-palette-primary-main',
    '--tw-color-primary',
  ];

  for (const varName of varNames) {
    const value = getCSSVariable(varName, '');
    if (value && value !== 'transparent') {
      // Handle HSL format from shadcn
      if (value.includes(' ') && !value.includes(',')) {
        return `hsl(${value})`;
      }
      return value;
    }
  }

  // Look for a prominent accent color in the page
  const buttons = document.querySelectorAll('button, a.btn, [class*="primary"]');
  for (const button of buttons) {
    const bgColor = getComputedStyle(button).backgroundColor;
    if (bgColor && bgColor !== 'transparent' && bgColor !== 'rgba(0, 0, 0, 0)') {
      const rgb = parseColor(bgColor);
      if (rgb && (rgb[0] > 50 || rgb[1] > 50 || rgb[2] > 100)) {
        return bgColor;
      }
    }
  }

  return '#2563eb'; // Default blue
}

/**
 * Detect font family
 */
export function detectFontFamily(): string {
  if (typeof document === 'undefined') {
    return 'system-ui, -apple-system, sans-serif';
  }

  const bodyFont = getComputedStyle(document.body).fontFamily;
  return bodyFont || 'system-ui, -apple-system, sans-serif';
}

/**
 * Detect base font size
 */
export function detectBaseFontSize(): number {
  if (typeof document === 'undefined') return 16;

  const fontSize = getComputedStyle(document.documentElement).fontSize;
  const parsed = parseInt(fontSize);
  return isNaN(parsed) ? 16 : parsed;
}

/**
 * Detect border radius
 */
export function detectBorderRadius(): number {
  if (typeof document === 'undefined') return 8;

  // Check CSS variables
  const varNames = ['--radius', '--border-radius', '--bs-border-radius'];
  for (const varName of varNames) {
    const value = getCSSVariable(varName, '');
    if (value) {
      const parsed = parseInt(value);
      if (!isNaN(parsed)) return parsed;
    }
  }

  // Sample some elements
  const elements = document.querySelectorAll('button, .card, input, [class*="rounded"]');
  for (const el of elements) {
    const radius = getComputedStyle(el).borderRadius;
    const parsed = parseInt(radius);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }

  return 8;
}

// =============================================================================
// MAIN DETECTION FUNCTION
// =============================================================================

/**
 * Detect all styles from the host page
 */
export function detectStyles(container?: HTMLElement): DetectedStyles {
  const theme = detectColorScheme();
  const framework = detectFramework();
  const accentColor = detectAccentColor();
  const fontFamily = detectFontFamily();
  const baseFontSize = detectBaseFontSize();
  const borderRadius = detectBorderRadius();

  // Get colors based on theme
  let backgroundColor: string;
  let textColor: string;
  let secondaryTextColor: string;
  let borderColor: string;
  let inputBackground: string;

  if (theme === 'dark') {
    backgroundColor = getCSSVariable('--background', '#1f2937');
    textColor = getCSSVariable('--foreground', '#f9fafb');
    secondaryTextColor = '#9ca3af';
    borderColor = getCSSVariable('--border', '#374151');
    inputBackground = '#374151';
  } else {
    backgroundColor = getCSSVariable('--background', '#ffffff');
    textColor = getCSSVariable('--foreground', '#111827');
    secondaryTextColor = '#6b7280';
    borderColor = getCSSVariable('--border', '#e5e7eb');
    inputBackground = '#f9fafb';
  }

  // Override from container if provided
  if (container) {
    const containerStyles = getComputedStyle(container);
    if (containerStyles.backgroundColor !== 'transparent' &&
        containerStyles.backgroundColor !== 'rgba(0, 0, 0, 0)') {
      backgroundColor = containerStyles.backgroundColor;
    }
    if (containerStyles.color) {
      textColor = containerStyles.color;
    }
  }

  return {
    theme,
    accentColor,
    backgroundColor,
    textColor,
    secondaryTextColor,
    borderColor,
    inputBackground,
    fontFamily,
    baseFontSize,
    borderRadius,
    borderWidth: 1,
    shadow: theme === 'dark' ? 'none' : 'subtle',
    density: 'normal',
    framework: framework || undefined,
  };
}

// =============================================================================
// THEME OBSERVER
// =============================================================================

/**
 * Callback for theme changes
 */
export type ThemeChangeCallback = (theme: 'light' | 'dark') => void;

/**
 * Create an observer that watches for theme changes
 */
export function createThemeObserver(callback: ThemeChangeCallback): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  let currentTheme = detectColorScheme();

  // Watch media query
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const mediaHandler = () => {
    const newTheme = detectColorScheme();
    if (newTheme !== currentTheme) {
      currentTheme = newTheme;
      callback(newTheme);
    }
  };
  mediaQuery.addEventListener('change', mediaHandler);

  // Watch DOM mutations for class/attribute changes
  const observer = new MutationObserver(() => {
    const newTheme = detectColorScheme();
    if (newTheme !== currentTheme) {
      currentTheme = newTheme;
      callback(newTheme);
    }
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'data-theme', 'data-mode'],
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class', 'data-theme', 'data-mode'],
  });

  // Return cleanup function
  return () => {
    mediaQuery.removeEventListener('change', mediaHandler);
    observer.disconnect();
  };
}

import { useState, useCallback, useMemo } from 'react';

export interface ContrastResult {
  ratio: number;
  ratioDisplay: string;
  aa: {
    normalText: boolean;
    largeText: boolean;
  };
  aaa: {
    normalText: boolean;
    largeText: boolean;
  };
}

interface UseColorContrastCheckerReturn {
  foregroundColor: string;
  backgroundColor: string;
  setForegroundColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  swapColors: () => void;
  result: ContrastResult;
}

// WCAG 2.1 thresholds
const THRESHOLDS = {
  AA_NORMAL: 4.5,
  AA_LARGE: 3,
  AAA_NORMAL: 7,
  AAA_LARGE: 4.5,
};

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function calculateContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 1;

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

export function useColorContrastChecker(): UseColorContrastCheckerReturn {
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

  const swapColors = useCallback(() => {
    setForegroundColor(backgroundColor);
    setBackgroundColor(foregroundColor);
  }, [foregroundColor, backgroundColor]);

  const result = useMemo((): ContrastResult => {
    const ratio = calculateContrastRatio(foregroundColor, backgroundColor);
    return {
      ratio,
      ratioDisplay: `${ratio.toFixed(2)}:1`,
      aa: {
        normalText: ratio >= THRESHOLDS.AA_NORMAL,
        largeText: ratio >= THRESHOLDS.AA_LARGE,
      },
      aaa: {
        normalText: ratio >= THRESHOLDS.AAA_NORMAL,
        largeText: ratio >= THRESHOLDS.AAA_LARGE,
      },
    };
  }, [foregroundColor, backgroundColor]);

  return {
    foregroundColor,
    backgroundColor,
    setForegroundColor,
    setBackgroundColor,
    swapColors,
    result,
  };
}

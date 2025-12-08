import { useState, useCallback, useMemo } from 'react';

export interface RgbaValues {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface HslValues {
  h: number;
  s: number;
  l: number;
}

export interface UseHexToRgbaReturn {
  hex: string;
  setHex: (hex: string) => void;
  opacity: number;
  setOpacity: (opacity: number) => void;
  rgba: RgbaValues | null;
  rgbaString: string;
  rgbString: string;
  hslString: string;
  hsl: HslValues | null;
  isValid: boolean;
  error: string | null;
  reset: () => void;
}

function parseHex(hex: string): RgbaValues | null {
  let cleanHex = hex.replace(/^#/, '');

  // Support 3, 6, or 8 digit hex
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }

  if (cleanHex.length === 8) {
    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);
    const a = parseInt(cleanHex.slice(6, 8), 16) / 255;
    if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a)) return null;
    return { r, g, b, a: Math.round(a * 100) / 100 };
  }

  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
    return { r, g, b, a: 1 };
  }

  return null;
}

function rgbToHsl(r: number, g: number, b: number): HslValues {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function useHexToRgba(): UseHexToRgbaReturn {
  const [hex, setHex] = useState('#3b82f6');
  const [opacity, setOpacity] = useState(100);

  const parsed = useMemo(() => parseHex(hex), [hex]);

  const rgba = useMemo<RgbaValues | null>(() => {
    if (!parsed) return null;
    return { ...parsed, a: opacity / 100 };
  }, [parsed, opacity]);

  const hsl = useMemo<HslValues | null>(() => {
    if (!rgba) return null;
    return rgbToHsl(rgba.r, rgba.g, rgba.b);
  }, [rgba]);

  const rgbaString = useMemo(() => {
    if (!rgba) return '';
    return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
  }, [rgba]);

  const rgbString = useMemo(() => {
    if (!rgba) return '';
    return `rgb(${rgba.r}, ${rgba.g}, ${rgba.b})`;
  }, [rgba]);

  const hslString = useMemo(() => {
    if (!hsl) return '';
    return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  }, [hsl]);

  const isValid = parsed !== null;
  const error = hex && !isValid ? 'Invalid hex color' : null;

  const reset = useCallback(() => {
    setHex('#3b82f6');
    setOpacity(100);
  }, []);

  return {
    hex,
    setHex,
    opacity,
    setOpacity,
    rgba,
    rgbaString,
    rgbString,
    hslString,
    hsl,
    isValid,
    error,
    reset,
  };
}

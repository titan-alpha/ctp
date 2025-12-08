import { useState, useCallback } from 'react';

export interface AdjustedImage {
  blob: Blob;
  url: string;
  width: number;
  height: number;
}

interface UseImageSaturationAdjusterReturn {
  originalImage: HTMLImageElement | null;
  originalUrl: string | null;
  adjustedImage: AdjustedImage | null;
  saturation: number;
  isProcessing: boolean;
  error: string | null;
  loadImage: (file: File) => Promise<void>;
  setSaturation: (value: number) => void;
  applyAdjustment: () => Promise<void>;
  reset: () => void;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
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
  return [h, s, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export function useImageSaturationAdjuster(): UseImageSaturationAdjusterReturn {
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [adjustedImage, setAdjustedImage] = useState<AdjustedImage | null>(null);
  const [saturation, setSaturationState] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadImage = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setIsProcessing(true);
    setError(null);

    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        if (originalUrl) {
          URL.revokeObjectURL(originalUrl);
        }
        if (adjustedImage) {
          URL.revokeObjectURL(adjustedImage.url);
        }
        setOriginalImage(img);
        setOriginalUrl(objectUrl);
        setAdjustedImage(null);
        setSaturationState(0);
        setIsProcessing(false);
        resolve();
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        setError('Failed to load image');
        setIsProcessing(false);
        reject(new Error('Failed to load image'));
      };

      img.src = objectUrl;
    });
  }, [originalUrl, adjustedImage]);

  const applyAdjustment = useCallback(async () => {
    if (!originalImage) {
      setError('No image loaded');
      return;
    }

    setIsProcessing(true);
    setError(null);

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const canvas = document.createElement('canvas');
        canvas.width = originalImage.naturalWidth;
        canvas.height = originalImage.naturalHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setError('Failed to get canvas context');
          setIsProcessing(false);
          resolve();
          return;
        }

        ctx.drawImage(originalImage, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Saturation adjustment: -100 to +100 maps to multiplier
        const saturationMultiplier = 1 + saturation / 100;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          // Alpha preserved

          const [h, s, l] = rgbToHsl(r, g, b);
          const newS = Math.min(1, Math.max(0, s * saturationMultiplier));
          const [newR, newG, newB] = hslToRgb(h, newS, l);

          data[i] = newR;
          data[i + 1] = newG;
          data[i + 2] = newB;
        }

        ctx.putImageData(imageData, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              setError('Failed to create image');
              setIsProcessing(false);
              resolve();
              return;
            }

            if (adjustedImage) {
              URL.revokeObjectURL(adjustedImage.url);
            }

            const url = URL.createObjectURL(blob);
            setAdjustedImage({
              blob,
              url,
              width: canvas.width,
              height: canvas.height,
            });
            setIsProcessing(false);
            resolve();
          },
          'image/png'
        );
      }, 0);
    });
  }, [originalImage, saturation, adjustedImage]);

  const setSaturation = useCallback((value: number) => {
    setSaturationState(Math.min(100, Math.max(-100, value)));
  }, []);

  const reset = useCallback(() => {
    if (originalUrl) {
      URL.revokeObjectURL(originalUrl);
    }
    if (adjustedImage) {
      URL.revokeObjectURL(adjustedImage.url);
    }
    setOriginalImage(null);
    setOriginalUrl(null);
    setAdjustedImage(null);
    setSaturationState(0);
    setError(null);
  }, [originalUrl, adjustedImage]);

  return {
    originalImage,
    originalUrl,
    adjustedImage,
    saturation,
    isProcessing,
    error,
    loadImage,
    setSaturation,
    applyAdjustment,
    reset,
  };
}

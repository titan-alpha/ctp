import { useState, useCallback, useRef } from 'react';

export type CharacterSet = 'standard' | 'detailed' | 'blocks';

const CHARACTER_SETS: Record<CharacterSet, string> = {
  standard: ' .:-=+*#%@',
  detailed: ' .\'`^",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$',
  blocks: ' ░▒▓█',
};

export interface AsciiArtResult {
  ascii: string;
  width: number;
  height: number;
}

interface UseAsciiArtGeneratorReturn {
  originalImage: string | null;
  result: AsciiArtResult | null;
  width: number;
  characterSet: CharacterSet;
  isProcessing: boolean;
  error: string | null;
  loadImage: (file: File) => Promise<void>;
  setWidth: (value: number) => void;
  setCharacterSet: (set: CharacterSet) => void;
  generateAscii: () => Promise<void>;
  reset: () => void;
}

export function useAsciiArtGenerator(): UseAsciiArtGeneratorReturn {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [result, setResult] = useState<AsciiArtResult | null>(null);
  const [width, setWidthState] = useState(80);
  const [characterSet, setCharacterSetState] = useState<CharacterSet>('standard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const getBrightness = (r: number, g: number, b: number): number => {
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  };

  const mapBrightnessToChar = useCallback((brightness: number, chars: string): string => {
    const index = Math.floor(brightness * (chars.length - 1));
    return chars[Math.min(index, chars.length - 1)];
  }, []);

  const loadImage = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError(null);

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, WebP, GIF, or BMP)');
      setIsProcessing(false);
      return;
    }

    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        if (originalImage) {
          URL.revokeObjectURL(originalImage);
        }
        setOriginalImage(objectUrl);
        imageRef.current = img;
        setResult(null);
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
  }, [originalImage]);

  const generateAscii = useCallback(async () => {
    if (!imageRef.current) {
      setError('No image loaded');
      return;
    }

    setIsProcessing(true);
    setError(null);

    const img = imageRef.current;
    const aspectRatio = img.naturalHeight / img.naturalWidth;
    const charAspectRatio = 0.5;
    const asciiHeight = Math.floor(width * aspectRatio * charAspectRatio);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = asciiHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setError('Failed to create canvas context');
      setIsProcessing(false);
      return;
    }

    ctx.drawImage(img, 0, 0, width, asciiHeight);
    const imageData = ctx.getImageData(0, 0, width, asciiHeight);
    const chars = CHARACTER_SETS[characterSet];

    let ascii = '';
    for (let y = 0; y < asciiHeight; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const brightness = getBrightness(r, g, b);
        ascii += mapBrightnessToChar(brightness, chars);
      }
      ascii += '\n';
    }

    setResult({
      ascii,
      width,
      height: asciiHeight,
    });
    setIsProcessing(false);
  }, [width, characterSet, mapBrightnessToChar]);

  const setWidth = useCallback((value: number) => {
    setWidthState(Math.max(20, Math.min(200, value)));
  }, []);

  const setCharacterSet = useCallback((set: CharacterSet) => {
    setCharacterSetState(set);
  }, []);

  const reset = useCallback(() => {
    if (originalImage) URL.revokeObjectURL(originalImage);
    setOriginalImage(null);
    setResult(null);
    setWidthState(80);
    setCharacterSetState('standard');
    setError(null);
    imageRef.current = null;
  }, [originalImage]);

  return {
    originalImage,
    result,
    width,
    characterSet,
    isProcessing,
    error,
    loadImage,
    setWidth,
    setCharacterSet,
    generateAscii,
    reset,
  };
}

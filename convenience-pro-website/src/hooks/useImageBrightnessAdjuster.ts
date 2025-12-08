import { useState, useCallback, useRef } from 'react';

export interface BrightnessResult {
  blob: Blob;
  url: string;
  width: number;
  height: number;
}

interface UseImageBrightnessAdjusterReturn {
  originalImage: string | null;
  previewUrl: string | null;
  result: BrightnessResult | null;
  brightness: number;
  isProcessing: boolean;
  error: string | null;
  loadImage: (file: File) => Promise<void>;
  setBrightness: (value: number) => void;
  applyBrightness: () => Promise<void>;
  reset: () => void;
}

export function useImageBrightnessAdjuster(): UseImageBrightnessAdjusterReturn {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<BrightnessResult | null>(null);
  const [brightness, setBrightnessState] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const imageDataRef = useRef<{ img: HTMLImageElement; width: number; height: number } | null>(null);

  const adjustBrightness = useCallback((
    imageData: ImageData,
    brightnessValue: number
  ): ImageData => {
    const data = imageData.data;
    const adjustment = (brightnessValue / 100) * 255;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.max(0, Math.min(255, data[i] + adjustment));     // R
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + adjustment)); // G
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + adjustment)); // B
      // Alpha channel (data[i + 3]) remains unchanged
    }

    return imageData;
  }, []);

  const generatePreview = useCallback(async (brightnessValue: number) => {
    if (!imageDataRef.current) return;

    const { img, width, height } = imageDataRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, width, height);
    const adjusted = adjustBrightness(imageData, brightnessValue);
    ctx.putImageData(adjusted, 0, 0);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
      }
    }, 'image/png');
  }, [adjustBrightness, previewUrl]);

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
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }

        setOriginalImage(objectUrl);
        setPreviewUrl(objectUrl);
        imageDataRef.current = { img, width: img.naturalWidth, height: img.naturalHeight };
        setBrightnessState(0);
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
  }, [originalImage, previewUrl]);

  const setBrightness = useCallback((value: number) => {
    const clampedValue = Math.max(-100, Math.min(100, value));
    setBrightnessState(clampedValue);
    generatePreview(clampedValue);
  }, [generatePreview]);

  const applyBrightness = useCallback(async () => {
    if (!imageDataRef.current) {
      setError('No image loaded');
      return;
    }

    setIsProcessing(true);
    setError(null);

    const { img, width, height } = imageDataRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setError('Failed to create canvas context');
      setIsProcessing(false);
      return;
    }

    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, width, height);
    const adjusted = adjustBrightness(imageData, brightness);
    ctx.putImageData(adjusted, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) {
        setError('Failed to generate image');
        setIsProcessing(false);
        return;
      }

      if (result?.url) {
        URL.revokeObjectURL(result.url);
      }

      const url = URL.createObjectURL(blob);
      setResult({
        blob,
        url,
        width,
        height,
      });
      setIsProcessing(false);
    }, 'image/png');
  }, [brightness, adjustBrightness, result]);

  const reset = useCallback(() => {
    if (originalImage) URL.revokeObjectURL(originalImage);
    if (previewUrl && previewUrl !== originalImage) URL.revokeObjectURL(previewUrl);
    if (result?.url) URL.revokeObjectURL(result.url);

    setOriginalImage(null);
    setPreviewUrl(null);
    setResult(null);
    setBrightnessState(0);
    setError(null);
    imageDataRef.current = null;
  }, [originalImage, previewUrl, result]);

  return {
    originalImage,
    previewUrl,
    result,
    brightness,
    isProcessing,
    error,
    loadImage,
    setBrightness,
    applyBrightness,
    reset,
  };
}

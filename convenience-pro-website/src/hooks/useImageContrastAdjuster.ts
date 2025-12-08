import { useState, useCallback } from 'react';

export interface AdjustedImage {
  blob: Blob;
  url: string;
  width: number;
  height: number;
}

interface UseImageContrastAdjusterReturn {
  originalImage: string | null;
  adjustedImage: AdjustedImage | null;
  contrast: number;
  isProcessing: boolean;
  error: string | null;
  loadImage: (file: File) => Promise<void>;
  setContrast: (value: number) => void;
  applyContrast: () => Promise<void>;
  reset: () => void;
}

export function useImageContrastAdjuster(): UseImageContrastAdjusterReturn {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalImageElement, setOriginalImageElement] = useState<HTMLImageElement | null>(null);
  const [adjustedImage, setAdjustedImage] = useState<AdjustedImage | null>(null);
  const [contrast, setContrastValue] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadImage = useCallback(async (file: File): Promise<void> => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, WebP, GIF, BMP)');
      return;
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        if (originalImage) {
          URL.revokeObjectURL(originalImage);
        }
        if (adjustedImage) {
          URL.revokeObjectURL(adjustedImage.url);
        }
        setOriginalImage(objectUrl);
        setOriginalImageElement(img);
        setAdjustedImage(null);
        setContrastValue(0);
        setError(null);
        resolve();
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        setError('Failed to load image');
        reject(new Error('Failed to load image'));
      };

      img.src = objectUrl;
    });
  }, [originalImage, adjustedImage]);

  const setContrast = useCallback((value: number) => {
    const clampedValue = Math.max(-100, Math.min(100, value));
    setContrastValue(clampedValue);
  }, []);

  const applyContrast = useCallback(async (): Promise<void> => {
    if (!originalImageElement) {
      setError('No image loaded');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = originalImageElement.naturalWidth;
      canvas.height = originalImageElement.naturalHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

      ctx.drawImage(originalImageElement, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Contrast formula: factor = (259 * (contrast + 255)) / (255 * (259 - contrast))
      const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.max(0, Math.min(255, factor * (data[i] - 128) + 128));     // Red
        data[i + 1] = Math.max(0, Math.min(255, factor * (data[i + 1] - 128) + 128)); // Green
        data[i + 2] = Math.max(0, Math.min(255, factor * (data[i + 2] - 128) + 128)); // Blue
        // Alpha channel (data[i + 3]) remains unchanged
      }

      ctx.putImageData(imageData, 0, 0);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error('Failed to create blob'));
          },
          'image/png'
        );
      });

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to adjust contrast');
    } finally {
      setIsProcessing(false);
    }
  }, [originalImageElement, contrast, adjustedImage]);

  const reset = useCallback(() => {
    if (originalImage) {
      URL.revokeObjectURL(originalImage);
    }
    if (adjustedImage) {
      URL.revokeObjectURL(adjustedImage.url);
    }
    setOriginalImage(null);
    setOriginalImageElement(null);
    setAdjustedImage(null);
    setContrastValue(0);
    setError(null);
  }, [originalImage, adjustedImage]);

  return {
    originalImage,
    adjustedImage,
    contrast,
    isProcessing,
    error,
    loadImage,
    setContrast,
    applyContrast,
    reset,
  };
}

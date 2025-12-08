import { useState, useCallback } from 'react';

export interface ConvertedImage {
  id: string;
  originalName: string;
  originalSize: number;
  blob: Blob;
  url: string;
  width: number;
  height: number;
  size: number;
}

interface UseGifToPngReturn {
  convertedImages: ConvertedImage[];
  isConverting: boolean;
  error: string | null;
  convert: (files: File[]) => Promise<void>;
  removeImage: (id: string) => void;
  clearAll: () => void;
}

export function useGifToPng(): UseGifToPngReturn {
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convertSingleFile = useCallback(async (file: File): Promise<ConvertedImage> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Clear canvas and draw first frame of GIF (preserves transparency)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(objectUrl);

            if (!blob) {
              reject(new Error('Failed to convert image'));
              return;
            }

            const url = URL.createObjectURL(blob);
            resolve({
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              originalName: file.name,
              originalSize: file.size,
              blob,
              url,
              width: img.naturalWidth,
              height: img.naturalHeight,
              size: blob.size,
            });
          },
          'image/png'
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error(`Failed to load image: ${file.name}`));
      };

      img.src = objectUrl;
    });
  }, []);

  const convert = useCallback(async (files: File[]) => {
    setIsConverting(true);
    setError(null);

    const gifFiles = files.filter(
      (f) => f.type === 'image/gif' || f.name.toLowerCase().endsWith('.gif')
    );

    if (gifFiles.length === 0) {
      setError('Please select GIF files');
      setIsConverting(false);
      return;
    }

    try {
      const results = await Promise.all(gifFiles.map(convertSingleFile));
      setConvertedImages((prev) => [...prev, ...results]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
    } finally {
      setIsConverting(false);
    }
  }, [convertSingleFile]);

  const removeImage = useCallback((id: string) => {
    setConvertedImages((prev) => {
      const image = prev.find((img) => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.url);
      }
      return prev.filter((img) => img.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    convertedImages.forEach((img) => URL.revokeObjectURL(img.url));
    setConvertedImages([]);
    setError(null);
  }, [convertedImages]);

  return {
    convertedImages,
    isConverting,
    error,
    convert,
    removeImage,
    clearAll,
  };
}

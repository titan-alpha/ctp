import { useState, useCallback } from 'react';

export interface ConversionResult {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  originalSize: number;
  convertedSize: number;
  fileName: string;
}

export interface UseJpgToWebpReturn {
  results: ConversionResult[];
  isConverting: boolean;
  error: string | null;
  quality: number;
  setQuality: (quality: number) => void;
  convertFiles: (files: File[]) => Promise<void>;
  removeResult: (index: number) => void;
  clearResults: () => void;
}

export function useJpgToWebp(): UseJpgToWebpReturn {
  const [results, setResults] = useState<ConversionResult[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quality, setQuality] = useState(0.8);

  const convertFile = useCallback(
    async (file: File): Promise<ConversionResult> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            URL.revokeObjectURL(objectUrl);
            reject(new Error('Failed to get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0);

          canvas.toBlob(
            (blob) => {
              URL.revokeObjectURL(objectUrl);
              if (!blob) {
                reject(new Error('Failed to convert image'));
                return;
              }

              const url = URL.createObjectURL(blob);
              const baseName = file.name.replace(/\.(jpg|jpeg)$/i, '');

              resolve({
                blob,
                url,
                width: img.width,
                height: img.height,
                originalSize: file.size,
                convertedSize: blob.size,
                fileName: `${baseName}.webp`,
              });
            },
            'image/webp',
            quality
          );
        };

        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          reject(new Error(`Failed to load image: ${file.name}`));
        };

        img.src = objectUrl;
      });
    },
    [quality]
  );

  const convertFiles = useCallback(
    async (files: File[]) => {
      setIsConverting(true);
      setError(null);

      const jpgFiles = files.filter((f) =>
        f.type === 'image/jpeg' || /\.(jpg|jpeg)$/i.test(f.name)
      );

      if (jpgFiles.length === 0) {
        setError('No JPG/JPEG files selected');
        setIsConverting(false);
        return;
      }

      try {
        const newResults: ConversionResult[] = [];
        for (const file of jpgFiles) {
          const result = await convertFile(file);
          newResults.push(result);
        }
        setResults((prev) => [...prev, ...newResults]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Conversion failed');
      } finally {
        setIsConverting(false);
      }
    },
    [convertFile]
  );

  const removeResult = useCallback((index: number) => {
    setResults((prev) => {
      const result = prev[index];
      if (result) {
        URL.revokeObjectURL(result.url);
      }
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const clearResults = useCallback(() => {
    results.forEach((r) => URL.revokeObjectURL(r.url));
    setResults([]);
    setError(null);
  }, [results]);

  return {
    results,
    isConverting,
    error,
    quality,
    setQuality,
    convertFiles,
    removeResult,
    clearResults,
  };
}

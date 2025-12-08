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

interface UseIcoToPngReturn {
  convertedImages: ConvertedImage[];
  isConverting: boolean;
  error: string | null;
  convert: (files: File[]) => Promise<void>;
  removeImage: (id: string) => void;
  clearAll: () => void;
}

interface IcoImage {
  width: number;
  height: number;
  colorCount: number;
  reserved: number;
  planes: number;
  bitCount: number;
  size: number;
  offset: number;
}

function parseIcoFile(buffer: ArrayBuffer): { images: IcoImage[]; data: ArrayBuffer } {
  const view = new DataView(buffer);

  // ICO header: reserved (2), type (2), count (2)
  const reserved = view.getUint16(0, true);
  const type = view.getUint16(2, true);
  const count = view.getUint16(4, true);

  if (reserved !== 0 || type !== 1) {
    throw new Error('Invalid ICO file format');
  }

  const images: IcoImage[] = [];

  for (let i = 0; i < count; i++) {
    const offset = 6 + i * 16;
    const width = view.getUint8(offset) || 256;
    const height = view.getUint8(offset + 1) || 256;

    images.push({
      width,
      height,
      colorCount: view.getUint8(offset + 2),
      reserved: view.getUint8(offset + 3),
      planes: view.getUint16(offset + 4, true),
      bitCount: view.getUint16(offset + 6, true),
      size: view.getUint32(offset + 8, true),
      offset: view.getUint32(offset + 12, true),
    });
  }

  return { images, data: buffer };
}

function extractLargestImage(icoData: { images: IcoImage[]; data: ArrayBuffer }): Blob {
  const { images, data } = icoData;

  // Find largest image by pixel count
  const largest = images.reduce((prev, curr) =>
    (curr.width * curr.height > prev.width * prev.height) ? curr : prev
  );

  const imageData = new Uint8Array(data, largest.offset, largest.size);

  // Check if it's a PNG (starts with PNG signature)
  if (imageData[0] === 0x89 && imageData[1] === 0x50 && imageData[2] === 0x4E && imageData[3] === 0x47) {
    return new Blob([imageData], { type: 'image/png' });
  }

  // Otherwise it's a BMP, return as BMP for canvas processing
  return new Blob([imageData], { type: 'image/bmp' });
}

export function useIcoToPng(): UseIcoToPngReturn {
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convertSingleFile = useCallback(async (file: File): Promise<ConvertedImage> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async () => {
        try {
          const buffer = reader.result as ArrayBuffer;
          const icoData = parseIcoFile(buffer);
          const imageBlob = extractLargestImage(icoData);

          const img = new Image();
          const objectUrl = URL.createObjectURL(imageBlob);

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
            reject(new Error(`Failed to decode image from: ${file.name}`));
          };

          img.src = objectUrl;
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = () => {
        reject(new Error(`Failed to read file: ${file.name}`));
      };

      reader.readAsArrayBuffer(file);
    });
  }, []);

  const convert = useCallback(async (files: File[]) => {
    setIsConverting(true);
    setError(null);

    const icoFiles = files.filter(
      (f) => f.type === 'image/x-icon' || f.type === 'image/vnd.microsoft.icon' || f.name.toLowerCase().endsWith('.ico')
    );

    if (icoFiles.length === 0) {
      setError('Please select ICO files');
      setIsConverting(false);
      return;
    }

    try {
      const results = await Promise.all(icoFiles.map(convertSingleFile));
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

import { useState, useCallback } from 'react';

export type Platform = 'instagram' | 'facebook' | 'twitter' | 'linkedin';
export type SizePreset = string;

export interface SizeOption {
  name: string;
  width: number;
  height: number;
}

export interface PlatformPresets {
  name: string;
  sizes: SizeOption[];
}

export interface ResizedImage {
  dataUrl: string;
  width: number;
  height: number;
  filename: string;
  sizeName: string;
}

interface UseSocialMediaImageResizerReturn {
  originalImage: string | null;
  resizedImages: ResizedImage[];
  isProcessing: boolean;
  error: string | null;
  loadImage: (file: File) => void;
  resizeImage: (platform: Platform, sizeName: string) => Promise<void>;
  resizeAllSizes: (platform: Platform) => Promise<void>;
  downloadImage: (image: ResizedImage) => void;
  reset: () => void;
  platformPresets: Record<Platform, PlatformPresets>;
}

export const PLATFORM_PRESETS: Record<Platform, PlatformPresets> = {
  instagram: {
    name: 'Instagram',
    sizes: [
      { name: 'Profile Picture', width: 320, height: 320 },
      { name: 'Square Post', width: 1080, height: 1080 },
      { name: 'Portrait Post', width: 1080, height: 1350 },
      { name: 'Landscape Post', width: 1080, height: 566 },
      { name: 'Story/Reels', width: 1080, height: 1920 },
    ],
  },
  facebook: {
    name: 'Facebook',
    sizes: [
      { name: 'Profile Picture', width: 180, height: 180 },
      { name: 'Cover Photo', width: 820, height: 312 },
      { name: 'Shared Image', width: 1200, height: 630 },
      { name: 'Event Cover', width: 1920, height: 1005 },
      { name: 'Story', width: 1080, height: 1920 },
    ],
  },
  twitter: {
    name: 'Twitter/X',
    sizes: [
      { name: 'Profile Picture', width: 400, height: 400 },
      { name: 'Header Photo', width: 1500, height: 500 },
      { name: 'In-Stream Image', width: 1600, height: 900 },
      { name: 'Card Image', width: 1200, height: 628 },
      { name: 'Square Post', width: 1080, height: 1080 },
    ],
  },
  linkedin: {
    name: 'LinkedIn',
    sizes: [
      { name: 'Profile Picture', width: 400, height: 400 },
      { name: 'Cover Photo', width: 1584, height: 396 },
      { name: 'Shared Image', width: 1200, height: 627 },
      { name: 'Company Logo', width: 300, height: 300 },
      { name: 'Blog Post Image', width: 1200, height: 644 },
    ],
  },
};

export function useSocialMediaImageResizer(): UseSocialMediaImageResizerReturn {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [resizedImages, setResizedImages] = useState<ResizedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadImage = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
      setOriginalFile(file);
      setResizedImages([]);
      setError(null);
    };
    reader.onerror = () => setError('Failed to load image');
    reader.readAsDataURL(file);
  }, []);

  const resizeToSize = useCallback(
    async (targetWidth: number, targetHeight: number, sizeName: string): Promise<ResizedImage | null> => {
      if (!originalImage) return null;

      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(null);
            return;
          }

          // Calculate scaling to cover the target area
          const scale = Math.max(targetWidth / img.width, targetHeight / img.height);
          const scaledWidth = img.width * scale;
          const scaledHeight = img.height * scale;
          const x = (targetWidth - scaledWidth) / 2;
          const y = (targetHeight - scaledHeight) / 2;

          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, targetWidth, targetHeight);
          ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

          const dataUrl = canvas.toDataURL('image/png', 1.0);
          const baseName = originalFile?.name.replace(/\.[^/.]+$/, '') || 'image';
          const filename = `${baseName}_${sizeName.replace(/\s+/g, '_')}_${targetWidth}x${targetHeight}.png`;

          resolve({
            dataUrl,
            width: targetWidth,
            height: targetHeight,
            filename,
            sizeName,
          });
        };
        img.onerror = () => resolve(null);
        img.src = originalImage;
      });
    },
    [originalImage, originalFile]
  );

  const resizeImage = useCallback(
    async (platform: Platform, sizeName: string) => {
      const preset = PLATFORM_PRESETS[platform];
      const size = preset.sizes.find((s) => s.name === sizeName);
      if (!size || !originalImage) return;

      setIsProcessing(true);
      setError(null);

      try {
        const resized = await resizeToSize(size.width, size.height, size.name);
        if (resized) {
          setResizedImages((prev) => {
            const filtered = prev.filter((img) => img.sizeName !== sizeName);
            return [...filtered, resized];
          });
        }
      } catch {
        setError('Failed to resize image');
      } finally {
        setIsProcessing(false);
      }
    },
    [originalImage, resizeToSize]
  );

  const resizeAllSizes = useCallback(
    async (platform: Platform) => {
      const preset = PLATFORM_PRESETS[platform];
      if (!originalImage) return;

      setIsProcessing(true);
      setError(null);

      try {
        const results = await Promise.all(
          preset.sizes.map((size) => resizeToSize(size.width, size.height, size.name))
        );
        const validResults = results.filter((r): r is ResizedImage => r !== null);
        setResizedImages(validResults);
      } catch {
        setError('Failed to resize images');
      } finally {
        setIsProcessing(false);
      }
    },
    [originalImage, resizeToSize]
  );

  const downloadImage = useCallback((image: ResizedImage) => {
    const link = document.createElement('a');
    link.href = image.dataUrl;
    link.download = image.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const reset = useCallback(() => {
    setOriginalImage(null);
    setOriginalFile(null);
    setResizedImages([]);
    setError(null);
  }, []);

  return {
    originalImage,
    resizedImages,
    isProcessing,
    error,
    loadImage,
    resizeImage,
    resizeAllSizes,
    downloadImage,
    reset,
    platformPresets: PLATFORM_PRESETS,
  };
}

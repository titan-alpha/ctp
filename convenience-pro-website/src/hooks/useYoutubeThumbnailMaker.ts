import { useState, useCallback, useRef, useEffect } from 'react';

export interface TextOverlay {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  strokeColor: string;
  strokeWidth: number;
  bold: boolean;
  italic: boolean;
}

export interface ThumbnailOptions {
  backgroundColor: string;
  overlays: TextOverlay[];
}

export interface ThumbnailResult {
  blob: Blob;
  url: string;
}

interface UseYoutubeThumbnailMakerReturn {
  backgroundImage: string | null;
  setBackgroundImage: (url: string | null) => void;
  options: ThumbnailOptions;
  setOptions: (options: Partial<ThumbnailOptions>) => void;
  addTextOverlay: () => void;
  updateTextOverlay: (index: number, overlay: Partial<TextOverlay>) => void;
  removeTextOverlay: (index: number) => void;
  previewUrl: string | null;
  result: ThumbnailResult | null;
  isProcessing: boolean;
  error: string | null;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  generateThumbnail: () => Promise<void>;
  uploadBackground: (file: File) => Promise<void>;
  reset: () => void;
  drawPreview: () => void;
}

const THUMBNAIL_WIDTH = 1280;
const THUMBNAIL_HEIGHT = 720;

const DEFAULT_TEXT_OVERLAY: TextOverlay = {
  text: 'Your Text Here',
  x: 640,
  y: 360,
  fontSize: 72,
  fontFamily: 'Impact',
  color: '#FFFFFF',
  strokeColor: '#000000',
  strokeWidth: 4,
  bold: true,
  italic: false,
};

const DEFAULT_OPTIONS: ThumbnailOptions = {
  backgroundColor: '#1a1a2e',
  overlays: [],
};

export const FONT_FAMILIES = [
  'Impact',
  'Arial Black',
  'Helvetica',
  'Arial',
  'Georgia',
  'Times New Roman',
  'Verdana',
  'Trebuchet MS',
  'Comic Sans MS',
];

export function useYoutubeThumbnailMaker(): UseYoutubeThumbnailMakerReturn {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [backgroundImageObj, setBackgroundImageObj] = useState<HTMLImageElement | null>(null);
  const [options, setOptionsState] = useState<ThumbnailOptions>(DEFAULT_OPTIONS);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<ThumbnailResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const setOptions = useCallback((newOptions: Partial<ThumbnailOptions>) => {
    setOptionsState((prev) => ({ ...prev, ...newOptions }));
  }, []);

  const addTextOverlay = useCallback(() => {
    setOptionsState((prev) => ({
      ...prev,
      overlays: [...prev.overlays, { ...DEFAULT_TEXT_OVERLAY }],
    }));
  }, []);

  const updateTextOverlay = useCallback((index: number, overlay: Partial<TextOverlay>) => {
    setOptionsState((prev) => ({
      ...prev,
      overlays: prev.overlays.map((o, i) => (i === index ? { ...o, ...overlay } : o)),
    }));
  }, []);

  const removeTextOverlay = useCallback((index: number) => {
    setOptionsState((prev) => ({
      ...prev,
      overlays: prev.overlays.filter((_, i) => i !== index),
    }));
  }, []);

  const drawPreview = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = THUMBNAIL_WIDTH;
    canvas.height = THUMBNAIL_HEIGHT;

    // Draw background
    if (backgroundImageObj) {
      ctx.drawImage(backgroundImageObj, 0, 0, THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT);
    } else {
      ctx.fillStyle = options.backgroundColor;
      ctx.fillRect(0, 0, THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT);
    }

    // Draw text overlays
    options.overlays.forEach((overlay) => {
      const fontStyle = `${overlay.italic ? 'italic ' : ''}${overlay.bold ? 'bold ' : ''}${overlay.fontSize}px ${overlay.fontFamily}`;
      ctx.font = fontStyle;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Draw stroke
      if (overlay.strokeWidth > 0) {
        ctx.strokeStyle = overlay.strokeColor;
        ctx.lineWidth = overlay.strokeWidth;
        ctx.lineJoin = 'round';
        ctx.strokeText(overlay.text, overlay.x, overlay.y);
      }

      // Draw fill
      ctx.fillStyle = overlay.color;
      ctx.fillText(overlay.text, overlay.x, overlay.y);
    });
  }, [backgroundImageObj, options]);

  useEffect(() => {
    drawPreview();
  }, [drawPreview]);

  const uploadBackground = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    setError(null);
    const url = URL.createObjectURL(file);

    const img = new Image();
    img.onload = () => {
      if (backgroundImage) URL.revokeObjectURL(backgroundImage);
      setBackgroundImage(url);
      setBackgroundImageObj(img);
    };
    img.onerror = () => {
      setError('Failed to load image');
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, [backgroundImage]);

  const generateThumbnail = useCallback(async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error('Canvas not available');

      drawPreview();

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setError('Failed to generate thumbnail');
            setIsProcessing(false);
            return;
          }

          if (result?.url) URL.revokeObjectURL(result.url);

          const url = URL.createObjectURL(blob);
          setResult({ blob, url });
          setPreviewUrl(url);
          setIsProcessing(false);
        },
        'image/png',
        1.0
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate thumbnail');
      setIsProcessing(false);
    }
  }, [drawPreview, result]);

  const reset = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (result?.url) URL.revokeObjectURL(result.url);
    if (backgroundImage) URL.revokeObjectURL(backgroundImage);
    setBackgroundImage(null);
    setBackgroundImageObj(null);
    setOptionsState(DEFAULT_OPTIONS);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  }, [previewUrl, result, backgroundImage]);

  return {
    backgroundImage,
    setBackgroundImage,
    options,
    setOptions,
    addTextOverlay,
    updateTextOverlay,
    removeTextOverlay,
    previewUrl,
    result,
    isProcessing,
    error,
    canvasRef,
    generateThumbnail,
    uploadBackground,
    reset,
    drawPreview,
  };
}

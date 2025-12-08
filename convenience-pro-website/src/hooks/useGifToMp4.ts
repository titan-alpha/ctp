import { useState, useCallback } from 'react';

export interface ConvertedVideo {
  id: string;
  originalName: string;
  originalSize: number;
  blob: Blob;
  url: string;
  width: number;
  height: number;
  size: number;
  duration: number;
}

interface UseGifToMp4Return {
  convertedVideo: ConvertedVideo | null;
  isConverting: boolean;
  progress: number;
  error: string | null;
  convert: (file: File) => Promise<void>;
  clear: () => void;
}

// Simple GIF parser to extract frames
async function parseGif(arrayBuffer: ArrayBuffer): Promise<{
  frames: ImageData[];
  width: number;
  height: number;
  delays: number[];
}> {
  const blob = new Blob([arrayBuffer], { type: 'image/gif' });
  const url = URL.createObjectURL(blob);

  // Create an image to get dimensions
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Failed to load GIF'));
    img.src = url;
  });

  const width = img.naturalWidth;
  const height = img.naturalHeight;

  // Use canvas to extract frames by drawing the gif at different times
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // For animated GIFs, we'll use a different approach - decode using ImageDecoder if available
  // Otherwise fall back to a simpler method
  const frames: ImageData[] = [];
  const delays: number[] = [];

  if ('ImageDecoder' in window) {
    try {
      const response = await fetch(url);
      const imageData = await response.blob();
      // @ts-expect-error ImageDecoder is experimental
      const decoder = new ImageDecoder({
        data: imageData,
        type: 'image/gif',
      });

      await decoder.completed;
      const frameCount = decoder.tracks.selectedTrack?.frameCount || 1;

      for (let i = 0; i < frameCount; i++) {
        const result = await decoder.decode({ frameIndex: i });
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(result.image, 0, 0);
        frames.push(ctx.getImageData(0, 0, width, height));
        // Default 100ms delay if not specified
        delays.push(result.image.duration ? result.image.duration / 1000 : 0.1);
        result.image.close();
      }

      decoder.close();
    } catch {
      // Fallback: single frame
      ctx.drawImage(img, 0, 0);
      frames.push(ctx.getImageData(0, 0, width, height));
      delays.push(0.1);
    }
  } else {
    // Fallback for browsers without ImageDecoder
    ctx.drawImage(img, 0, 0);
    frames.push(ctx.getImageData(0, 0, width, height));
    delays.push(0.1);
  }

  URL.revokeObjectURL(url);

  return { frames, width, height, delays };
}

export function useGifToMp4(): UseGifToMp4Return {
  const [convertedVideo, setConvertedVideo] = useState<ConvertedVideo | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const convert = useCallback(async (file: File) => {
    if (!file.type.includes('gif') && !file.name.toLowerCase().endsWith('.gif')) {
      setError('Please select a GIF file');
      return;
    }

    setIsConverting(true);
    setProgress(0);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      setProgress(10);

      const { frames, width, height, delays } = await parseGif(arrayBuffer);
      setProgress(30);

      // Create canvas for rendering frames
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;

      // Use MediaRecorder to capture canvas as video
      const stream = canvas.captureStream(0); // 0 fps = manual frame control
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 5000000,
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      const recordingDone = new Promise<Blob>((resolve) => {
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          resolve(blob);
        };
      });

      mediaRecorder.start();

      // Render each frame
      let totalDuration = 0;
      const track = stream.getVideoTracks()[0];
      // @ts-expect-error requestFrame is available on captureStream tracks
      const requestFrame = track.requestFrame?.bind(track);

      for (let i = 0; i < frames.length; i++) {
        ctx.putImageData(frames[i], 0, 0);
        if (requestFrame) {
          requestFrame();
        }

        // Wait for frame delay
        const delay = delays[i] * 1000;
        totalDuration += delays[i];
        await new Promise((r) => setTimeout(r, delay));

        setProgress(30 + Math.floor((i / frames.length) * 60));
      }

      mediaRecorder.stop();
      const webmBlob = await recordingDone;
      setProgress(95);

      const videoUrl = URL.createObjectURL(webmBlob);

      setConvertedVideo({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        originalName: file.name,
        originalSize: file.size,
        blob: webmBlob,
        url: videoUrl,
        width,
        height,
        size: webmBlob.size,
        duration: totalDuration,
      });

      setProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
    } finally {
      setIsConverting(false);
    }
  }, []);

  const clear = useCallback(() => {
    if (convertedVideo) {
      URL.revokeObjectURL(convertedVideo.url);
    }
    setConvertedVideo(null);
    setError(null);
    setProgress(0);
  }, [convertedVideo]);

  return {
    convertedVideo,
    isConverting,
    progress,
    error,
    convert,
    clear,
  };
}

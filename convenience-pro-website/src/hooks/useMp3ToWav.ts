import { useState, useCallback } from 'react';

interface ConversionResult {
  blob: Blob;
  url: string;
  filename: string;
  size: number;
  duration: number;
  sampleRate: number;
}

interface UseMp3ToWavReturn {
  file: File | null;
  isConverting: boolean;
  progress: number;
  result: ConversionResult | null;
  error: string | null;
  setFile: (file: File | null) => void;
  convert: () => Promise<void>;
  download: () => void;
  reset: () => void;
}

export function useMp3ToWav(): UseMp3ToWavReturn {
  const [file, setFileState] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const setFile = useCallback((newFile: File | null) => {
    setFileState(newFile);
    setResult(null);
    setError(null);
    setProgress(0);
  }, []);

  const convert = useCallback(async () => {
    if (!file) {
      setError('No file selected');
      return;
    }

    setIsConverting(true);
    setError(null);
    setProgress(0);

    try {
      // Create AudioContext for decoding
      const audioContext = new AudioContext();
      setProgress(10);

      // Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      setProgress(30);

      // Decode MP3 using Web Audio API
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      setProgress(50);

      const duration = audioBuffer.duration;
      const sampleRate = audioBuffer.sampleRate;
      const numberOfChannels = audioBuffer.numberOfChannels;

      // Encode to WAV (PCM 16-bit)
      const wavBuffer = encodeWav(audioBuffer);
      setProgress(90);

      const outputBlob = new Blob([wavBuffer], { type: 'audio/wav' });
      const url = URL.createObjectURL(outputBlob);
      const baseName = file.name.replace(/\.[^/.]+$/, '');

      setResult({
        blob: outputBlob,
        url,
        filename: `${baseName}.wav`,
        size: outputBlob.size,
        duration,
        sampleRate,
      });
      setProgress(100);

      await audioContext.close();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed. Please ensure the file is a valid MP3.');
    } finally {
      setIsConverting(false);
    }
  }, [file]);

  const download = useCallback(() => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [result]);

  const reset = useCallback(() => {
    if (result?.url) {
      URL.revokeObjectURL(result.url);
    }
    setFileState(null);
    setResult(null);
    setError(null);
    setProgress(0);
  }, [result]);

  return {
    file,
    isConverting,
    progress,
    result,
    error,
    setFile,
    convert,
    download,
    reset,
  };
}

// Encode AudioBuffer to WAV format (PCM 16-bit)
function encodeWav(buffer: AudioBuffer): ArrayBuffer {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;

  const samples = buffer.length;
  const dataSize = samples * blockAlign;
  const bufferLength = 44 + dataSize;

  const arrayBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(arrayBuffer);

  // WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, format, true); // AudioFormat (1 = PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true); // ByteRate
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // Interleave channels and write PCM samples
  const channels: Float32Array[] = [];
  for (let i = 0; i < numChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  let offset = 44;
  for (let i = 0; i < samples; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, channels[ch][i]));
      const int16 = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, int16, true);
      offset += 2;
    }
  }

  return arrayBuffer;
}

function writeString(view: DataView, offset: number, str: string): void {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

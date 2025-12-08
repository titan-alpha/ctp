import { useState, useCallback } from 'react';

export type InputFormat = 'mp3' | 'wav' | 'ogg' | 'aac' | 'unknown';
export type OutputFormat = 'wav' | 'mp3';
export type Quality = 'low' | 'medium' | 'high';

interface ConversionResult {
  blob: Blob;
  url: string;
  filename: string;
  size: number;
  duration: number;
}

interface UseAudioConverterReturn {
  file: File | null;
  inputFormat: InputFormat;
  outputFormat: OutputFormat;
  quality: Quality;
  isConverting: boolean;
  progress: number;
  result: ConversionResult | null;
  error: string | null;
  setFile: (file: File | null) => void;
  setOutputFormat: (format: OutputFormat) => void;
  setQuality: (quality: Quality) => void;
  convert: () => Promise<void>;
  download: () => void;
  reset: () => void;
}

const QUALITY_BITRATES: Record<Quality, number> = {
  low: 96,
  medium: 128,
  high: 320,
};

function detectFormat(file: File): InputFormat {
  const ext = file.name.split('.').pop()?.toLowerCase();
  const mimeMap: Record<string, InputFormat> = {
    mp3: 'mp3',
    wav: 'wav',
    ogg: 'ogg',
    aac: 'aac',
    m4a: 'aac',
  };
  if (ext && mimeMap[ext]) return mimeMap[ext];
  if (file.type.includes('mp3') || file.type.includes('mpeg')) return 'mp3';
  if (file.type.includes('wav')) return 'wav';
  if (file.type.includes('ogg')) return 'ogg';
  if (file.type.includes('aac') || file.type.includes('mp4')) return 'aac';
  return 'unknown';
}

export function useAudioConverter(): UseAudioConverterReturn {
  const [file, setFileState] = useState<File | null>(null);
  const [inputFormat, setInputFormat] = useState<InputFormat>('unknown');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('wav');
  const [quality, setQuality] = useState<Quality>('medium');
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const setFile = useCallback((newFile: File | null) => {
    setFileState(newFile);
    setResult(null);
    setError(null);
    setProgress(0);
    if (newFile) {
      setInputFormat(detectFormat(newFile));
    } else {
      setInputFormat('unknown');
    }
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
      const audioContext = new AudioContext();
      setProgress(10);

      const arrayBuffer = await file.arrayBuffer();
      setProgress(30);

      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      setProgress(50);

      const duration = audioBuffer.duration;
      const numberOfChannels = audioBuffer.numberOfChannels;
      const sampleRate = audioBuffer.sampleRate;

      let outputBlob: Blob;
      let mimeType: string;

      if (outputFormat === 'wav') {
        // Convert to WAV (lossless)
        const wavBuffer = audioBufferToWav(audioBuffer);
        outputBlob = new Blob([wavBuffer], { type: 'audio/wav' });
        mimeType = 'audio/wav';
        setProgress(90);
      } else {
        // MP3 output - try lamejs if available, otherwise fallback to WAV
        try {
          // @ts-ignore - lamejs is optional
          if (typeof window !== 'undefined' && window.lamejs) {
            // @ts-ignore
            const mp3encoder = new window.lamejs.Mp3Encoder(numberOfChannels, sampleRate, QUALITY_BITRATES[quality]);
            const mp3Data: Int8Array[] = [];

            const samples = audioBuffer.getChannelData(0);
            const sampleBlockSize = 1152;

            for (let i = 0; i < samples.length; i += sampleBlockSize) {
              const sampleChunk = samples.subarray(i, i + sampleBlockSize);
              const int16Samples = new Int16Array(sampleChunk.length);
              for (let j = 0; j < sampleChunk.length; j++) {
                int16Samples[j] = Math.max(-32768, Math.min(32767, sampleChunk[j] * 32768));
              }
              const mp3buf = mp3encoder.encodeBuffer(int16Samples);
              if (mp3buf.length > 0) {
                mp3Data.push(new Int8Array(mp3buf));
              }
              setProgress(50 + Math.floor((i / samples.length) * 40));
            }

            const mp3buf = mp3encoder.flush();
            if (mp3buf.length > 0) {
              mp3Data.push(new Int8Array(mp3buf));
            }

            outputBlob = new Blob(mp3Data, { type: 'audio/mp3' });
            mimeType = 'audio/mp3';
          } else {
            // Fallback: output as WAV with message
            const wavBuffer = audioBufferToWav(audioBuffer);
            outputBlob = new Blob([wavBuffer], { type: 'audio/wav' });
            mimeType = 'audio/wav';
            setError('MP3 encoding not available. Outputting as WAV instead.');
          }
        } catch {
          const wavBuffer = audioBufferToWav(audioBuffer);
          outputBlob = new Blob([wavBuffer], { type: 'audio/wav' });
          mimeType = 'audio/wav';
        }
        setProgress(90);
      }

      const url = URL.createObjectURL(outputBlob);
      const baseName = file.name.replace(/\.[^/.]+$/, '');
      const ext = mimeType.includes('mp3') ? 'mp3' : 'wav';

      setResult({
        blob: outputBlob,
        url,
        filename: `${baseName}-converted.${ext}`,
        size: outputBlob.size,
        duration,
      });
      setProgress(100);

      await audioContext.close();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
    } finally {
      setIsConverting(false);
    }
  }, [file, outputFormat, quality]);

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
    setInputFormat('unknown');
    setResult(null);
    setError(null);
    setProgress(0);
  }, [result]);

  return {
    file,
    inputFormat,
    outputFormat,
    quality,
    isConverting,
    progress,
    result,
    error,
    setFile,
    setOutputFormat,
    setQuality,
    convert,
    download,
    reset,
  };
}

// Helper function to convert AudioBuffer to WAV
function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
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
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // Interleave channels and write samples
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

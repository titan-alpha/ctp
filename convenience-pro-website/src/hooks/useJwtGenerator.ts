import { useState, useCallback } from 'react';

export interface JwtPayload {
  [key: string]: unknown;
}

export interface JwtOptions {
  secret: string;
  payload: string;
  expiresIn: number; // seconds
  issuer: string;
  subject: string;
}

interface UseJwtGeneratorReturn {
  options: JwtOptions;
  setOptions: (options: JwtOptions) => void;
  jwt: string;
  error: string | null;
  isGenerating: boolean;
  generate: () => void;
  reset: () => void;
  copied: boolean;
  copyToClipboard: () => void;
}

function base64UrlEncode(str: string): string {
  const base64 = btoa(str);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function hmacSha256(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);

  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, messageData);
  const signatureArray = new Uint8Array(signature);
  const signatureString = String.fromCharCode(...signatureArray);
  return base64UrlEncode(signatureString);
}

const DEFAULT_OPTIONS: JwtOptions = {
  secret: 'your-256-bit-secret',
  payload: '{\n  "userId": "12345",\n  "role": "admin"\n}',
  expiresIn: 3600,
  issuer: '',
  subject: '',
};

export function useJwtGenerator(): UseJwtGeneratorReturn {
  const [options, setOptions] = useState<JwtOptions>(DEFAULT_OPTIONS);
  const [jwt, setJwt] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = useCallback(async () => {
    setError(null);
    setIsGenerating(true);
    setCopied(false);

    try {
      if (!options.secret.trim()) {
        throw new Error('Secret key is required');
      }

      let payloadObj: JwtPayload;
      try {
        payloadObj = JSON.parse(options.payload);
      } catch {
        throw new Error('Invalid JSON payload');
      }

      // Build header
      const header = {
        alg: 'HS256',
        typ: 'JWT',
      };

      // Build payload with standard claims
      const now = Math.floor(Date.now() / 1000);
      const claims: JwtPayload = {
        ...payloadObj,
        iat: now,
      };

      if (options.expiresIn > 0) {
        claims.exp = now + options.expiresIn;
      }

      if (options.issuer.trim()) {
        claims.iss = options.issuer.trim();
      }

      if (options.subject.trim()) {
        claims.sub = options.subject.trim();
      }

      // Encode header and payload
      const encodedHeader = base64UrlEncode(JSON.stringify(header));
      const encodedPayload = base64UrlEncode(JSON.stringify(claims));

      // Create signature
      const signatureInput = `${encodedHeader}.${encodedPayload}`;
      const signature = await hmacSha256(signatureInput, options.secret);

      // Assemble JWT
      const token = `${encodedHeader}.${encodedPayload}.${signature}`;
      setJwt(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setJwt('');
    } finally {
      setIsGenerating(false);
    }
  }, [options]);

  const reset = useCallback(() => {
    setOptions(DEFAULT_OPTIONS);
    setJwt('');
    setError(null);
    setCopied(false);
  }, []);

  const copyToClipboard = useCallback(async () => {
    if (jwt) {
      await navigator.clipboard.writeText(jwt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [jwt]);

  return {
    options,
    setOptions,
    jwt,
    error,
    isGenerating,
    generate,
    reset,
    copied,
    copyToClipboard,
  };
}

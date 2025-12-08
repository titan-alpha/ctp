import { useState, useCallback } from 'react';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export type BodyType = 'none' | 'json' | 'form-data';

export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface RequestConfig {
  method: HttpMethod;
  url: string;
  headers: KeyValuePair[];
  queryParams: KeyValuePair[];
  bodyType: BodyType;
  body: string;
}

export interface GeneratedCode {
  curl: string;
  fetch: string;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function createEmptyPair(): KeyValuePair {
  return { id: generateId(), key: '', value: '', enabled: true };
}

function buildUrlWithParams(url: string, params: KeyValuePair[]): string {
  const enabledParams = params.filter((p) => p.enabled && p.key.trim());
  if (enabledParams.length === 0) return url;

  const queryString = enabledParams
    .map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
    .join('&');

  return url.includes('?') ? `${url}&${queryString}` : `${url}?${queryString}`;
}

function generateCurl(config: RequestConfig): string {
  const fullUrl = buildUrlWithParams(config.url || 'https://api.example.com', config.queryParams);
  const parts: string[] = [`curl -X ${config.method}`];

  const enabledHeaders = config.headers.filter((h) => h.enabled && h.key.trim());
  enabledHeaders.forEach((h) => {
    parts.push(`-H '${h.key}: ${h.value}'`);
  });

  if (config.bodyType === 'json' && config.body.trim()) {
    if (!enabledHeaders.some((h) => h.key.toLowerCase() === 'content-type')) {
      parts.push(`-H 'Content-Type: application/json'`);
    }
    parts.push(`-d '${config.body.replace(/'/g, "\\'")}'`);
  } else if (config.bodyType === 'form-data' && config.body.trim()) {
    if (!enabledHeaders.some((h) => h.key.toLowerCase() === 'content-type')) {
      parts.push(`-H 'Content-Type: application/x-www-form-urlencoded'`);
    }
    parts.push(`-d '${config.body}'`);
  }

  parts.push(`'${fullUrl}'`);

  return parts.join(' \\\n  ');
}

function generateFetch(config: RequestConfig): string {
  const fullUrl = buildUrlWithParams(config.url || 'https://api.example.com', config.queryParams);
  const options: Record<string, unknown> = {
    method: config.method,
  };

  const enabledHeaders = config.headers.filter((h) => h.enabled && h.key.trim());
  const headersObj: Record<string, string> = {};
  enabledHeaders.forEach((h) => {
    headersObj[h.key] = h.value;
  });

  if (config.bodyType === 'json' && config.body.trim()) {
    if (!headersObj['Content-Type']) {
      headersObj['Content-Type'] = 'application/json';
    }
    options.body = 'JSON.stringify(body)';
  } else if (config.bodyType === 'form-data' && config.body.trim()) {
    if (!headersObj['Content-Type']) {
      headersObj['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    options.body = `'${config.body}'`;
  }

  if (Object.keys(headersObj).length > 0) {
    options.headers = headersObj;
  }

  let bodyVar = '';
  if (config.bodyType === 'json' && config.body.trim()) {
    try {
      const parsed = JSON.parse(config.body);
      bodyVar = `const body = ${JSON.stringify(parsed, null, 2)};\n\n`;
    } catch {
      bodyVar = `const body = ${config.body};\n\n`;
    }
  }

  const optionsStr = JSON.stringify(options, null, 2)
    .replace('"JSON.stringify(body)"', 'JSON.stringify(body)')
    .replace(/"body": "(.*?)"/g, 'body: $1');

  return `${bodyVar}fetch('${fullUrl}', ${optionsStr})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`;
}

interface UseHttpRequestBuilderReturn {
  config: RequestConfig;
  generatedCode: GeneratedCode;
  setMethod: (method: HttpMethod) => void;
  setUrl: (url: string) => void;
  setHeaders: (headers: KeyValuePair[]) => void;
  setQueryParams: (params: KeyValuePair[]) => void;
  setBodyType: (type: BodyType) => void;
  setBody: (body: string) => void;
  addHeader: () => void;
  removeHeader: (id: string) => void;
  updateHeader: (id: string, field: 'key' | 'value', value: string) => void;
  toggleHeader: (id: string) => void;
  addQueryParam: () => void;
  removeQueryParam: (id: string) => void;
  updateQueryParam: (id: string, field: 'key' | 'value', value: string) => void;
  toggleQueryParam: (id: string) => void;
  generate: () => void;
}

export function useHttpRequestBuilder(): UseHttpRequestBuilderReturn {
  const [config, setConfig] = useState<RequestConfig>({
    method: 'GET',
    url: '',
    headers: [createEmptyPair()],
    queryParams: [createEmptyPair()],
    bodyType: 'none',
    body: '',
  });

  const [generatedCode, setGeneratedCode] = useState<GeneratedCode>({
    curl: '',
    fetch: '',
  });

  const setMethod = useCallback((method: HttpMethod) => {
    setConfig((prev) => ({ ...prev, method }));
  }, []);

  const setUrl = useCallback((url: string) => {
    setConfig((prev) => ({ ...prev, url }));
  }, []);

  const setHeaders = useCallback((headers: KeyValuePair[]) => {
    setConfig((prev) => ({ ...prev, headers }));
  }, []);

  const setQueryParams = useCallback((queryParams: KeyValuePair[]) => {
    setConfig((prev) => ({ ...prev, queryParams }));
  }, []);

  const setBodyType = useCallback((bodyType: BodyType) => {
    setConfig((prev) => ({ ...prev, bodyType }));
  }, []);

  const setBody = useCallback((body: string) => {
    setConfig((prev) => ({ ...prev, body }));
  }, []);

  const addHeader = useCallback(() => {
    setConfig((prev) => ({ ...prev, headers: [...prev.headers, createEmptyPair()] }));
  }, []);

  const removeHeader = useCallback((id: string) => {
    setConfig((prev) => ({
      ...prev,
      headers: prev.headers.length > 1 ? prev.headers.filter((h) => h.id !== id) : prev.headers,
    }));
  }, []);

  const updateHeader = useCallback((id: string, field: 'key' | 'value', value: string) => {
    setConfig((prev) => ({
      ...prev,
      headers: prev.headers.map((h) => (h.id === id ? { ...h, [field]: value } : h)),
    }));
  }, []);

  const toggleHeader = useCallback((id: string) => {
    setConfig((prev) => ({
      ...prev,
      headers: prev.headers.map((h) => (h.id === id ? { ...h, enabled: !h.enabled } : h)),
    }));
  }, []);

  const addQueryParam = useCallback(() => {
    setConfig((prev) => ({ ...prev, queryParams: [...prev.queryParams, createEmptyPair()] }));
  }, []);

  const removeQueryParam = useCallback((id: string) => {
    setConfig((prev) => ({
      ...prev,
      queryParams: prev.queryParams.length > 1 ? prev.queryParams.filter((p) => p.id !== id) : prev.queryParams,
    }));
  }, []);

  const updateQueryParam = useCallback((id: string, field: 'key' | 'value', value: string) => {
    setConfig((prev) => ({
      ...prev,
      queryParams: prev.queryParams.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    }));
  }, []);

  const toggleQueryParam = useCallback((id: string) => {
    setConfig((prev) => ({
      ...prev,
      queryParams: prev.queryParams.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)),
    }));
  }, []);

  const generate = useCallback(() => {
    setGeneratedCode({
      curl: generateCurl(config),
      fetch: generateFetch(config),
    });
  }, [config]);

  return {
    config,
    generatedCode,
    setMethod,
    setUrl,
    setHeaders,
    setQueryParams,
    setBodyType,
    setBody,
    addHeader,
    removeHeader,
    updateHeader,
    toggleHeader,
    addQueryParam,
    removeQueryParam,
    updateQueryParam,
    toggleQueryParam,
    generate,
  };
}

import { useState, useCallback, useRef } from 'react';

export type Theme = 'dark' | 'light' | 'monokai' | 'github';
export type Language = 'javascript' | 'typescript' | 'python' | 'html' | 'css' | 'json' | 'bash' | 'sql' | 'java' | 'cpp' | 'go' | 'rust' | 'php' | 'ruby' | 'plain';

export interface CodeToImageOptions {
  theme: Theme;
  language: Language;
  padding: number;
  fontSize: number;
  showLineNumbers: boolean;
  backgroundColor: string;
}

export interface CodeToImageResult {
  blob: Blob;
  url: string;
  width: number;
  height: number;
}

interface UseCodeToImageReturn {
  code: string;
  setCode: (code: string) => void;
  options: CodeToImageOptions;
  setOptions: (options: Partial<CodeToImageOptions>) => void;
  previewUrl: string | null;
  result: CodeToImageResult | null;
  isProcessing: boolean;
  error: string | null;
  generateImage: (format?: 'png' | 'jpeg') => Promise<void>;
  reset: () => void;
}

const THEME_COLORS: Record<Theme, { background: string; text: string; keyword: string; string: string; comment: string; number: string; function: string; lineNumber: string }> = {
  dark: {
    background: '#1e1e1e',
    text: '#d4d4d4',
    keyword: '#569cd6',
    string: '#ce9178',
    comment: '#6a9955',
    number: '#b5cea8',
    function: '#dcdcaa',
    lineNumber: '#858585',
  },
  light: {
    background: '#ffffff',
    text: '#333333',
    keyword: '#0000ff',
    string: '#a31515',
    comment: '#008000',
    number: '#098658',
    function: '#795e26',
    lineNumber: '#999999',
  },
  monokai: {
    background: '#272822',
    text: '#f8f8f2',
    keyword: '#f92672',
    string: '#e6db74',
    comment: '#75715e',
    number: '#ae81ff',
    function: '#a6e22e',
    lineNumber: '#90908a',
  },
  github: {
    background: '#f6f8fa',
    text: '#24292e',
    keyword: '#d73a49',
    string: '#032f62',
    comment: '#6a737d',
    number: '#005cc5',
    function: '#6f42c1',
    lineNumber: '#959da5',
  },
};

const KEYWORDS: Record<Language, string[]> = {
  javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'default', 'from', 'async', 'await', 'try', 'catch', 'throw', 'new', 'this', 'true', 'false', 'null', 'undefined', 'typeof', 'instanceof'],
  typescript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'default', 'from', 'async', 'await', 'try', 'catch', 'throw', 'new', 'this', 'true', 'false', 'null', 'undefined', 'typeof', 'instanceof', 'interface', 'type', 'enum', 'implements', 'extends', 'private', 'public', 'protected', 'readonly'],
  python: ['def', 'class', 'return', 'if', 'elif', 'else', 'for', 'while', 'import', 'from', 'as', 'try', 'except', 'finally', 'raise', 'with', 'lambda', 'True', 'False', 'None', 'and', 'or', 'not', 'in', 'is', 'pass', 'break', 'continue', 'yield', 'async', 'await'],
  html: ['html', 'head', 'body', 'div', 'span', 'p', 'a', 'img', 'script', 'style', 'link', 'meta', 'title', 'header', 'footer', 'nav', 'section', 'article', 'aside', 'main', 'form', 'input', 'button', 'table', 'tr', 'td', 'th', 'ul', 'ol', 'li'],
  css: ['color', 'background', 'margin', 'padding', 'border', 'display', 'position', 'width', 'height', 'font', 'text', 'flex', 'grid', 'align', 'justify', 'transform', 'transition', 'animation', 'opacity', 'overflow', 'z-index', 'important'],
  json: [],
  bash: ['if', 'then', 'else', 'fi', 'for', 'do', 'done', 'while', 'case', 'esac', 'function', 'return', 'exit', 'echo', 'export', 'source', 'cd', 'ls', 'rm', 'mv', 'cp', 'mkdir', 'chmod', 'chown', 'grep', 'sed', 'awk', 'cat', 'sudo'],
  sql: ['SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER', 'TABLE', 'INDEX', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON', 'AND', 'OR', 'NOT', 'NULL', 'ORDER', 'BY', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET', 'AS', 'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MAX', 'MIN'],
  java: ['public', 'private', 'protected', 'class', 'interface', 'extends', 'implements', 'static', 'final', 'void', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'try', 'catch', 'finally', 'throw', 'throws', 'new', 'this', 'super', 'import', 'package', 'true', 'false', 'null'],
  cpp: ['int', 'char', 'float', 'double', 'bool', 'void', 'class', 'struct', 'public', 'private', 'protected', 'virtual', 'static', 'const', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'try', 'catch', 'throw', 'new', 'delete', 'this', 'true', 'false', 'nullptr', 'include', 'define', 'namespace', 'using', 'template', 'typename'],
  go: ['package', 'import', 'func', 'return', 'if', 'else', 'for', 'range', 'switch', 'case', 'default', 'break', 'continue', 'go', 'chan', 'select', 'defer', 'type', 'struct', 'interface', 'map', 'const', 'var', 'true', 'false', 'nil', 'make', 'new', 'append', 'len', 'cap'],
  rust: ['fn', 'let', 'mut', 'const', 'static', 'struct', 'enum', 'impl', 'trait', 'pub', 'use', 'mod', 'crate', 'self', 'super', 'return', 'if', 'else', 'for', 'while', 'loop', 'match', 'break', 'continue', 'move', 'ref', 'type', 'where', 'async', 'await', 'true', 'false', 'Some', 'None', 'Ok', 'Err'],
  php: ['function', 'return', 'if', 'else', 'elseif', 'for', 'foreach', 'while', 'do', 'switch', 'case', 'break', 'continue', 'class', 'interface', 'extends', 'implements', 'public', 'private', 'protected', 'static', 'const', 'new', 'try', 'catch', 'throw', 'finally', 'use', 'namespace', 'true', 'false', 'null', 'echo', 'print', 'require', 'include'],
  ruby: ['def', 'end', 'class', 'module', 'return', 'if', 'elsif', 'else', 'unless', 'for', 'while', 'until', 'do', 'case', 'when', 'begin', 'rescue', 'ensure', 'raise', 'yield', 'block', 'proc', 'lambda', 'require', 'include', 'extend', 'attr', 'self', 'super', 'true', 'false', 'nil', 'and', 'or', 'not'],
  plain: [],
};

export function detectLanguage(code: string): Language {
  if (/^\s*<[\w!]/.test(code)) return 'html';
  if (/^\s*\{[\s\S]*\}$/.test(code.trim()) || /^\s*\[[\s\S]*\]$/.test(code.trim())) return 'json';
  if (/\b(def|elif|import\s+\w+|from\s+\w+\s+import)\b/.test(code)) return 'python';
  if (/\b(fn\s+\w+|let\s+mut|impl\s+\w+)\b/.test(code)) return 'rust';
  if (/\b(func\s+\w+|package\s+main|go\s+func)\b/.test(code)) return 'go';
  if (/\b(interface\s+\w+|type\s+\w+\s*=|:\s*(string|number|boolean))\b/.test(code)) return 'typescript';
  if (/\b(public\s+class|public\s+static\s+void)\b/.test(code)) return 'java';
  if (/\b(#include|std::|\bcout\b|\bcin\b)\b/.test(code)) return 'cpp';
  if (/\b(<\?php|\$\w+\s*=|echo\s+)/i.test(code)) return 'php';
  if (/\b(SELECT\s+|FROM\s+|WHERE\s+|INSERT\s+INTO)/i.test(code)) return 'sql';
  if (/^\s*#!/.test(code) || /\b(echo\s+|export\s+\w+=)\b/.test(code)) return 'bash';
  if (/\b(const|let|var|function|=>|import\s+.*from)\b/.test(code)) return 'javascript';
  if (/\{[\s\S]*:\s*[\s\S]*;[\s\S]*\}/.test(code)) return 'css';
  return 'plain';
}

const DEFAULT_OPTIONS: CodeToImageOptions = {
  theme: 'dark',
  language: 'javascript',
  padding: 32,
  fontSize: 14,
  showLineNumbers: true,
  backgroundColor: '',
};

export function useCodeToImage(): UseCodeToImageReturn {
  const [code, setCode] = useState('');
  const [options, setOptionsState] = useState<CodeToImageOptions>(DEFAULT_OPTIONS);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<CodeToImageResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const setOptions = useCallback((newOptions: Partial<CodeToImageOptions>) => {
    setOptionsState((prev) => ({ ...prev, ...newOptions }));
  }, []);

  const tokenize = useCallback((line: string, lang: Language, colors: typeof THEME_COLORS.dark) => {
    const tokens: { text: string; color: string }[] = [];
    const keywords = KEYWORDS[lang];

    let remaining = line;
    while (remaining.length > 0) {
      // Comments
      if (remaining.startsWith('//') || remaining.startsWith('#') || remaining.startsWith('--')) {
        tokens.push({ text: remaining, color: colors.comment });
        break;
      }

      // Strings
      const stringMatch = remaining.match(/^(['"`])(?:\\.|[^\\])*?\1/);
      if (stringMatch) {
        tokens.push({ text: stringMatch[0], color: colors.string });
        remaining = remaining.slice(stringMatch[0].length);
        continue;
      }

      // Numbers
      const numberMatch = remaining.match(/^\b\d+\.?\d*\b/);
      if (numberMatch) {
        tokens.push({ text: numberMatch[0], color: colors.number });
        remaining = remaining.slice(numberMatch[0].length);
        continue;
      }

      // Keywords
      const wordMatch = remaining.match(/^\b\w+\b/);
      if (wordMatch) {
        const word = wordMatch[0];
        if (keywords.includes(word) || keywords.includes(word.toLowerCase())) {
          tokens.push({ text: word, color: colors.keyword });
        } else if (/^[A-Z]/.test(word) || remaining.slice(word.length).match(/^\s*\(/)) {
          tokens.push({ text: word, color: colors.function });
        } else {
          tokens.push({ text: word, color: colors.text });
        }
        remaining = remaining.slice(word.length);
        continue;
      }

      // Other characters
      tokens.push({ text: remaining[0], color: colors.text });
      remaining = remaining.slice(1);
    }

    return tokens;
  }, []);

  const generateImage = useCallback(async (format: 'png' | 'jpeg' = 'png') => {
    if (!code.trim()) {
      setError('Please enter some code');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Failed to get canvas context');

      const colors = THEME_COLORS[options.theme];
      const lines = code.split('\n');
      const lineHeight = options.fontSize * 1.5;
      const fontFamily = 'Consolas, Monaco, "Courier New", monospace';

      ctx.font = `${options.fontSize}px ${fontFamily}`;
      const lineNumberWidth = options.showLineNumbers ? ctx.measureText(String(lines.length)).width + 24 : 0;

      let maxLineWidth = 0;
      for (const line of lines) {
        const width = ctx.measureText(line).width;
        if (width > maxLineWidth) maxLineWidth = width;
      }

      const contentWidth = lineNumberWidth + maxLineWidth;
      const contentHeight = lines.length * lineHeight;

      canvas.width = contentWidth + options.padding * 2;
      canvas.height = contentHeight + options.padding * 2;

      // Background
      ctx.fillStyle = options.backgroundColor || colors.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw code
      ctx.font = `${options.fontSize}px ${fontFamily}`;
      ctx.textBaseline = 'top';

      lines.forEach((line, index) => {
        const y = options.padding + index * lineHeight;

        // Line number
        if (options.showLineNumbers) {
          ctx.fillStyle = colors.lineNumber;
          ctx.fillText(String(index + 1), options.padding, y);
        }

        // Tokenize and draw
        const tokens = tokenize(line, options.language, colors);
        let x = options.padding + lineNumberWidth;

        for (const token of tokens) {
          ctx.fillStyle = token.color;
          ctx.fillText(token.text, x, y);
          x += ctx.measureText(token.text).width;
        }
      });

      const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
      const quality = format === 'jpeg' ? 0.92 : undefined;

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setError('Failed to generate image');
            setIsProcessing(false);
            return;
          }

          if (result?.url) URL.revokeObjectURL(result.url);
          if (previewUrl) URL.revokeObjectURL(previewUrl);

          const url = URL.createObjectURL(blob);
          setResult({ blob, url, width: canvas.width, height: canvas.height });
          setPreviewUrl(url);
          setIsProcessing(false);
        },
        mimeType,
        quality
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image');
      setIsProcessing(false);
    }
  }, [code, options, tokenize, result, previewUrl]);

  const reset = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (result?.url) URL.revokeObjectURL(result.url);
    setCode('');
    setOptionsState(DEFAULT_OPTIONS);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  }, [previewUrl, result]);

  return {
    code,
    setCode,
    options,
    setOptions,
    previewUrl,
    result,
    isProcessing,
    error,
    generateImage,
    reset,
  };
}

import { useState, useCallback } from 'react';

export interface HreflangEntry {
  id: string;
  langCode: string;
  url: string;
}

interface UseHreflangGeneratorReturn {
  entries: HreflangEntry[];
  includeXDefault: boolean;
  xDefaultUrl: string;
  generatedTags: string;
  addEntry: () => void;
  removeEntry: (id: string) => void;
  updateEntry: (id: string, field: 'langCode' | 'url', value: string) => void;
  setIncludeXDefault: (value: boolean) => void;
  setXDefaultUrl: (url: string) => void;
  applyPreset: (preset: LanguagePreset) => void;
  generate: () => void;
  reset: () => void;
}

export interface LanguagePreset {
  name: string;
  languages: { code: string; label: string }[];
}

export const COMMON_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'en-US', label: 'English (US)' },
  { code: 'en-GB', label: 'English (UK)' },
  { code: 'es', label: 'Spanish' },
  { code: 'es-ES', label: 'Spanish (Spain)' },
  { code: 'es-MX', label: 'Spanish (Mexico)' },
  { code: 'fr', label: 'French' },
  { code: 'fr-FR', label: 'French (France)' },
  { code: 'fr-CA', label: 'French (Canada)' },
  { code: 'de', label: 'German' },
  { code: 'de-DE', label: 'German (Germany)' },
  { code: 'it', label: 'Italian' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'pt-BR', label: 'Portuguese (Brazil)' },
  { code: 'pt-PT', label: 'Portuguese (Portugal)' },
  { code: 'zh', label: 'Chinese' },
  { code: 'zh-CN', label: 'Chinese (Simplified)' },
  { code: 'zh-TW', label: 'Chinese (Traditional)' },
  { code: 'ja', label: 'Japanese' },
  { code: 'ko', label: 'Korean' },
  { code: 'ru', label: 'Russian' },
  { code: 'ar', label: 'Arabic' },
  { code: 'hi', label: 'Hindi' },
  { code: 'nl', label: 'Dutch' },
  { code: 'pl', label: 'Polish' },
  { code: 'sv', label: 'Swedish' },
  { code: 'tr', label: 'Turkish' },
];

export const LANGUAGE_PRESETS: LanguagePreset[] = [
  {
    name: 'European Languages',
    languages: [
      { code: 'en-GB', label: 'English (UK)' },
      { code: 'de-DE', label: 'German (Germany)' },
      { code: 'fr-FR', label: 'French (France)' },
      { code: 'es-ES', label: 'Spanish (Spain)' },
      { code: 'it', label: 'Italian' },
    ],
  },
  {
    name: 'North American',
    languages: [
      { code: 'en-US', label: 'English (US)' },
      { code: 'en-CA', label: 'English (Canada)' },
      { code: 'fr-CA', label: 'French (Canada)' },
      { code: 'es-MX', label: 'Spanish (Mexico)' },
    ],
  },
  {
    name: 'Asian Languages',
    languages: [
      { code: 'zh-CN', label: 'Chinese (Simplified)' },
      { code: 'zh-TW', label: 'Chinese (Traditional)' },
      { code: 'ja', label: 'Japanese' },
      { code: 'ko', label: 'Korean' },
    ],
  },
  {
    name: 'Global Basics',
    languages: [
      { code: 'en', label: 'English' },
      { code: 'es', label: 'Spanish' },
      { code: 'fr', label: 'French' },
      { code: 'de', label: 'German' },
      { code: 'zh', label: 'Chinese' },
      { code: 'ja', label: 'Japanese' },
    ],
  },
];

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function useHreflangGenerator(): UseHreflangGeneratorReturn {
  const [entries, setEntries] = useState<HreflangEntry[]>([
    { id: generateId(), langCode: 'en', url: '' },
  ]);
  const [includeXDefault, setIncludeXDefault] = useState(false);
  const [xDefaultUrl, setXDefaultUrl] = useState('');
  const [generatedTags, setGeneratedTags] = useState('');

  const addEntry = useCallback(() => {
    setEntries((prev) => [...prev, { id: generateId(), langCode: '', url: '' }]);
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const updateEntry = useCallback(
    (id: string, field: 'langCode' | 'url', value: string) => {
      setEntries((prev) =>
        prev.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry))
      );
    },
    []
  );

  const applyPreset = useCallback((preset: LanguagePreset) => {
    const newEntries = preset.languages.map((lang) => ({
      id: generateId(),
      langCode: lang.code,
      url: '',
    }));
    setEntries(newEntries);
  }, []);

  const generate = useCallback(() => {
    const validEntries = entries.filter((e) => e.langCode && e.url);
    if (validEntries.length === 0) {
      setGeneratedTags('');
      return;
    }

    const tags: string[] = [];

    validEntries.forEach((entry) => {
      tags.push(`<link rel="alternate" hreflang="${entry.langCode}" href="${entry.url}" />`);
    });

    if (includeXDefault && xDefaultUrl) {
      tags.push(`<link rel="alternate" hreflang="x-default" href="${xDefaultUrl}" />`);
    }

    setGeneratedTags(tags.join('\n'));
  }, [entries, includeXDefault, xDefaultUrl]);

  const reset = useCallback(() => {
    setEntries([{ id: generateId(), langCode: 'en', url: '' }]);
    setIncludeXDefault(false);
    setXDefaultUrl('');
    setGeneratedTags('');
  }, []);

  return {
    entries,
    includeXDefault,
    xDefaultUrl,
    generatedTags,
    addEntry,
    removeEntry,
    updateEntry,
    setIncludeXDefault,
    setXDefaultUrl,
    applyPreset,
    generate,
    reset,
  };
}

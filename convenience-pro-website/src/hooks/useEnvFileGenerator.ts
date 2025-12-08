import { useState, useCallback } from 'react';

export type FrameworkTemplate = 'nextjs' | 'react' | 'node' | 'django' | 'laravel' | 'rails' | 'custom';

export interface EnvKeyValue {
  id: string;
  key: string;
  value: string;
}

export interface ValidationError {
  id: string;
  message: string;
}

interface UseEnvFileGeneratorReturn {
  entries: EnvKeyValue[];
  content: string;
  errors: ValidationError[];
  addEntry: () => void;
  removeEntry: (id: string) => void;
  updateEntry: (id: string, field: 'key' | 'value', value: string) => void;
  applyTemplate: (template: FrameworkTemplate) => void;
  reset: () => void;
  validate: () => boolean;
}

const FRAMEWORK_TEMPLATES: Record<FrameworkTemplate, EnvKeyValue[]> = {
  nextjs: [
    { id: '1', key: 'NEXT_PUBLIC_API_URL', value: 'https://api.example.com' },
    { id: '2', key: 'NEXT_PUBLIC_APP_NAME', value: 'My App' },
    { id: '3', key: 'DATABASE_URL', value: 'postgresql://user:password@localhost:5432/db' },
    { id: '4', key: 'NEXTAUTH_SECRET', value: 'your-secret-key' },
    { id: '5', key: 'NEXTAUTH_URL', value: 'http://localhost:3000' },
  ],
  react: [
    { id: '1', key: 'REACT_APP_API_URL', value: 'https://api.example.com' },
    { id: '2', key: 'REACT_APP_NAME', value: 'My React App' },
    { id: '3', key: 'REACT_APP_VERSION', value: '1.0.0' },
    { id: '4', key: 'REACT_APP_ENV', value: 'development' },
  ],
  node: [
    { id: '1', key: 'NODE_ENV', value: 'development' },
    { id: '2', key: 'PORT', value: '3000' },
    { id: '3', key: 'DATABASE_URL', value: 'postgresql://user:password@localhost:5432/db' },
    { id: '4', key: 'JWT_SECRET', value: 'your-jwt-secret' },
    { id: '5', key: 'API_KEY', value: 'your-api-key' },
  ],
  django: [
    { id: '1', key: 'DEBUG', value: 'True' },
    { id: '2', key: 'SECRET_KEY', value: 'your-django-secret-key' },
    { id: '3', key: 'DATABASE_URL', value: 'postgres://user:password@localhost:5432/db' },
    { id: '4', key: 'ALLOWED_HOSTS', value: 'localhost,127.0.0.1' },
    { id: '5', key: 'REDIS_URL', value: 'redis://localhost:6379/0' },
  ],
  laravel: [
    { id: '1', key: 'APP_NAME', value: 'Laravel' },
    { id: '2', key: 'APP_ENV', value: 'local' },
    { id: '3', key: 'APP_KEY', value: 'base64:your-app-key' },
    { id: '4', key: 'APP_DEBUG', value: 'true' },
    { id: '5', key: 'APP_URL', value: 'http://localhost' },
    { id: '6', key: 'DB_CONNECTION', value: 'mysql' },
    { id: '7', key: 'DB_HOST', value: '127.0.0.1' },
    { id: '8', key: 'DB_PORT', value: '3306' },
    { id: '9', key: 'DB_DATABASE', value: 'laravel' },
    { id: '10', key: 'DB_USERNAME', value: 'root' },
    { id: '11', key: 'DB_PASSWORD', value: '' },
  ],
  rails: [
    { id: '1', key: 'RAILS_ENV', value: 'development' },
    { id: '2', key: 'SECRET_KEY_BASE', value: 'your-secret-key-base' },
    { id: '3', key: 'DATABASE_URL', value: 'postgres://user:password@localhost:5432/db' },
    { id: '4', key: 'REDIS_URL', value: 'redis://localhost:6379/0' },
    { id: '5', key: 'RAILS_MASTER_KEY', value: 'your-master-key' },
  ],
  custom: [
    { id: '1', key: '', value: '' },
  ],
};

const ENV_KEY_REGEX = /^[A-Za-z_][A-Za-z0-9_]*$/;

export function useEnvFileGenerator(): UseEnvFileGeneratorReturn {
  const [entries, setEntries] = useState<EnvKeyValue[]>([{ id: '1', key: '', value: '' }]);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const generateContent = useCallback((currentEntries: EnvKeyValue[]): string => {
    return currentEntries
      .filter((entry) => entry.key.trim() !== '')
      .map((entry) => {
        const value = entry.value.includes(' ') || entry.value.includes('"')
          ? `"${entry.value.replace(/"/g, '\\"')}"`
          : entry.value;
        return `${entry.key}=${value}`;
      })
      .join('\n');
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: ValidationError[] = [];
    const seenKeys = new Set<string>();

    entries.forEach((entry) => {
      if (entry.key.trim() === '' && entry.value.trim() !== '') {
        newErrors.push({ id: entry.id, message: 'Key is required when value is provided' });
      } else if (entry.key.trim() !== '' && !ENV_KEY_REGEX.test(entry.key)) {
        newErrors.push({ id: entry.id, message: 'Key must start with letter or underscore, and contain only alphanumeric characters or underscores' });
      } else if (entry.key.trim() !== '' && seenKeys.has(entry.key)) {
        newErrors.push({ id: entry.id, message: 'Duplicate key' });
      }
      if (entry.key.trim() !== '') {
        seenKeys.add(entry.key);
      }
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  }, [entries]);

  const addEntry = useCallback(() => {
    setEntries((prev) => [...prev, { id: generateId(), key: '', value: '' }]);
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => (prev.length > 1 ? prev.filter((e) => e.id !== id) : prev));
    setErrors((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const updateEntry = useCallback((id: string, field: 'key' | 'value', value: string) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry))
    );
    setErrors((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const applyTemplate = useCallback((template: FrameworkTemplate) => {
    const templateEntries = FRAMEWORK_TEMPLATES[template].map((entry) => ({
      ...entry,
      id: generateId(),
    }));
    setEntries(templateEntries);
    setErrors([]);
  }, []);

  const reset = useCallback(() => {
    setEntries([{ id: generateId(), key: '', value: '' }]);
    setErrors([]);
  }, []);

  const content = generateContent(entries);

  return {
    entries,
    content,
    errors,
    addEntry,
    removeEntry,
    updateEntry,
    applyTemplate,
    reset,
    validate,
  };
}

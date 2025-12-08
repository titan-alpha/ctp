import { useState, useCallback, useMemo } from 'react';

export interface GridOptions {
  columns: number;
  rows: number;
  columnGap: number;
  rowGap: number;
  columnSizes: string[];
  rowSizes: string[];
  justifyItems: 'start' | 'end' | 'center' | 'stretch';
  alignItems: 'start' | 'end' | 'center' | 'stretch';
  justifyContent: 'start' | 'end' | 'center' | 'stretch' | 'space-between' | 'space-around' | 'space-evenly';
  alignContent: 'start' | 'end' | 'center' | 'stretch' | 'space-between' | 'space-around' | 'space-evenly';
  useTemplateAreas: boolean;
  templateAreas: string[][];
}

interface UseCssGridGeneratorReturn {
  options: GridOptions;
  setOptions: (options: Partial<GridOptions>) => void;
  cssCode: string;
  htmlCode: string;
  reset: () => void;
  copyToClipboard: (text: string) => Promise<boolean>;
}

const DEFAULT_OPTIONS: GridOptions = {
  columns: 3,
  rows: 2,
  columnGap: 10,
  rowGap: 10,
  columnSizes: ['1fr', '1fr', '1fr'],
  rowSizes: ['1fr', '1fr'],
  justifyItems: 'stretch',
  alignItems: 'stretch',
  justifyContent: 'start',
  alignContent: 'start',
  useTemplateAreas: false,
  templateAreas: [
    ['area1', 'area2', 'area3'],
    ['area4', 'area5', 'area6'],
  ],
};

export function useCssGridGenerator(): UseCssGridGeneratorReturn {
  const [options, setOptionsState] = useState<GridOptions>(DEFAULT_OPTIONS);

  const setOptions = useCallback((newOptions: Partial<GridOptions>) => {
    setOptionsState((prev) => {
      const updated = { ...prev, ...newOptions };

      // Sync column/row sizes arrays when count changes
      if (newOptions.columns !== undefined && newOptions.columns !== prev.columns) {
        const newColumnSizes = Array(newOptions.columns).fill('1fr').map((v, i) =>
          prev.columnSizes[i] || v
        );
        updated.columnSizes = newColumnSizes;

        // Update template areas columns
        if (updated.useTemplateAreas) {
          updated.templateAreas = updated.templateAreas.map((row, ri) =>
            Array(newOptions.columns).fill('').map((_, ci) =>
              row[ci] || `area${ri * newOptions.columns + ci + 1}`
            )
          );
        }
      }

      if (newOptions.rows !== undefined && newOptions.rows !== prev.rows) {
        const newRowSizes = Array(newOptions.rows).fill('1fr').map((v, i) =>
          prev.rowSizes[i] || v
        );
        updated.rowSizes = newRowSizes;

        // Update template areas rows
        if (updated.useTemplateAreas) {
          updated.templateAreas = Array(newOptions.rows).fill(null).map((_, ri) =>
            updated.templateAreas[ri] || Array(updated.columns).fill('').map((_, ci) =>
              `area${ri * updated.columns + ci + 1}`
            )
          );
        }
      }

      return updated;
    });
  }, []);

  const cssCode = useMemo(() => {
    const lines: string[] = ['.grid-container {', '  display: grid;'];

    // Grid template columns
    const colTemplate = options.columnSizes.slice(0, options.columns).join(' ');
    lines.push(`  grid-template-columns: ${colTemplate};`);

    // Grid template rows
    const rowTemplate = options.rowSizes.slice(0, options.rows).join(' ');
    lines.push(`  grid-template-rows: ${rowTemplate};`);

    // Gap
    if (options.columnGap === options.rowGap) {
      lines.push(`  gap: ${options.columnGap}px;`);
    } else {
      lines.push(`  row-gap: ${options.rowGap}px;`);
      lines.push(`  column-gap: ${options.columnGap}px;`);
    }

    // Template areas
    if (options.useTemplateAreas) {
      const areasStr = options.templateAreas
        .slice(0, options.rows)
        .map(row => `"${row.slice(0, options.columns).join(' ')}"`)
        .join('\n    ');
      lines.push(`  grid-template-areas:\n    ${areasStr};`);
    }

    // Alignment
    if (options.justifyItems !== 'stretch') {
      lines.push(`  justify-items: ${options.justifyItems};`);
    }
    if (options.alignItems !== 'stretch') {
      lines.push(`  align-items: ${options.alignItems};`);
    }
    if (options.justifyContent !== 'start') {
      lines.push(`  justify-content: ${options.justifyContent};`);
    }
    if (options.alignContent !== 'start') {
      lines.push(`  align-content: ${options.alignContent};`);
    }

    lines.push('}');

    // Item styles
    lines.push('');
    lines.push('.grid-item {');
    lines.push('  /* Add your item styles */');
    lines.push('}');

    return lines.join('\n');
  }, [options]);

  const htmlCode = useMemo(() => {
    const totalItems = options.columns * options.rows;
    const items = Array(totalItems)
      .fill(null)
      .map((_, i) => `  <div class="grid-item">${i + 1}</div>`)
      .join('\n');

    return `<div class="grid-container">\n${items}\n</div>`;
  }, [options.columns, options.rows]);

  const reset = useCallback(() => {
    setOptionsState(DEFAULT_OPTIONS);
  }, []);

  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }, []);

  return {
    options,
    setOptions,
    cssCode,
    htmlCode,
    reset,
    copyToClipboard,
  };
}

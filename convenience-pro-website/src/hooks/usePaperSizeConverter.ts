import { useState, useCallback } from 'react';

export type PaperSizeType =
  | 'A0' | 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'A6' | 'A7' | 'A8'
  | 'Letter' | 'Legal' | 'Tabloid' | 'Ledger' | 'Executive' | 'Folio';

interface PaperDimensions {
  mm: { width: number; height: number };
  inches: { width: number; height: number };
}

interface PaperSizeInfo {
  name: PaperSizeType;
  dimensions: PaperDimensions;
  description: string;
}

interface UsePaperSizeConverterReturn {
  selectedSize: PaperSizeType;
  setSelectedSize: (size: PaperSizeType) => void;
  dimensions: PaperDimensions | null;
  allSizes: PaperSizeInfo[];
  getSizeInfo: (size: PaperSizeType) => PaperSizeInfo | undefined;
}

const MM_TO_INCHES = 0.0393701;

const PAPER_SIZES: Record<PaperSizeType, { width: number; height: number; description: string }> = {
  // A Series (ISO 216) - dimensions in mm
  A0: { width: 841, height: 1189, description: 'Large technical drawings, posters' },
  A1: { width: 594, height: 841, description: 'Flip charts, large posters' },
  A2: { width: 420, height: 594, description: 'Posters, diagrams' },
  A3: { width: 297, height: 420, description: 'Drawings, large tables' },
  A4: { width: 210, height: 297, description: 'Standard documents, letters' },
  A5: { width: 148, height: 210, description: 'Notebooks, booklets' },
  A6: { width: 105, height: 148, description: 'Postcards, flyers' },
  A7: { width: 74, height: 105, description: 'Pocket cards, notes' },
  A8: { width: 52, height: 74, description: 'Small cards, tickets' },
  // North American sizes - dimensions in mm
  Letter: { width: 216, height: 279, description: 'US standard letter size' },
  Legal: { width: 216, height: 356, description: 'Legal documents, contracts' },
  Tabloid: { width: 279, height: 432, description: 'Newspapers, oversized documents' },
  Ledger: { width: 432, height: 279, description: 'Spreadsheets, accounting' },
  Executive: { width: 184, height: 267, description: 'Executive letters, memos' },
  Folio: { width: 216, height: 330, description: 'Legal filings' },
};

function convertToDimensions(widthMm: number, heightMm: number): PaperDimensions {
  return {
    mm: { width: widthMm, height: heightMm },
    inches: {
      width: Math.round(widthMm * MM_TO_INCHES * 100) / 100,
      height: Math.round(heightMm * MM_TO_INCHES * 100) / 100,
    },
  };
}

export function usePaperSizeConverter(): UsePaperSizeConverterReturn {
  const [selectedSize, setSelectedSize] = useState<PaperSizeType>('A4');

  const allSizes: PaperSizeInfo[] = Object.entries(PAPER_SIZES).map(([name, data]) => ({
    name: name as PaperSizeType,
    dimensions: convertToDimensions(data.width, data.height),
    description: data.description,
  }));

  const getSizeInfo = useCallback((size: PaperSizeType): PaperSizeInfo | undefined => {
    const data = PAPER_SIZES[size];
    if (!data) return undefined;
    return {
      name: size,
      dimensions: convertToDimensions(data.width, data.height),
      description: data.description,
    };
  }, []);

  const dimensions = PAPER_SIZES[selectedSize]
    ? convertToDimensions(PAPER_SIZES[selectedSize].width, PAPER_SIZES[selectedSize].height)
    : null;

  return {
    selectedSize,
    setSelectedSize,
    dimensions,
    allSizes,
    getSizeInfo,
  };
}

import { useState, useCallback } from 'react';

export type ProjectType = 'rectangular' | 'curtain' | 'tablecloth' | 'pillowcase' | 'quilt' | 'clothing';
export type UnitSystem = 'imperial' | 'metric';

export interface FabricResult {
  yardsNeeded: number;
  metersNeeded: number;
  totalArea: number;
  areaUnit: string;
  pieces: number;
  wastePercentage: number;
}

interface UseFabricCalculatorReturn {
  projectType: ProjectType;
  unitSystem: UnitSystem;
  length: number;
  width: number;
  fabricWidth: number;
  quantity: number;
  seamAllowance: number;
  patternRepeat: number;
  result: FabricResult | null;
  setProjectType: (type: ProjectType) => void;
  setUnitSystem: (system: UnitSystem) => void;
  setLength: (length: number) => void;
  setWidth: (width: number) => void;
  setFabricWidth: (width: number) => void;
  setQuantity: (quantity: number) => void;
  setSeamAllowance: (allowance: number) => void;
  setPatternRepeat: (repeat: number) => void;
  calculate: () => void;
  reset: () => void;
}

const PROJECT_MULTIPLIERS: Record<ProjectType, { lengthMultiplier: number; widthMultiplier: number }> = {
  rectangular: { lengthMultiplier: 1, widthMultiplier: 1 },
  curtain: { lengthMultiplier: 2.5, widthMultiplier: 1 }, // Fullness factor
  tablecloth: { lengthMultiplier: 1, widthMultiplier: 1 }, // Add drop on all sides
  pillowcase: { lengthMultiplier: 2.5, widthMultiplier: 1 }, // Front, back, flap
  quilt: { lengthMultiplier: 1.15, widthMultiplier: 1.15 }, // Extra for binding/batting
  clothing: { lengthMultiplier: 1.5, widthMultiplier: 1 }, // General clothing estimate
};

export function useFabricCalculator(): UseFabricCalculatorReturn {
  const [projectType, setProjectType] = useState<ProjectType>('rectangular');
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('imperial');
  const [length, setLength] = useState(36);
  const [width, setWidth] = useState(24);
  const [fabricWidth, setFabricWidth] = useState(45); // Standard fabric width in inches
  const [quantity, setQuantity] = useState(1);
  const [seamAllowance, setSeamAllowance] = useState(0.5);
  const [patternRepeat, setPatternRepeat] = useState(0);
  const [result, setResult] = useState<FabricResult | null>(null);

  const calculate = useCallback(() => {
    if (length <= 0 || width <= 0 || fabricWidth <= 0 || quantity <= 0) {
      setResult(null);
      return;
    }

    const multipliers = PROJECT_MULTIPLIERS[projectType];

    // Add seam allowance to dimensions (on all sides)
    const totalLength = (length + seamAllowance * 2) * multipliers.lengthMultiplier;
    const totalWidth = (width + seamAllowance * 2) * multipliers.widthMultiplier;

    // Account for pattern repeat
    let adjustedLength = totalLength;
    if (patternRepeat > 0) {
      const repeats = Math.ceil(totalLength / patternRepeat);
      adjustedLength = repeats * patternRepeat;
    }

    // Calculate how many pieces fit across the fabric width
    const piecesAcross = Math.floor(fabricWidth / totalWidth);
    const piecesNeeded = quantity;

    // Calculate rows needed
    const rows = piecesAcross > 0 ? Math.ceil(piecesNeeded / piecesAcross) : piecesNeeded;

    // Total length needed
    const totalFabricLength = rows * adjustedLength;

    // Convert to yards (36 inches) and meters
    const yardsNeeded = totalFabricLength / 36;
    const inchesToMeters = 0.0254;
    const metersNeeded = totalFabricLength * inchesToMeters;

    // Calculate total area
    const totalArea = totalLength * totalWidth * quantity;
    const usedArea = fabricWidth * totalFabricLength;
    const wastePercentage = usedArea > 0 ? Math.max(0, ((usedArea - totalArea) / usedArea) * 100) : 0;

    setResult({
      yardsNeeded: Math.ceil(yardsNeeded * 8) / 8, // Round up to nearest 1/8 yard
      metersNeeded: Math.ceil(metersNeeded * 10) / 10, // Round up to nearest 0.1 meter
      totalArea: Math.round(totalArea),
      areaUnit: 'sq inches',
      pieces: piecesAcross > 0 ? piecesAcross : 1,
      wastePercentage: Math.round(wastePercentage),
    });
  }, [projectType, length, width, fabricWidth, quantity, seamAllowance, patternRepeat]);

  const reset = useCallback(() => {
    setProjectType('rectangular');
    setUnitSystem('imperial');
    setLength(36);
    setWidth(24);
    setFabricWidth(45);
    setQuantity(1);
    setSeamAllowance(0.5);
    setPatternRepeat(0);
    setResult(null);
  }, []);

  return {
    projectType,
    unitSystem,
    length,
    width,
    fabricWidth,
    quantity,
    seamAllowance,
    patternRepeat,
    result,
    setProjectType,
    setUnitSystem,
    setLength,
    setWidth,
    setFabricWidth,
    setQuantity,
    setSeamAllowance,
    setPatternRepeat,
    calculate,
    reset,
  };
}

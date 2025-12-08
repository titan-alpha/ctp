import { useState, useCallback } from 'react';

export type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'irregular';

export interface Area {
  id: string;
  name: string;
  shape: ShapeType;
  dimensions: {
    length?: number;
    width?: number;
    radius?: number;
    base?: number;
    height?: number;
    sides?: { length: number; width: number }[];
  };
  squareFeet: number;
}

export interface SquareFootageCalculatorState {
  areas: Area[];
  totalSquareFeet: number;
}

export function useSquareFootageCalculator() {
  const [areas, setAreas] = useState<Area[]>([]);

  const calculateArea = useCallback((shape: ShapeType, dimensions: Area['dimensions']): number => {
    switch (shape) {
      case 'rectangle':
        return (dimensions.length || 0) * (dimensions.width || 0);
      case 'circle':
        return Math.PI * Math.pow(dimensions.radius || 0, 2);
      case 'triangle':
        return 0.5 * (dimensions.base || 0) * (dimensions.height || 0);
      case 'irregular':
        return (dimensions.sides || []).reduce((sum, side) => sum + side.length * side.width, 0);
      default:
        return 0;
    }
  }, []);

  const addArea = useCallback((name: string, shape: ShapeType, dimensions: Area['dimensions']) => {
    const squareFeet = calculateArea(shape, dimensions);
    const newArea: Area = {
      id: crypto.randomUUID(),
      name,
      shape,
      dimensions,
      squareFeet,
    };
    setAreas((prev) => [...prev, newArea]);
  }, [calculateArea]);

  const updateArea = useCallback((id: string, updates: Partial<Omit<Area, 'id' | 'squareFeet'>>) => {
    setAreas((prev) =>
      prev.map((area) => {
        if (area.id !== id) return area;
        const updatedArea = { ...area, ...updates };
        updatedArea.squareFeet = calculateArea(updatedArea.shape, updatedArea.dimensions);
        return updatedArea;
      })
    );
  }, [calculateArea]);

  const removeArea = useCallback((id: string) => {
    setAreas((prev) => prev.filter((area) => area.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setAreas([]);
  }, []);

  const totalSquareFeet = areas.reduce((sum, area) => sum + area.squareFeet, 0);

  return {
    areas,
    totalSquareFeet,
    addArea,
    updateArea,
    removeArea,
    clearAll,
    calculateArea,
  };
}

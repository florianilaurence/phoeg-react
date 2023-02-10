import { createContext } from 'react';

interface ContextType {
  order: number;
  labelX: string;
  labelY: string;
  labelColor: string;
  constraints: Array<string>;
  advancedConstraints: string;
  valueX: number;
  valueY: number;
}

// Create a context object without default values
export const Context = createContext<ContextType | null>(null); 
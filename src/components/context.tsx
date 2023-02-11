import { createContext } from "react";

interface InvContext {
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
export const Context = createContext<InvContext>({
  order: 7,
  labelX: "",
  labelY: "",
  labelColor: "",
  constraints: [],
  advancedConstraints: "",
  valueX: 0,
  valueY: 0,
});

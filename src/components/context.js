import { createContext } from 'react';

export const Context = createContext({
  order: 5,
  invariantX: "num_vertices",
  invariantY: "num_edges",
  invariantColor: "num_vertices",
  constraints: [],
  advancedConstraints: "",
});
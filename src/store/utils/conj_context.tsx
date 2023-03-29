import { createContext } from "react";
import { initialConjState } from "../reducers/conj_reducer";

const ConjContext = createContext({
  ...initialConjState,

  setActive: (active: boolean, index: number) => {},
  setIsFYSearched: (isFYSearched: boolean, index: number) => {},
  setIsMore: (isMore: boolean, index: number) => {},
});

export default ConjContext;

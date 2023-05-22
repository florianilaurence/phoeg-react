import { createContext } from "react";
import {
  ColorationObject,
  initialColorationsState,
} from "../reducers/colorations_reducer";

const ColorationsContext = createContext({
  ...initialColorationsState,

  setDataCols: (objects: Array<ColorationObject>) => {},
  updateAColoration: (average: number, coloration: string) => {},
  changeMinColoration: (newColoration: string) => {},
  changeMaxColoration: (newColoration: string) => {},
  resetHasChanged: () => {},
});

export default ColorationsContext;

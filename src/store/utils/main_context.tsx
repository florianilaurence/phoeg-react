import { createContext } from "react";
import {
  ChartData,
  Concave,
  Coordinate,
  initialMainState,
} from "../reducers/main_reducer";

const MainContext = createContext({
  ...initialMainState,
  setOrder: (order: number) => {},
  setLabelX: (labelX: string) => {},
  setLabelY: (labelY: string) => {},
  setLabelColor: (labelColor: string) => {},
  setConstraints: (constraints: string) => {},
  setAdvancedConstraints: (advancedConstraints: string) => {},
  setIsSubmit: (isSubmit: boolean) => {},
  setIsLoading: (isLoading: boolean) => {},

  setData: (data: ChartData) => {},

  setPointClicked: (coordinate: Coordinate | null) => {},
  setLegendClicked: (isClicked: number | null) => {},

  setError: (message: string) => {},

  reset: () => {},

  // For conjecture app
  setOrders: (orders: number[]) => {},
  setConcaves: (concaves: Concave[]) => {},
  addPointClicked: (coordinate: Coordinate, index: number) => {},
  removePointClicked: (coordinate: Coordinate, index: number) => {},
});

export default MainContext;

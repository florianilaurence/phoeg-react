import { createContext } from "react";
import {
  ChartData,
  Concave,
  Concaves,
  CoordinateAutoconj,
  CoordinateGrouped,
  initialMainState,
  MinMax,
  SimplifiedCoordinate,
} from "../reducers/main_reducer";

const MainContext = createContext({
  ...initialMainState,
  // For phoeg app
  setOrder: (order: number) => {},
  setData: (data: ChartData) => {},
  setPointClicked: (coordinate: CoordinateGrouped | null) => {},
  setLegendClicked: (isClicked: number | null) => {},

  // For both apps
  setLabelX: (labelX: string, typeX: string) => {},
  setLabelY: (labelY: string, typeY: string) => {},
  setLabelColor: (labelColor: string) => {},
  setConstraints: (constraints: string) => {},
  setAdvancedConstraints: (advancedConstraints: string) => {},
  setIsSubmit: (isSubmit: boolean) => {},
  setIsLoading: (isLoading: boolean) => {},
  setError: (message: string) => {},

  // For conjecture app
  setOrders: (orders: number[]) => {},
  setDataAutoconj: (
    concaveList: Array<Concave>,
    concaves: Concaves | {},
    envelopes: Array<Array<SimplifiedCoordinate>>,
    simplifiedPoints: Array<Array<CoordinateAutoconj>>,
    minMaxList: Array<MinMax>
  ) => {},
  setPointsClicked: (pointsClicked: CoordinateAutoconj[][]) => {},
  setSubmitAutoconj: (submitAutoconj: boolean) => {},
  updateSimplifiedPoints: (simplifiedPoints: CoordinateAutoconj[][]) => {},

  // For clear data or reset when change field in form
  clearData: () => {},
  reset: () => {},
  resetAllFields: () => {},
});

export default MainContext;

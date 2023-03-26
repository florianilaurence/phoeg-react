import { createContext } from "react";
import {
  ChartData,
  Concave,
  Coordinate,
  CoordinateAutoconj,
  initialMainState,
  MinMax,
} from "../reducers/main_reducer";

const MainContext = createContext({
  ...initialMainState,
  // For phoeg app
  setOrder: (order: number) => {},
  setData: (data: ChartData) => {},
  setPointClicked: (coordinate: Coordinate | null) => {},
  setLegendClicked: (isClicked: number | null) => {},

  // For both apps
  setLabelX: (labelX: string) => {},
  setLabelY: (labelY: string) => {},
  setLabelColor: (labelColor: string) => {},
  setConstraints: (constraints: string) => {},
  setAdvancedConstraints: (advancedConstraints: string) => {},
  setIsSubmit: (isSubmit: boolean) => {},
  setIsLoading: (isLoading: boolean) => {},
  setError: (message: string) => {},

  // For conjecture app
  setOrders: (orders: number[]) => {},
  setDataAutoconj: (
    concaves: Array<Concave>,
    envelopes: Array<Concave>,
    simplifiedPoints: Array<Array<CoordinateAutoconj>>,
    minMaxList: Array<MinMax>
  ) => {},
  setPointsClicked: (pointsClicked: CoordinateAutoconj[][]) => {},
  setSubmitAutoconj: (submitAutoconj: boolean) => {},

  // For clear data or reset when change field in form
  clearData: () => {},
  reset: () => {},
});

export default MainContext;

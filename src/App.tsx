import { useReducer } from "react";
import {
  ChartData,
  Concave,
  Concaves,
  CoordinateAutoconj,
  CoordinateGrouped,
  MainReducer,
  MinMax,
  SimplifiedCoordinate,
  initialMainState,
} from "./store/reducers/main_reducer";
import {
  setOrder,
  setData,
  setPointClicked,
  setLegendClicked,
  setLabelX,
  setLabelY,
  setLabelColor,
  setConstraints,
  setAdvancedConstraints,
  setIsSubmit,
  setIsLoading,
  setError,
  setOrders,
  setDataAutoconj,
  setPointsClicked,
  setSubmitAutoconj,
  updateSimplifiedPoints,
  clearData,
  reset,
  resetAllFields,
} from "./store/actions/main_action";
import MainContext from "./store/contexts/main_context";
import Routers from "./Routers";

const App = () => {
  //TODO: add here user settings

  const [stateMainReducer, dispatchMainReducer] = useReducer(
    MainReducer,
    initialMainState
  );

  return (
    <MainContext.Provider
      value={{
        ...stateMainReducer,

        setOrder: (order: number) => setOrder(order, dispatchMainReducer),
        setData: (data: ChartData) => setData(data, dispatchMainReducer),
        setPointClicked: (coordinate: CoordinateGrouped | null) =>
          setPointClicked(coordinate, dispatchMainReducer),
        setLegendClicked: (legendClicked: number | null) =>
          setLegendClicked(legendClicked, dispatchMainReducer),

        setLabelX: (labelX: string, typeX: string) =>
          setLabelX(labelX, typeX, dispatchMainReducer),
        setLabelY: (labelY: string, typeY: string) =>
          setLabelY(labelY, typeY, dispatchMainReducer),
        setLabelColor: (labelColor: string) =>
          setLabelColor(labelColor, dispatchMainReducer),
        setConstraints: (constraints: string) =>
          setConstraints(constraints, dispatchMainReducer),
        setAdvancedConstraints: (advancedConstraints: string) =>
          setAdvancedConstraints(advancedConstraints, dispatchMainReducer),
        setIsSubmit: (isSubmit: boolean) =>
          setIsSubmit(isSubmit, dispatchMainReducer),
        setIsLoading: (isLoading: boolean) =>
          setIsLoading(isLoading, dispatchMainReducer),
        setError: (message: string) => setError(message, dispatchMainReducer),

        setOrders: (orders: number[]) => setOrders(orders, dispatchMainReducer),
        setDataAutoconj: (
          concaveList: Array<Concave>,
          concaves: Concaves | {},
          envelopes: Array<Array<SimplifiedCoordinate>>,
          simplifiedPoints: Array<Array<CoordinateAutoconj>>,
          minMaxList: Array<MinMax>
        ) =>
          setDataAutoconj(
            concaveList,
            concaves,
            envelopes,
            simplifiedPoints,
            minMaxList,
            dispatchMainReducer
          ),

        setPointsClicked: (pointsClicked: Array<Array<CoordinateAutoconj>>) =>
          setPointsClicked(pointsClicked, dispatchMainReducer),
        setSubmitAutoconj: (submitAutoconj: boolean) =>
          setSubmitAutoconj(submitAutoconj, dispatchMainReducer),
        updateSimplifiedPoints: (
          simplifiedPoints: Array<Array<CoordinateAutoconj>>
        ) => updateSimplifiedPoints(simplifiedPoints, dispatchMainReducer),

        clearData: () => clearData(dispatchMainReducer),
        reset: () => reset(dispatchMainReducer),
        resetAllFields: () => {
          resetAllFields(dispatchMainReducer);
        },
      }}
    >
      <Routers />
    </MainContext.Provider>
  );
};

export default App;

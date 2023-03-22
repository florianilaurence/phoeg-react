import { useState, useEffect, useReducer } from "react";
import {
  setOrder,
  setLabelX,
  setLabelY,
  setLabelColor,
  setConstraints,
  setAdvancedConstraints,
  setIsSubmit,
  setIsLoading,
  setData,
  setPointClicked,
  setLegendClicked,
  setError,
  MainAction,
  addPointClicked,
  removePointClicked,
  reset,
  setConcaves,
  setOrders,
} from "../../store/actions/main_action";
import {
  ChartData,
  Concave,
  Coordinate,
  initialMainState,
  MainReducer,
} from "../../store/reducers/main_reducer";
import MainContext from "../../store/utils/main_context";
import Frame from "../annex_pages/Frame";
import Form from "../form_fetch/Form";
import { fetchInvariants, OpenProps } from "../polytopes/PhoegApp";
import { Invariant } from "../polytopes/PolytopesSlider";

// Main component of Autoconjectures application
const AutoconjecturesApp = ({ isOpenMenu, setIsOpenMenu }: OpenProps) => {
  const [invariants, setDataInvariants] = useState<Array<Invariant>>([]);

  const [stateMainReducer, dispatchMainReducer] = useReducer(
    MainReducer,
    initialMainState
  );

  useEffect(() => {
    fetchInvariants().then((inv) => setDataInvariants(inv));
  }, []);

  return (
    <Frame isOpenMenu={isOpenMenu} setIsOpenMenu={setIsOpenMenu}>
      <MainContext.Provider
        value={{
          ...stateMainReducer,

          setOrder: (order: number) => setOrder(order, dispatchMainReducer),
          setLabelX: (labelX: string) => setLabelX(labelX, dispatchMainReducer),
          setLabelY: (labelY: string) => setLabelY(labelY, dispatchMainReducer),
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

          setData: (data: ChartData) => setData(data, dispatchMainReducer),

          setPointClicked: (coordinate: Coordinate | null) =>
            setPointClicked(coordinate, dispatchMainReducer),
          setLegendClicked: (legendClicked: number | null) =>
            setLegendClicked(legendClicked, dispatchMainReducer),

          setError: (message: string) => setError(message, dispatchMainReducer),

          reset: () => reset(dispatchMainReducer),

          setOrders: (orders: number[]) =>
            setOrders(orders, dispatchMainReducer),
          setConcaves: (concaves: Array<Concave>) =>
            setConcaves(concaves, dispatchMainReducer),

          addPointClicked: (coordinate: Coordinate, index: number) =>
            addPointClicked(coordinate, index, dispatchMainReducer),
          removePointClicked: (coordinate: Coordinate, index: number) =>
            removePointClicked(coordinate, index, dispatchMainReducer),
        }}
      >
        <Form invariants={invariants} withOrders={true} />
      </MainContext.Provider>
    </Frame>
  );
};

export default AutoconjecturesApp;

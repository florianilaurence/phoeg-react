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
} from "../../store/actions/main_action";
import {
  ChartData,
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

  const [statePhoegReducer, dispatchPhoegReducer] = useReducer(
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
          ...statePhoegReducer,

          setOrder: (order: number) => setOrder(order, dispatchPhoegReducer),
          setLabelX: (labelX: string) =>
            setLabelX(labelX, dispatchPhoegReducer),
          setLabelY: (labelY: string) =>
            setLabelY(labelY, dispatchPhoegReducer),
          setLabelColor: (labelColor: string) =>
            setLabelColor(labelColor, dispatchPhoegReducer),
          setConstraints: (constraints: string) =>
            setConstraints(constraints, dispatchPhoegReducer),
          setAdvancedConstraints: (advancedConstraints: string) =>
            setAdvancedConstraints(advancedConstraints, dispatchPhoegReducer),
          setIsSubmit: (isSubmit: boolean) =>
            setIsSubmit(isSubmit, dispatchPhoegReducer),
          setIsLoading: (isLoading: boolean) =>
            setIsLoading(isLoading, dispatchPhoegReducer),

          setData: (data: ChartData) => setData(data, dispatchPhoegReducer),

          setPointClicked: (coordinate: Coordinate | null) =>
            setPointClicked(coordinate, dispatchPhoegReducer),
          setLegendClicked: (legendClicked: number | null) =>
            setLegendClicked(legendClicked, dispatchPhoegReducer),

          setError: (message: string) =>
            setError(message, dispatchPhoegReducer),

          reset: () => dispatchPhoegReducer({ type: MainAction.RESET }),

          setOrders: (orders: number[]) =>
            dispatchPhoegReducer({
              type: MainAction.ORDERS,
              orders: orders,
            }),
          addPoint: (coordinate: Coordinate, index: number) =>
            dispatchPhoegReducer({
              type: MainAction.ADD_POINT_CLICKED,
              coordinate: coordinate,
              index: index,
            }),
          removePoint: (coordinate: Coordinate, index: number) =>
            dispatchPhoegReducer({
              type: MainAction.REMOVE_POINT_CLICKED,
              coordinate: coordinate,
              index: index,
            }),
        }}
      >
        <Form invariants={invariants} withOrders={true} />
      </MainContext.Provider>
    </Frame>
  );
};

export default AutoconjecturesApp;

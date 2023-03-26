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
  reset,
  setOrders,
  setPointsClicked,
  setSubmitAutoconj,
  setDataAutoconj,
  clearData,
} from "../../store/actions/main_action";
import {
  ChartData,
  Concave,
  Coordinate,
  CoordinateAutoconj,
  initialMainState,
  MainReducer,
  MinMax,
} from "../../store/reducers/main_reducer";
import MainContext from "../../store/utils/main_context";
import Frame from "../annex_pages/Frame";
import Form from "../form_fetch/Form";
import { fetchInvariants, OpenProps } from "../polytopes/PhoegApp";
import { Invariant } from "../polytopes/PolytopesSlider";
import MyTabs from "./data/MyTabs";
import Loading from "../Loading";
import ConjectureResults from "./result/ConjectureResults";
import Fetch from "../form_fetch/Fetch";

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
          setData: (data: ChartData) => setData(data, dispatchMainReducer),
          setPointClicked: (coordinate: Coordinate | null) =>
            setPointClicked(coordinate, dispatchMainReducer),
          setLegendClicked: (legendClicked: number | null) =>
            setLegendClicked(legendClicked, dispatchMainReducer),

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
          setError: (message: string) => setError(message, dispatchMainReducer),

          setOrders: (orders: number[]) =>
            setOrders(orders, dispatchMainReducer),
          setDataAutoconj: (
            concaves: Array<Concave>,
            enveloppes: Array<Concave>,
            simplifiedPoints: Array<Array<CoordinateAutoconj>>,
            minMaxList: Array<MinMax>
          ) =>
            setDataAutoconj(
              concaves,
              enveloppes,
              simplifiedPoints,
              minMaxList,
              dispatchMainReducer
            ),

          setPointsClicked: (pointsClicked: Array<Array<CoordinateAutoconj>>) =>
            setPointsClicked(pointsClicked, dispatchMainReducer),
          setSubmitAutoconj: (submitAutoconj: boolean) =>
            setSubmitAutoconj(submitAutoconj, dispatchMainReducer),

          clearData: () => clearData(dispatchMainReducer),
          reset: () => reset(dispatchMainReducer),
        }}
      >
        <Form invariants={invariants} withOrders={true} />

        {stateMainReducer.isSubmit && (
          <Fetch invariants={invariants} withOrders={true} />
        )}

        {stateMainReducer.isSubmit && stateMainReducer.isLoading && (
          <Loading height="1000px" />
        )}

        {stateMainReducer.isSubmit &&
          !stateMainReducer.isLoading &&
          stateMainReducer.concaves.length > 0 &&
          stateMainReducer.minMaxList.length > 0 && <MyTabs />}

        {stateMainReducer.submitAutoconj && <ConjectureResults />}
      </MainContext.Provider>
    </Frame>
  );
};

export default AutoconjecturesApp;

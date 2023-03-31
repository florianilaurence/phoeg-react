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
  setDataAutoconj,
  clearData,
  updateSimplifiedPoints,
  setSubmitAutoconj,
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
import { fetchInvariants, OpenProps } from "../phoeg_app/PhoegApp";
import { Invariant } from "../phoeg_app/PolytopesSlider";
import MyTabs from "./data/MyTabs";
import Loading from "../Loading";
import Fetch from "../form_fetch/Fetch";
import ConjectureResults from "./result/ConjectureResults";
import {
  ConjReducer,
  initialConjState,
} from "../../store/reducers/conj_reducer";
import ConjContext from "../../store/utils/conj_context";
import {
  setActive,
  setIsFYSearched,
  setIsMore,
} from "../../store/actions/conj_action";
import Rational from "./result/utils/rational";

// Main component of Autoconjectures application
const AutoconjecturesApp = ({ isOpenMenu, setIsOpenMenu }: OpenProps) => {
  const [invariants, setDataInvariants] = useState<Array<Invariant>>([]);

  const [stateConjReducer, dispatchConjReducer] = useReducer(
    ConjReducer,
    initialConjState
  );

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
          setSubmitAutoconj: (submitAutoconj: boolean) =>
            setSubmitAutoconj(submitAutoconj, dispatchMainReducer),

          setPointsClicked: (pointsClicked: Array<Array<CoordinateAutoconj>>) =>
            setPointsClicked(pointsClicked, dispatchMainReducer),
          updateSimplifiedPoints: (
            simplifiedPoints: Array<Array<CoordinateAutoconj>>
          ) => updateSimplifiedPoints(simplifiedPoints, dispatchMainReducer),

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
        <ConjContext.Provider
          value={{
            ...stateConjReducer,

            setActive: (active: boolean, index: number) =>
              setActive(active, index, dispatchConjReducer),
            setIsFYSearched: (isFYSearched: boolean, index: number) =>
              setIsFYSearched(isFYSearched, index, dispatchConjReducer),
            setIsMore: (isMore: boolean, index: number) =>
              setIsMore(isMore, index, dispatchConjReducer),
          }}
        >
          {stateMainReducer.isSubmit &&
            !stateMainReducer.isLoading &&
            stateMainReducer.concaves.length > 0 &&
            stateMainReducer.minMaxList.length > 0 && <MyTabs />}

          {stateMainReducer.submitAutoconj && <ConjectureResults />}
        </ConjContext.Provider>
      </MainContext.Provider>
    </Frame>
  );
};

export default AutoconjecturesApp;

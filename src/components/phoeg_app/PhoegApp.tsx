import PolytopesSlider, { Invariant } from "./PolytopesSlider";
import "react-banner/dist/style.css";
import Form from "../form_fetch/Form";
import axios from "axios";
import { API_URL } from "../../.env";
import { useEffect, useReducer, useState } from "react";
import Frame from "../annex_pages/Frame";
import MainContext from "../../store/utils/main_context";
import {
  ChartData,
  Concave,
  Coordinate,
  CoordinateAutoconj,
  CoordinateGrouped,
  initialMainState,
  MainReducer,
  MinMax,
} from "../../store/reducers/main_reducer";
import {
  clearData,
  reset,
  setAdvancedConstraints,
  setConstraints,
  setData,
  setDataAutoconj,
  setError,
  setIsLoading,
  setIsSubmit,
  setLabelColor,
  setLabelX,
  setLabelY,
  setLegendClicked,
  setOrder,
  setOrders,
  setPointClicked,
  setPointsClicked,
  setSubmitAutoconj,
  updateSimplifiedPoints,
} from "../../store/actions/main_action";
import Graphs from "../graphs/Graphs";
import { Box, Typography } from "@mui/material";
import Fetch from "../form_fetch/Fetch";

export interface OpenProps {
  isOpenMenu: boolean;
  setIsOpenMenu: (isOpenMenu: boolean) => void;
}

const fetchData = async (request: string): Promise<Array<Invariant>> => {
  try {
    const res = await axios.get(request);
    return res.data;
  } catch (error) {
    return [];
  }
};

export const fetchInvariants = async () => {
  let request = new URL(`${API_URL}/invariants?type=any`);
  const inv = await fetchData(request.toString());
  inv.push({
    name: "Multiplicity",
    datatype: -1,
    tablename: "mult",
    description: "",
  });
  inv.sort((a, b) => (a.name > b.name ? 1 : -1));
  return inv;
};

// Main component of PHOEG application
const PhoegApp = ({ isOpenMenu, setIsOpenMenu }: OpenProps) => {
  const [invariants, setDataInvariants] = useState<Array<Invariant>>([]);
  const [withConcave, setWithConcave] = useState<boolean>(false);

  const [stateMainReducer, dispatchMainReducer] = useReducer(
    MainReducer,
    initialMainState
  );

  useEffect(() => {
    fetchInvariants().then((inv) => setDataInvariants(inv));
  }, []);

  return (
    <Frame isOpenMenu={isOpenMenu} setIsOpenMenu={setIsOpenMenu}>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body1" align="center">
          Welcome to the new user interface. Start using it by filling in the
          following form to view your first polytope.
          <br />
          And enjoy!
        </Typography>
      </Box>
      <MainContext.Provider
        value={{
          ...stateMainReducer,

          setOrder: (order: number) => setOrder(order, dispatchMainReducer),
          setData: (data: ChartData) => setData(data, dispatchMainReducer),
          setPointClicked: (coordinate: CoordinateGrouped | null) =>
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
          updateSimplifiedPoints: (
            simplifiedPoints: Array<Array<CoordinateAutoconj>>
          ) => updateSimplifiedPoints(simplifiedPoints, dispatchMainReducer),

          clearData: () => clearData(dispatchMainReducer),
          reset: () => reset(dispatchMainReducer),
        }}
      >
        <Form
          invariants={invariants}
          withOrders={false}
          withConcave={withConcave}
          setWithConcave={setWithConcave}
        />
        {stateMainReducer.isSubmit && (
          <Fetch
            invariants={invariants}
            withConcave={withConcave}
            withOrders={false}
          />
        )}
        <PolytopesSlider withConcave={withConcave} />
        {stateMainReducer.isSubmit &&
          !stateMainReducer.isLoading &&
          stateMainReducer.pointClicked && <Graphs invariants={invariants} />}
      </MainContext.Provider>
    </Frame>
  );
};

export default PhoegApp;

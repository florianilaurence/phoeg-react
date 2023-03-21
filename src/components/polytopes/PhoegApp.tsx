import Polytopes, { Invariant } from "./PolytopesSlider";
import "react-banner/dist/style.css";
import Form from "../form_fetch/Form";
import axios from "axios";
import { API_URL } from "../../.env";
import { useEffect, useReducer, useState } from "react";
import Frame from "../annex_pages/Frame";
import MainContext from "../../store/utils/main_context";
import {
  ChartData,
  Coordinate,
  initialMainState,
  MainReducer,
} from "../../store/reducers/main_reducer";
import {
  MainAction,
  setAdvancedConstraints,
  setConstraints,
  setData,
  setError,
  setIsLoading,
  setIsSubmit,
  setLabelColor,
  setLabelX,
  setLabelY,
  setLegendClicked,
  setOrder,
  setPointClicked,
} from "../../store/actions/main_action";
import Graphs from "../graphs/Graphs";
import { Box } from "@mui/material";
import Inner from "../styles_and_settings/Inner";

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

  const [statePhoegReducer, dispatchPhoegReducer] = useReducer(
    MainReducer,
    initialMainState
  );

  useEffect(() => {
    fetchInvariants().then((inv) => setDataInvariants(inv));
  }, []);

  return (
    <Frame isOpenMenu={isOpenMenu} setIsOpenMenu={setIsOpenMenu}>
      <Box sx={{ mt: 2 }}>
        <Inner align="center">
          Welcome to the new user interface. Start using it by filling in the
          following form to view your first polytope.
          <br />
          And enjoy!
        </Inner>
      </Box>
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
        <Form invariants={invariants} withOrders={false} />
        <Polytopes />
        {statePhoegReducer.isSubmit &&
          !statePhoegReducer.isLoading &&
          statePhoegReducer.pointClicked && <Graphs invariants={invariants} />}
      </MainContext.Provider>
    </Frame>
  );
};

export default PhoegApp;

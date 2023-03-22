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
  Concave,
  Coordinate,
  initialMainState,
  MainReducer,
} from "../../store/reducers/main_reducer";
import {
  addPointClicked,
  MainAction,
  removePointClicked,
  reset,
  setAdvancedConstraints,
  setConcaves,
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
  setOrders,
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
        <Inner align="center">
          Welcome to the new user interface. Start using it by filling in the
          following form to view your first polytope.
          <br />
          And enjoy!
        </Inner>
      </Box>
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
        <Form invariants={invariants} withOrders={false} />
        <Polytopes />
        {stateMainReducer.isSubmit &&
          !stateMainReducer.isLoading &&
          stateMainReducer.pointClicked && <Graphs invariants={invariants} />}
      </MainContext.Provider>
    </Frame>
  );
};

export default PhoegApp;

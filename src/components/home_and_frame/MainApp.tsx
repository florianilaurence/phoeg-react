import Polytopes, { Invariant } from "../polytopes/PolytopesSlider";
import "react-banner/dist/style.css";
import { Introduction } from "./Introduction";
import Form from "../form_fetch/Form";
import axios from "axios";
import { API_URL } from "../../.env";
import { useEffect, useReducer, useState } from "react";
import Frame from "./Frame";
import MainContext from "../../store/utils/main_context";
import {
  ChartData,
  Coordinate,
  initialMainState,
  MainReducer,
} from "../../store/reducers/main_reducer";
import {
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

// Main component
const MainApp: React.FC = () => {
  const [invariants, setDataInvariants] = useState<Array<Invariant>>([]);

  const [stateMainReducer, dispatchMainReducer] = useReducer(
    MainReducer,
    initialMainState
  );

  useEffect(() => {
    let request = new URL(`${API_URL}/invariants?type=any`);
    fetchData(request.toString()).then((inv) => {
      inv.push({
        name: "Multiplicity",
        datatype: -1,
        tablename: "mult",
        description: "",
      });
      inv.sort((a, b) => (a.name > b.name ? 1 : -1));
      setDataInvariants(inv);
    });
  }, []);

  const fetchData = async (request: string): Promise<Array<Invariant>> => {
    try {
      const res = await axios.get(request);
      return res.data;
    } catch (error) {
      return [];
    }
  };

  return (
    <Frame>
      <Introduction />
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
        }}
      >
        <Form invariants={invariants} withOrders={false} />
        <Polytopes />
        {/* Add graphs when it is implementing */}
      </MainContext.Provider>
    </Frame>
  );
};

export default MainApp;

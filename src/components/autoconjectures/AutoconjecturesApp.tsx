import { Box, Button } from "@mui/material";
import SendTimeExtensionIcon from "@mui/icons-material/SendTimeExtension";
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
  setConcaves,
  setOrders,
  setMinMaxList,
  setEnvelopes,
  initPointsClicked,
  setPointsClicked,
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
import MyTabs from "./MyTabs";
import Loading from "../Loading";

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

  const handleSubmit = () => {
    console.log("Submit");
    console.log(stateMainReducer.pointsClicked);
  };

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
          initPointsClicked: (orders: number[]) =>
            initPointsClicked(orders, dispatchMainReducer),
          setConcaves: (concaves: Array<Concave>) =>
            setConcaves(concaves, dispatchMainReducer),
          setEnvelopes: (envelopes: Array<Array<Coordinate>>) =>
            setEnvelopes(envelopes, dispatchMainReducer),
          setMinMaxList: (minMaxList: Array<MinMax>) =>
            setMinMaxList(minMaxList, dispatchMainReducer),

          setPointsClicked: (pointsClicked: Array<Array<CoordinateAutoconj>>) =>
            setPointsClicked(pointsClicked, dispatchMainReducer),
        }}
      >
        <Form invariants={invariants} withOrders={true} />
        {stateMainReducer.isSubmit && stateMainReducer.isLoading && (
          <Loading height="1000px" />
        )}
        {stateMainReducer.isSubmit &&
          !stateMainReducer.isLoading &&
          stateMainReducer.concaves.length > 0 &&
          stateMainReducer.minMaxList.length > 0 && (
            <>
              <MyTabs />

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  color="success"
                  endIcon={<SendTimeExtensionIcon />}
                  onClick={handleSubmit}
                >
                  Generate autoconojectures
                </Button>
              </Box>
            </>
          )}
      </MainContext.Provider>
    </Frame>
  );
};

export default AutoconjecturesApp;

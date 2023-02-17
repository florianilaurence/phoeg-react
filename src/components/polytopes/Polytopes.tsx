import { useEffect, useReducer, useState } from "react";
import TitleText from "../styles_and_settings/TitleText";
import { Grid, Typography } from "@mui/material";
import { LEFT, RIGHT } from "../../designVars";
import axios from "axios";
import { API_URL } from "../../.env";
import Form from "./Form";
import { Box } from "@mui/system";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import MyError from "../MyError";
import Loading from "../Loading";
import {
  initialChartState,
  RequestChartReducer,
} from "../../store/reducers/request_chart_reducer";
import RequestChartContext from "../../store/utils/request_chart_context";
import {
  handleAdvancedConstraints,
  handleLabelColor,
  handleLabelX,
  handleLabelY,
  handleIsSubmit,
  ChartAction,
  handleConstraints,
  handleIsLoading,
  handleOrder,
} from "../../store/actions/request_chart_action";
import Fetch from "./Fetch";
import Chart from "./Chart";
import ChartDataContext from "../../store/utils/chart_data_context";
import {
  ChartData,
  ChartDataReducer,
  initialChartDataState,
} from "../../store/reducers/chart_data_reducer";
import { setData, setError } from "../../store/actions/chart_data_action";

export interface Invariant {
  tablename: string;
  datatype: number;
  name: string;
  description: string;
}

export interface InvariantsProps {
  invariants: Array<Invariant>;
}

const Polytopes: React.FC = () => {
  const [stateRequestChartReducer, dispatchRequestChartReducer] = useReducer(
    RequestChartReducer,
    initialChartState
  );

  const [stateChartDataReducer, dispatchChartDataReducer] = useReducer(
    ChartDataReducer,
    initialChartDataState
  );

  const [invariants, setDataInvariants] = useState<InvariantsProps>({
    invariants: Array<Invariant>(),
  });

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
      setDataInvariants({ invariants: inv });
    });
  }, []);

  const fetchData = async (request: string): Promise<Array<Invariant>> => {
    try {
      const res = await axios.get(request);
      return res.data;
    } catch (err) {
      dispatchChartDataReducer({
        type: "SET_ERROR",
      });
      return [];
    }
  };

  const nextOrder = () => {
    if (stateRequestChartReducer.order < 10) {
      const newOrder = stateRequestChartReducer.order + 1;
      handleOrder(newOrder, dispatchRequestChartReducer);
      handleIsLoading(false, dispatchRequestChartReducer);
    }
  };

  const prevOrder = () => {
    if (stateRequestChartReducer.order > 1) {
      const newOrder = stateRequestChartReducer.order - 1;
      console.log(stateRequestChartReducer.order);
      console.log(newOrder);
      handleOrder(newOrder, dispatchRequestChartReducer);
      console.log(stateRequestChartReducer.order);
      handleIsLoading(false, dispatchRequestChartReducer);
    }
  };

  return (
    <RequestChartContext.Provider
      value={{
        order: stateRequestChartReducer.order,
        labelX: stateRequestChartReducer.labelX,
        labelY: stateRequestChartReducer.labelY,
        labelColor: stateRequestChartReducer.labelColor,
        constraints: stateRequestChartReducer.constraints,
        advancedConstraints: stateRequestChartReducer.advancedConstraints,
        isSubmit: stateRequestChartReducer.isSubmit,
        isLoading: stateRequestChartReducer.isLoading,
        handleLabelX: (value: string) =>
          handleLabelX(value, dispatchRequestChartReducer),
        handleLabelY: (value: string) =>
          handleLabelY(value, dispatchRequestChartReducer),
        handleLabelColor: (value: string) =>
          handleLabelColor(value, dispatchRequestChartReducer),
        handleConstraints: (value: string) =>
          handleConstraints(value, dispatchRequestChartReducer),
        handleAdvancedConstraints: (value: string) =>
          handleAdvancedConstraints(value, dispatchRequestChartReducer),
        handleIsSubmit: (value: boolean) =>
          handleIsSubmit(value, dispatchRequestChartReducer),
        handleIsLoading: (value: boolean) =>
          handleIsLoading(value, dispatchRequestChartReducer),
      }}
    >
      <ChartDataContext.Provider
        value={{
          envelope: stateChartDataReducer.envelope,
          coordinates: stateChartDataReducer.coordinates,
          minMax: stateChartDataReducer.minMax,
          clusterList: stateChartDataReducer.clusterList,
          allClusters: stateChartDataReducer.allClusters,
          concave: stateChartDataReducer.concave,
          error: stateChartDataReducer.error,
          handleSetData: (data: ChartData) =>
            setData(data, dispatchChartDataReducer),
          handleSetError: (value: string) =>
            setError(value, dispatchChartDataReducer),
        }}
      >
        <TitleText>Polytopes</TitleText>
        <Box sx={{ ml: LEFT, mr: RIGHT }}>
          <Form invariants={invariants.invariants} />

          {stateChartDataReducer.error !== "" && (
            <MyError message={stateChartDataReducer.error} />
          )}

          {stateRequestChartReducer.isSubmit && (
            <Fetch invariants={invariants.invariants} />
          )}

          {stateRequestChartReducer.isSubmit &&
            stateRequestChartReducer.isLoading && <Loading />}

          {stateRequestChartReducer.isSubmit &&
            !stateRequestChartReducer.isLoading && (
              <>
                <Typography variant="h5" sx={{ mt: 2, mb: 2 }}>
                  Order {stateRequestChartReducer.order}
                </Typography>
                <Grid
                  container
                  spacing={1}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid item xs={1}>
                    <ArrowBackIosIcon
                      sx={{ fontSize: 40 }}
                      onClick={prevOrder}
                      color={
                        stateRequestChartReducer.order > 1
                          ? "success"
                          : "disabled"
                      }
                    />
                  </Grid>
                  <Grid item xs={10}>
                    <Chart />
                  </Grid>
                  <Grid item xs={1}>
                    <ArrowForwardIosIcon
                      sx={{ fontSize: 40 }}
                      onClick={nextOrder}
                      color={
                        stateRequestChartReducer.order < 7
                          ? "success"
                          : stateRequestChartReducer.order < 10
                          ? "warning"
                          : "disabled"
                      }
                    />
                  </Grid>
                </Grid>
              </>
            )}
        </Box>
      </ChartDataContext.Provider>
    </RequestChartContext.Provider>
  );
};

export default Polytopes;

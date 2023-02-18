import { useEffect, useReducer, useState } from "react";
import { Grid, Tooltip, Typography } from "@mui/material";
import { LEFT, RIGHT } from "../../designVars";
import axios from "axios";
import { API_URL } from "../../.env";
import Form, { FormProps } from "./Form";
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
import Title from "../styles_and_settings/Title";
import { deepOrange, green, grey, orange } from "@mui/material/colors";
import SubTitle from "../styles_and_settings/SubTitle";
import ParentSize from "@visx/responsive/lib/components/ParentSizeModern";

export interface Invariant {
  tablename: string;
  datatype: number;
  name: string;
  description: string;
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

  const [invariants, setDataInvariants] = useState<FormProps>({
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
    } catch (error) {
      dispatchChartDataReducer({
        type: "SET_ERROR",
        message: " invariants loading",
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
      handleOrder(newOrder, dispatchRequestChartReducer);
      handleIsLoading(false, dispatchRequestChartReducer);
    }
  };

  const colorNext = () => {
    switch (stateRequestChartReducer.order) {
      case 7:
        return orange[500];
      case 8:
        return deepOrange[700];
      case 9:
        return deepOrange[900];
      case 10:
        return grey[400];
      default:
        return green[800];
    }
  };

  const colorPrev = () => {
    switch (stateRequestChartReducer.order) {
      case 1:
        return grey[400];
      case 9:
        return orange[500];
      case 10:
        return deepOrange[700];
      default:
        return green[800];
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
          minMax: stateChartDataReducer.minMax,
          coordinates: stateChartDataReducer.coordinates,
          sorted: stateChartDataReducer.sorted,
          concave: stateChartDataReducer.concave,
          error: stateChartDataReducer.error,
          handleSetData: (data: ChartData) =>
            setData(data, dispatchChartDataReducer),
          handleSetError: (value: string) =>
            setError(value, dispatchChartDataReducer),
        }}
      >
        <Title>Polytope</Title>
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
                <SubTitle>
                  Chart for order {stateRequestChartReducer.order}
                </SubTitle>
                <br />
                <Grid
                  container
                  spacing={1}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid item xs={0.5}>
                    <Tooltip title="Previous order" placement="top">
                      <ArrowBackIosIcon
                        sx={{ fontSize: 40, color: colorPrev() }}
                        onClick={prevOrder}
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item xs={11}>
                    <ParentSize>
                      {({ width }) => <Chart width={width} />}
                    </ParentSize>
                  </Grid>
                  <Grid item xs={0.5}>
                    <Tooltip
                      title={
                        stateRequestChartReducer.order < 7
                          ? "Next order"
                          : "Next order, warning !"
                      }
                      placement="top"
                    >
                      <ArrowForwardIosIcon
                        sx={{
                          fontSize: 40,
                          color: colorNext(),
                        }}
                        onClick={nextOrder}
                      />
                    </Tooltip>
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

import { useEffect, useReducer, useState } from "react";
import TitleText from "../styles_and_settings/TitleText";
import { Grid } from "@mui/material";
import { LEFT, RIGHT, TOP } from "../../designVars";
import axios from "axios";
import { API_URL } from "../../.env";
import Form, { Constraint } from "./Form";
import Chart from "./Chart";
import { Box } from "@mui/system";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import MyError from "../MyError";
import Loading from "../Loading";
import {
  initialChartState,
  RequestChartReducer,
} from "../../store/reducers/request_chart_reducer";
import ChartContext from "../../store/utils/chart_context";
import {
  handleAdvancedConstraints,
  handleLabelColor,
  handleLabelX,
  handleLabelY,
  handleIsSubmit,
  ChartAction,
  handleConstraints,
} from "../../store/actions/request_chart_action";

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

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    });
  }, []);

  const fetchData = async (request: string): Promise<Array<Invariant>> => {
    try {
      const res = await axios.get(request);
      return res.data;
    } catch (err) {
      setError(true);
      setLoading(false);
      return [];
    }
  };

  const nextOrder = () => {
    if (stateRequestChartReducer.order < 10) {
      const newOrder = stateRequestChartReducer.order + 1;
      dispatchRequestChartReducer({ type: ChartAction.ORDER, newOrder });
    }
  };

  const prevOrder = () => {
    if (stateRequestChartReducer.order > 1) {
      const newOrder = stateRequestChartReducer.order - 1;
      dispatchRequestChartReducer({ type: ChartAction.ORDER, newOrder });
    }
  };

  if (error) {
    return <MyError message={"invariants"} />;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <ChartContext.Provider
      value={{
        order: stateRequestChartReducer.order,
        labelX: stateRequestChartReducer.labelX,
        labelY: stateRequestChartReducer.labelY,
        labelColor: stateRequestChartReducer.labelColor,
        constraints: stateRequestChartReducer.constraints,
        advancedConstraints: stateRequestChartReducer.advancedConstraints,
        isSubmit: stateRequestChartReducer.isSubmit,
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
      }}
    >
      <TitleText>Polytopes</TitleText>
      <Box sx={{ ml: LEFT, mr: RIGHT }}>
        <Form invariants={invariants.invariants} />
        {stateRequestChartReducer.isSubmit && (
          <Grid container spacing={2}>
            <Grid item xs={1}>
              <ArrowBackIosIcon
                sx={{ fontSize: 40 }}
                onClick={prevOrder}
                color={
                  stateRequestChartReducer.order > 1 ? "success" : "disabled"
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
                  stateRequestChartReducer.order < 8
                    ? "success"
                    : stateRequestChartReducer.order < 10
                    ? "warning"
                    : "disabled"
                }
              />
            </Grid>
          </Grid>
        )}
      </Box>
    </ChartContext.Provider>
  );
};

export default Polytopes;

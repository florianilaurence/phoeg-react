import { Box, Grid, Slider, Typography } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useReducer } from "react";
import { API_URL } from "../../.env";
import MainContext from "../../store/utils/main_context";
import { decodeConstraints, getTablenameFromName } from "../form_fetch/Fetch";
import { Invariant } from "../polytopes/PolytopesSlider";
import SubTitle from "../styles_and_settings/SubTitle";
import GraphSlider from "./GraphSlider";

interface Graphs {
  list: Array<string>;
  isLoading: boolean;
  error: string;
  nbGraphSlider: number;
}

export const initialGraphsState: Graphs = {
  list: [],
  isLoading: false,
  error: "",
  nbGraphSlider: 1,
};

enum GraphsAction {
  SET_LIST = "SET_LIST",
  SET_IS_LOADING = "SET_IS_LOADING",
  SET_ERROR = "SET_ERROR",
  SET_NB_GRAPH_SLIDER = "SET_NB_GRAPH_SLIDER",
}

interface GraphsProps {
  invariants: Array<Invariant>;
}

export const Graphs = ({ invariants }: GraphsProps) => {
  const mainContext = useContext(MainContext);

  const readGraph = (data: any) => {
    const result: Array<string> = [];
    const keys = Object.keys(data);
    const invariantLength = data[keys[0]].length;
    const x_tablename = getTablenameFromName(mainContext.labelX, invariants);
    const y_tablename = getTablenameFromName(mainContext.labelY, invariants);
    for (let i = 0; i < invariantLength; i++) {
      const xValue = data[x_tablename][i];
      const yValue = data[y_tablename][i];
      const signValue = data["sig"][i];
      if (
        xValue === mainContext.pointClicked?.x &&
        yValue === mainContext.pointClicked?.y
      ) {
        result.push(signValue);
      }
    }
    return result;
  };

  const graphsReducer = (state: any, action: any) => {
    switch (action.type) {
      case GraphsAction.SET_LIST:
        return {
          ...state,
          list: action.payload,
        };
      case GraphsAction.SET_IS_LOADING:
        return {
          ...state,
          isLoading: action.payload,
        };
      case GraphsAction.SET_ERROR:
        return {
          ...state,
          error: action.payload,
        };
      case GraphsAction.SET_NB_GRAPH_SLIDER:
        return {
          ...state,
          nbGraphSlider: action.payload,
        };
      default:
        return state;
    }
  };

  const [stateGraphs, dispatchGraphs] = useReducer(
    graphsReducer,
    initialGraphsState
  );

  useEffect(() => {
    let graphs_request = new URL(`${API_URL}/graphs`);

    const constraints = decodeConstraints(mainContext.constraints).toString();
    const x_tablename = getTablenameFromName(mainContext.labelX, invariants);
    const y_tablename = getTablenameFromName(mainContext.labelY, invariants);

    graphs_request.searchParams.append("order", mainContext.order.toString());
    graphs_request.searchParams.append("invariants[0][name]", x_tablename);
    graphs_request.searchParams.append("invariants[1][name]", y_tablename);
    // Filter for specific invariant values
    graphs_request.searchParams.append(
      "invariants[0][value]",
      mainContext.pointClicked?.x.toString() || ""
    );
    graphs_request.searchParams.append(
      "invariants[1][value]",
      mainContext.pointClicked?.y.toString() || ""
    );

    if (constraints !== "")
      graphs_request.searchParams.append("constraints", constraints);
    // graphs_request =
    //   graphs_request.toString() +
    //   "&" +
    //   stringify({
    //     constraints: context.constraints,
    //   });

    const advancedConstraints = {
      query: mainContext.advancedConstraints,
    };

    fetchData(graphs_request, advancedConstraints)
      .then((data) => {
        dispatchGraphs({
          type: GraphsAction.SET_LIST,
          payload: data,
        });
        dispatchGraphs({
          type: GraphsAction.SET_IS_LOADING,
          payload: false,
        });
        dispatchGraphs({
          type: GraphsAction.SET_ERROR,
          payload: "",
        });
      })
      .catch((error) => {
        dispatchGraphs({
          type: GraphsAction.SET_ERROR,
          payload: error,
        });
        dispatchGraphs({
          type: GraphsAction.SET_IS_LOADING,
          payload: false,
        });
      });
  }, [mainContext.pointClicked]);

  const fetchData = (request: URL, body: any) => {
    return axios
      .post(request.toString(), {
        ...body,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((d) => {
        return readGraph(d.data);
      });
  };

  return (
    <Box sx={{ justifyContent: "center", m: 1 }}>
      {mainContext.pointClicked && stateGraphs.list.length > 0 && (
        <>
          <SubTitle>Graphs</SubTitle>
          <Typography variant="body1" align="center">
            There are {stateGraphs.list.length} graph
            {stateGraphs.list.length === 1 ? "" : "s"}. You can display up to{" "}
            {stateGraphs.list.length * 2} sliders in same the time:
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", m: 1 }}>
            <Slider
              aria-label="nb_of_sliders"
              value={stateGraphs.nbGraphSlider}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={1}
              max={stateGraphs.list.length * 2}
              sx={{
                color: "success.main",
                "& .MuiSlider-thumb": { borderRadius: "1px" },
                width: "75%",
              }}
              onChange={(event, newValue) =>
                dispatchGraphs({
                  type: GraphsAction.SET_NB_GRAPH_SLIDER,
                  payload: newValue,
                })
              }
            />
          </Box>

          <Grid
            container
            spacing={1}
            sx={{ mt: 1, display: "flex", justifyContent: "center" }}
          >
            {Array.from(Array(stateGraphs.nbGraphSlider).keys()).map(
              (i: number) => {
                return (
                  <Grid item sm={6} key={i}>
                    <GraphSlider
                      list={stateGraphs.list}
                      firstToShow={i % stateGraphs.list.length}
                    />
                  </Grid>
                );
              }
            )}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Graphs;

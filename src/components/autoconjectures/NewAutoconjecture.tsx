import { Box, Grid } from "@mui/material";
import { useReducer, useEffect } from "react";
import { Coordinate } from "../../store/reducers/main_reducer";
import SubTitle from "../styles_and_settings/SubTitle";
import TableDirection from "./TableDirection";

interface AutoconjecturesData {
  minY: Array<Array<Coordinate>>; // First array = order 1, second array = order 2, etc.
  minXminY: Array<Array<Coordinate>>;
  minX: Array<Array<Coordinate>>;
  maxXminY: Array<Array<Coordinate>>;
  maxX: Array<Array<Coordinate>>;
  maxXmaxY: Array<Array<Coordinate>>;
  maxY: Array<Array<Coordinate>>;
  minXmaxY: Array<Array<Coordinate>>;
  isLoading: boolean;
}

const initialAutoconjecturesData: AutoconjecturesData = {
  minY: [],
  minXminY: [],
  minX: [],
  maxXminY: [],
  maxX: [],
  maxXmaxY: [],
  maxY: [],
  minXmaxY: [],
  isLoading: true,
};

enum AutoconjecturesAction {
  SET_DATA = "SET_DATA",
}

const NewAutoconjecture = () =>
  // {
  // invariants,
  // }: InvariantsProps
  {
    const autoconjectureDataReducer = (
      state: AutoconjecturesData,
      action: any
    ) => {
      switch (action.type) {
        case AutoconjecturesAction.SET_DATA:
          return {
            ...state,
            minY: action.payload.minY,
            minXminY: action.payload.minXminY,
            minX: action.payload.minX,
            maxXminY: action.payload.maxXminY,
            maxX: action.payload.maxX,
            maxXmaxY: action.payload.maxXmaxY,
            maxY: action.payload.maxY,
            minXmaxY: action.payload.minXmaxY,
            isLoading: false,
          };
        default:
          return state;
      }
    };

    const [stateAutoconjectureData, dispatchAutoconjecture] = useReducer(
      autoconjectureDataReducer,
      initialAutoconjecturesData
    );

    useEffect(() => {
      // const constraints = decodeConstraints(requestChartContext.constraints);
      // const x_tablename = getTablenameFromName(
      //   requestChartContext.labelX,
      //   invariants
      // );
      // const y_tablename = getTablenameFromName(
      //   requestChartContext.labelY,
      //   invariants
      // );
      // const advanced_constraints = {
      //   query: requestChartContext.advancedConstraints,
      // };
      // const request = new URL(
      //   `${API_URL}/graphs/autoconjecture/data` +
      //     "?" +
      //     stringify({
      //       order: 1,
      //       x_invariant: x_tablename,
      //       y_invariant: y_tablename,
      //       constraints: constraints,
      //     })
      // );
      // axios.post(request.toString(), advanced_constraints).then((response) => {
      //   dispatchAutoconjecture({
      //     type: AutoconjecturesAction.SET_DATA,
      //     payload: response.data,
      //   });
      // });
    }, []);

    return (
      <Box>
        <SubTitle> Autoconjectures </SubTitle>
        <Grid container spacing={1}>
          {Object.keys(stateAutoconjectureData).map((key) => {
            if (key !== "isLoading") {
              return (
                <Grid item xs={3} key={`table-${key}`}>
                  <TableDirection
                    title={key}
                    data={stateAutoconjectureData[key]}
                  />
                </Grid>
              );
            }
          })}
        </Grid>
      </Box>
    );
  };

export default NewAutoconjecture;

import axios from "axios";
import { useContext, useEffect, useReducer, useState } from "react";
import { API_URL } from "../../../.env";
import { Coordinate } from "../../../store/reducers/chart_data_reducer";
import RequestChartContext from "../../../store/utils/request_chart_context";
import { stringify } from "qs";
import { InvariantsProps } from "../Polytopes";
import { decodeConstraints, getTablenameFromName } from "../Fetch";
import { Box, Grid } from "@mui/material";
import SubTitle from "../../styles_and_settings/SubTitle";
import TableDirection from "./TableDirection";
import Loading from "../../Loading";

interface CoordinateO {
  x: number;
  y: number;
  order: number;
}

interface AutoconjecturesData {
  minY: Array<Array<CoordinateO>>; // First array = order 1, second array = order 2, etc.
  minXminY: Array<Array<CoordinateO>>;
  minX: Array<Array<CoordinateO>>;
  maxXminY: Array<Array<CoordinateO>>;
  maxX: Array<Array<CoordinateO>>;
  maxXmaxY: Array<Array<CoordinateO>>;
  maxY: Array<Array<CoordinateO>>;
  minXmaxY: Array<Array<CoordinateO>>;
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

const Autoconjectures: React.FC<InvariantsProps> = ({
  invariants,
}: InvariantsProps) => {
  const requestChartContext = useContext(RequestChartContext);

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

  const fetchData = (requestConcave: URL, body: { query: string }) => {
    return axios.all([axios.post(requestConcave.toString(), body)]).then(
      axios.spread((concave) => {
        return {
          concave: concave.data,
        };
      })
    );
  };

  useEffect(() => {
    const constraints = decodeConstraints(requestChartContext.constraints);
    const x_tablename = getTablenameFromName(
      requestChartContext.labelX,
      invariants
    );
    const y_tablename = getTablenameFromName(
      requestChartContext.labelY,
      invariants
    );
    const advanced_constraints = {
      query: requestChartContext.advancedConstraints,
    };
    let autoconjectureData: AutoconjecturesData = initialAutoconjecturesData;

    for (let i = 0; i < 9; i++) {
      const concave_request = new URL(
        `${API_URL}/graphs/concave` +
          "?" +
          stringify({
            order: i + 1,
            x_invariant: x_tablename,
            y_invariant: y_tablename,
            constraints: constraints,
          })
      );
      fetchData(concave_request, advanced_constraints)
        .then((data) => {
          autoconjectureData.minY.push(data.concave.minY);
          autoconjectureData.minXminY.push(data.concave.minXminY);
          autoconjectureData.minX.push(data.concave.minX);
          autoconjectureData.maxXminY.push(data.concave.maxXminY);
          autoconjectureData.maxX.push(data.concave.maxX);
          autoconjectureData.maxXmaxY.push(data.concave.maxXmaxY);
          autoconjectureData.maxY.push(data.concave.maxY);
          autoconjectureData.minXmaxY.push(data.concave.minXmaxY);
        })
        .finally(() => {
          dispatchAutoconjecture({
            type: AutoconjecturesAction.SET_DATA,
            payload: sortByOrder(autoconjectureData),
          });
        });
    }
  }, [requestChartContext.isSubmit]);

  const sortByOrder = (data: AutoconjecturesData) => {
    Object.keys(data).forEach((key) => {
      if (key !== "isLoading") {
        data[key].sort(
          (a: CoordinateO, b: CoordinateO) => a[0].order - b[0].order
        );
      }
    });
    return data;
  };

  if (stateAutoconjectureData.isLoading) return <Loading />;
  else
    return (
      <Box>
        <SubTitle subtitle="Autoconjectures" />
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

export default Autoconjectures;

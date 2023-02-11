import { useCallback, useEffect, useReducer, useState } from "react";
import { View } from "react-native-web";
import TitleText from "../styles_and_settings/TitleText";
import InnerText from "../styles_and_settings/InnerText";
import { CircularProgress, Grid, Slider, Typography } from "@mui/material";
import {
  DEFAULT_NUMBER_OF_POLYTOPES,
  MAX_NUMBER_OF_POLYTOPES,
  MIN_NUMBER_OF_POLYTOPES,
  BOTTOM,
  LEFT,
  RIGHT,
  TOP,
} from "../../designVars";
import { Context } from "../context";
import axios from "axios";
import { API_URL } from "../../.env";
import Form from "./Form";
import Chart from "./Chart";
import { Box } from "@mui/system";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import MyError from "../MyError";
import Loading from "../Loading";

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
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const [invariants, setDataInvariants] = useState<InvariantsProps>({
    invariants: Array<Invariant>(),
  });

  const orderReducer = (state: any, action: any) => {
    switch (action.type) {
      case "increment":
        return state + 1;
      case "decrement":
        return state - 1;
      default:
        throw new Error();
    }
  };

  const [order, dispatchOrder] = useReducer(orderReducer, 7);

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
    if (order < 10) {
      dispatchOrder({ type: "increment" });
    }
  };

  const prevOrder = () => {
    if (order > 1) {
      dispatchOrder({ type: "decrement" });
    }
  };

  if (error) {
    return <MyError message={"invariants"} />;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <Context.Provider
      value={{
        order: order,
        labelX: "",
        labelY: "",
        labelColor: "",
        constraints: [],
        advancedConstraints: "",
        valueX: 0,
        valueY: 0,
      }}
    >
      <TitleText>Polytopes</TitleText>
      <Box sx={{ ml: LEFT, mr: RIGHT }}>
        <Form invariants={invariants.invariants} />
        <Grid container spacing={2}>
          <Grid item xs={1}>
            <ArrowBackIosIcon
              sx={{ fontSize: 40 }}
              onClick={prevOrder}
              color={order > 1 ? "success" : "disabled"}
            />
          </Grid>
          <Grid item xs={10}>
            order: {order}
            <Chart />
          </Grid>
          <Grid item xs={1}>
            <ArrowForwardIosIcon
              sx={{ fontSize: 40 }}
              onClick={nextOrder}
              color={order < 10 ? "success" : "disabled"}
            />
          </Grid>
        </Grid>
      </Box>
    </Context.Provider>
  );
};

export default Polytopes;

import { useCallback, useEffect, useState } from "react";
import { View } from "react-native-web";
import TitleText from "../styles_and_settings/TitleText";
import InnerText from "../styles_and_settings/InnerText";
import { Grid, Slider } from "@mui/material";
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
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState(undefined), []);

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
    forceUpdate();
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

  if (error) {
    return (
      <View>
        <TitleText>Error</TitleText>
        <InnerText>Something went wrong</InnerText>
      </View>
    );
  }

  if (loading) {
    return (
      <View>
        <TitleText>Loading</TitleText>
        <InnerText>Loading...</InnerText>
      </View>
    );
  }

  return (
    <Context.Provider
      value={{
        order: 7,
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
            <ArrowBackIosIcon sx={{ fontSize: 40 }} />
          </Grid>
          <Grid item xs={10}>
            <Chart />
          </Grid>
          <Grid item xs={1}>
            <ArrowForwardIosIcon sx={{ fontSize: 40 }} />
          </Grid>
        </Grid>
      </Box>
    </Context.Provider>
  );
};

export default Polytopes;

import PolytopesSlider, { Invariant } from "./PolytopesSlider";
import "react-banner/dist/style.css";
import Form from "../form_fetch/Form";
import axios from "axios";
import { API_URL } from "../../.env";
import { useContext, useEffect, useState } from "react";
import Frame from "../annex_pages/Frame";
import MainContext from "../../store/contexts/main_context";
import Graphs from "./graphs/Graphs";
import { Box, Typography } from "@mui/material";
import Fetch from "../form_fetch/Fetch";
import Title from "../styles_and_settings/Title";
import Loading from "../Loading";

export interface OpenProps {
  isOpenMenu: boolean;
  setIsOpenMenu: (isOpenMenu: boolean) => void;
}

export enum InvariantTypes {
  ANY = "any",
  NUMBER = "number",
  INTEGER = "integer",
  RATIONAL = "rational",
  REAL = "real",
  DOUBLE = "double",
  BOOLEAN = "boolean",
  SPECIAL = "special", // for mult
}

const fetchData = async (request: string): Promise<Array<Invariant>> => {
  try {
    const res = await axios.get(request);
    return res.data;
  } catch (error) {
    return [];
  }
};

export const fetchInvariants = async () => {
  // Exported for use in AutoconjecturesApp.tsx
  let request = new URL(`${API_URL}/invariants?type=any`);
  const inv = await fetchData(request.toString());
  inv.push({
    name: "Multiplicity",
    datatype: InvariantTypes.SPECIAL,
    tablename: "mult",
    description: "",
  });
  inv.sort((a, b) => (a.name > b.name ? 1 : -1));
  return inv;
};

// Main component of PHOEG application
const PhoegApp = ({ isOpenMenu, setIsOpenMenu }: OpenProps) => {
  const [invariants, setDataInvariants] = useState<Array<Invariant>>([]);
  const [withConcave, setWithConcave] = useState<boolean>(false);
  const mainContext = useContext(MainContext);

  useEffect(() => {
    mainContext.resetAllFields();
    fetchInvariants().then((inv) => setDataInvariants(inv));
  }, []);

  return (
    <Frame isOpenMenu={isOpenMenu} setIsOpenMenu={setIsOpenMenu}>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body1" align="center">
          Welcome to the new user interface. Start using it by filling in the
          following form to view your first polytope.
          <br />
          And enjoy!
        </Typography>
      </Box>
      <Form
        invariants={invariants}
        withOrders={false}
        withConcave={withConcave}
        setWithConcave={setWithConcave}
      />
      {mainContext.isSubmit && (
        <Fetch
          invariants={invariants}
          withConcave={withConcave}
          withOrders={false}
        />
      )}
      {mainContext.isSubmit && <Title title="Polytope" />}
      {mainContext.isSubmit && mainContext.isLoading && (
        <Loading height="1000px" />
      )}
      {mainContext.isSubmit && !mainContext.isLoading && (
        <PolytopesSlider withConcave={withConcave} />
      )}
      {mainContext.isSubmit &&
        !mainContext.isLoading &&
        mainContext.pointClicked && <Graphs invariants={invariants} />}
    </Frame>
  );
};

export default PhoegApp;

import { useState, useEffect, useReducer, useContext } from "react";
import MainContext from "../../store/contexts/main_context";
import Frame from "../annex_pages/Frame";
import Form from "../form_fetch/Form";
import { fetchInvariants, OpenProps } from "../phoeg_app/PhoegApp";
import { Invariant } from "../phoeg_app/PolytopesSlider";
import MyTabs from "./data/MyTabs";
import Loading from "../Loading";
import Fetch from "../form_fetch/Fetch";
import ConjectureResults from "./result/ConjectureResults";
import {
  ConjReducer,
  initialConjState,
} from "../../store/reducers/conj_reducer";
import ConjContext from "../../store/contexts/conj_context";
import {
  setActive,
  setIsFYSearched,
  setIsMore,
} from "../../store/actions/conj_action";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { blueGrey } from "@mui/material/colors";

export interface AutoconjecturesAppProps extends OpenProps {
  withPolytopes: boolean;
  setWithPolytopes: (withPolytopes: boolean) => void;
  withDataTables: boolean;
  setWithDataTables: (withDataTables: boolean) => void;
  withMainConjectures: boolean;
  setWithMainConjectures: (withMainConjectures: boolean) => void;
  withConjectureResults: boolean;
  setWithConjectureResults: (withConjectureResults: boolean) => void;
}

// Main component of Autoconjectures application
const AutoconjecturesApp = ({ isOpenMenu, setIsOpenMenu }: OpenProps) => {
  const [invariants, setDataInvariants] = useState<Array<Invariant>>([]);

  const [withPolytopes, setWithPolytopes] = useState(false);
  const [withDataTables, setWithDataTables] = useState(false);
  const [withMainConjectures, setWithMainConjectures] = useState(false);
  const [withConjectureResults, setWithConjectureResults] = useState(false);

  const [stateConjReducer, dispatchConjReducer] = useReducer(
    ConjReducer,
    initialConjState
  );

  const mainContext = useContext(MainContext);

  useEffect(() => {
    fetchInvariants().then((inv) => setDataInvariants(inv));
  }, []);

  return (
    <Frame isOpenMenu={isOpenMenu} setIsOpenMenu={setIsOpenMenu}>
      <Form invariants={invariants} withOrders={true} />
      {mainContext.isSubmit && (
        <>
          <Fetch invariants={invariants} withOrders={true} />
        </>
      )}

      {mainContext.isSubmit && mainContext.isLoading && (
        <Loading height="1000px" />
      )}
      <ConjContext.Provider
        value={{
          ...stateConjReducer,

          setActive: (active: boolean, index: number) =>
            setActive(active, index, dispatchConjReducer),
          setIsFYSearched: (isFYSearched: boolean, index: number) =>
            setIsFYSearched(isFYSearched, index, dispatchConjReducer),
          setIsMore: (isMore: boolean, index: number) =>
            setIsMore(isMore, index, dispatchConjReducer),
        }}
      >
        {mainContext.isSubmit &&
          !mainContext.isLoading &&
          mainContext.concaveList.length > 0 &&
          mainContext.minMaxList.length > 0 && <MyTabs />}

        {mainContext.submitAutoconj && <ConjectureResults isToPrint={false} />}

        {mainContext.isSubmit &&
          !mainContext.isLoading &&
          mainContext.concaveList.length > 0 &&
          mainContext.minMaxList.length > 0 && (
            <>
              <Divider />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <FormControl component="fieldset" variant="standard">
                  <Typography color={blueGrey[800]} sx={{ mb: 1 }}>
                    Which components do you want to print?
                  </Typography>
                  <FormGroup>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-evenly" }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={withPolytopes}
                            onChange={(e) => setWithPolytopes(e.target.checked)}
                            color="success"
                            size="small"
                          />
                        }
                        label="Polytopes"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={withDataTables}
                            onChange={(e) =>
                              setWithDataTables(e.target.checked)
                            }
                            color="success"
                            size="small"
                          />
                        }
                        label="Data tables"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={withMainConjectures}
                            onChange={(e) =>
                              setWithMainConjectures(e.target.checked)
                            }
                            color="success"
                            size="small"
                          />
                        }
                        label="Main conjectures"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={!mainContext.submitAutoconj}
                            checked={withConjectureResults}
                            onChange={(e) => {
                              setWithConjectureResults(e.target.checked);
                            }}
                            color="success"
                            size="small"
                          />
                        }
                        label="Conjecture results"
                      />
                    </Box>
                  </FormGroup>
                </FormControl>
                <Link
                  to="/autoconjectures/print"
                  onClick={() => {
                    localStorage.setItem(
                      "withPolytopes",
                      withPolytopes.toString()
                    );
                    localStorage.setItem(
                      "withDataTables",
                      withDataTables.toString()
                    );
                    localStorage.setItem(
                      "withMainConjectures",
                      withMainConjectures.toString()
                    );
                    localStorage.setItem(
                      "withConjectureResults",
                      withConjectureResults.toString()
                    );
                  }}
                >
                  <Button
                    variant="contained"
                    color="success"
                    endIcon={<DocumentScannerIcon />}
                  >
                    Generate report
                  </Button>
                </Link>
              </Box>
            </>
          )}
      </ConjContext.Provider>
    </Frame>
  );
};

export default AutoconjecturesApp;

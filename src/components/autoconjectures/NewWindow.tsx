import { Box, Button, Typography } from "@mui/material";
import PolytopesContainer from "./data/PolytopesContainer";
import DataTables from "./data/DataTables";
import MainConjectures from "./data/MainConjectures";
import ConjectureResults from "./result/ConjectureResults";
import "./NewWindow.css";
import PrintIcon from "@mui/icons-material/Print";
import UndoIcon from "@mui/icons-material/Undo";
import { useEffect } from "react";

export interface NewWindowProps {
  withPolytopes: boolean;
  withDataTables: boolean;
  withMainConjectures: boolean;
  withConjectureResults: boolean;
}

export interface ToPrintProps {
  isToPrint: boolean;
}

const NewWindow = () => {
  const withPolytopes = localStorage.getItem("withPolytopes") === "true";
  const withDataTables = localStorage.getItem("withDataTables") === "true";
  const withMainConjectures =
    localStorage.getItem("withMainConjectures") === "true";
  const withConjectureResults =
    localStorage.getItem("withConjectureResults") === "true";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const back = () => {
    window.history.back();
  };

  return (
    <Box
      sx={{
        width: "24cm",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "21cm",
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Button
          className="no-print"
          color="success"
          size="large"
          variant="contained"
          onClick={() => back()}
          startIcon={<UndoIcon />}
        >
          Return to application
        </Button>
        <Button
          className="no-print"
          color="success"
          size="large"
          variant="contained"
          onClick={() => window.print()}
          endIcon={<PrintIcon />}
        >
          Print
        </Button>
      </Box>
      <Box
        sx={{
          width: "21cm",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography variant="h4" align="center" sx={{ mb: 2 }}>
          Autoconjectures application
        </Typography>
        {withPolytopes && (
          <>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Polytopes
            </Typography>
            <PolytopesContainer isToPrint={true} />
          </>
        )}
        {withDataTables && (
          <>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Data Tables
            </Typography>
            <DataTables isToPrint={true} />
          </>
        )}
        {withMainConjectures && (
          <>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Main Conjectures
            </Typography>
            <MainConjectures isToPrint={true} />
          </>
        )}
        {withConjectureResults && (
          <>
            <Typography variant="h5">Your conjecture Results</Typography>
            <ConjectureResults isToPrint={true} />
          </>
        )}
      </Box>
    </Box>
  );
};

export default NewWindow;

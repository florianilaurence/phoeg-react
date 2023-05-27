import { Box, Button, Collapse, Typography } from "@mui/material";
import { useContext, useState } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MainContext from "../../../store/contexts/main_context";
import { red } from "@mui/material/colors";
import LegendConcaves from "./LegendConcaves";
import LegendColorValues from "./LegendColorValues";
import LegendColorations from "./LegendColorations";
import LegendConcave from "./LegendConcave";

interface LegendProps {
  withConcave: boolean;
  currentIndexOrder?: number;
  colorScale?: any;
}

const Legend = ({
  withConcave,
  currentIndexOrder, // undefined --> phoeg app || defined --> autoconjectures app
  colorScale, // defined --> phoeg app || undefined --> autoconjectures app
}: LegendProps) => {
  const mainContext = useContext(MainContext);
  const [showLegend, setShowLegend] = useState(true);

  if (
    // No legend to show
    !withConcave &&
    currentIndexOrder === undefined &&
    mainContext.labelColor === ""
  )
    return null;

  if (currentIndexOrder !== undefined) {
    // Autoconjecture app (only show legend for concave)
    return <LegendConcaves currentIndexOrder={currentIndexOrder} />;
  }

  return (
    // Phoeg app (show legend for color values &| colorations &| concave )
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Button
          variant={showLegend ? "contained" : "outlined"}
          onClick={() => setShowLegend(!showLegend)}
          color="success"
          sx={{ height: 20, mr: 1 }}
        >
          {showLegend ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </Button>
        <Typography variant="body1" fontSize={12}>
          {showLegend ? "Hide legend" : "Show legend"}
        </Typography>
      </Box>
      <Collapse in={showLegend}>
        {mainContext.labelColor !== "" && (
          <>
            <Box sx={{ mt: 1, display: "flex", justifyContent: "center" }}>
              <Typography
                variant="body1"
                fontSize={14}
                fontWeight="bold"
                fontStyle="italic"
                color={red[500]}
              >
                Stars show the points with several different values for the
                {" " + mainContext.labelColor}
              </Typography>
            </Box>
            {/* Color values possible */}
            <LegendColorValues />

            {/* Coloration possible (average if several color values on one point) */}
            <LegendColorations colorScale={colorScale} />
          </>
        )}
        {/* Directions legend */}
        {withConcave && currentIndexOrder === undefined && <LegendConcave />}
      </Collapse>
    </>
  );
};

export default Legend;

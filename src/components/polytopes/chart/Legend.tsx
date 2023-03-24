import { Box, Button, Collapse, Divider } from "@mui/material";
import { useContext, useState } from "react";
import Inner from "../../styles_and_settings/Inner";
import { ScalesProps } from "./Chart";
import { DirectionColors } from "./DrawConcave";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MainContext from "../../../store/utils/main_context";

interface LegendProps {
  colorScale: any;
  currentIndexOrder?: number;
}

const Legend = ({ colorScale, currentIndexOrder }: LegendProps) => {
  const mainContext = useContext(MainContext);

  const [showLegend, setShowLegend] = useState<boolean>(true);

  const dirsKeys =
    currentIndexOrder !== undefined
      ? Object.keys(mainContext.concaves[currentIndexOrder]).filter(
          (dir) => mainContext.concaves[currentIndexOrder][dir].length > 1
        )
      : Object.keys(mainContext.concave).filter(
          (dir) => mainContext.concave[dir].length > 1
        );

  if (currentIndexOrder !== undefined) {
    return (
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
          <Inner size={12}>{showLegend ? "Hide legend" : "Show legend"}</Inner>
        </Box>
        <Collapse in={showLegend}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {dirsKeys.map((dir, i) => {
              return (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mr: 1,
                  }}
                  key={`leg-dir-${dir}`}
                >
                  <Inner size={10} color={DirectionColors[dir]} bold>
                    {dir}
                  </Inner>
                  {i !== dirsKeys.length - 1 && (
                    <Divider
                      sx={{
                        ml: 1,
                      }}
                      orientation="vertical"
                      variant="middle"
                      flexItem
                    />
                  )}
                </Box>
              );
            })}
          </Box>
        </Collapse>
      </>
    );
  }

  const colorsKeysStr = Object.keys(mainContext.sorted);
  let colorsKeys = colorsKeysStr.map((color) => Number(color));
  colorsKeys.sort((a, b) => (a > b ? 1 : -1));

  const handleOnClickLegend = (item: number) => {
    if (mainContext.legendClicked === item) {
      mainContext.setLegendClicked(null);
    } else {
      mainContext.setLegendClicked(item);
    }
  };

  return (
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
        <Inner size={12}>{showLegend ? "Hide legend" : "Show legend"}</Inner>
      </Box>
      <Collapse in={showLegend}>
        {mainContext.labelColor !== "" && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
            flexWrap="wrap"
          >
            {colorsKeys.map((color, i) => {
              return (
                <Box
                  key={`leg-col-${i}-${color}`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{ ml: 1, cursor: "pointer" }}
                    onClick={() => handleOnClickLegend(color)}
                  >
                    <Inner
                      size={14}
                      color={colorScale(color)}
                      italic={
                        mainContext.legendClicked !== null &&
                        mainContext.legendClicked === color
                      }
                    >
                      {color}
                    </Inner>
                  </Box>
                  {i !== colorsKeys.length - 1 && (
                    <Divider
                      sx={{
                        ml: 1,
                      }}
                      orientation="vertical"
                      variant="middle"
                      flexItem
                    />
                  )}
                </Box>
              );
            })}
          </Box>
        )}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {dirsKeys.map((dir, i) => {
            return (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mr: 1,
                }}
                key={`leg-dir-${dir}`}
              >
                <Inner size={14} color={DirectionColors[dir]} bold>
                  {dir}
                </Inner>
                {i !== dirsKeys.length - 1 && (
                  <Divider
                    sx={{
                      ml: 1,
                    }}
                    orientation="vertical"
                    variant="middle"
                    flexItem
                  />
                )}
              </Box>
            );
          })}
        </Box>
      </Collapse>
    </>
  );
};

export default Legend;

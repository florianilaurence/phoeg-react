import { Box, Button, Collapse, Container, Divider } from "@mui/material";
import { useContext, useState } from "react";
import ChartDataContext from "../../../store/utils/chart_data_context";
import RequestChartContext from "../../../store/utils/request_chart_context";
import Inner from "../../styles_and_settings/Inner";
import { ScalesProps } from "./Chart";
import { DirectionColors } from "./DrawConcave";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const Legend: React.FC<ScalesProps> = ({ colorScale }: ScalesProps) => {
  const [showLegend, setShowLegend] = useState<boolean>(true);

  const chartDataContext = useContext(ChartDataContext);
  const requestChartContext = useContext(RequestChartContext);

  const colorsKeysStr = Object.keys(chartDataContext.sorted);
  let colorsKeys = colorsKeysStr.map((color) => Number(color));
  colorsKeys.sort((a, b) => (a > b ? 1 : -1));

  const dirsKeys = Object.keys(chartDataContext.concave).filter(
    (dir) => chartDataContext.concave[dir].length > 1
  );

  const handleOnClickLegend = (item: number) => {
    if (chartDataContext.legendClicked === item) {
      chartDataContext.handleSetLegendClicked(null);
    } else {
      chartDataContext.handleSetLegendClicked(item);
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
        {requestChartContext.labelColor !== "" && (
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
                        chartDataContext.legendClicked !== null &&
                        chartDataContext.legendClicked === color
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

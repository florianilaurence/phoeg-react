import {
  Box,
  Button,
  Collapse,
  Divider,
  Tooltip,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { DirectionColors } from "./DrawConcave";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MainContext from "../../../store/utils/main_context";
import { CoordinateAutoconj } from "../../../store/reducers/main_reducer";

interface LegendProps {
  colorScale: any;
  withConcave: boolean;
  currentIndexOrder?: number;
}

const Legend = ({
  colorScale,
  withConcave,
  currentIndexOrder,
}: LegendProps) => {
  const mainContext = useContext(MainContext);
  const [showLegend, setShowLegend] = useState<boolean>(true);

  let dirsKeys: string[] = [];

  if (withConcave) {
    dirsKeys =
      currentIndexOrder !== undefined
        ? Object.keys(mainContext.concaves[currentIndexOrder]).filter(
            (dir) => mainContext.concaves[currentIndexOrder][dir].length > 1
          )
        : Object.keys(mainContext.concave!).filter(
            (dir) => mainContext.concave![dir].length > 1
          );
  }

  const onClickLegendConcave = (key: string) => {
    //TODO: FIX THIS :'(
    const points = mainContext.simplifiedPoints[currentIndexOrder!][key];
    const selectedDir = mainContext.concaves[currentIndexOrder!][key];
    const newPointsClickedN: Array<CoordinateAutoconj> = [
      ...mainContext.pointsClicked[currentIndexOrder!],
    ];
    for (let point of selectedDir) {
      if (!point.clicked) {
        newPointsClickedN.push(point);
        point.clicked = true;
      }
    }
    const newPointsClicked = [...mainContext.pointsClicked];
    newPointsClicked[currentIndexOrder!].push(...newPointsClickedN);
    mainContext.setSubmitAutoconj(false);
    mainContext.setPointsClicked(newPointsClicked);
  };

  if (
    !withConcave &&
    currentIndexOrder === undefined &&
    mainContext.labelColor === ""
  )
    return null;

  if (currentIndexOrder !== undefined) {
    // Autoconjecture app
    return (
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
              <Tooltip title="Click to select all points in this direction">
                <Button
                  variant="text"
                  onClick={() => onClickLegendConcave(dir)}
                >
                  <Typography
                    variant="body1"
                    fontSize={10}
                    color={DirectionColors[dir]}
                    fontWeight="bold"
                  >
                    {dir}
                  </Typography>
                </Button>
              </Tooltip>
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
    // Phoeg app
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
                    <Typography
                      variant="body1"
                      fontSize={14}
                      color={colorScale(color)}
                      fontStyle={
                        mainContext.legendClicked !== null &&
                        mainContext.legendClicked === color
                          ? "italic"
                          : "normal"
                      }
                    >
                      {color}
                    </Typography>
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
                <Typography
                  variant="body1"
                  fontSize={14}
                  color={DirectionColors[dir]}
                  fontWeight="bold"
                >
                  {dir}
                </Typography>
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

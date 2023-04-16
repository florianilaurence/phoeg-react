import {
  Box,
  Button,
  Collapse,
  Divider,
  Tooltip,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { DirectionColors } from "./DrawConcave";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MainContext from "../../store/utils/main_context";
import { containsCoordinate } from "../form_fetch/Fetch";
import { red } from "@mui/material/colors";

interface LegendProps {
  withConcave: boolean;
  colorScale?: any;
  currentIndexOrder?: number;
}

interface LegendMean {
  value: number;
  colorToShow: string;
}

const Legend = ({
  withConcave,
  colorScale,
  currentIndexOrder, // undefined --> phoeg app || defined --> autoconjectures app
}: LegendProps) => {
  const mainContext = useContext(MainContext);
  const [showLegend, setShowLegend] = useState(true);
  const [means, setMeans] = useState<Array<LegendMean>>([]);

  let dirsKeys: string[] = [];

  useEffect(() => {
    let means: Array<LegendMean> = [];
    let viewedMeans: Array<number> = [];
    mainContext.coordinates.forEach((point) => {
      if (viewedMeans.indexOf(point.meanColor) === -1) {
        means.push({
          value: point.meanColor,
          colorToShow: colorScale(point.meanColor),
        });
        viewedMeans.push(point.meanColor);
      }
      // update colorToShow
      point.colorToShow = colorScale(point.meanColor);
    });
    means.sort((meanObject1, meanObject2) => {
      return meanObject1.value - meanObject2.value;
    });
    setMeans(means);
  }, [mainContext.coordinates]);

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
    const previousSubPointsClicked =
      mainContext.pointsClicked[currentIndexOrder!];
    const concaveSelected = mainContext.concaves[currentIndexOrder!][key];

    for (const point of concaveSelected) {
      if (!point.clicked) {
        point.clicked = true;
        previousSubPointsClicked.push(point);
      }
    }

    const previousSimplifiedPoints = mainContext.simplifiedPoints;

    for (const point of previousSimplifiedPoints[currentIndexOrder!]) {
      if (containsCoordinate(previousSubPointsClicked, point)) {
        point.clicked = true;
      }
    }

    mainContext.updateSimplifiedPoints(previousSimplifiedPoints);
    mainContext.setPointsClicked([
      ...mainContext.pointsClicked.slice(0, currentIndexOrder!),
      previousSubPointsClicked,
      ...mainContext.pointsClicked.slice(currentIndexOrder! + 1),
    ]);
    mainContext.setSubmitAutoconj(false);
  };

  if (
    !withConcave &&
    currentIndexOrder === undefined &&
    mainContext.labelColor === ""
  )
    return null;

  if (currentIndexOrder !== undefined) {
    // Autoconjecture app (only show legend for concave)
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {dirsKeys.map((dir, i) => {
          return (
            <Box className="dirs-container" key={`dirs-container-${i}`}>
              <Typography variant="body1" fontSize={14} fontStyle="italic">
                Points families:
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mr: 1,
                }}
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
    // Phoeg app (show legend for colorations &| color values &| concave )
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
                Stars show the points with several color values
              </Typography>
            </Box>
            {/* Coloration possible (average if several color values on one point) */}
            <Box
              className="coloration-container"
              sx={{
                mt: 1,
              }}
            >
              <Typography variant="body1" fontSize={14} fontStyle="italic">
                Color legend calculated from the average colour of a point (not
                clickable):
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 1,
                  maxHeight: 45,
                }}
                style={{
                  overflow: "hidden",
                  overflowY: "scroll", // added scroll
                }}
                flexWrap="wrap"
              >
                {means.map((mean, i) => {
                  return (
                    <Box
                      key={`leg-mean-${i}-${mean}`}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mr: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: 1,
                          backgroundColor: mean.colorToShow,
                          mr: 1,
                          ml: 1,
                        }}
                      />
                      <Typography variant="body1" fontSize={14}>
                        {mean.value}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
            {/* Color values possible */}
            <Box
              className="color-values-container"
              sx={{
                mt: 1,
              }}
            >
              <Typography variant="body1" fontSize={14} fontStyle="italic">
                All possible color values (clickable to show point with this
                value in these colors):
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 1,
                  maxHeight: 45,
                }}
                style={{
                  overflow: "hidden",
                  overflowY: "scroll", // added scroll
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
            </Box>
          </>
        )}
        {/* Directions legend */}
        <Box
          className="coloration-container"
          sx={{
            mt: 1,
          }}
        >
          <Typography variant="body1" fontSize={14} fontStyle="italic">
            Points families:
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: 1,
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
        </Box>
      </Collapse>
    </>
  );
};

export default Legend;

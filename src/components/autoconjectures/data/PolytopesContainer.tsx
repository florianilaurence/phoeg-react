import { Box, Button, Grid, Tooltip, Typography } from "@mui/material";
import { blueGrey, green } from "@mui/material/colors";
import ParentSize from "@visx/responsive/lib/components/ParentSizeModern";
import { useContext, useRef } from "react";
import { Concave } from "../../../store/reducers/main_reducer";
import MainContext from "../../../store/contexts/main_context";
import Chart from "../../chart/Chart";
import { DirectionColors } from "../../chart/DrawConcave";
import { containsCoordinate } from "../../form_fetch/Fetch";
import SubTitle from "../../styles_and_settings/SubTitle";
import ClearIcon from "@mui/icons-material/Clear";
import Legend from "../../chart/legend/Legend";
import { ToPrintProps } from "../NewWindow";

const PolytopesContainer = ({ isToPrint }: ToPrintProps) => {
  const mainContext = useContext(MainContext);
  const keys = Object.keys(mainContext.concaveList[0]);
  const windowSize = useRef([window.innerWidth, window.innerHeight]);

  const onClickLegendConcave = (key: string) => {
    mainContext.setSubmitAutoconj(false);
    const previousSimplifiedPoints = mainContext.simplifiedPoints;
    const previousPointsClicked = mainContext.pointsClicked;

    for (let i = 0; i < mainContext.concaveList.length; i++) {
      const concaveSelected = mainContext.concaveList[i][key];
      const previousSubPointsClicked = previousPointsClicked[i];

      for (const point of concaveSelected) {
        if (!point.clicked) {
          point.clicked = true;
          previousSubPointsClicked.push(point);
        }
      }

      for (const point of previousSimplifiedPoints[i]) {
        if (containsCoordinate(previousSubPointsClicked, point)) {
          point.clicked = true;
        }
      }
    }

    mainContext.setPointsClicked([...previousPointsClicked]);
    mainContext.updateSimplifiedPoints([...previousSimplifiedPoints]);
  };

  const clearAllPointsClicked = () => {
    const previousSimplifiedPoints = mainContext.simplifiedPoints;
    const previousPointsClicked = mainContext.pointsClicked;
    const previousConcaves = mainContext.concaveList;

    for (let i = 0; i < previousConcaves.length; i++) {
      const previousSubPointsClicked = previousPointsClicked[i];

      for (const point of previousSimplifiedPoints[i]) {
        point.clicked = false;
      }

      for (const key of keys) {
        const concaveSelected = previousConcaves[i][key];

        for (const point of concaveSelected) {
          point.clicked = false;
        }
      }

      previousSubPointsClicked.length = 0;
    }

    mainContext.setPointsClicked([...previousPointsClicked]);
    mainContext.updateSimplifiedPoints([...previousSimplifiedPoints]);
  };

  return (
    <Box>
      {!isToPrint && (
        <>
          <Box sx={{ mt: 2, mb: 1 }}>
            <Typography variant="body2" fontSize={14}>
              Click here to select the direction on each polytope at once:
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignContent: "center",
            }}
          >
            <Box sx={{ display: "flex" }}>
              {keys.map((dir: string, i: number) => {
                return (
                  <Box
                    sx={{
                      mr: 1,
                    }}
                    key={`leg-dir-${dir}-${i}`}
                  >
                    <Tooltip
                      title="Click to select all points in all polytopes for this family"
                      placement="top"
                    >
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
                  </Box>
                );
              })}
            </Box>

            <Tooltip
              title="Warning! It deletes all your selection"
              placement="top"
            >
              <Button
                variant="outlined"
                onClick={() => clearAllPointsClicked()}
                startIcon={<ClearIcon />}
                color="error"
                size="small"
              >
                <Typography
                  variant="body1"
                  fontSize={10}
                  color={blueGrey[800]}
                  fontWeight="bold"
                >
                  Clear all
                </Typography>
              </Button>
            </Tooltip>
          </Box>
        </>
      )}

      <Box
        sx={
          isToPrint
            ? { height: "auto" }
            : {
                height: (windowSize.current[1] * 65) / 100 + "px",
                overflow: "auto",
                mb: 1,
                mt: 1,
              }
        }
      >
        <Grid container spacing={2}>
          {mainContext.concaveList.map((concave: Concave, index: number) => {
            return (
              <Grid item xs={6} key={`chart-${index}`}>
                <SubTitle
                  size={18}
                >{`Order ${mainContext.orders[index]}`}</SubTitle>
                {mainContext.minMaxList[index] === null ||
                mainContext.simplifiedPoints[index].length === 0 ? (
                  <Box
                    sx={{
                      height: "300px",
                      backgroundColor: "#fafafa",
                      borderRadius: 5,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="body1"
                      gutterBottom
                      align="center"
                      color={green["A700"]}
                      fontWeight="bold"
                      fontSize={14}
                    >
                      Sorry, there is not data to show for this polytope (maybe
                      constraints are too strong or order is too small).
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <ParentSize>
                      {({ width }) => (
                        <Chart
                          width={width}
                          currentIndexOrder={index}
                          withConcave={true}
                        />
                      )}
                    </ParentSize>
                    <Legend withConcave={true} currentIndexOrder={index} />
                  </Box>
                )}
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};

export default PolytopesContainer;

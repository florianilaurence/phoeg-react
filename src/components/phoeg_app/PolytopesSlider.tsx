import { useContext, useEffect, useReducer, useState } from "react";
import { Grid, IconButton, Slider, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Loading from "../Loading";
import Chart from "../chart/Chart";
import {
  blueGrey,
  deepOrange,
  green,
  grey,
  orange,
} from "@mui/material/colors";
import SubTitle from "../styles_and_settings/SubTitle";
import ParentSize from "@visx/responsive/lib/components/ParentSizeModern";
import MainContext from "../../store/contexts/main_context";
import Legend from "../chart/legend/Legend";
import { scaleLinear } from "@visx/scale";
import ColorationsContext from "../../store/contexts/colorations_context";
import {
  ColorationObject,
  ColorationsReducer,
  initialColorationsState,
} from "../../store/reducers/colorations_reducer";
import {
  changeMaxColoration,
  changeMinColoration,
  resetHasChanged,
  setDataCols,
  updateAColoration,
} from "../../store/actions/colorations_action";
import ClearIcon from "@mui/icons-material/Clear";

export interface Invariant {
  tablename: string;
  datatype: string;
  name: string;
  description: string;
}

interface PolytopesSliderProps {
  withConcave: boolean;
}

const PolytopesSlider = ({ withConcave }: PolytopesSliderProps) => {
  const mainContext = useContext(MainContext);
  const [stateColsObject, dispatchColsObject] = useReducer(
    ColorationsReducer,
    initialColorationsState
  );
  const [circleRadius, setCircleRadius] = useState<number>(4);

  useEffect(() => {
    const element = document.getElementById("polytope-slider");
    if (element) {
      // 👇 Will scroll smoothly to the top of the next section
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const objects: Array<ColorationObject> = [];
    mainContext.viewedAverages.forEach((average, index) => {
      objects.push({
        average: average,
        coloration: colorScale(index),
        indexInAveragesViewed: index,
      });
    });

    setDataCols(objects, dispatchColsObject);
  }, [mainContext.order, mainContext.coordinates]);

  const nextOrder = () => {
    if (mainContext.order < 10) {
      mainContext.setOrder(mainContext.order + 1);
    }
  };

  const prevOrder = () => {
    if (mainContext.order > 1) {
      mainContext.setOrder(mainContext.order - 1);
    }
  };

  const onChangeOrder = (event: any) => {
    mainContext.setOrder(event.target.value);
  };

  const onChangeCircleRadius = (event: any) => {
    setCircleRadius(event.target.value);
  };

  const colorNext = () => {
    switch (mainContext.order) {
      case 7:
        return orange[500];
      case 8:
        return deepOrange[700];
      case 9:
        return deepOrange[900];
      case 10:
        return grey[400];
      default:
        return green[800];
    }
  };

  const colorPrev = () => {
    switch (mainContext.order) {
      case 1:
        return grey[400];
      case 9:
        return orange[500];
      case 10:
        return deepOrange[700];
      default:
        return green[800];
    }
  };

  const colorScale = mainContext.minMax
    ? scaleLinear<string>({
        domain: mainContext.minMax && [
          mainContext.minMax.minColor!,
          mainContext.minMax.maxColor!,
        ],
        range: [stateColsObject.minColoration, stateColsObject.maxColoration],
        clamp: true,
      })
    : scaleLinear<string>({
        domain: [0, 1],
        range: [stateColsObject.minColoration, stateColsObject.maxColoration],
        clamp: true,
      });

  return (
    <Box id="polytope-slider">
      {!stateColsObject.ready ? (
        <Loading height="750px" />
      ) : (
        <ColorationsContext.Provider
          value={{
            ...stateColsObject,

            setDataCols: (objects: Array<ColorationObject>) => {
              setDataCols(objects, dispatchColsObject);
            },
            updateAColoration: (average: number, coloration: string) => {
              updateAColoration(average, coloration, dispatchColsObject);
            },
            changeMinColoration: (newColoration: string) => {
              changeMinColoration(newColoration, dispatchColsObject);
            },
            changeMaxColoration: (newColoration: string) => {
              changeMaxColoration(newColoration, dispatchColsObject);
            },
            resetHasChanged: () => {
              resetHasChanged(dispatchColsObject);
            },
          }}
        >
          <Box sx={{ ml: 1, mr: 1 }} id="polytope-slider">
            <SubTitle>{`Chart for order ${mainContext.order}`}</SubTitle>

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Slider
                value={mainContext.order}
                onChange={(event) => onChangeOrder(event)}
                min={1}
                max={10}
                step={1}
                valueLabelDisplay="auto"
                marks
                sx={{
                  width: "75%",
                  color: "success.main",
                  "& .MuiSlider-thumb": { borderRadius: "1px" },
                }}
              />
            </Box>
            <Grid
              container
              spacing={1}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={0.5}>
                <Tooltip
                  title={
                    mainContext.order === 1
                      ? "No previous order"
                      : "Previous order"
                  }
                  placement="top"
                >
                  <IconButton
                    sx={{
                      color: colorPrev(),
                    }}
                    onClick={prevOrder}
                  >
                    <ArrowBackIosIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item xs={11}>
                {mainContext.minMax === undefined ||
                mainContext.coordinates.length === 0 ? (
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
                      fontSize={27}
                    >
                      Sorry, there is not data to show for this polytope (maybe
                      constraints are too strong or order is too small).
                    </Typography>
                  </Box>
                ) : (
                  <ParentSize>
                    {({ width }) => (
                      <Chart
                        width={width}
                        withConcave={withConcave}
                        circleRadius={circleRadius}
                      />
                    )}
                  </ParentSize>
                )}
              </Grid>
              <Grid item xs={0.5}>
                <Tooltip
                  title={
                    mainContext.order < 7
                      ? "Next order"
                      : mainContext.order === 10
                      ? "No next order"
                      : "Next order, warning !"
                  }
                  placement="top"
                >
                  <IconButton
                    sx={{
                      fontSize: 40,
                      color: colorNext(),
                    }}
                    onClick={nextOrder}
                  >
                    <ArrowForwardIosIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
            <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
              <Typography variant="body1" gutterBottom color={blueGrey[800]}>
                Circle radius:
              </Typography>
              <Slider
                size="small"
                sx={{
                  width: "50%",
                  color: "success.main",
                }}
                min={1}
                max={15}
                step={1}
                value={circleRadius}
                onChange={onChangeCircleRadius}
                aria-label="Small"
                valueLabelDisplay="auto"
              />
            </Box>
            {withConcave && mainContext.concave && (
              <Legend withConcave={withConcave} colorScale={colorScale} />
            )}

            {!withConcave && (
              <Legend withConcave={withConcave} colorScale={colorScale} />
            )}

            {/* Show which point is clicked */}
            {mainContext.pointClicked && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  mt: 1,
                }}
              >
                <Typography fontSize={14} fontStyle="italic" align="center">
                  Clicked point: x = {mainContext.pointClicked.x.numerator}, y =
                  {mainContext.pointClicked.y.numerator}, color =
                  {mainContext.pointClicked.colors[0]}, multiplicity =
                  {mainContext.pointClicked.mults[0]}
                </Typography>
                <Tooltip title="Clear clicked point" placement="top">
                  <IconButton
                    onClick={() => mainContext.setPointClicked(null)}
                    size="small"
                    color="success"
                  >
                    <ClearIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>
        </ColorationsContext.Provider>
      )}
    </Box>
  );
};

export default PolytopesSlider;

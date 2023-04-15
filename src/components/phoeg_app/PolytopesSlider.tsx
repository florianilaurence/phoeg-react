import { useContext } from "react";
import { Grid, Slider, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Loading from "../Loading";
import Chart from "../chart/Chart";
import Title from "../styles_and_settings/Title";
import { deepOrange, green, grey, orange } from "@mui/material/colors";
import SubTitle from "../styles_and_settings/SubTitle";
import ParentSize from "@visx/responsive/lib/components/ParentSizeModern";
import MainContext from "../../store/utils/main_context";

export interface Invariant {
  tablename: string;
  datatype: number;
  name: string;
  description: string;
}

interface PolytopesSliderProps {
  withConcave: boolean;
}

const PolytopesSlider = ({ withConcave }: PolytopesSliderProps) => {
  const mainContext = useContext(MainContext);

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

  return (
    <>
      {mainContext.isSubmit && <Title title="Polytope" />}
      {mainContext.isSubmit && mainContext.isLoading && (
        <Loading height="1000px" />
      )}
      {mainContext.isSubmit && !mainContext.isLoading && (
        <Box sx={{ ml: 1, mr: 1 }}>
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
                <ArrowBackIosIcon
                  sx={{ fontSize: 40, color: colorPrev() }}
                  onClick={prevOrder}
                />
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
                    <Chart width={width} withConcave={withConcave} />
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
                <ArrowForwardIosIcon
                  sx={{
                    fontSize: 40,
                    color: colorNext(),
                  }}
                  onClick={nextOrder}
                />
              </Tooltip>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
};

export default PolytopesSlider;

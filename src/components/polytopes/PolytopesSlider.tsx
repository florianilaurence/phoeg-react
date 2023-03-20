import { useContext } from "react";
import { Grid, Tooltip } from "@mui/material";
import { Box } from "@mui/system";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Loading from "../Loading";
import Chart from "./chart/Chart";
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

const Polytopes = () => {
  const mainContext = useContext(MainContext);

  const nextOrder = () => {
    if (mainContext.order < 10) {
      mainContext.setOrder(mainContext.order + 1);
      mainContext.setIsLoading(false);
      mainContext.setLegendClicked(null);
      mainContext.setPointClicked(null);
    }
  };

  const prevOrder = () => {
    if (mainContext.order > 1) {
      const newOrder = mainContext.order - 1;
      mainContext.setOrder(newOrder);
      mainContext.setIsLoading(false);
      mainContext.setLegendClicked(null);
      mainContext.setPointClicked(null);
    }
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
          <SubTitle subtitle={`Chart for order ${mainContext.order}`} />
          <Grid
            container
            spacing={1}
            alignItems="center"
            justifyContent="center"
            sx={{ mt: 1, mb: 1 }}
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
              <ParentSize>{({ width }) => <Chart width={width} />}</ParentSize>
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

export default Polytopes;

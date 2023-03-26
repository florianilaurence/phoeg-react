import { Box, Grid, Typography } from "@mui/material";
import { green } from "@mui/material/colors";
import ParentSize from "@visx/responsive/lib/components/ParentSizeModern";
import { useContext } from "react";
import { Concave } from "../../../store/reducers/main_reducer";
import MainContext from "../../../store/utils/main_context";
import Chart from "../../polytopes/chart/Chart";
import SubTitle from "../../styles_and_settings/SubTitle";

const PolytopesContainer = () => {
  const mainContext = useContext(MainContext);

  return (
    <Grid container spacing={2}>
      {mainContext.concaves.map((concave: Concave, index: number) => {
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
              <ParentSize>
                {({ width }) => (
                  <Chart
                    width={width}
                    currentIndexOrder={index}
                    withConcave={true}
                  />
                )}
              </ParentSize>
            )}
          </Grid>
        );
      })}
    </Grid>
  );
};

export default PolytopesContainer;

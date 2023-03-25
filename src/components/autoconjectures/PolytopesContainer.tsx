import { Grid } from "@mui/material";
import ParentSize from "@visx/responsive/lib/components/ParentSizeModern";
import { useContext } from "react";
import { Concave } from "../../store/reducers/main_reducer";
import MainContext from "../../store/utils/main_context";
import Chart from "../polytopes/chart/Chart";
import SubTitle from "../styles_and_settings/SubTitle";

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
            <ParentSize>
              {({ width }) => (
                <Chart
                  width={width}
                  currentIndexOrder={index}
                  withConcave={true}
                />
              )}
            </ParentSize>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default PolytopesContainer;

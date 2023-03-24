import { Box, Button, Grid } from "@mui/material";
import ParentSize from "@visx/responsive/lib/components/ParentSizeModern";
import { useContext } from "react";
import { Concave } from "../../store/reducers/main_reducer";
import MainContext from "../../store/utils/main_context";
import Loading from "../Loading";
import Chart from "../polytopes/chart/Chart";
import SubTitle from "../styles_and_settings/SubTitle";
import Title from "../styles_and_settings/Title";
import SendTimeExtensionIcon from "@mui/icons-material/SendTimeExtension";

const PolytopesContainer = () => {
  const mainContext = useContext(MainContext);
  const handleSubmit = () => {
    console.log("Submit");
    console.log(mainContext.pointsClicked);
  };

  return (
    <>
      {mainContext.isSubmit && <Title title="Polytopes" />}
      {mainContext.isSubmit && mainContext.isLoading && (
        <Loading height="1000px" />
      )}
      {mainContext.isSubmit &&
        !mainContext.isLoading &&
        mainContext.concaves.length > 0 &&
        mainContext.minMaxList.length > 0 &&
        mainContext.envelopes.length > 0 && (
          <>
            <Grid container spacing={2}>
              {mainContext.concaves.map((concave: Concave, index: number) => {
                return (
                  <Grid item xs={6} key={`chart-${index}`}>
                    <SubTitle
                      size={18}
                    >{`Order ${mainContext.orders[index]}`}</SubTitle>
                    <ParentSize>
                      {({ width }) => (
                        <Chart width={width} currentIndexOrder={index} />
                      )}
                    </ParentSize>
                  </Grid>
                );
              })}
            </Grid>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                color="success"
                endIcon={<SendTimeExtensionIcon />}
                onClick={handleSubmit}
              >
                Generate autoconojectures
              </Button>
            </Box>
          </>
        )}
    </>
  );
};

export default PolytopesContainer;

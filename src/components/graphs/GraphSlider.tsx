import { Grid, Paper, Tooltip } from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import { useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SubSubTitle from "../styles_and_settings/SubSubTitle";
import NewGraph from "./NewGraph";
import ParentSize from "@visx/responsive/lib/components/ParentSizeModern";

interface GraphSliderProps {
  list: Array<string>;
  firstToShow: number;
}

const GraphSlider = ({ list, firstToShow }: GraphSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(firstToShow);

  const handleClickPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(list.length - 1);
    }
  };

  const handleClickNext = () => {
    setCurrentIndex((currentIndex + 1) % list.length);
  };

  return (
    <Paper elevation={1} sx={{ p: 1, pb: 2, backgroundColor: blueGrey[50] }}>
      <SubSubTitle annex={currentIndex + 1 + "/" + list.length}>
        Graph {list[currentIndex]}
      </SubSubTitle>
      <Grid container spacing={1} alignItems="center" justifyContent="center">
        <Grid item xs={0.7}>
          <Tooltip title="Previous" placement="left">
            <ArrowBackIosIcon
              sx={{ fontSize: 20, color: blueGrey[600] }}
              onClick={handleClickPrevious}
            />
          </Tooltip>
        </Grid>
        <Grid item xs={10.6}>
          <ParentSize>
            {({ width, height }) => (
              <NewGraph width={width} sign={list[currentIndex]} />
            )}
          </ParentSize>
        </Grid>
        <Grid item xs={0.7}>
          <Tooltip title="Next" placement="right">
            <ArrowForwardIosIcon
              sx={{ fontSize: 20, color: blueGrey[600] }}
              onClick={handleClickNext}
            />
          </Tooltip>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default GraphSlider;

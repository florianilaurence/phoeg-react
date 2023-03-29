import { Box, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import ConjContext from "../../../store/utils/conj_context";
import MainContext from "../../../store/utils/main_context";
import SubTitle from "../../styles_and_settings/SubTitle";
import { inequality, main_func, searched_f } from "./utils/autoconjectures";

const ConjectureResults = () => {
  const conjContext = useContext(ConjContext);
  const mainContext = useContext(MainContext);
  const [res, setRes] = useState<null | string>(null);

  useEffect(() => {
    let temp = "";
    if (conjContext.Fs[0].active) {
      temp += computeConjecture(0);
    }
    if (conjContext.Fs[0].active && conjContext.Fs[1].active) {
      temp += " ╳ ";
    }
    if (conjContext.Fs[1].active) {
      temp += computeConjecture(1);
    }
    setRes(temp);
  }, []);

  const computeConjecture = (i: number) => {
    const f = conjContext.Fs[i].isFYSearched ? searched_f.FY : searched_f.FX;
    const ineq = conjContext.Fs[i].isMore ? inequality.MORE : inequality.LESS;

    return main_func(mainContext.pointsClicked, mainContext.orders, f, ineq);
  };

  return (
    <Box>
      <SubTitle> Your results </SubTitle>
      <Typography variant="body1" sx={{ mt: 2 }}>
        {res}
      </Typography>
    </Box>
  );
};

export default ConjectureResults;

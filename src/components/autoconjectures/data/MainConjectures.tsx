import MainContext from "../../../store/utils/main_context";
import { useContext, useEffect, useState } from "react";
import {
  inequality,
  main_func,
  searched_f,
} from "../result/utils/autoconjectures";
import { ConcavesRefactoredProps } from "./MyTabs";
import { Grid, Paper, Typography } from "@mui/material";
import SubSubTitle from "../../styles_and_settings/SubSubTitle";

const allParams = {
  minY: [{ f: searched_f.FX, ineq: inequality.MORE }],
  minXminY: [
    { f: searched_f.FX, ineq: inequality.MORE },
    { f: searched_f.FY, ineq: inequality.MORE },
  ],
  minX: [{ f: searched_f.FY, ineq: inequality.MORE }],
  maxXminY: [
    { f: searched_f.FX, ineq: inequality.MORE },
    { f: searched_f.FY, ineq: inequality.LESS },
  ],
  maxY: [{ f: searched_f.FX, ineq: inequality.LESS }],
  maxXmaxY: [
    { f: searched_f.FX, ineq: inequality.LESS },
    { f: searched_f.FY, ineq: inequality.LESS },
  ],
  maxX: [{ f: searched_f.FY, ineq: inequality.LESS }],
  minXmaxY: [
    { f: searched_f.FX, ineq: inequality.MORE },
    { f: searched_f.FY, ineq: inequality.LESS },
  ],
};

interface ResultConjectures {
  minY: string;
  minXminY: string;
  minX: string;
  maxXminY: string;
  maxX: string;
  maxXmaxY: string;
  maxY: string;
  minXmaxY: string;
}

const initialResultConjectures: ResultConjectures = {
  minY: "",
  minXminY: "",
  minX: "",
  maxXminY: "",
  maxX: "",
  maxXmaxY: "",
  maxY: "",
  minXmaxY: "",
};

const MainConjectures = ({ concavesRefactored }: ConcavesRefactoredProps) => {
  const mainContext = useContext(MainContext);
  const [resultConjectures, setResultConjectures] = useState<ResultConjectures>(
    initialResultConjectures
  );

  const keys = Object.keys(initialResultConjectures);

  useEffect(() => {
    const tempResultConjectures: ResultConjectures = {
      ...initialResultConjectures,
    };

    for (let key of keys) {
      const params = allParams[key as keyof ResultConjectures];
      if (params.length === 1) {
        tempResultConjectures[key as keyof ResultConjectures] = main_func(
          concavesRefactored[key as keyof ResultConjectures],
          mainContext.orders,
          params[0].f,
          params[0].ineq
        );
      } else if (params.length === 2) {
        tempResultConjectures[key as keyof ResultConjectures] =
          main_func(
            concavesRefactored[key as keyof ResultConjectures],
            mainContext.orders,
            params[0].f,
            params[0].ineq
          ) +
          " ||" +
          main_func(
            concavesRefactored[key as keyof ResultConjectures],
            mainContext.orders,
            params[1].f,
            params[1].ineq
          );
      }
    }
    setResultConjectures(tempResultConjectures);
  }, [mainContext.concaves]);

  return (
    <Grid container spacing={2}>
      {keys.map((key) => {
        return (
          <Grid key={`key-${key}`} item xs={3}>
            <Paper>
              <SubSubTitle annex={""}>{key}</SubSubTitle>
              <Typography variant="body1" fontSize={14}>
                {resultConjectures[key as keyof ResultConjectures]}
              </Typography>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default MainConjectures;

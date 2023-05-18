import MainContext from "../../../store/utils/main_context";
import { useContext, useEffect, useReducer, useState } from "react";
import {
  inequality_latex,
  main_func,
  searched_f,
} from "../result/utils/autoconjectures";
import { Box, Grid, Paper } from "@mui/material";
import SubSubTitle from "../../styles_and_settings/SubSubTitle";
import Loading from "../../Loading";
import RenderOneConjecture from "../result/RenderOneConjecture";

export const allParams = {
  minX: [{ f: searched_f.FY, ineq: inequality_latex.MORE }],
  maxX: [{ f: searched_f.FY, ineq: inequality_latex.LESS }],
  minY: [{ f: searched_f.FX, ineq: inequality_latex.MORE }],
  maxY: [{ f: searched_f.FX, ineq: inequality_latex.LESS }],
  minXminY: [
    { f: searched_f.FY, ineq: inequality_latex.MORE },
    { f: searched_f.FX, ineq: inequality_latex.MORE },
  ],
  minXmaxY: [
    { f: searched_f.FY, ineq: inequality_latex.MORE },
    { f: searched_f.FX, ineq: inequality_latex.LESS },
  ],
  maxXminY: [
    { f: searched_f.FY, ineq: inequality_latex.LESS },
    { f: searched_f.FX, ineq: inequality_latex.MORE },
  ],
  maxXmaxY: [
    { f: searched_f.FY, ineq: inequality_latex.LESS },
    { f: searched_f.FX, ineq: inequality_latex.LESS },
  ],
};

interface ResultConjectures {
  minX: Array<string>;
  maxX: Array<string>;
  minY: Array<string>;
  maxY: Array<string>;
  minXminY: Array<string>;
  minXmaxY: Array<string>;
  maxXminY: Array<string>;
  maxXmaxY: Array<string>;
}

const initialResultConjectures: ResultConjectures = {
  minX: [],
  maxX: [],
  minY: [],
  maxY: [],
  minXminY: [],
  minXmaxY: [],
  maxXminY: [],
  maxXmaxY: [],
};

enum ConjAction {
  SET_DATA,
}

const MainConjectures = () => {
  const mainContext = useContext(MainContext);
  const [isLoading, setIsLoading] = useState(true);

  const conjReducer = (state: ResultConjectures, action: any) => {
    switch (action.type) {
      case ConjAction.SET_DATA:
        return action.payload;
      default:
        return state;
    }
  };

  const [stateConj, dispatchConj] = useReducer(
    conjReducer,
    initialResultConjectures
  );

  const keys = Object.keys(initialResultConjectures);

  const inRational =
    mainContext.typeX === "rational" ||
    mainContext.typeY === "rational" ||
    (mainContext.typeX === "integer" && mainContext.typeY === "integer");
  const computeConjectures = async () => {
    const tempResultConjectures: ResultConjectures = {
      minX: [],
      maxX: [],
      minY: [],
      maxY: [],
      minXminY: [],
      minXmaxY: [],
      maxXminY: [],
      maxXmaxY: [],
    };

    for (let key of keys) {
      const params = allParams[key as keyof ResultConjectures];
      console.log(key, params);
      tempResultConjectures[key as keyof ResultConjectures].push(
        main_func(
          mainContext.concaves[key as keyof ResultConjectures],
          mainContext.orders,
          params[0].f,
          params[0].ineq,
          true,
          inRational,
          inRational ? 0 : 2
        )
      );
      if (params.length === 2) {
        tempResultConjectures[key as keyof ResultConjectures].push(
          main_func(
            mainContext.concaves[key as keyof ResultConjectures],
            mainContext.orders,
            params[1].f,
            params[1].ineq,
            true,
            inRational,
            inRational ? 0 : 2
          )
        );
      }
    }

    return tempResultConjectures;
  };

  useEffect(() => {
    computeConjectures().then((res) => {
      dispatchConj({
        type: ConjAction.SET_DATA,
        payload: res,
      });
      setIsLoading(false);
    });
  }, [mainContext.concaves, isLoading]);

  if (isLoading) {
    return <Loading height={"250px"} />;
  }

  return (
    <Grid container spacing={1}>
      {keys.map((key) => {
        return (
          <Grid key={`key-${key}`} item xs={6}>
            <Paper>
              <SubSubTitle annex={""}>{key}</SubSubTitle>
              {stateConj[key].map((conj: string, index: number) => {
                return (
                  <Box
                    key={`key-${key}-${index}`}
                    sx={{
                      display: "flex",
                      direction: "row",
                      alignItems: "center",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <RenderOneConjecture
                      maxLenEq={75}
                      conjecture={conj}
                      direction={key}
                    />
                  </Box>
                );
              })}
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default MainConjectures;

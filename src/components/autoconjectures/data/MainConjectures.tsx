import MainContext from "../../../store/utils/main_context";
import { useContext, useEffect, useReducer, useState } from "react";
import {
  inequality_latex,
  main_func,
  searched_f,
} from "../result/utils/autoconjectures";
import { ConcavesRefactoredProps } from "./MyTabs";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
} from "@mui/material";
import SubSubTitle from "../../styles_and_settings/SubSubTitle";
import Loading from "../../Loading";
import RenderOneConjecture from "../result/RenderOneConjecture";

export const allParams = {
  minY: [{ f: searched_f.FX, ineq: inequality_latex.MORE }],
  minXminY: [
    { f: searched_f.FX, ineq: inequality_latex.MORE },
    { f: searched_f.FY, ineq: inequality_latex.MORE },
  ],
  minX: [{ f: searched_f.FY, ineq: inequality_latex.MORE }],
  maxXminY: [
    { f: searched_f.FX, ineq: inequality_latex.MORE },
    { f: searched_f.FY, ineq: inequality_latex.LESS },
  ],
  maxY: [{ f: searched_f.FX, ineq: inequality_latex.LESS }],
  maxXmaxY: [
    { f: searched_f.FX, ineq: inequality_latex.LESS },
    { f: searched_f.FY, ineq: inequality_latex.LESS },
  ],
  maxX: [{ f: searched_f.FY, ineq: inequality_latex.LESS }],
  minXmaxY: [
    { f: searched_f.FX, ineq: inequality_latex.MORE },
    { f: searched_f.FY, ineq: inequality_latex.LESS },
  ],
};

interface ResultConjectures {
  minY: Array<string>;
  minXminY: Array<string>;
  minX: Array<string>;
  maxXminY: Array<string>;
  maxX: Array<string>;
  maxXmaxY: Array<string>;
  maxY: Array<string>;
  minXmaxY: Array<string>;
}

const initialResultConjectures: ResultConjectures = {
  minY: [],
  minXminY: [],
  minX: [],
  maxXminY: [],
  maxX: [],
  maxXmaxY: [],
  maxY: [],
  minXmaxY: [],
};

enum ConjAction {
  SET_DATA,
}

const MainConjectures = ({ concavesRefactored }: ConcavesRefactoredProps) => {
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

  const computeConjectures = async () => {
    const tempResultConjectures: ResultConjectures = {
      ...initialResultConjectures,
    };

    for (let key of keys) {
      const params = allParams[key as keyof ResultConjectures];
      if (params.length === 1) {
        tempResultConjectures[key as keyof ResultConjectures].push(
          main_func(
            concavesRefactored[key as keyof ResultConjectures],
            mainContext.orders,
            params[0].f,
            params[0].ineq,
            true
          )
        );
      } else if (params.length === 2) {
        tempResultConjectures[key as keyof ResultConjectures].push(
          main_func(
            concavesRefactored[key as keyof ResultConjectures],
            mainContext.orders,
            params[0].f,
            params[0].ineq,
            true
          )
        );
        tempResultConjectures[key as keyof ResultConjectures].push(
          main_func(
            concavesRefactored[key as keyof ResultConjectures],
            mainContext.orders,
            params[1].f,
            params[1].ineq,
            true
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

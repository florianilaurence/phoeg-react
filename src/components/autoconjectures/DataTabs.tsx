import MainContext from "../../store/utils/main_context";
import { useContext, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import TableDirection from "./TableDirection";
import { Concave, CoordinateAutoconj } from "../../store/reducers/main_reducer";

interface ConcaveRefactored {
  minY: Array<Array<CoordinateAutoconj>>;
  minXminY: Array<Array<CoordinateAutoconj>>;
  minX: Array<Array<CoordinateAutoconj>>;
  minXmaxY: Array<Array<CoordinateAutoconj>>;
  maxY: Array<Array<CoordinateAutoconj>>;
  maxXmaxY: Array<Array<CoordinateAutoconj>>;
  maxX: Array<Array<CoordinateAutoconj>>;
  maxXminY: Array<Array<CoordinateAutoconj>>;
}

const DataTabs = () => {
  const mainContext = useContext(MainContext);
  const initLists = mainContext.orders.map(
    () => new Array<CoordinateAutoconj>()
  );
  const [concavesRefactored, setConcavesRefactored] =
    useState<ConcaveRefactored>({
      minY: [...initLists], // Not just initLists, but a copy of it (else reference problem)
      minXminY: [...initLists],
      minX: [...initLists],
      minXmaxY: [...initLists],
      maxY: [...initLists],
      maxXmaxY: [...initLists],
      maxX: [...initLists],
      maxXminY: [...initLists],
    });

  const keys = Object.keys(concavesRefactored);

  const regroupByDirection = (concaves: Array<Concave>) => {
    const initLists = mainContext.orders.map(
      () => new Array<CoordinateAutoconj>()
    );

    const tempConcavesRefactored: ConcaveRefactored = {
      minY: [...initLists], // Not just initLists, but a copy of it (else reference problem)
      minXminY: [...initLists],
      minX: [...initLists],
      minXmaxY: [...initLists],
      maxY: [...initLists],
      maxXmaxY: [...initLists],
      maxX: [...initLists],
      maxXminY: [...initLists],
    };

    for (let key of keys) {
      for (let n = 0; n < concaves.length; n++) {
        tempConcavesRefactored[key][n] = concaves[n][key];
      }
    }
    return tempConcavesRefactored;
  };

  useEffect(() => {
    if (mainContext.concaves.length > 0) {
      setConcavesRefactored(regroupByDirection(mainContext.concaves));
    }
  }, [mainContext.concaves]);

  return (
    <Grid container spacing={1}>
      {keys.map((key) => {
        return (
          <Grid item xs={4} key={`table-${key}`}>
            <TableDirection title={key} data={concavesRefactored[key]} />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default DataTabs;

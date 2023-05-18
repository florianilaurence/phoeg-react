import { Box } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import ConjContext from "../../../store/utils/conj_context";
import MainContext from "../../../store/utils/main_context";
import SubTitle from "../../styles_and_settings/SubTitle";
import {
  inequality_latex,
  main_func,
  searched_f,
} from "./utils/autoconjectures";
import RenderOneConjecture from "./RenderOneConjecture";
import { CoordinateAutoconj } from "../../../store/reducers/main_reducer";

const ConjectureResults = () => {
  const conjContext = useContext(ConjContext);
  const mainContext = useContext(MainContext);
  const [res, setRes] = useState<Array<string>>([]);

  useEffect(() => {
    let temp: Array<string> = [];
    if (conjContext.Fs[0].active) {
      temp.push(computeConjecture(0));
    }
    if (conjContext.Fs[1].active) {
      temp.push(computeConjecture(1));
    }
    setRes(temp);
  }, [mainContext.submitAutoconj]);

  const computeConjecture = (i: number) => {
    const f = conjContext.Fs[i].isFYSearched ? searched_f.FY : searched_f.FX;
    const ineq = conjContext.Fs[i].isMore
      ? inequality_latex.MORE
      : inequality_latex.LESS;
    const { newOrders, newPointsClicked } = simplifyListWithoutSelectedPoint(
      mainContext.orders,
      mainContext.pointsClicked
    );
    const inRational =
      mainContext.typeX === "rational" ||
      mainContext.typeY === "rational" ||
      (mainContext.typeX === "integer" && mainContext.typeY === "integer");

    return main_func(
      newPointsClicked,
      newOrders,
      f,
      ineq,
      true,
      inRational,
      inRational ? 0 : 2 //TODO: change this, not hardcode value 2
    );
  };

  const simplifyListWithoutSelectedPoint = (
    orders: Array<number>,
    pointsClicked: Array<Array<CoordinateAutoconj>>
  ) => {
    const resOrders: Array<number> = [];
    const resPoints: Array<Array<CoordinateAutoconj>> = [];

    for (let i = 0; i < orders.length; i++) {
      if (pointsClicked[i].length > 0) {
        resOrders.push(orders[i]);
        resPoints.push(pointsClicked[i]);
      }
    }

    return { newOrders: resOrders, newPointsClicked: resPoints };
  };

  return (
    <Box>
      <SubTitle> Your result{res.length < 2 ? "" : "s"} </SubTitle>
      {res.map((conj) => (
        <div key={conj}>
          <RenderOneConjecture maxLenEq={150} conjecture={conj} />
        </div>
      ))}
    </Box>
  );
};

export default ConjectureResults;

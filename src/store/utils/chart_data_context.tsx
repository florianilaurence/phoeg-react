import { createContext } from "react";
import {
  ChartData,
  Coordinate,
  initialChartDataState,
} from "../reducers/chart_data_reducer";

const ChartDataContext = createContext({
  ...initialChartDataState,
  handleSetData: (data: ChartData) => {},
  handleSetError: (data: string) => {},
  handleSetPointClicked: (data: Coordinate) => {},
  handleSetLegendClicked: (data: number | null) => {},
});

export default ChartDataContext;

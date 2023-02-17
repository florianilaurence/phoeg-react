import { createContext } from "react";
import {
  ChartData,
  initialChartDataState,
} from "../reducers/chart_data_reducer";

const ChartDataContext = createContext({
  ...initialChartDataState,
  handleSetData: (data: ChartData) => {},
  handleSetError: (data: string) => {},
});

export default ChartDataContext;

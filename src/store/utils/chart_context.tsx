import { createContext } from "react";
import { initialChartState } from "../reducers/request_chart_reducer";

const ChartContext = createContext({
  ...initialChartState,
  handleLabelX: (data: any) => {},
  handleLabelY: (data: any) => {},
  handleLabelColor: (data: any) => {},
  handleConstraints: (data: any) => {},
  handleAdvancedConstraints: (data: any) => {},
  handleIsSubmit: (data: any) => {},
});

export default ChartContext;

import { ChartAction } from "../actions/request_chart_action";

export interface RequestChart {
  order: number;
  labelX: string;
  labelY: string;
  labelColor: string;
  constraints: string;
  advancedConstraints: string;
  isSubmit: boolean;
}

export const initialChartState = {
  order: 7,
  labelX: "",
  labelY: "",
  labelColor: "",
  constraints: "",
  advancedConstraints: "",
  isSubmit: false,
};

export const RequestChartReducer = (
  state: RequestChart = initialChartState,
  action: any
) => {
  switch (action.type) {
    case ChartAction.ORDER:
      return { ...state, order: action.newOrder };
    case ChartAction.LABEL_X:
      return { ...state, labelX: action.payload };
    case ChartAction.LABEL_Y:
      return { ...state, labelY: action.payload };
    case ChartAction.LABEL_COLOR:
      return { ...state, labelColor: action.payload };
    case ChartAction.CONSTRAINTS:
      return { ...state, constraints: action.payload };
    case ChartAction.ADVANCED_CONSTRAINTS:
      return { ...state, advancedConstraints: action.payload };
    case ChartAction.IS_SUBMIT:
      return { ...state, isSubmit: action.payload };
    default:
      return state;
  }
};

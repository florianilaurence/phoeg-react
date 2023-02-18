import { ChartAction } from "../actions/request_chart_action";

export interface RequestChart {
  order: number;
  labelX: string;
  labelY: string;
  labelColor: string;
  constraints: string;
  advancedConstraints: string;
  isSubmit: boolean;
  isLoading: boolean;
}

export const initialChartState = {
  order: 7,
  labelX: "",
  labelY: "",
  labelColor: "",
  constraints: "",
  advancedConstraints: "",
  isSubmit: false,
  isLoading: false,
};

export const RequestChartReducer = (
  state: RequestChart = initialChartState,
  action: any
) => {
  switch (action.type) {
    case ChartAction.ORDER:
      return { ...state, order: action.newOrder };
    case ChartAction.LABEL_X:
      return { ...state, labelX: action.label };
    case ChartAction.LABEL_Y:
      return { ...state, labelY: action.label };
    case ChartAction.LABEL_COLOR:
      return { ...state, labelColor: action.label };
    case ChartAction.CONSTRAINTS:
      return { ...state, constraints: action.constraints };
    case ChartAction.ADVANCED_CONSTRAINTS:
      return { ...state, advancedConstraints: action.advancedConstraints };
    case ChartAction.IS_SUBMIT:
      return { ...state, isSubmit: action.isSubmit };
    case ChartAction.IS_LOADING:
      return { ...state, isLoading: action.isLoading };
    default:
      return state;
  }
};

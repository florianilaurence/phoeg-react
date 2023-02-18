import { GraphAction } from "../actions/request_graph_action";

export interface RequestGraph {
  valueX: number;
  valueY: number;
  is_selected: boolean;
}

export const initialGraphState = {
  valueX: 0,
  valueY: 0,
  is_selected: false,
};

export const RequestGraphReducer = (
  state: RequestGraph = initialGraphState,
  action: any
) => {
  switch (action.type) {
    case GraphAction.VALUE_X:
      return { ...state, valueX: action.valueX };
    case GraphAction.VALUE_Y:
      return { ...state, valueY: action.valueY };
    case GraphAction.IS_SELECTED:
      return { ...state, is_selected: action.isSelected };
    default:
      return state;
  }
};

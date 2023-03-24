import {
  ChartData,
  Concave,
  Coordinate,
  CoordinateAutoconj,
  MinMax,
} from "../reducers/main_reducer";

export enum MainAction {
  // Common actions for phoeg app and conjecture app
  ORDER,
  LABEL_X,
  LABEL_Y,
  LABEL_COLOR,
  CONSTRAINTS,
  ADVANCED_CONSTRAINTS,
  IS_SUBMIT,
  IS_LOADING,

  SET_DATA,

  SET_POINT_CLICKED,
  SET_LEGEND_CLICKED,

  SET_ERROR,
  RESET,

  // Special actions for conjecture app
  ORDERS,
  INIT_POINTS_CLICKED,
  SET_CONCAVES,
  SET_ENVELOPES,
  SET_MIN_MAX_LIST,
  SET_POINTS_CLICKED,
}

// Common actions for phoeg app and conjecture app
export const setOrder = (order: number, dispatch: any) => {
  dispatch({
    type: MainAction.ORDER,
    order: order,
  });
};

export const setLabelX = (labelX: string, dispatch: any) => {
  dispatch({
    type: MainAction.LABEL_X,
    labelX: labelX,
  });
};

export const setLabelY = (labelY: string, dispatch: any) => {
  dispatch({
    type: MainAction.LABEL_Y,
    labelY: labelY,
  });
};

export const setLabelColor = (labelColor: string, dispatch: any) => {
  dispatch({
    type: MainAction.LABEL_COLOR,
    labelColor: labelColor,
  });
};

export const setConstraints = (constraints: string, dispatch: any) => {
  dispatch({
    type: MainAction.CONSTRAINTS,
    constraints: constraints,
  });
};

export const setAdvancedConstraints = (
  advancedConstraints: string,
  dispatch: any
) => {
  dispatch({
    type: MainAction.ADVANCED_CONSTRAINTS,
    advancedConstraints: advancedConstraints,
  });
};

export const setIsSubmit = (isSubmit: boolean, dispatch: any) => {
  dispatch({
    type: MainAction.IS_SUBMIT,
    isSubmit: isSubmit,
  });
};

export const setIsLoading = (isLoading: boolean, dispatch: any) => {
  dispatch({
    type: MainAction.IS_LOADING,
    isLoading: isLoading,
  });
};

export const setData = (data: ChartData, dispatch: any) => {
  dispatch({
    type: MainAction.SET_DATA,
    data: data,
  });
};

export const setPointClicked = (
  coordinate: Coordinate | null,
  dispatch: any
) => {
  dispatch({
    type: MainAction.SET_POINT_CLICKED,
    coordinate: coordinate,
  });
};

export const setLegendClicked = (
  legendClicked: number | null,
  dispatch: any
) => {
  dispatch({
    type: MainAction.SET_LEGEND_CLICKED,
    legendClicked: legendClicked,
  });
};

export const setError = (message: string, dispatch: any) => {
  dispatch({
    type: MainAction.SET_ERROR,
    message: message,
  });
};

export const reset = (dispatch: any) => {
  dispatch({
    type: MainAction.RESET,
  });
};

// Special actions for conjecture app

export const setOrders = (orders: number[], dispatch: any) => {
  dispatch({
    type: MainAction.ORDERS,
    orders: orders,
  });
};

export const initPointsClicked = (orders: number[], dispatch: any) => {
  dispatch({
    type: MainAction.INIT_POINTS_CLICKED,
    orders: orders,
  });
};

export const setConcaves = (concaves: Array<Concave>, dispatch: any) => {
  dispatch({
    type: MainAction.SET_CONCAVES,
    concaves: concaves,
  });
};

export const setEnvelopes = (
  envelopes: Array<Array<Coordinate>>,
  dispatch: any
) => {
  dispatch({
    type: MainAction.SET_ENVELOPES,
    envelopes: envelopes,
  });
};

export const setMinMaxList = (minMaxList: Array<MinMax>, dispatch: any) => {
  dispatch({
    type: MainAction.SET_MIN_MAX_LIST,
    minMaxList: minMaxList,
  });
};

export const setPointsClicked = (
  pointsClicked: Array<Array<CoordinateAutoconj>>,
  dispatch: any
) => {
  dispatch({
    type: MainAction.SET_POINTS_CLICKED,
    pointsClicked: pointsClicked,
  });
};

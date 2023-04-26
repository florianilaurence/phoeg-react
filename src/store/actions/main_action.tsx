import {
  ChartData,
  Concave,
  Concaves,
  CoordinateAutoconj,
  CoordinateGrouped,
  MinMax,
  SimplifiedCoordinate,
} from "../reducers/main_reducer";

export enum MainAction {
  // Actions for phoeg app
  ORDER,
  SET_DATA,
  SET_POINT_CLICKED,
  SET_LEGEND_CLICKED,

  // Common actions for phoeg app and conjecture app
  LABEL_X,
  LABEL_Y,
  LABEL_COLOR,
  CONSTRAINTS,
  ADVANCED_CONSTRAINTS,
  IS_SUBMIT,
  IS_LOADING,
  SET_ERROR,

  // Actions for conjecture app
  ORDERS,
  SET_DATA_AUTOCONJ, // set concaves, enveloppes, simplified points and minMax (init points clicked)
  SET_POINTS_CLICKED,
  SET_SUBMIT_AUTOCONJ,
  UPDATE_SIMPLIFIED_POINTS,

  // Common actions for phoeg app and conjecture app --> Clear data (change order) and reset (change field in form)
  CLEAR_DATA,
  RESET,
}

// Functions for phoeg app
export const setOrder = (order: number, dispatch: any) => {
  dispatch({
    type: MainAction.ORDER,
    order: order,
  });
};

export const setData = (data: ChartData, dispatch: any) => {
  dispatch({
    type: MainAction.SET_DATA,
    data: data,
  });
};

export const setPointClicked = (
  coordinate: CoordinateGrouped | null,
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

// Common functions for phoeg app and conjecture app

export const setLabelX = (labelX: string, typeX: string, dispatch: any) => {
  dispatch({
    type: MainAction.LABEL_X,
    labelX: labelX,
    typeX: typeX,
  });
};

export const setLabelY = (labelY: string, typeY: string, dispatch: any) => {
  dispatch({
    type: MainAction.LABEL_Y,
    labelY: labelY,
    typeY: typeY,
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

export const setError = (message: string, dispatch: any) => {
  dispatch({
    type: MainAction.SET_ERROR,
    message: message,
  });
};

// Functions for conjecture app

export const setOrders = (orders: number[], dispatch: any) => {
  dispatch({
    type: MainAction.ORDERS,
    orders: orders,
  });
};

export const setDataAutoconj = (
  concaveList: Array<Concave>,
  concaves: Concaves | {},
  envelopes: Array<Array<SimplifiedCoordinate>>,
  simplifiedPoints: Array<Array<CoordinateAutoconj>>,
  minMaxList: Array<MinMax>,
  dispatch: any
) => {
  dispatch({
    type: MainAction.SET_DATA_AUTOCONJ,
    concaveList: concaveList,
    concaves: concaves,
    envelopes: envelopes,
    simplifiedPoints: simplifiedPoints,
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

export const setSubmitAutoconj = (submitAutoconj: boolean, dispatch: any) => {
  dispatch({
    submitAutoconj: submitAutoconj,
    type: MainAction.SET_SUBMIT_AUTOCONJ,
  });
};

export const updateSimplifiedPoints = (
  simplifiedPoints: Array<Array<CoordinateAutoconj>>,
  dispatch: any
) => {
  dispatch({
    type: MainAction.UPDATE_SIMPLIFIED_POINTS,
    simplifiedPoints: simplifiedPoints,
  });
};

// Common functions for phoeg app and conjecture app --> Clear data (change order) and reset (change field in form)

export const reset = (dispatch: any) => {
  dispatch({
    type: MainAction.RESET,
  });
};

export const clearData = (dispatch: any) => {
  dispatch({
    type: MainAction.CLEAR_DATA,
  });
};

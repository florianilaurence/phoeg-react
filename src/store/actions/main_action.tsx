import { ChartData, Coordinate, MainState } from "../reducers/main_reducer";

export enum MainAction {
  ORDER = "order",
  LABEL_X = "labelX",
  LABEL_Y = "labelY",
  LABEL_COLOR = "labelColor",
  CONSTRAINTS = "constraints",
  ADVANCED_CONSTRAINTS = "advancedConstraints",
  IS_SUBMIT = "isSubmit",
  IS_LOADING = "isLoading",

  SET_DATA = "setData",

  SET_POINT_CLICKED = "setPointClicked",
  SET_LEGEND_CLICKED = "setLegendClicked",

  SET_ERROR = "setError",
}

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
    pointClicked: coordinate,
  });
};

export const setLegendClicked = (isClicked: number | null, dispatch: any) => {
  dispatch({
    type: MainAction.SET_LEGEND_CLICKED,
    legendClicked: isClicked,
  });
};

export const setError = (message: string, dispatch: any) => {
  dispatch({
    type: MainAction.SET_ERROR,
    message: message,
  });
};

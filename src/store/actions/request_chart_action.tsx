export enum ChartAction {
  ORDER = "order",
  LABEL_X = "labelX",
  LABEL_Y = "labelY",
  LABEL_COLOR = "labelColor",
  CONSTRAINTS = "constraints",
  ADVANCED_CONSTRAINTS = "advancedConstraints",
  IS_SUBMIT = "isSubmit",
}

export const handleLabelX = (data: any, dispatch: any) => {
  return dispatch({
    type: ChartAction.LABEL_X,
    payload: data === null ? "" : data,
  });
};

export const handleLabelY = (data: any, dispatch: any) => {
  return dispatch({
    type: ChartAction.LABEL_Y,
    payload: data === null ? "" : data,
  });
};

export const handleLabelColor = (data: any, dispatch: any) => {
  return dispatch({
    type: ChartAction.LABEL_COLOR,
    payload: data === null ? "" : data,
  });
};

export const handleConstraints = (data: any, dispatch: any) => {
  return dispatch({
    type: ChartAction.CONSTRAINTS,
    payload: data === null ? "" : data,
  });
};

export const handleAdvancedConstraints = (data: any, dispatch: any) => {
  return dispatch({
    type: ChartAction.ADVANCED_CONSTRAINTS,
    payload: data === null ? "" : data,
  });
};

export const handleIsSubmit = (data: any, dispatch: any) => {
  return dispatch({
    type: ChartAction.IS_SUBMIT,
    payload: data === null ? "" : data,
  });
};

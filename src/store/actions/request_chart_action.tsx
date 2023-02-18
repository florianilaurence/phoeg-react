export enum ChartAction {
  ORDER = "order",
  LABEL_X = "labelX",
  LABEL_Y = "labelY",
  LABEL_COLOR = "labelColor",
  CONSTRAINTS = "constraints",
  ADVANCED_CONSTRAINTS = "advancedConstraints",
  IS_SUBMIT = "isSubmit",
  IS_LOADING = "isLoading",
}

export const handleOrder = (data: number, dispatch: any) => {
  return dispatch({
    type: ChartAction.ORDER,
    newOrder: data === null ? -1 : data,
  });
};

export const handleLabelX = (data: string, dispatch: any) => {
  return dispatch({
    type: ChartAction.LABEL_X,
    label: data === null ? "" : data,
  });
};

export const handleLabelY = (data: string, dispatch: any) => {
  return dispatch({
    type: ChartAction.LABEL_Y,
    label: data === null ? "" : data,
  });
};

export const handleLabelColor = (data: string, dispatch: any) => {
  return dispatch({
    type: ChartAction.LABEL_COLOR,
    label: data === null ? "" : data,
  });
};

export const handleConstraints = (data: string, dispatch: any) => {
  return dispatch({
    type: ChartAction.CONSTRAINTS,
    constraints: data === null ? "" : data,
  });
};

export const handleAdvancedConstraints = (data: string, dispatch: any) => {
  return dispatch({
    type: ChartAction.ADVANCED_CONSTRAINTS,
    advancedConstraints: data === null ? "" : data,
  });
};

export const handleIsSubmit = (data: boolean, dispatch: any) => {
  return dispatch({
    type: ChartAction.IS_SUBMIT,
    isSubmit: data === null ? false : data,
  });
};

export const handleIsLoading = (data: boolean, dispatch: any) => {
  return dispatch({
    type: ChartAction.IS_LOADING,
    isLoading: data === null ? false : data,
  });
};

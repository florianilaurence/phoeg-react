export enum GraphAction {
  VALUE_X = "valueX",
  VALUE_Y = "valueY",
  IS_SELECTED = "is_selected",
}

export const handleValueX = (data: number, dispatch: any) => {
  return dispatch({
    type: GraphAction.VALUE_X,
    valueX: data,
  });
};

export const handleValueY = (data: number, dispatch: any) => {
  return dispatch({
    type: GraphAction.VALUE_Y,
    valueY: data,
  });
};

export const handleIsSelected = (data: boolean, dispatch: any) => {
  return dispatch({
    type: GraphAction.IS_SELECTED,
    isSelected: data,
  });
};

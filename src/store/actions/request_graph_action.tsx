export enum GraphAction {
  VALUE_X = "valueX",
  VALUE_Y = "valueY",
  IS_SELECTED = "is_selected",
}

export const handleChangeValueX = (data: any) => {
  return {
    type: GraphAction.VALUE_X,
    payload: data,
  };
};

export const handleChangeValueY = (data: any) => {
  return {
    type: GraphAction.VALUE_Y,
    payload: data,
  };
};

export const handleChangeIsSelected = (data: any) => {
  return {
    type: GraphAction.IS_SELECTED,
    payload: data,
  };
};

import { ColorationObject } from "../reducers/colorations_reducer";

export enum ColorationsAction {
  SET_DATA,
  UPDATE_A_COLORATION,
  CHANGE_MIN,
  CHANGE_MAX,
  RESET_HAS_CHANGED,
}

export const setDataCols = (
  objects: Array<ColorationObject>,
  dispatch: any
) => {
  dispatch({
    type: ColorationsAction.SET_DATA,
    objects: objects,
  });
};

export const updateAColoration = (
  average: number,
  newColoration: string,
  dispatch: any
) => {
  dispatch({
    type: ColorationsAction.UPDATE_A_COLORATION,
    average: average,
    newColoration: newColoration,
  });
};

export const changeMinColoration = (newColoration: string, dispatch: any) => {
  dispatch({
    type: ColorationsAction.CHANGE_MIN,
    newColoration: newColoration,
  });
};

export const changeMaxColoration = (newColoration: string, dispatch: any) => {
  dispatch({
    type: ColorationsAction.CHANGE_MAX,
    newColoration: newColoration,
  });
};

export const resetHasChanged = (dispatch: any) => {
  dispatch({
    type: ColorationsAction.RESET_HAS_CHANGED,
  });
};

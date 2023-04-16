import { ColorationObject } from "../reducers/colorations_reducer";

export enum ColorationsAction {
  SET_DATA,
  UPDATE_A_COLORATION,
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

import { ColorationsAction } from "../actions/colorations_action";

export interface ColorationObject {
  average: number;
  coloration: string;
}

export interface ColorationsState {
  objects: Array<ColorationObject>;
  ready: boolean;
}

export const initialColorationsState: ColorationsState = {
  objects: [],
  ready: false,
};

export const ColorationsReducer = (
  state: ColorationsState,
  action: any
): ColorationsState => {
  switch (action.type) {
    case ColorationsAction.SET_DATA:
      return {
        ...state,
        objects: action.objects,
        ready: true,
      };
    case ColorationsAction.UPDATE_A_COLORATION: // Change coloration from average value
      return {
        ...state,
        objects: state.objects.map((object) => {
          if (object.average === action.average) {
            return {
              ...object,
              coloration: action.coloration,
            };
          } else {
            return object;
          }
        }),
      };
    default:
      return state;
  }
};

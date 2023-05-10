import { ColorationsAction } from "../actions/colorations_action";

export interface ColorationObject {
  average: number;
  indexInAveragesViewed: number;
  coloration: string;
}

export interface ColorationsState {
  objects: Array<ColorationObject>;
  ready: boolean;
  minColoration: string;
  maxColoration: string;
  hasChanged: boolean;
}

export const initialColorationsState: ColorationsState = {
  objects: [],
  ready: false,
  minColoration: "#000000",
  maxColoration: "#00ff00",
  hasChanged: false,
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
              coloration: action.newColoration,
            };
          } else {
            return object;
          }
        }),
      };
    case ColorationsAction.CHANGE_MIN: // Change min coloration for gradient
      return {
        ...state,
        minColoration: action.newColoration,
        hasChanged: true,
      };
    case ColorationsAction.CHANGE_MAX: // Change max coloration for gradient
      return {
        ...state,
        maxColoration: action.newColoration,
        hasChanged: true,
      };
    case ColorationsAction.RESET_HAS_CHANGED:
      return {
        ...state,
        hasChanged: false,
      };

    default:
      return state;
  }
};

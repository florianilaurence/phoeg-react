import { MainAction } from "../actions/main_action";

export interface Coordinate {
  x: number;
  y: number;
  color: number;
  mult: number;
}

export interface CoordinateAutoconj extends Coordinate {
  order: number;
  clicked: boolean;
}

export interface MinMax {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minColor: number;
  maxColor: number;
}

export const defaultMinMax: MinMax = {
  minX: 0,
  maxX: 0,
  minY: 0,
  maxY: 0,
  minColor: 0,
  maxColor: 0,
};

export interface Concave {
  minY: Array<Coordinate>;
  minXminY: Array<Coordinate>;
  minX: Array<Coordinate>;
  minXmaxY: Array<Coordinate>;
  maxY: Array<Coordinate>;
  maxXmaxY: Array<Coordinate>;
  maxX: Array<Coordinate>;
  maxXminY: Array<Coordinate>;
}

export const defaultConcave: Concave = {
  minY: [],
  minXminY: [],
  minX: [],
  minXmaxY: [],
  maxY: [],
  maxXmaxY: [],
  maxX: [],
  maxXminY: [],
};

export interface ChartData {
  envelope: Array<Coordinate>;
  minMax: MinMax;
  concave: Concave;
  coordinates: Array<Coordinate>;
  sorted: { [key: number]: Array<Coordinate> };
}

export interface SimplifiedChartData {
  envelope: Array<Coordinate>;
  minMax: MinMax;
  concave: Concave;
}

export interface MainState {
  // Only for phoeg app
  order: number;

  coordinates: Array<Coordinate>;
  sorted: { [key: number]: Array<Coordinate> };

  // For both apps
  labelX: string;
  labelY: string;
  labelColor: string;
  constraints: string;
  advancedConstraints: string;
  isSubmit: boolean;
  isLoading: boolean;

  envelope: Array<Coordinate>;
  minMax: MinMax;
  concave: Concave;

  pointClicked: Coordinate | null; // point clicked => graphs request
  legendClicked: number | null; // color clicked => bigger point

  error: string;

  // Only for conjecture app
  orders: Array<number>;
  concaves: Array<Concave>;
  envelopes: Array<Array<Coordinate>>;
  minMaxList: Array<MinMax>;
  pointsClicked: Array<Array<CoordinateAutoconj>>;
  submitAutoconj: boolean;
}

export const initialMainState: MainState = {
  // Only for phoeg app
  order: 7,

  coordinates: [],
  sorted: {},

  // For both apps
  labelX: "",
  labelY: "",
  labelColor: "",
  constraints: "",
  advancedConstraints: "",
  isSubmit: false,
  isLoading: false,

  envelope: [],
  minMax: defaultMinMax,
  concave: defaultConcave,

  pointClicked: null,
  legendClicked: null,

  error: "",

  // Only for conjecture app
  orders: [],
  concaves: [],
  envelopes: [],
  minMaxList: [],
  pointsClicked: [],
  submitAutoconj: false,
};

export const MainReducer = (state: MainState, action: any): MainState => {
  switch (action.type) {
    case MainAction.ORDER:
      return { ...state, order: action.order };
    case MainAction.LABEL_X:
      return { ...state, labelX: action.labelX };
    case MainAction.LABEL_Y:
      return { ...state, labelY: action.labelY };
    case MainAction.LABEL_COLOR:
      return { ...state, labelColor: action.labelColor };
    case MainAction.CONSTRAINTS:
      return { ...state, constraints: action.constraints };
    case MainAction.ADVANCED_CONSTRAINTS:
      return { ...state, advancedConstraints: action.advancedConstraints };
    case MainAction.IS_SUBMIT:
      return { ...state, isSubmit: action.isSubmit };
    case MainAction.IS_LOADING:
      return { ...state, isLoading: action.isLoading };

    case MainAction.SET_DATA:
      return {
        ...state,
        envelope: action.data.envelope,
        minMax: action.data.minMax,
        coordinates: action.data.coordinates,
        sorted: action.data.sorted,
        concave: action.data.concave,
      };

    case MainAction.SET_POINT_CLICKED:
      return { ...state, pointClicked: action.coordinate };
    case MainAction.SET_LEGEND_CLICKED:
      return { ...state, legendClicked: action.legendClicked };

    case MainAction.SET_ERROR:
      return { ...state, error: action.message };

    case MainAction.RESET:
      return {
        ...state,
        order: 7,
        isSubmit: false,
        isLoading: false,
        pointClicked: null,
        legendClicked: null,
        submitAutoconj: false,
      };

    // Only for conjecture app
    case MainAction.ORDERS:
      return { ...state, orders: action.orders };
    case MainAction.INIT_POINTS_CLICKED: {
      const newPointsClicked: Array<Array<CoordinateAutoconj>> = [];
      for (let i = 0; i < action.orders.length; i++) {
        newPointsClicked.push([]);
      }
      return { ...state, pointsClicked: newPointsClicked };
    }
    case MainAction.SET_CONCAVES:
      return { ...state, concaves: action.concaves };
    case MainAction.SET_ENVELOPES:
      return { ...state, envelopes: action.envelopes };
    case MainAction.SET_MIN_MAX_LIST:
      return { ...state, minMaxList: action.minMaxList };
    case MainAction.SET_POINTS_CLICKED: {
      const newState = { ...state, pointsClicked: [...action.pointsClicked] };
      return newState;
    }
    case MainAction.SET_SUBMIT_AUTOCONJ:
      return { ...state, submitAutoconj: action.submitAutoconj };
    default:
      return state;
  }
};

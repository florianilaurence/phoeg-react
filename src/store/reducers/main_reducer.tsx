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
  envelope: Array<Coordinate>;
  minMax: MinMax | undefined;
  concave: Concave | undefined;
  pointClicked: Coordinate | null; // point clicked => graphs request
  legendClicked: number | null; // color clicked => bigger point

  // For both apps
  labelX: string;
  labelY: string;
  labelColor: string;
  constraints: string;
  advancedConstraints: string;
  isSubmit: boolean; // Submit of form => chart request for phoeg app or charts request for autoconjecture app
  isLoading: boolean;
  error: string;

  // Only for conjecture app
  orders: Array<number>;

  concaves: Array<Concave>;
  envelopes: Array<Array<Coordinate>>;
  minMaxList: Array<MinMax>;
  simplifiedPoints: Array<Array<CoordinateAutoconj>>;
  pointsClicked: Array<Array<CoordinateAutoconj>>;
  submitAutoconj: boolean;
}

export const initialMainState: MainState = {
  // Only for phoeg app
  order: 7,

  coordinates: [],
  sorted: {},
  envelope: [],
  minMax: undefined,
  concave: undefined,
  pointClicked: null,
  legendClicked: null,

  // For both apps
  labelX: "",
  labelY: "",
  labelColor: "",
  constraints: "",
  advancedConstraints: "",
  isSubmit: false,
  isLoading: false,
  error: "",

  // Only for conjecture app
  orders: [],

  concaves: [],
  envelopes: [],
  minMaxList: [],
  simplifiedPoints: [],
  pointsClicked: [],
  submitAutoconj: false,
};

export const MainReducer = (state: MainState, action: any): MainState => {
  switch (action.type) {
    // Only for phoeg app
    case MainAction.ORDER:
      return { ...state, order: action.order };
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

    // For both apps
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
    case MainAction.SET_ERROR:
      return { ...state, error: action.message };

    // Only for conjecture app
    case MainAction.ORDERS:
      return { ...state, orders: action.orders };
    case MainAction.SET_DATA_AUTOCONJ: {
      const newPointsClicked: Array<Array<CoordinateAutoconj>> = [];
      for (let i = 0; i < state.orders.length; i++) {
        newPointsClicked.push([]);
      }
      const newState = {
        ...state,
        concaves: action.concaves,
        envelopes: action.envelopes,
        simplifiedPoints: action.simplifiedPoints,
        minMaxList: action.minMaxList,
        pointsClicked: newPointsClicked,
      };
      return newState;
    }
    case MainAction.SET_POINTS_CLICKED: {
      const newState = { ...state, pointsClicked: [...action.pointsClicked] };
      return newState;
    }
    case MainAction.SET_SUBMIT_AUTOCONJ:
      return { ...state, submitAutoconj: action.submitAutoconj };
    case MainAction.UPDATE_SIMPLIFIED_POINTS: {
      const newSimplifiedPoints = [...state.simplifiedPoints];
      newSimplifiedPoints[action.index] = action.simplifiedPoints;
      return { ...state, simplifiedPoints: newSimplifiedPoints };
    }

    // Clear data (change order) and reset (change field in form)
    case MainAction.CLEAR_DATA:
      return {
        ...state,
        coordinates: [],
        sorted: {},
        envelope: [],
        minMax: undefined,
        concave: undefined,
        pointClicked: null,
        legendClicked: null,
      };
    case MainAction.RESET:
      return {
        ...state,
        order: 7,
        coordinates: [],
        sorted: {},
        envelope: [],
        minMax: undefined,
        concave: undefined,
        pointClicked: null,
        legendClicked: null,
        isSubmit: false,
        isLoading: false,
        submitAutoconj: false,
      };

    default:
      return state;
  }
};

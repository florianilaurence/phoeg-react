import { ChartDataAction } from "../actions/chart_data_action";

export interface Coordinate {
  x: number;
  y: number;
  color: number;
  mult: number;
}

export interface MinMax {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minColor?: number;
  maxColor?: number;
}

export const defaultMinMax: MinMax = {
  minX: 0,
  maxX: 0,
  minY: 0,
  maxY: 0,
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
  coordinates: Array<Coordinate>;
  minMax: MinMax;
  clusterList: Array<number>;
  allClusters: { [key: number]: Array<Array<Coordinate>> };
  concave: Concave;
  error: string;
}

export const initialChartDataState: ChartData = {
  envelope: [],
  coordinates: [],
  minMax: defaultMinMax,
  clusterList: [],
  allClusters: { 0: [] },
  concave: defaultConcave,
  error: "",
};

export const ChartDataReducer = (state: ChartData, action: any) => {
  switch (action.type) {
    case ChartDataAction.SET_DATA:
      return {
        ...state,
        envelope: action.payload.envelope,
        coordinates: action.payload.coordinates,
        minMax: action.payload.minMax,
        clusterList: action.payload.clusterList,
        allClusters: action.payload.allClusters,
        concave: action.payload.concave,
      };

    case ChartDataAction.SET_ERROR:
      return {
        ...state,
        envelope: [],
        coordinates: [],
        minMax: defaultMinMax,
        clusterList: [],
        allClusters: {},
        concave: defaultConcave,
        error: action.payload,
      };

    default:
      throw new Error();
  }
};

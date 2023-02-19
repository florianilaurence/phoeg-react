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
  coordinates: Array<Coordinate>;
  sorted: { [key: number]: Array<Coordinate> };
  concave: Concave;
  pointClicked: Coordinate | null;
  legendClicked: number | null;
  error: string;
}

export const initialChartDataState: ChartData = {
  envelope: [],
  minMax: defaultMinMax,
  coordinates: [],
  sorted: {},
  concave: defaultConcave,
  pointClicked: null,
  legendClicked: null,
  error: "",
};

export const ChartDataReducer = (state: ChartData, action: any) => {
  switch (action.type) {
    case ChartDataAction.SET_DATA:
      return {
        ...state,
        envelope: action.chartData.envelope,
        minMax: action.chartData.minMax,
        coordinates: action.chartData.coordinates,
        sorted: action.chartData.sorted,
        concave: action.chartData.concave,
        error: "",
      };

    case ChartDataAction.SET_ERROR:
      return {
        ...state,
        envelope: [],
        minMax: defaultMinMax,
        coordinates: [],
        sorted: {},
        concave: defaultConcave,
        error: action.message,
      };

    case ChartDataAction.SET_POINT_CLICKED:
      return {
        ...state,
        pointClicked: action.pointClicked,
      };

    case ChartDataAction.SET_LEGEND_CLICKED:
      return {
        ...state,
        legendClicked: action.legendClicked,
      };

    default:
      throw new Error();
  }
};

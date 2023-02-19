import { ChartData, Coordinate } from "../reducers/chart_data_reducer";

export enum ChartDataAction {
  SET_DATA = "SET_DATA",
  SET_ERROR = "SET_ERROR",
  SET_POINT_CLICKED = "SET_POINT_CLICKED",
  SET_LEGEND_CLICKED = "SET_LEGEND_CLICKED",
}

export const setData = (data: ChartData, dispatch: any) => {
  dispatch({
    type: ChartDataAction.SET_DATA,
    chartData: data,
  });
};

export const setError = (data: string, dispatch: any) => {
  dispatch({
    type: ChartDataAction.SET_ERROR,
    message: data,
  });
};

export const setPointClicked = (data: Coordinate | null, dispatch: any) => {
  dispatch({
    type: ChartDataAction.SET_POINT_CLICKED,
    pointClicked: data,
  });
};

export const setLegendClicked = (data: number | null, dispatch: any) => {
  dispatch({
    type: ChartDataAction.SET_LEGEND_CLICKED,
    legendClicked: data,
  });
};

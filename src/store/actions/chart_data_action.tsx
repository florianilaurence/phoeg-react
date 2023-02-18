import { ChartData } from "../reducers/chart_data_reducer";

export enum ChartDataAction {
  SET_DATA = "SET_DATA",
  SET_ERROR = "SET_ERROR",
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

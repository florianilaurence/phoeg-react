export enum ChartDataAction {
  SET_DATA = "SET_DATA",
  SET_ERROR = "SET_ERROR",
}

export const setData = (data: any, dispatch: any) => {
  dispatch({
    type: ChartDataAction.SET_DATA,
    payload: data,
  });
};

export const setError = (data: any, dispatch: any) => {
  dispatch({
    type: ChartDataAction.SET_ERROR,
  });
};

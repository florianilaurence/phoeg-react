export enum ConjAction {
  SET_ACTIVE,
  SET_IS_FY_SEARCHED,
  SET_IS_MORE,
}

export const setActive = (active: boolean, index: number, dispatch: any) => {
  dispatch({
    type: ConjAction.SET_ACTIVE,
    active: active,
    index: index,
  });
};

export const setIsFYSearched = (
  isFYSearched: boolean,
  index: number,
  dispatch: any
) => {
  dispatch({
    type: ConjAction.SET_IS_FY_SEARCHED,
    isFYSearched: isFYSearched,
    index: index,
  });
};

export const setIsMore = (isMore: boolean, index: number, dispatch: any) => {
  dispatch({
    type: ConjAction.SET_IS_MORE,
    isMore: isMore,
    index: index,
  });
};

import { ConjAction } from "../actions/conj_action";

interface FParam {
  active: boolean;
  isFYSearched: boolean; // FY --> true if search f(y) (else search f(x))
  isMore: boolean; // true if more than (else less than)
}

export interface ConjState {
  Fs: { 0: FParam; 1: FParam };
}

export const initialConjState: ConjState = {
  Fs: {
    0: {
      active: true,
      isFYSearched: true,
      isMore: true,
    },
    1: {
      active: false,
      isFYSearched: false,
      isMore: false,
    },
  },
};

export const ConjReducer = (state: ConjState, action: any): ConjState => {
  switch (action.type) {
    case ConjAction.SET_ACTIVE:
      const newF = {
        ...state.Fs[action.index],
        active: action.active,
      };
      const newState = {
        ...state,
        Fs: {
          ...state.Fs,
          [action.index]: newF,
        },
      };
      return newState;
    case ConjAction.SET_IS_FY_SEARCHED:
      const newF2 = {
        ...state.Fs[action.index],
        isFYSearched: action.isFYSearched,
      };
      const newState2 = {
        ...state,
        Fs: {
          ...state.Fs,
          [action.index]: newF2,
        },
      };
      return newState2;
    case ConjAction.SET_IS_MORE:
      const newF3 = {
        ...state.Fs[action.index],
        isMore: action.isMore,
      };
      const newState3 = {
        ...state,
        Fs: {
          ...state.Fs,
          [action.index]: newF3,
        },
      };
      return newState3;
    default:
      return state;
  }
};

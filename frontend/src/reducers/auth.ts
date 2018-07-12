import { Action, handleActions } from 'redux-actions';
import * as types from '../actions/types';
import { IAuthState } from '../types/redux';

const defaultState: IAuthState = {
  authenticated: false,
  error: null,
  inProgress: false,
  initialized: false,
};

const reducer = handleActions<IAuthState, any>(
  {
    [types.LOGIN_REQUESTED]: state => {
      return { ...state, inProgress: true };
    },
    [types.LOGIN_FULFILLED]: state => {
      return { ...state, inProgress: false, authenticated: true, error: null };
    },
    [types.LOGIN_REJECTED]: (state, action) => {
      return {
        ...state,
        authenticated: false,
        error: action.payload,
        inProgress: false,
      };
    },
    [types.LOGOUT_REQUESTED]: state => {
      return { ...state, inProgress: true };
    },
    [types.LOGOUT_FULFILLED]: state => {
      return { ...state, inProgress: false, authenticated: false, error: null };
    },
    [types.LOGOUT_REJECTED]: (state, action: Action<Error>) => {
      return {
        ...state,
        authenticated: false,
        error: action.payload,
        inProgress: false,
      };
    },
    [types.SYNC_AUTH_STATE_REQUESTED]: state => {
      return { ...state, inProgress: true };
    },
    [types.SYNC_AUTH_STATE_FULFILLED]: (_, action: Action<boolean>) => {
      return {
        authenticated: !!action.payload,
        error: null,
        inProgress: false,
        initialized: true,
      };
    },
    [types.SYNC_AUTH_STATE_REJECTED]: (_, action: Action<Error>) => {
      return {
        authenticated: false,
        error: action.payload,
        inProgress: false,
        initialized: true,
      };
    },
  },
  defaultState,
);

export default reducer;

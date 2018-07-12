import { createAction } from 'redux-actions';
import * as types from './types';

export const loginRequested = createAction(types.LOGIN_REQUESTED);
export const loginFulfilled = createAction(types.LOGIN_FULFILLED);
export const loginRejected = createAction(types.LOGIN_REJECTED);

export const logoutRequested = createAction(types.LOGOUT_REQUESTED);
export const logoutFulfilled = createAction(types.LOGOUT_FULFILLED);
export const logoutRejected = createAction(types.LOGOUT_REJECTED);

export const syncAuthStateRequested = createAction(
  types.SYNC_AUTH_STATE_REQUESTED,
);
export const syncAuthStateFulfilled = createAction(
  types.SYNC_AUTH_STATE_FULFILLED,
);
export const syncAuthStateRejected = createAction(
  types.SYNC_AUTH_STATE_REJECTED,
);

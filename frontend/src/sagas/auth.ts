import { call, put, select, takeEvery } from 'redux-saga/effects';
import * as types from '../actions/types';
import { isAuthenticated, login, logout } from '../lib/auth';
import {
  logoutFulfilled,
  logoutRejected,
  syncAuthStateFulfilled,
  syncAuthStateRejected,
} from './../actions/auth';
import { redirectRouteSelector } from './../selectors/router';

export function* handleLogin() {
  const redirectRoute = yield select(redirectRouteSelector);
  yield call(login, redirectRoute);
}

export function* loginSaga() {
  yield takeEvery(types.LOGIN_REQUESTED, handleLogin);
}

export function* handleLogout() {
  try {
    yield call(logout);
    yield put(logoutFulfilled());
  } catch (err) {
    yield put(logoutRejected(err));
  }
}

export function* logoutSaga() {
  yield takeEvery(types.LOGOUT_REQUESTED, handleLogout);
}

export function* handleAuthState() {
  try {
    const authenticated = yield call(isAuthenticated);
    yield put(syncAuthStateFulfilled(authenticated));
  } catch (err) {
    yield put(syncAuthStateRejected(err));
  }
}

export function* authStateSaga() {
  yield takeEvery(types.SYNC_AUTH_STATE_REQUESTED, handleAuthState);
}

const sagas = [loginSaga(), logoutSaga(), authStateSaga()];

export default sagas;

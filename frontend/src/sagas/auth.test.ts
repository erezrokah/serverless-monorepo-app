import { call, put, select, takeEvery } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import * as types from '../actions/types';
import { isAuthenticated, login, logout } from '../lib/auth';
import {
  logoutFulfilled,
  logoutRejected,
  syncAuthStateFulfilled,
  syncAuthStateRejected,
} from './../actions/auth';
import { redirectRouteSelector } from './../selectors/router';
import * as sagas from './auth';

describe('Auth Sagas', () => {
  test('should invoke login on handleLogin', () => {
    const generator = sagas.handleLogin();
    expect(generator.next().value).toEqual(select(redirectRouteSelector));

    const route = 'router';
    expect(generator.next(route).value).toEqual(call(login, route));
    expect(generator.next().done).toBe(true);
  });

  test('should handleLogin on loginSaga', () => {
    const generator = sagas.loginSaga();
    expect(generator.next().value).toEqual(
      takeEvery(types.LOGIN_REQUESTED, sagas.handleLogin),
    );
    expect(generator.next().done).toBe(true);
  });

  test('should invoke logout on handleLogout', () => {
    const generator = cloneableGenerator(sagas.handleLogout)();

    expect(generator.next().value).toEqual(call(logout));

    const errorGenerator = generator.clone();
    const error = new Error('logout error');
    expect(errorGenerator.throw && errorGenerator.throw(error).value).toEqual(
      put(logoutRejected(error)),
    );
    expect(errorGenerator.next().done).toBe(true);

    expect(generator.next().value).toEqual(put(logoutFulfilled()));
    expect(generator.next().done).toBe(true);
  });

  test('should handleLogout on logoutSaga', () => {
    const generator = sagas.logoutSaga();
    expect(generator.next().value).toEqual(
      takeEvery(types.LOGOUT_REQUESTED, sagas.handleLogout),
    );
    expect(generator.next().done).toBe(true);
  });

  test('should invoke isAuthenticated on handleAuthState', () => {
    const generator = cloneableGenerator(sagas.handleAuthState)();

    expect(generator.next().value).toEqual(call(isAuthenticated));

    const errorGenerator = generator.clone();
    const error = new Error('isAuthenticated error');
    expect(errorGenerator.throw && errorGenerator.throw(error).value).toEqual(
      put(syncAuthStateRejected(error)),
    );
    expect(errorGenerator.next().done).toBe(true);

    const authenticated = true;
    expect(generator.next(authenticated).value).toEqual(
      put(syncAuthStateFulfilled(authenticated)),
    );
    expect(generator.next().done).toBe(true);
  });

  test('should handleAuthState on authStateSaga', () => {
    const generator = sagas.authStateSaga();
    expect(generator.next().value).toEqual(
      takeEvery(types.SYNC_AUTH_STATE_REQUESTED, sagas.handleAuthState),
    );
    expect(generator.next().done).toBe(true);
  });
});

import * as actions from './auth';
import * as types from './types';

describe('Auth Actions', () => {
  test(types.LOGIN_REQUESTED, () => {
    expect({
      type: types.LOGIN_REQUESTED,
    }).toEqual(actions.loginRequested());
  });

  test(types.LOGIN_FULFILLED, () => {
    expect({
      type: types.LOGIN_FULFILLED,
    }).toEqual(actions.loginFulfilled());
  });

  test(types.LOGIN_REJECTED, () => {
    const error = new Error('Unauthorized');
    expect({
      error: true,
      payload: error,
      type: types.LOGIN_REJECTED,
    }).toEqual(actions.loginRejected(error));
  });

  test(types.LOGOUT_REQUESTED, () => {
    expect({
      type: types.LOGOUT_REQUESTED,
    }).toEqual(actions.logoutRequested());
  });

  test(types.LOGOUT_FULFILLED, () => {
    expect({
      type: types.LOGOUT_FULFILLED,
    }).toEqual(actions.logoutFulfilled());
  });

  test(types.LOGOUT_REJECTED, () => {
    const error = new Error('error');
    expect({
      error: true,
      payload: error,
      type: types.LOGOUT_REJECTED,
    }).toEqual(actions.logoutRejected(error));
  });
});

import * as actions from '../actions/auth';
import * as types from '../actions/types';
import reducer from './auth';

const state = {
  authenticated: false,
  error: null,
  inProgress: false,
  initialized: false,
};

describe('Auth Reducer', () => {
  test(types.LOGIN_REQUESTED, () => {
    expect(
      reducer({ ...state, inProgress: false }, actions.loginRequested()),
    ).toEqual({
      ...state,
      inProgress: true,
    });
  });

  test(types.LOGIN_FULFILLED, () => {
    expect(
      reducer(
        {
          ...state,
          authenticated: false,
          error: new Error('error'),
          inProgress: true,
        },
        actions.loginFulfilled(),
      ),
    ).toEqual({
      ...state,
      authenticated: true,
      error: null,
      inProgress: false,
    });
  });

  test(types.LOGIN_REJECTED, () => {
    const error = new Error('error');
    expect(
      reducer(
        {
          ...state,
          authenticated: true,
          error: null,
          inProgress: true,
        },
        actions.loginRejected(error),
      ),
    ).toEqual({
      ...state,
      authenticated: false,
      error,
      inProgress: false,
    });
  });
  test(types.LOGOUT_REQUESTED, () => {
    expect(
      reducer({ ...state, inProgress: false }, actions.logoutRequested()),
    ).toEqual({
      ...state,
      inProgress: true,
    });
  });

  test(types.LOGOUT_FULFILLED, () => {
    expect(
      reducer(
        {
          ...state,
          authenticated: true,
          error: new Error('error'),
          inProgress: true,
        },
        actions.logoutFulfilled(),
      ),
    ).toEqual({
      ...state,
      authenticated: false,
      error: null,
      inProgress: false,
    });
  });

  test(types.LOGOUT_FULFILLED, () => {
    const error = new Error('error');
    expect(
      reducer(
        {
          ...state,
          authenticated: true,
          error: null,
          inProgress: true,
        },
        actions.logoutRejected(error),
      ),
    ).toEqual({
      ...state,
      authenticated: false,
      error,
      inProgress: false,
    });
  });

  test(types.SYNC_AUTH_STATE_REQUESTED, () => {
    expect(
      reducer(
        { ...state, inProgress: false },
        actions.syncAuthStateRequested(),
      ),
    ).toEqual({
      ...state,
      inProgress: true,
    });
  });

  test(types.SYNC_AUTH_STATE_FULFILLED, () => {
    const authenticated = true;
    expect(
      reducer(
        {
          ...state,
          authenticated: false,
          error: new Error('error'),
          inProgress: true,
          initialized: false,
        },
        actions.syncAuthStateFulfilled(authenticated),
      ),
    ).toEqual({
      ...state,
      authenticated,
      error: null,
      inProgress: false,
      initialized: true,
    });
  });

  test(types.SYNC_AUTH_STATE_REJECTED, () => {
    const error = new Error('error');
    expect(
      reducer(
        {
          ...state,
          authenticated: true,
          error: null,
          inProgress: true,
          initialized: false,
        },
        actions.syncAuthStateRejected(error),
      ),
    ).toEqual({
      ...state,
      authenticated: false,
      error,
      inProgress: false,
      initialized: true,
    });
  });
});

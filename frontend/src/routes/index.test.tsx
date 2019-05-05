import { push } from 'connected-react-router';
import * as React from 'react';
import { Route } from 'react-router';
import 'react-test-renderer';
import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper';
import Loading, { ComponentLoading } from '../components/Loading';
import { isAuthenticated, isNotAuthenticated } from '../selectors/auth';
import { paths, routes, userIsAuthenticated, userIsNotAuthenticated } from './';

jest.mock('../components/Callback', () => 'Callback');
jest.mock('../components/Home', () => 'Home');
jest.mock('../components/Login', () => 'Login');
jest.mock('../components/NotFound', () => 'NotFound');
jest.mock('../components/Private', () => 'Private');
jest.mock('../components/Public', () => 'Public');
jest.mock('redux-auth-wrapper/history4/redirect', () => {
  const returnValue = jest.fn();
  const connectedReduxRedirectMock = jest.fn(() => returnValue);
  return { connectedReduxRedirect: connectedReduxRedirectMock };
});
jest.mock('redux-auth-wrapper/history4/locationHelper', () => {
  const locationHelper = { getRedirectQueryParam: jest.fn() };
  return jest.fn(() => locationHelper);
});
jest.mock('react-loadable', () => jest.fn());

describe('routes', () => {
  test('should return valid paths', () => {
    expect(paths).toEqual({
      callback: '/callback',
      home: '/',
      login: '/login',
      private: '/private',
      public: '/public',
    });
  });

  test('should return valid routes', async () => {
    const {
      connectedReduxRedirect,
    } = require('redux-auth-wrapper/history4/redirect');

    const Loadable = require('react-loadable');

    expect(Loadable).toHaveBeenCalledTimes(6);
    expect(Loadable).toHaveBeenCalledWith({
      loader: expect.any(Function),
      loading: ComponentLoading,
    });

    const [
      callback,
      home,
      login,
      notfound,
      privateComponent,
      publicComponent,
    ] = await Promise.all(Loadable.mock.calls.map((c: any) => c[0].loader()));

    expect([
      callback,
      home,
      login,
      notfound,
      privateComponent,
      publicComponent,
    ]).toEqual([
      await import('../components/Callback'),
      await import('../components/Home'),
      await import('../components/Login'),
      await import('../components/NotFound'),
      await import('../components/Private'),
      await import('../components/Public'),
    ]);

    expect(connectedReduxRedirect).toHaveBeenCalledTimes(2);
    expect(connectedReduxRedirect).toHaveBeenCalledWith({
      AuthenticatingComponent: Loading,
      authenticatedSelector: isAuthenticated,
      redirectAction: push,
      redirectPath: paths.login,
      wrapperDisplayName: 'UserIsAuthenticated',
    });

    expect(connectedReduxRedirect).toHaveBeenCalledWith({
      allowRedirectBack: false,
      authenticatedSelector: isNotAuthenticated,
      redirectAction: push,
      redirectPath: expect.any(Function),
      wrapperDisplayName: 'UserIsNotAuthenticated',
    });

    expect(locationHelperBuilder).toHaveBeenCalledTimes(1);
    expect(locationHelperBuilder).toHaveBeenCalledWith({});

    const result = (connectedReduxRedirect as jest.Mock<{}>).mock.calls[1][0].redirectPath();
    expect(result).toEqual(paths.home);
    expect(
      locationHelperBuilder({}).getRedirectQueryParam,
    ).toHaveBeenCalledTimes(1);

    expect(routes).toEqual({
      Callback: <Route path={paths.callback} component={Loadable()} />,
      Home: <Route exact={true} path={paths.home} component={Loadable()} />,
      Login: (
        <Route
          path={paths.login}
          component={userIsNotAuthenticated(Loadable())}
        />
      ),
      NotFound: <Route component={Loadable()} />,
      Private: (
        <Route
          path={paths.private}
          component={userIsAuthenticated(Loadable())}
        />
      ),
      Public: <Route path={paths.public} component={Loadable()} />,
    });
  });
});

import { push } from 'connected-react-router';
import * as React from 'react';
import * as Loadable from 'react-loadable';
import { Route } from 'react-router';
import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper';
import { connectedReduxRedirect } from 'redux-auth-wrapper/history4/redirect';
import Loading from '../components/Loading';
import { ComponentLoading } from '../components/Loading';
import { isAuthenticated, isNotAuthenticated } from '../selectors/auth';

export const paths = {
  callback: '/callback',
  home: '/',
  login: '/login',
  private: '/private',
  public: '/public',
};

export const userIsAuthenticated = connectedReduxRedirect({
  AuthenticatingComponent: Loading,
  // If selector is true, wrapper will not redirect
  // For example let's check that state contains user data
  authenticatedSelector: isAuthenticated,
  redirectAction: push,
  // The url to redirect user to if they fail
  redirectPath: paths.login,
  // A nice display name for this check
  wrapperDisplayName: 'UserIsAuthenticated',
});

const locationHelper = locationHelperBuilder({});

export const userIsNotAuthenticated = connectedReduxRedirect({
  // This prevents us from adding the query parameter when we send the user away from the login page
  allowRedirectBack: false,
  // If selector is true, wrapper will not redirect
  // So if there is no user data, then we show the page
  authenticatedSelector: isNotAuthenticated,
  redirectAction: push,
  // This sends the user either to the query param route if we have one, or to the landing page if none is specified and the user is already logged in
  redirectPath: (_, ownProps) =>
    locationHelper.getRedirectQueryParam(ownProps) || paths.home,
  // A nice display name for this check
  wrapperDisplayName: 'UserIsNotAuthenticated',
});

export const routes = {
  Callback: (
    <Route
      path={paths.callback}
      component={Loadable({
        loader: () => import('../components/Callback'),
        loading: ComponentLoading,
      })}
    />
  ),
  Home: (
    <Route
      exact={true}
      path={paths.home}
      component={Loadable({
        loader: () => import('../components/Home'),
        loading: ComponentLoading,
      })}
    />
  ),
  Login: (
    <Route
      path={paths.login}
      component={userIsNotAuthenticated(
        Loadable({
          loader: () => import('../components/Login'),
          loading: ComponentLoading,
        }),
      )}
    />
  ),
  NotFound: (
    <Route
      component={Loadable({
        loader: () => import('../components/NotFound'),
        loading: ComponentLoading,
      })}
    />
  ),
  Private: (
    <Route
      path={paths.private}
      component={userIsAuthenticated(
        Loadable({
          loader: () => import('../components/Private'),
          loading: ComponentLoading,
        }),
      )}
    />
  ),
  Public: (
    <Route
      path={paths.public}
      component={Loadable({
        loader: () => import('../components/Public'),
        loading: ComponentLoading,
      })}
    />
  ),
};

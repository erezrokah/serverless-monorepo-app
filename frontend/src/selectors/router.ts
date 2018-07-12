import { paths } from '../routes';
import { IState } from '../types/redux';

export const pathnameSelector = (state: IState) =>
  state.router.location.pathname || paths.home;

export const redirectRouteSelector = (state: IState) => {
  const search = state.router.location.search;
  const params = new URLSearchParams(search);
  return params.get('redirect');
};

import { paths } from '../routes';
import * as selectors from './router';

describe('Router Selectors', () => {
  test('should return pathname', () => {
    expect(
      // @ts-ignore missing properties for state
      selectors.pathnameSelector({ router: { location: { pathname: '' } } }),
    ).toEqual(paths.home);
    expect(
      // @ts-ignore missing properties for state
      selectors.pathnameSelector({
        router: { location: { pathname: '/somepath' } },
      }),
    ).toEqual('/somepath');
  });

  test('should return redirect query parameter', () => {
    expect(
      // @ts-ignore missing properties for state
      selectors.redirectRouteSelector({
        router: { location: { search: '?' } },
      }),
    ).toEqual(null);
    expect(
      // @ts-ignore missing properties for state
      selectors.redirectRouteSelector({
        router: { location: { search: '?redirect=login' } },
      }),
    ).toEqual('login');
  });
});

import { paths } from '../routes';
import * as selectors from './router';

describe('Router Selectors', () => {
  test('should return pathname', () => {
    expect(
      // @ts-ignore missing properties for state
      selectors.pathnameSelector({ router: { location: { pathname: '' } } }),
    ).toEqual(paths.home);
    expect(
      selectors.pathnameSelector({
        // @ts-ignore missing properties for state
        router: { location: { pathname: '/somepath' } },
      }),
    ).toEqual('/somepath');
  });

  test('should return redirect query parameter', () => {
    expect(
      selectors.redirectRouteSelector({
        // @ts-ignore missing properties for state
        router: { location: { search: '?' } },
      }),
    ).toEqual(null);
    expect(
      selectors.redirectRouteSelector({
        // @ts-ignore missing properties for state
        router: { location: { search: '?redirect=login' } },
      }),
    ).toEqual('login');
  });
});

import * as selectors from './auth';

describe('Auth Selectors', () => {
  test('should return auth flag on isAuthenticated', () => {
    expect(
      // @ts-ignore missing properties for state
      selectors.isAuthenticated({ auth: { authenticated: false } }),
    ).toEqual(false);
    expect(
      // @ts-ignore missing properties for state
      selectors.isAuthenticated({ auth: { authenticated: true } }),
    ).toEqual(true);
  });

  test('should negate auth flag on isNotAuthenticated', () => {
    expect(
      // @ts-ignore missing properties for state
      selectors.isNotAuthenticated({ auth: { authenticated: false } }),
    ).toEqual(true);
    expect(
      // @ts-ignore missing properties for state
      selectors.isNotAuthenticated({ auth: { authenticated: true } }),
    ).toEqual(false);
  });

  test('should return initialized flag on isInitialized', () => {
    expect(
      // @ts-ignore missing properties for state
      selectors.isInitialized({ auth: { initialized: false } }),
    ).toEqual(false);
    expect(
      // @ts-ignore missing properties for state
      selectors.isInitialized({ auth: { initialized: true } }),
    ).toEqual(true);
  });
});

import { apiMetaTypes } from './../actions/api';
import * as selectors from './api';

describe('Api Selectors', () => {
  test('should return api state on apiStateSelector', () => {
    const subState = { inProgress: false, error: null, result: 'result' };
    expect(
      // @ts-ignore missing properties for state
      selectors.apiStateSelector({ api: { apiType: subState } }, 'apiType'),
    ).toEqual(subState);
  });

  Object.keys(apiMetaTypes).forEach(key => {
    test(`should return ${key} state on selector`, () => {
      const subState = { inProgress: false, error: null, result: 'result' };
      expect(
        // @ts-ignore missing properties for state
        selectors[`${key}ApiSelector`]({ api: { [key]: subState } }),
      ).toEqual(subState);
    });
  });
});

import * as actions from '../actions/api';
import * as types from '../actions/types';
import reducer from './api';

describe('api reducer', () => {
  const metaTypes = Object.keys(actions.apiMetaTypes);

  for (const metaType of metaTypes) {
    test(types.API_REQUESTED, () => {
      const action = actions.apiRequested(undefined, metaType);

      expect(
        reducer(
          {
            [metaType]: { inProgress: false, error: null },
          },
          action,
        )[metaType],
      ).toEqual({
        error: null,
        inProgress: true,
        result: null,
      });
    });

    test(types.API_FULFILLED, () => {
      const result = 'result';
      const action = actions.apiFulfilled(result, metaType);

      expect(
        reducer({ [metaType]: { inProgress: true, error: null } }, action)[
          metaType
        ],
      ).toEqual({
        error: null,
        inProgress: false,
        result,
      });
    });

    test(types.API_REJECTED, () => {
      const error = new Error('error');
      const action = actions.apiRejected(error, metaType);

      expect(
        reducer({ [metaType]: { inProgress: true, error: null } }, action)[
          metaType
        ],
      ).toEqual({
        error,
        inProgress: false,
        result: null,
      });
    });
  }
});

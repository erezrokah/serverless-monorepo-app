import { createAction } from 'redux-actions';
import * as types from './types';

export const apiMetaTypes = {
  email: 'email',
  private: 'private',
  public: 'public',
};

export const apiRequested = createAction(
  types.API_REQUESTED,
  undefined,
  (_, type) => ({ type }),
);
export const apiFulfilled = createAction(
  types.API_FULFILLED,
  undefined,
  (_, type) => ({ type }),
);
export const apiRejected = createAction(
  types.API_REJECTED,
  undefined,
  (_, type) => ({ type }),
);

export const emailApiRequested = (toAddress: string) =>
  apiRequested(toAddress, apiMetaTypes.email);
export const privateApiRequested = () =>
  apiRequested(undefined, apiMetaTypes.private);
export const publicApiRequested = () =>
  apiRequested(undefined, apiMetaTypes.public);

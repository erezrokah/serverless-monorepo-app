import { call, put, takeEvery } from 'redux-saga/effects';
import * as actions from '../actions/api';
import * as types from '../actions/types';
import {
  createTodosItem,
  emailApi,
  privateApi,
  publicApi,
  saveFile,
} from '../lib/api';
import { IActionWithMeta } from '../types/redux';

const handlers = {
  [actions.apiMetaTypes.email]: emailApi,
  [actions.apiMetaTypes.private]: privateApi,
  [actions.apiMetaTypes.public]: publicApi,
  [actions.apiMetaTypes.file]: saveFile,
  [actions.apiMetaTypes.dbCreate]: createTodosItem,
};

export const getHandler = (type: string) => {
  return handlers[type];
};

export function* handleApi(action: IActionWithMeta) {
  const { payload, meta } = action;
  const { type } = meta;

  try {
    const handler = yield call(getHandler, type);
    const result = yield call(handler, payload);
    yield put(actions.apiFulfilled(result, type));
  } catch (e) {
    yield put(actions.apiRejected(e, type));
  }
}

export function* apiRequested() {
  yield takeEvery(types.API_REQUESTED, handleApi);
}

const sagas = [apiRequested()];

export default sagas;

import * as actions from './api';
import * as types from './types';

describe('Api Actions', () => {
  test(types.API_REQUESTED, () => {
    const type = 'type';
    expect({
      meta: { type },
      type: types.API_REQUESTED,
    }).toEqual(actions.apiRequested(undefined, type));
  });

  test(types.API_FULFILLED, () => {
    const payload = 'payload';
    const type = 'type';
    expect({
      meta: { type },
      payload,
      type: types.API_FULFILLED,
    }).toEqual(actions.apiFulfilled(payload, type));
  });

  test(types.API_REJECTED, () => {
    const error = new Error('error');
    const type = 'type';
    expect({
      error: true,
      meta: { type },
      payload: error,
      type: types.API_REJECTED,
    }).toEqual(actions.apiRejected(error, type));
  });

  test('emailApiRequested', () => {
    const toAddress = 'toAddress';
    expect({
      meta: { type: actions.apiMetaTypes.email },
      payload: toAddress,
      type: types.API_REQUESTED,
    }).toEqual(actions.emailApiRequested(toAddress));
  });

  test('privateApiRequested', () => {
    expect({
      meta: { type: actions.apiMetaTypes.private },
      type: types.API_REQUESTED,
    }).toEqual(actions.privateApiRequested());
  });

  test('publicApiRequested', () => {
    expect({
      meta: { type: actions.apiMetaTypes.public },
      type: types.API_REQUESTED,
    }).toEqual(actions.publicApiRequested());
  });

  test('fileApiRequested', () => {
    const fileUrl = 'fileUrl';
    const key = 'key';
    expect({
      meta: { type: actions.apiMetaTypes.file },
      payload: { fileUrl, key },
      type: types.API_REQUESTED,
    }).toEqual(actions.fileApiRequested(fileUrl, key));
  });

  test('dbCreateApiRequested', () => {
    const text = 'text';
    expect({
      meta: { type: actions.apiMetaTypes.dbCreate },
      payload: text,
      type: types.API_REQUESTED,
    }).toEqual(actions.dbCreateApiRequested(text));
  });
});

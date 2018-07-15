import { call, put, takeEvery } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import * as actions from '../actions/api';
import * as types from '../actions/types';
import { emailApi, privateApi, publicApi } from '../lib/api';
import * as sagas from './api';

describe('api sagas', () => {
  test('getHandler', () => {
    expect(sagas.getHandler(actions.apiMetaTypes.email)).toBe(emailApi);
    expect(sagas.getHandler(actions.apiMetaTypes.private)).toBe(privateApi);
    expect(sagas.getHandler(actions.apiMetaTypes.public)).toBe(publicApi);
  });

  test('handleApi', () => {
    const toAddress = 'toAddress';
    const action = actions.emailApiRequested(toAddress);
    const generator = cloneableGenerator(sagas.handleApi)(action);

    expect(generator.next().value).toEqual(
      call(sagas.getHandler, action.meta.type),
    );

    const errorGenerator = generator.clone();
    const error = new Error('Some Error');
    expect(errorGenerator.throw && errorGenerator.throw(error).value).toEqual(
      put(actions.apiRejected(error, action.meta.type)),
    );
    expect(errorGenerator.next().done).toBe(true);

    const handler = jest.fn();
    expect(generator.next(handler).value).toEqual(call(handler, toAddress));

    const result = 'result';
    expect(generator.next(result).value).toEqual(
      put(actions.apiFulfilled(result, action.meta.type)),
    );
    expect(generator.next().done).toBe(true);
  });

  test('apiRequested', () => {
    const generator = sagas.apiRequested();
    expect(generator.next().value).toEqual(
      takeEvery(types.API_REQUESTED, sagas.handleApi),
    );
    expect(generator.next().done).toBe(true);
  });
});

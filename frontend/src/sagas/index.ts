import { all } from 'redux-saga/effects';
import api from './api';
import auth from './auth';

export const sagas = [...api, ...auth];

export default function* root() {
  yield all(sagas);
}

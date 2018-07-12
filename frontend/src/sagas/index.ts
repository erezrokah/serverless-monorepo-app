import { all } from 'redux-saga/effects';
import auth from './auth';

export const sagas = [...auth];

export default function* root() {
  yield all(sagas);
}

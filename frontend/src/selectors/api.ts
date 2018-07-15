import { apiMetaTypes } from '../actions/api';
import { IState } from '../types/redux';

export const apiStateSelector = (state: IState, type: string) =>
  state.api[type];

export const emailApiSelector = (state: IState) =>
  apiStateSelector(state, apiMetaTypes.email);

export const privateApiSelector = (state: IState) =>
  apiStateSelector(state, apiMetaTypes.private);

export const publicApiSelector = (state: IState) =>
  apiStateSelector(state, apiMetaTypes.public);

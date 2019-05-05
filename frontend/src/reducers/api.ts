import { combineReducers, Reducer, Action } from 'redux';
import { handleActions } from 'redux-actions';
import { filterActions } from 'redux-ignore';
import * as actions from '../actions/api';
import * as types from '../actions/types';
import { IActionWithMeta, IApiState } from '../types/redux';

export const predicate = (action: IActionWithMeta, metaType: string) => {
  if (action.meta && action.meta.type === metaType) {
    return true;
  }
  return false;
};

const initialState: IApiState = {
  error: null,
  inProgress: false,
  result: null,
};

const apiSubReducer = handleActions<IApiState, any, any>(
  {
    [types.API_REQUESTED]: () => {
      const newState = {
        error: null,
        inProgress: true,
        result: null,
      };
      return newState;
    },
    [types.API_FULFILLED]: (_, action) => {
      const newState = {
        error: null,
        inProgress: false,
        result: action.payload,
      };
      return newState;
    },
    [types.API_REJECTED]: (_, action) => {
      const newState = {
        error: action.payload,
        inProgress: false,
        result: null,
      };
      return newState;
    },
  },
  initialState,
) as Reducer<IApiState | undefined>;

export let subReducers: {
  [metaType: string]: Reducer<IApiState | undefined>;
} = {};
Object.keys(actions.apiMetaTypes).forEach(metaType => {
  subReducers[metaType] = filterActions(apiSubReducer, (action: Action) =>
    predicate(action as IActionWithMeta, metaType),
  );
});

export default combineReducers(subReducers);

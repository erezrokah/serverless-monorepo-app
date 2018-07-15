// istanbul ignore file
import { combineReducers } from 'redux';
import api from './api';
import auth from './auth';

const rootReducer = combineReducers({
  api,
  auth,
});

export default rootReducer;

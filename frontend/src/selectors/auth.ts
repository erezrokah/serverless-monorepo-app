import { IState } from '../types/redux';

export const isAuthenticated = (state: IState) => state.auth.authenticated;
export const isNotAuthenticated = (state: IState) => !state.auth.authenticated;
export const isInitialized = (state: IState) => state.auth.initialized;

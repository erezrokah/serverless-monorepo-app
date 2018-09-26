import { RouterState } from 'connected-react-router';
import { ActionMeta } from 'redux-actions';

interface IMeta {
  type: string;
}

export interface IActionWithMeta extends ActionMeta<any, IMeta> {}

export interface IAuthState {
  authenticated: boolean;
  error: Error | null;
  inProgress: boolean;
  initialized: boolean;
}

export interface IRouterState extends RouterState {
  location: {
    pathname: string;
    search: string;
    hash: string;
    key: string;
    state: { from: string };
  };
}

export interface IApiState {
  inProgress: boolean;
  result: any;
  error: Error | null;
}

export interface IState {
  auth: IAuthState;
  router: IRouterState;
  api: { [key: string]: IApiState };
}

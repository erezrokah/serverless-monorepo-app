import { RouterState } from 'connected-react-router';

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
    state?: { from: string };
  };
}

export interface IState {
  auth: IAuthState;
  router: IRouterState;
}

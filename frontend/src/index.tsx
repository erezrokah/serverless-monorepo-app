import {
  ConnectedRouter,
  connectRouter,
  routerMiddleware,
} from 'connected-react-router';
import { createBrowserHistory } from 'history';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import 'semantic-ui-css/semantic.min.css';
import App from './App';
import './index.css';
import rootReducer from './reducers';
import registerServiceWorker from './registerServiceWorker';
import sagas from './sagas';

const devEnvironment =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

const history = createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();

const applyAllMiddleware = () => {
  /* istanbul ignore if */
  if (devEnvironment) {
    const { createLogger } = require('redux-logger');
    const logger = createLogger();
    return applyMiddleware(sagaMiddleware, routerMiddleware(history), logger);
  } else {
    return applyMiddleware(sagaMiddleware, routerMiddleware(history));
  }
};

const __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ =
  // @ts-ignore: property does not exist
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

/* istanbul ignore next */
const loadExtension =
  devEnvironment &&
  typeof window === 'object' &&
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

const composeEnhancers = loadExtension
  ? /* istanbul ignore next */
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
  : compose;

const store = createStore(
  connectRouter(history)(rootReducer),
  composeEnhancers(applyAllMiddleware()),
);

sagaMiddleware.run(sagas);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root') as HTMLElement,
);
registerServiceWorker();

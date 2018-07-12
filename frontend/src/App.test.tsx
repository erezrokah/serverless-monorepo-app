import { shallow } from 'enzyme';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import * as renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { syncAuthStateRequested as syncAuthState } from './actions/auth';
import ConnectedApp, { App } from './App';

const middlewares: any[] = [];
const mockStore = configureStore(middlewares);

jest.mock('./components/Api', () => {
  return {
    default: 'api-component',
  };
});

jest.mock('./components/AuthStatus', () => {
  return {
    default: 'auth-status-component',
  };
});

jest.mock('./components/Loading', () => {
  return {
    ComponentLoading: 'component-loading-component',
    default: 'loading-component',
  };
});

jest.mock('./selectors/auth');
jest.mock('./selectors/router');

const props = {
  initialized: true,
  pathname: '/public',
  syncAuthState: jest.fn(),
};

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <MemoryRouter>
        <App {...props} />
      </MemoryRouter>,
      div,
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  test('renders correctly initialized=true', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <App {...props} />
        </MemoryRouter>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('renders correctly initialized=false', () => {
    const tree = renderer
      .create(<App {...props} initialized={false} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('syncs auth state on mount', () => {
    const wrapper = shallow(<App {...props} />, {
      disableLifecycleMethods: true,
    });

    // @ts-ignore access to undefined
    wrapper.instance().componentDidMount();

    expect(props.syncAuthState).toHaveBeenCalledTimes(1);
  });

  test('should connect component correctly', () => {
    const { isInitialized } = require('./selectors/auth');
    isInitialized.mockReturnValueOnce(true);

    const { pathnameSelector } = require('./selectors/router');
    pathnameSelector.mockReturnValueOnce('somepath');

    const state = { someState: 'someState' };
    const store = mockStore(state);

    // @ts-ignore wrong store type
    const wrapper = shallow(<ConnectedApp store={store} />);

    expect(wrapper.props().initialized).toBe(true);
    expect(wrapper.props().pathname).toBe('somepath');
    wrapper.props().syncAuthState();

    expect(store.getActions()).toHaveLength(1);
    expect(store.getActions()[0]).toEqual(syncAuthState());

    expect(isInitialized).toHaveBeenCalledTimes(1);
    expect(isInitialized).toHaveBeenCalledWith(state);

    expect(pathnameSelector).toHaveBeenCalledTimes(1);
    expect(pathnameSelector).toHaveBeenCalledWith(state);
  });
});

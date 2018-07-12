import { shallow } from 'enzyme';
import * as React from 'react';
import * as renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { Button } from 'semantic-ui-react';
import { logoutRequested as logout } from '../../actions/auth';
import ConnectedAuthStatus, { AuthStatus } from './';

jest.mock('../../lib/api');
jest.mock('../../selectors/auth');

const middlewares: any[] = [];
const mockStore = configureStore(middlewares);

const props = {
  authenticated: false,
  logout: jest.fn(),
};

describe('AuthStatus Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('should render correctly authenticated=false', () => {
    const tree = renderer
      .create(<AuthStatus {...props} authenticated={false} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should render correctly authenticated=true', () => {
    const tree = renderer
      .create(<AuthStatus {...props} authenticated={true} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should call logout on button click', () => {
    const wrapper = shallow(<AuthStatus {...props} authenticated={true} />);

    wrapper.find(Button).simulate('click');

    expect(props.logout).toHaveBeenCalledTimes(1);
  });

  test('should connect component correctly', () => {
    const { isAuthenticated } = require('../../selectors/auth');
    isAuthenticated.mockReturnValueOnce(true);

    const state = { someState: 'someState' };
    const store = mockStore(state);

    // @ts-ignore wrong store type
    const wrapper = shallow(<ConnectedAuthStatus store={store} />);

    expect(wrapper.props().authenticated).toBe(true);
    wrapper.props().logout();

    expect(store.getActions()).toHaveLength(1);
    expect(store.getActions()[0]).toEqual(logout());

    expect(isAuthenticated).toHaveBeenCalledTimes(1);
    expect(isAuthenticated).toHaveBeenCalledWith(state);
  });
});

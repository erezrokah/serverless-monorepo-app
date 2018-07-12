import { shallow } from 'enzyme';
import * as React from 'react';
import * as renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { Button } from 'semantic-ui-react';
import { loginRequested as login } from '../../actions/auth';
import ConnectedLogin, { Login } from './';

jest.mock('../../lib/auth');

const middlewares: any[] = [];
const mockStore = configureStore(middlewares);

const props = {
  isAuthenticated: false,
  isAuthenticating: false,
  login: jest.fn(),
  redirectPath: '/',
};

describe('Callback Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render correctly', () => {
    const tree = renderer.create(<Login {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('invokes login on button click', async () => {
    const wrapper = shallow(<Login {...props} />);

    wrapper.find(Button).simulate('click');

    expect(props.login).toHaveBeenCalledTimes(1);
  });

  test('should connect component correctly', () => {
    const store = mockStore();

    // @ts-ignore wrong store type
    const wrapper = shallow(<ConnectedLogin store={store} />);

    wrapper.props().login();

    expect(store.getActions()).toHaveLength(1);
    expect(store.getActions()[0]).toEqual(login());
  });
});

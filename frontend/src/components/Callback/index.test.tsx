import { replace } from 'connected-react-router';
import { shallow } from 'enzyme';
import * as React from 'react';
import * as renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { loginFulfilled, loginRejected } from '../../actions/auth';
import { paths } from '../../routes';
import ConnectedCallback, { Callback } from './';

jest.mock('../../lib/auth');
jest.mock('../Loading', () => {
  return {
    ComponentLoading: 'component-loading-component',
    default: 'loading-component',
  };
});

const middlewares: any[] = [];
const mockStore = configureStore(middlewares);

const props = {
  loginFulfilled: jest.fn(),
  loginRejected: jest.fn(),
  replace: jest.fn(),
};

describe('Callback Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render correctly', () => {
    const tree = renderer.create(<Callback {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('handles authentication on mount with auth state', async () => {
    const { handleAuthentication } = require('../../lib/auth');

    const wrapper = shallow(<Callback {...props} />, {
      disableLifecycleMethods: true,
    });

    const authResult = { state: 'state' };
    handleAuthentication.mockReturnValueOnce(Promise.resolve(authResult));

    // @ts-ignore access to undefined
    await wrapper.instance().componentDidMount();

    expect(handleAuthentication).toHaveBeenCalledTimes(1);
    expect(props.loginFulfilled).toHaveBeenCalledTimes(1);
    expect(props.loginFulfilled).toHaveBeenCalledWith(authResult);
    expect(props.replace).toHaveBeenCalledTimes(1);
    expect(props.replace).toHaveBeenCalledWith(authResult.state);
  });

  test('handles authentication on mount no auth state', async () => {
    const { handleAuthentication } = require('../../lib/auth');

    const wrapper = shallow(<Callback {...props} />, {
      disableLifecycleMethods: true,
    });

    const authResult = {};
    handleAuthentication.mockReturnValueOnce(Promise.resolve(authResult));

    // @ts-ignore access to undefined
    await wrapper.instance().componentDidMount();

    expect(props.replace).toHaveBeenCalledWith('/public');
  });

  test('handles authentication on mount with error', async () => {
    const { handleAuthentication } = require('../../lib/auth');

    const wrapper = shallow(<Callback {...props} />, {
      disableLifecycleMethods: true,
    });

    const error = new Error('error');
    handleAuthentication.mockReturnValueOnce(Promise.reject(error));

    // @ts-ignore access to undefined
    await wrapper.instance().componentDidMount();

    expect(props.loginRejected).toHaveBeenCalledTimes(1);
    expect(props.loginRejected).toHaveBeenCalledWith(error);
    expect(props.replace).toHaveBeenCalledTimes(1);
    expect(props.replace).toHaveBeenCalledWith(paths.login);
  });

  test('should connect component correctly', () => {
    const store = mockStore();

    // @ts-ignore wrong store type
    const wrapper = shallow(<ConnectedCallback store={store} />);

    wrapper.props().loginFulfilled();
    wrapper.props().loginRejected();
    wrapper.props().replace('/');

    expect(store.getActions()).toHaveLength(3);
    expect(store.getActions()[0]).toEqual(loginFulfilled());
    expect(store.getActions()[1]).toEqual(loginRejected());
    expect(store.getActions()[2]).toEqual(replace(paths.home));
  });
});

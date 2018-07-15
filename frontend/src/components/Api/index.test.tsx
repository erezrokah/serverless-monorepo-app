import { shallow } from 'enzyme';
import * as React from 'react';
import * as renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import {
  emailApiRequested,
  privateApiRequested,
  publicApiRequested,
} from '../../actions/api';
import ConnectedApi, { Api } from './';

const middlewares: any[] = [];
const mockStore = configureStore(middlewares);

const props = {
  emailApiRequested: jest.fn(),
  privateApiRequested: jest.fn(),
  publicApiRequested: jest.fn(),
};

describe('Api Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render correctly', () => {
    const tree = renderer.create(<Api {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should call public api on button click', () => {
    const wrapper = shallow(<Api {...props} />);

    wrapper.find('#publicApi').simulate('click');

    expect(props.publicApiRequested).toHaveBeenCalledTimes(1);
  });

  test('should call private api on button click', () => {
    const wrapper = shallow(<Api {...props} />);

    wrapper.find('#privateApi').simulate('click');

    expect(props.privateApiRequested).toHaveBeenCalledTimes(1);
  });

  test('should call email api on button click', () => {
    const wrapper = shallow(<Api {...props} />);

    const email = 'email';

    wrapper.setState({ email });

    wrapper.find('#apiForm').simulate('submit');

    expect(props.emailApiRequested).toHaveBeenCalledTimes(1);
    expect(props.emailApiRequested).toHaveBeenCalledWith(email);
  });

  test('should update state on email change', () => {
    const wrapper = shallow(<Api {...props} />);

    wrapper.setState({ email: '' });
    const email = 'email';

    wrapper
      .find('#emailApi')
      .simulate('change', {}, { name: email, value: email });

    expect(wrapper.state()).toEqual({ email });
  });

  test('should connect component correctly', () => {
    const store = mockStore();

    // @ts-ignore wrong store type
    const wrapper = shallow(<ConnectedApi store={store} />);

    const toAddress = 'toAddress';
    wrapper.props().emailApiRequested(toAddress);
    wrapper.props().privateApiRequested();
    wrapper.props().publicApiRequested();

    expect(store.getActions()).toHaveLength(3);
    expect(store.getActions()[0]).toEqual(emailApiRequested(toAddress));
    expect(store.getActions()[1]).toEqual(privateApiRequested());
    expect(store.getActions()[2]).toEqual(publicApiRequested());
  });
});

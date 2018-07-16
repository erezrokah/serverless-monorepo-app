import { shallow } from 'enzyme';
import * as React from 'react';
import * as renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { Form } from 'semantic-ui-react';
import { emailApiRequested } from '../../actions/api';
import ConnectedEmailApi, { EmailApi } from './EmailApi';

const middlewares: any[] = [];
const mockStore = configureStore(middlewares);

jest.mock('../../selectors/api');

const props = {
  emailApiRequested: jest.fn(),
  error: null,
  inProgress: false,
  result: 'result',
};

describe('Api Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render correctly', () => {
    const tree = renderer.create(<EmailApi {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should render correctly with error', () => {
    const tree = renderer
      .create(<EmailApi {...props} error={new Error('error')} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should call email api on button click', () => {
    const wrapper = shallow(<EmailApi {...props} />);

    const email = 'email';

    wrapper.setState({ email });

    wrapper.find(Form).simulate('submit');

    expect(props.emailApiRequested).toHaveBeenCalledTimes(1);
    expect(props.emailApiRequested).toHaveBeenCalledWith(email);
  });

  test('should update state on email change', () => {
    const wrapper = shallow(<EmailApi {...props} />);

    wrapper.setState({ email: '' });
    const email = 'email';

    wrapper
      .find('#emailApi')
      .simulate('change', {}, { name: email, value: email });

    expect(wrapper.state()).toEqual({ email });
  });

  test('should connect component correctly', () => {
    const { emailApiSelector } = require('../../selectors/api');
    const mockState = {
      error: null,
      inProgress: true,
      result: 'result',
    };
    emailApiSelector.mockReturnValueOnce(mockState);
    const store = mockStore();

    // @ts-ignore wrong store type
    const wrapper = shallow(<ConnectedEmailApi store={store} />);

    expect(wrapper.props().error).toBe(mockState.error);
    expect(wrapper.props().inProgress).toBe(mockState.inProgress);
    expect(wrapper.props().result).toBe(mockState.result);
    const toAddress = 'toAddress';
    wrapper.props().emailApiRequested(toAddress);

    expect(store.getActions()).toHaveLength(1);
    expect(store.getActions()[0]).toEqual(emailApiRequested(toAddress));
  });
});

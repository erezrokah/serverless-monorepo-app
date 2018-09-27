import { shallow } from 'enzyme';
import * as React from 'react';
import * as renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { Button } from 'semantic-ui-react';
import { privateApiRequested } from '../../actions/api';
import ConnectedPrivateApi, { PrivateApi } from './PrivateApi';

const middlewares: any[] = [];
const mockStore = configureStore(middlewares);

jest.mock('../../selectors/api');

const props = {
  error: null,
  inProgress: false,
  privateApiRequested: jest.fn(),
  result: 'result',
};

describe('Private Api Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render correctly', () => {
    const tree = renderer.create(<PrivateApi {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should render correctly with error', () => {
    const tree = renderer
      .create(<PrivateApi {...props} error={new Error('error')} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should call private api on button click', () => {
    const wrapper = shallow(<PrivateApi {...props} />);

    wrapper.find(Button).simulate('click');

    expect(props.privateApiRequested).toHaveBeenCalledTimes(1);
  });

  test('should connect component correctly', () => {
    const { privateApiSelector } = require('../../selectors/api');
    const mockState = {
      error: null,
      inProgress: true,
      result: 'result',
    };
    privateApiSelector.mockReturnValueOnce(mockState);
    const store = mockStore();

    // @ts-ignore wrong store type
    const wrapper = shallow(<ConnectedPrivateApi store={store} />);

    expect(wrapper.props().error).toBe(mockState.error);
    expect(wrapper.props().inProgress).toBe(mockState.inProgress);
    expect(wrapper.props().result).toBe(mockState.result);
    wrapper.props().privateApiRequested();

    expect(store.getActions()).toHaveLength(1);
    expect(store.getActions()[0]).toEqual(privateApiRequested());
  });
});

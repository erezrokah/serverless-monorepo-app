import { shallow } from 'enzyme';
import * as React from 'react';
import * as renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { publicApiRequested } from '../../actions/api';
import ConnectedPublicApi, { PublicApi } from './PublicApi';

const middlewares: any[] = [];
const mockStore = configureStore(middlewares);

jest.mock('../../selectors/api');

const props = {
  error: null,
  inProgress: false,
  publicApiRequested: jest.fn(),
  result: 'result',
};

describe('Api Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render correctly', () => {
    const tree = renderer.create(<PublicApi {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should render correctly with error', () => {
    const tree = renderer
      .create(<PublicApi {...props} error={new Error('error')} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should call private api on button click', () => {
    const wrapper = shallow(<PublicApi {...props} />);

    wrapper.find('#privateApi').simulate('click');

    expect(props.publicApiRequested).toHaveBeenCalledTimes(1);
  });

  test('should connect component correctly', () => {
    const { publicApiSelector } = require('../../selectors/api');
    const mockState = {
      error: null,
      inProgress: true,
      result: 'result',
    };
    publicApiSelector.mockReturnValueOnce(mockState);
    const store = mockStore();

    // @ts-ignore wrong store type
    const wrapper = shallow(<ConnectedPublicApi store={store} />);

    expect(wrapper.props().error).toBe(mockState.error);
    expect(wrapper.props().inProgress).toBe(mockState.inProgress);
    expect(wrapper.props().result).toBe(mockState.result);
    wrapper.props().publicApiRequested();

    expect(store.getActions()).toHaveLength(1);
    expect(store.getActions()[0]).toEqual(publicApiRequested());
  });
});

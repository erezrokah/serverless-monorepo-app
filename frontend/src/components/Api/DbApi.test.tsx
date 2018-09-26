import { shallow } from 'enzyme';
import * as React from 'react';
import * as renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { Form } from 'semantic-ui-react';
import { dbCreateApiRequested } from '../../actions/api';
import ConnectedDbApi, { DbApi } from './DbApi';

const middlewares: any[] = [];
const mockStore = configureStore(middlewares);

jest.mock('../../selectors/api');

const props = {
  dbCreateApiRequested: jest.fn(),
  error: null,
  inProgress: false,
  result: 'result',
};

describe('Db Api Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render correctly', () => {
    const tree = renderer.create(<DbApi {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should render correctly with error', () => {
    const tree = renderer
      .create(<DbApi {...props} error={new Error('error')} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should call db api on button click', () => {
    const wrapper = shallow(<DbApi {...props} />);

    const text = 'text';

    wrapper.setState({ text });

    wrapper.find(Form).simulate('submit');

    expect(props.dbCreateApiRequested).toHaveBeenCalledTimes(1);
    expect(props.dbCreateApiRequested).toHaveBeenCalledWith(text);
  });

  test('should update state on text change', () => {
    const wrapper = shallow(<DbApi {...props} />);

    wrapper.setState({ text: '' });
    const text = 'text';

    wrapper.find('#dbApi').simulate('change', {}, { name: text, value: text });

    expect(wrapper.state()).toEqual({ text });
  });

  test('should connect component correctly', () => {
    const { dbCreateApiSelector } = require('../../selectors/api');
    const mockState = {
      error: null,
      inProgress: true,
      result: 'result',
    };
    dbCreateApiSelector.mockReturnValueOnce(mockState);
    const store = mockStore();

    // @ts-ignore wrong store type
    const wrapper = shallow(<ConnectedDbApi store={store} />);

    expect(wrapper.props().error).toBe(mockState.error);
    expect(wrapper.props().inProgress).toBe(mockState.inProgress);
    expect(wrapper.props().result).toBe(mockState.result);
    const text = 'text';
    wrapper.props().dbCreateApiRequested(text);

    expect(store.getActions()).toHaveLength(1);
    expect(store.getActions()[0]).toEqual(dbCreateApiRequested(text));
  });
});

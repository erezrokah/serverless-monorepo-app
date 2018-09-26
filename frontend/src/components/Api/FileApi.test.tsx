import { shallow } from 'enzyme';
import * as React from 'react';
import * as renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { Form } from 'semantic-ui-react';
import { fileApiRequested } from '../../actions/api';
import ConnectedFileApi, { FileApi } from './FileApi';

const middlewares: any[] = [];
const mockStore = configureStore(middlewares);

jest.mock('../../selectors/api');

const props = {
  error: null,
  fileApiRequested: jest.fn(),
  inProgress: false,
  result: 'result',
};

describe('File Api Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render correctly', () => {
    const tree = renderer.create(<FileApi {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should render correctly with error', () => {
    const tree = renderer
      .create(<FileApi {...props} error={new Error('error')} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should call file api on button click', () => {
    const wrapper = shallow(<FileApi {...props} />);

    const fileUrl = 'fileUrl';
    const fileName = 'fileName';

    wrapper.setState({ fileUrl, fileName });

    wrapper.find(Form).simulate('submit');

    expect(props.fileApiRequested).toHaveBeenCalledTimes(1);
    expect(props.fileApiRequested).toHaveBeenCalledWith(fileUrl, fileName);
  });

  test('should update state on input changes', () => {
    const wrapper = shallow(<FileApi {...props} />);

    wrapper.setState({ fileUrl: '', fileName: '' });
    const fileUrl = 'fileUrl';
    const fileName = 'fileName';

    wrapper
      .find('#fileUrl')
      .simulate('change', {}, { name: 'fileUrl', value: 'fileUrl' });
    wrapper
      .find('#fileName')
      .simulate('change', {}, { name: 'fileName', value: 'fileName' });

    expect(wrapper.state()).toEqual({ fileUrl, fileName });
  });

  test('should connect component correctly', () => {
    const { fileApiSelector } = require('../../selectors/api');
    const mockState = {
      error: null,
      inProgress: true,
      result: 'result',
    };
    fileApiSelector.mockReturnValueOnce(mockState);
    const store = mockStore();

    // @ts-ignore wrong store type
    const wrapper = shallow(<ConnectedFileApi store={store} />);

    expect(wrapper.props().error).toBe(mockState.error);
    expect(wrapper.props().inProgress).toBe(mockState.inProgress);
    expect(wrapper.props().result).toBe(mockState.result);
    const fileUrl = 'fileUrl';
    const fileName = 'fileName';
    wrapper.props().fileApiRequested(fileUrl, fileName);

    expect(store.getActions()).toHaveLength(1);
    expect(store.getActions()[0]).toEqual(fileApiRequested(fileUrl, fileName));
  });
});

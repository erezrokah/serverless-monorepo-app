import { shallow } from 'enzyme';
import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { Button } from 'semantic-ui-react';
import Loading, { ComponentLoading } from './';

describe('Loading Components', () => {
  describe('Loading', () => {
    test('should render correctly', () => {
      const tree = renderer.create(<Loading />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('ComponentLoading', () => {
    const props = {
      error: null,
      isLoading: false,
      pastDelay: false,
      retry: jest.fn(),
      timedOut: false,
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should render correctly', () => {
      const tree = renderer.create(<ComponentLoading {...props} />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should render correctly with error', () => {
      const tree = renderer
        .create(<ComponentLoading {...props} error={new Error('error')} />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should render correctly with timedOut', () => {
      const tree = renderer
        .create(<ComponentLoading {...props} timedOut={true} />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should render correctly with pastDelay', () => {
      const tree = renderer
        .create(<ComponentLoading {...props} pastDelay={true} />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should retry on click (error)', () => {
      const wrapper = shallow(
        <ComponentLoading {...props} error={new Error('error')} />,
      );

      wrapper.find(Button).simulate('click');

      expect(props.retry).toHaveBeenCalledTimes(1);
    });

    test('should retry on click (timeout)', () => {
      const wrapper = shallow(<ComponentLoading {...props} timedOut={true} />);

      wrapper.find(Button).simulate('click');

      expect(props.retry).toHaveBeenCalledTimes(1);
    });
  });
});

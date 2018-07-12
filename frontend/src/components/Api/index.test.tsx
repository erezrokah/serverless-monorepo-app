import { shallow } from 'enzyme';
import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Api from './';

jest.mock('../../lib/api');

describe('Api Component', () => {
  test('should render correctly', () => {
    const tree = renderer.create(<Api />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should call public api on button click', () => {
    const { publicApi } = require('../../lib/api');
    const wrapper = shallow(<Api />);

    // @ts-ignore access to undefined
    wrapper
      .find('#publicApi')
      .props()
      .onClick();

    expect(publicApi).toHaveBeenCalledTimes(1);
  });

  test('should call private api on button click', () => {
    const { privateApi } = require('../../lib/api');
    const wrapper = shallow(<Api />);

    // @ts-ignore access to undefined
    wrapper
      .find('#privateApi')
      .props()
      .onClick();

    expect(privateApi).toHaveBeenCalledTimes(1);
  });
});

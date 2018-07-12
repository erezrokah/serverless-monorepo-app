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

    wrapper.find('#publicApi').simulate('click');

    expect(publicApi).toHaveBeenCalledTimes(1);
  });

  test('should call private api on button click', () => {
    const { privateApi } = require('../../lib/api');
    const wrapper = shallow(<Api />);

    wrapper.find('#privateApi').simulate('click');

    expect(privateApi).toHaveBeenCalledTimes(1);
  });

  test('should call email api on button click', () => {
    const { emailApi } = require('../../lib/api');
    const wrapper = shallow(<Api />);

    const email = 'email';

    wrapper.setState({ email });

    wrapper.find('#apiForm').simulate('submit');

    expect(emailApi).toHaveBeenCalledTimes(1);
    expect(emailApi).toHaveBeenCalledWith(email);
  });

  test('should update state on email change', () => {
    const wrapper = shallow(<Api />);

    wrapper.setState({ email: '' });
    const email = 'email';

    wrapper
      .find('#emailApi')
      .simulate('change', {}, { name: email, value: email });

    expect(wrapper.state()).toEqual({ email });
  });
});

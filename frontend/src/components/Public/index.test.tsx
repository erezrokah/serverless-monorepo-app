import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Public from './';

describe('Public Component', () => {
  test('should render correctly', () => {
    const tree = renderer.create(<Public />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

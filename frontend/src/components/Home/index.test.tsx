import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Home from './';

describe('Home Component', () => {
  test('should render correctly', () => {
    const tree = renderer.create(<Home />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

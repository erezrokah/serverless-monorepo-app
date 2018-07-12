import * as React from 'react';
import * as renderer from 'react-test-renderer';
import NotFound from './';

describe('NotFound Component', () => {
  test('should render correctly', () => {
    const tree = renderer.create(<NotFound />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Private from './';

describe('Private Component', () => {
  test('should render correctly', () => {
    const tree = renderer
      .create(
        <Private
          redirectPath=""
          isAuthenticated={true}
          isAuthenticating={false}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

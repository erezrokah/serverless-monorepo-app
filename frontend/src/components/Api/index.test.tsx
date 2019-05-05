import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Api from './';

jest.mock('./EmailApi', () => 'EmailApi');
jest.mock('./PrivateApi', () => 'PrivateApi');
jest.mock('./PublicApi', () => 'PublicApi');
jest.mock('./DbApi', () => 'DbApi');
jest.mock('./FileApi', () => 'FileApi');

describe('Api Component', () => {
  test('should render correctly', () => {
    const tree = renderer.create(<Api />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

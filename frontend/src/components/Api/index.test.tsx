import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Api from './';

jest.mock('./EmailApi', () => ({ default: 'EmailApi' }));
jest.mock('./PrivateApi', () => ({ default: 'PrivateApi' }));
jest.mock('./PublicApi', () => ({ default: 'PublicApi' }));
jest.mock('./DbApi', () => ({ default: 'DbApi' }));
jest.mock('./FileApi', () => ({ default: 'FileApi' }));

describe('Api Component', () => {
  test('should render correctly', () => {
    const tree = renderer.create(<Api />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

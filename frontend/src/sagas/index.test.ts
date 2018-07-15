import { all } from 'redux-saga/effects';
import root from './index';

jest.mock('./api', () => ({
  default: ['api'],
}));

jest.mock('./auth', () => ({
  default: ['auth'],
}));

describe('Sagas Index', () => {
  test('should export all sagas', () => {
    const generator = root();
    expect(generator.next().value).toEqual(all(['api', 'auth']));
    expect(generator.next().done).toBe(true);
  });
});

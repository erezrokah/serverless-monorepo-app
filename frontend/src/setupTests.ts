import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-styled-components';

Enzyme.configure({ adapter: new Adapter() });

const localStorageMock = (() => {
  return {
    getItem: jest.fn(),
    removeItem: jest.fn(),
    setItem: jest.fn(),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const fetchMock = jest.fn();

Object.defineProperty(window, 'fetch', {
  value: fetchMock,
});

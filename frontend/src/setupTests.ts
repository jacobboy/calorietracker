import * as Enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

// TODO this probably isn't ideal for many tests using localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
  };
// window.localStorage = localStorageMock;
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});
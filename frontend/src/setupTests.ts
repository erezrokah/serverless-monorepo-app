import Enzyme = require('enzyme');
import Adapter = require('enzyme-adapter-react-16');
import 'jest-styled-components';

Enzyme.configure({ adapter: new Adapter() });

const config = require('./jest.config');

module.exports = {
  ...config,
  roots: ['<rootDir>/e2e'],
};

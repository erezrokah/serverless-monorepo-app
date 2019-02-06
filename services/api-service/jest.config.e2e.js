const config = require('./jest.config');

module.exports = {
  ...config,
  roots: ['<rootDir>/e2e'],
  globalSetup: '<rootDir>/e2e/setup_hook.js',
  setupTestFrameworkScriptFile: '<rootDir>/e2e/setupFrameworks.ts',
};

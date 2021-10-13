// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // A set of global variables that need to be available in all test environments
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
  },

  // An array of file extensions your modules use
  moduleFileExtensions: ['ts', 'js'],

  // The test environment that will be used for testing
  testEnvironment: 'node',

  // The glob patterns Jest uses to detect test files
  testMatch: ['**/test/**/*.spec.ts'],

  // A map from regular expressions to paths to transformers
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },

  errorOnDeprecated: true,
};
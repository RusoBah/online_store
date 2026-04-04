export default {
    testEnvironment: 'node',
    transform: {},
    moduleFileExtensions: ['js', 'mjs'],
    testMatch: ['**/tests/**/*.test.js'],
    verbose: true,
    injectGlobals: true,
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
};

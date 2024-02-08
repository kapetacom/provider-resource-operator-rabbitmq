/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    moduleNameMapper: {
        '\.ya?ml$': '<rootDir>/__mocks__/yaml.js',
    }
};

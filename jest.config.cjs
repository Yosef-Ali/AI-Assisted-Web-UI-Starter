/** @type {import('jest').Config} */
module.exports = {
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    setupFilesAfterEnv: ['<rootDir>/tests/setup/jest.setup.ts'],
    testPathIgnorePatterns: ['/node_modules/', '/.next/'],
    verbose: true,
    collectCoverage: true,
    collectCoverageFrom: [
        'src/services/**/*.ts',
        'src/app/api/**/*.ts',
        '!src/**/__tests__/**'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
    coverageThreshold: {
        global: { lines: 60, statements: 60, branches: 45, functions: 55 }
    },
    // NOTE: To include React component coverage later, add a Babel transform with preset-react or use swc/jest.
};
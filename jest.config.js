module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@/components/(.*)$': '<rootDir>/src/components/$1',
        '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
        '^@/app/(.*)$': '<rootDir>/src/app/$1',
    },
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
    },
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
    testMatch: [
        '<rootDir>/src/**/__tests__/**/*.(js|jsx|ts|tsx)',
        '<rootDir>/src/**/*.(test|spec).(js|jsx|ts|tsx)',
    ],
    collectCoverageFrom: [
        'src/**/*.(js|jsx|ts|tsx)',
        '!src/**/*.d.ts',
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
};
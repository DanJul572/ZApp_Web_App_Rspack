export default {
  coverageProvider: 'v8',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.{js,ts,tsx}',
    '!src/aliases/**',
    '!src/routes.jsx',
    '!src/index.jsx',
  ],
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: {
            jsx: true,
            syntax: 'ecmascript',
          },
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
        isModule: 'unknown',
      },
    ],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@configs/(.*)$': '<rootDir>/src/configs/$1',
  },
};

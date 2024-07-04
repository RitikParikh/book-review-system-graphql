import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js'],
    transform: {
      '^.+\\.ts?$': 'ts-jest',
    },
    testMatch: ['<rootDir>/tests/**/*.test.ts'],
  };

export default config;
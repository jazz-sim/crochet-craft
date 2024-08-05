import { createDefaultPreset } from 'ts-jest';

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    ...createDefaultPreset({ tsconfig: './tsconfig.cjs.json' }),
    moduleNameMapper: { '^(\\.\\.?/.*)\\.js$': '$1' },
};

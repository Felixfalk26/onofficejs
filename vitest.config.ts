import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: false,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/index.ts', // barrel re-exports only
        'src/constants/index.ts',
      ],
      thresholds: {
        lines: 75,
        functions: 60,
        branches: 80,
        statements: 75,
      },
    },
  },
});

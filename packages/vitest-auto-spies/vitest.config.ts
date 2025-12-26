import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    watch: false,
    environment: 'node',
    setupFiles: ['../../node_modules/@hirez_io/vitest-given/dist/vitest-given.js'],
    restoreMocks: true,
    coverage: {
      provider: 'v8' as const,
      reporter: ['text', 'json', 'html'],
    },
  },
});

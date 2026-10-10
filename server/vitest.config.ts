import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    server: {
      deps: {
        // node:sqlite is a Node builtin; let Vitest externalise it instead of
        // trying to bundle the bare `sqlite` specifier.
        external: [/^node:/, 'node:sqlite', 'sqlite'],
      },
    },
  },
});

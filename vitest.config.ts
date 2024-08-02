import path from 'node:path';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

const CWD = process.cwd();

export default defineConfig({
  test: {
    alias: {
      'graphql-config': path.join(CWD, 'src', 'index.ts'),
      // fixes Duplicate "graphql" modules cannot be used at the same time since different
      graphql: path.join(CWD, 'node_modules', 'graphql', 'index.js'),
    },
  },
  plugins: [tsconfigPaths()],
});

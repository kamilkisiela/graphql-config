import path from 'node:path';
import { defineConfig } from 'vitest/config';
import tsconfig from './tsconfig.json';

const GRAPHQL_PATH = path.join(__dirname, 'node_modules', 'graphql');

export default defineConfig({
  test: {
    globals: true,
    // @ts-expect-error -- paths' values as array works too
    alias: {
      ...tsconfig.compilerOptions.paths,
      // fixes Duplicate "graphql" modules cannot be used at the same time since different
      graphql: path.join(GRAPHQL_PATH, 'index.js'),
    },
  },
});

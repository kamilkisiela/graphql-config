import { defineConfig } from 'vitest/config';
import tsconfig from './tsconfig.json';

export default defineConfig({
  test: {
    // @ts-expect-error -- It just works
    alias: tsconfig.compilerOptions.paths,
  },
});

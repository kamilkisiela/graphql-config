module.exports = {
  root: true,
  reportUnusedDisableDirectives: true,
  env: {
    node: true,
  },
  // TODO: remove this line to lint website folder from root folder
  ignorePatterns: 'website',
  overrides: [
    {
      files: '*.{js,ts,jsx,tsx,cjs,cts,mjs,mts,cjsx,ctsx,mjsx,mtsx}',
      parser: '@typescript-eslint/parser',
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
      rules: {
        'no-console': 'error',
        '@typescript-eslint/no-explicit-any': 'warn',
      },
    },
  ],
};

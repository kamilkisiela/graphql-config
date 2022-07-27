module.exports = {
  root: true,
  ignorePatterns: ['!.*', '.next'],
  reportUnusedDisableDirectives: true,
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'next', 'prettier'],
  settings: {
    next: {
      rootDir: './src',
    },
  },
  rules: {
    'no-else-return': ['error', { allowElseIf: false }],
    'react/jsx-curly-brace-presence': ['error', 'never'],
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal'],
        pathGroups: [
          {
            pattern: './*.css',
            group: 'unknown',
            position: 'after',
          },
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['.eslintrc.cjs', 'next.config.mjs'],
      env: {
        node: true,
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
};

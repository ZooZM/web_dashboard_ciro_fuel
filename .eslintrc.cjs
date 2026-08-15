module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.app.json',
    tsconfigRootDir: __dirname,
    ecmaFeatures: { jsx: true },
    sourceType: 'module',
  },
  env: { browser: true, es2022: true },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'react-refresh', 'i18next'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  settings: { react: { version: 'detect' } },
  ignorePatterns: ['dist/', 'node_modules/', 'coverage/', 'playwright-report/', '*.cjs'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off', // TypeScript prop typing supersedes PropTypes (Constitution I)
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/no-explicit-any': 'error',
  },
  overrides: [
    {
      // FR-022: no hard-coded display strings in feature/UI code — every user-facing
      // string must come from i18next. Excludes components/ui (shadcn primitives, which
      // take localized text as props from callers, not literal children).
      files: ['src/features/**/*.tsx', 'src/components/layout/**/*.tsx', 'src/routing/**/*.tsx'],
      rules: {
        'i18next/no-literal-string': [
          'error',
          {
            markupOnly: true,
            ignoreAttribute: ['data-testid', 'to', 'href', 'name', 'type', 'id', 'className'],
          },
        ],
      },
    },
  ],
};

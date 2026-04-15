// eslint.js — base ESLint configuration (flat config, ESLint 9)
// Usage: import baseConfig from '@somenergia/frontend-config/eslint'
//        export default [...baseConfig, { /* project-specific overrides */ }]

import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import prettier from 'eslint-plugin-prettier'
import importPlugin from 'eslint-plugin-import'
import promisePlugin from 'eslint-plugin-promise'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'

export default [
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**', 'coverage/**', '.env*'],
  },

  js.configs.recommended,
  react.configs.flat['jsx-runtime'],

  {
    files: ['**/*.{js,jsx}'],

    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier,
      import: importPlugin,
      promise: promisePlugin,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },

    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },

    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        node: { extensions: ['.js', '.jsx'] },
      },
    },

    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // React
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-vars': 'error',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // Formatting
      'prettier/prettier': 'warn',

      // Code quality
      eqeqeq: ['error', 'always'],
      'arrow-parens': ['error', 'always'],

      // Import order groups:
      // 1. Side effects (polyfills, global CSS…)
      // 2. React and its ecosystem
      // 3. @mui
      // 4. @somenergia
      // 5. Other external packages
      // 6. Internal imports (relative paths)
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^\\u0000'],
            ['^react', '^react-dom', '^react-router', '^react-i18next'],
            ['^@mui/'],
            ['^@somenergia/'],
            ['^@?\\w'],
            ['^\\.\\./', '^\\./', '^\\.'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',

      // Unused imports
      // no-unused-vars is disabled because unused-imports already covers it
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },

  // Test files — expose Vitest/Jest globals (describe, test, expect, vi…)
  {
    files: [
      '**/*.test.{js,jsx}',
      '**/*.spec.{js,jsx}',
      '**/tests/**/*.{js,jsx}',
      '**/test/**/*.{js,jsx}',
    ],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
]

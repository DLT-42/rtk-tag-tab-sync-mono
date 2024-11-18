import { fixupConfigRules } from '@eslint/compat';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import typescript from '@typescript-eslint/eslint-plugin';
import eslint from '@eslint/js';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      'dist/**/*',
      'dist.d/**/*',
      '.eslintrc.cjs',
      '.github/**/*',
      'node_modules/**/*',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],

    ...eslint.configs.recommended,
    ...react.configs.flat.recommended,

    languageOptions: {
      globals: { ...globals.browser, ...globals.es2020 },
      parser: tsParser,
      ecmaVersion: 5,
      sourceType: 'script',
      parserOptions: { ecmaFeatures: { jsx: true } },
    },

    settings: {
      react: { version: 'detect' },
    },

    plugins: {
      'react-refresh': reactRefresh,
      'react-hooks': reactHooks,
      '@typescript-eslint': typescript,
    },

    rules: {
      ...react.configs.flat.recommended.rules,
      ...typescript.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'react-refresh/only-export-components': 'warn',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-empty-interface': 'error',
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/no-namespace': 'error',
      '@typescript-eslint/no-empty-function': 'error',
      '@typescript-eslint/no-unused-expressions': 'warn',
    },
  },

  ...fixupConfigRules(compat.extends('plugin:react/jsx-runtime')),
];

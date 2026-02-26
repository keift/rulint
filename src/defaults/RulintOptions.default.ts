import TSESLint from 'typescript-eslint';
import ESLintJS from '@eslint/js';

import type { ESLintConfig } from '../types/ESLintConfig.type';
import type { RulintOptions } from '../types/RulintOptions.type';

export const js_rules: { configs: ESLintConfig['rules']; custom: ESLintConfig['rules'] } = {
  configs: {
    ...ESLintJS.configs.recommended.rules,

    ...(Object.assign(
      {},
      ...TSESLint.configs.strictTypeChecked.map((item) =>
        Object.fromEntries(
          Object.entries(item.rules ?? {})
            .filter(([key]) => !key.startsWith('@typescript-eslint'))
            .map(([key]) => [key, 'error'])
        )
      )
    ) as ESLintConfig['rules']),

    ...(Object.assign(
      {},
      ...TSESLint.configs.stylisticTypeChecked.map((item) =>
        Object.fromEntries(
          Object.entries(item.rules ?? {})
            .filter(([key]) => !key.startsWith('@typescript-eslint'))
            .map(([key]) => [key, 'error'])
        )
      )
    ) as ESLintConfig['rules']),

    ...TSESLint.configs.eslintRecommended.rules
  },

  custom: {
    'func-style': ['error', 'expression', { allowArrowFunctions: true }],
    'no-duplicate-imports': 'error',
    'no-eval': 'error',
    'no-new-func': 'error',
    'no-new-wrappers': 'error',
    'no-object-constructor': 'error',
    'no-restricted-imports': [
      'error',
      {
        patterns: ['node:*'],
        paths: [{ name: 'fs', message: "Use 'fs/promises' instead. (rulint)" }]
      }
    ],
    'no-restricted-syntax': [
      'error',
      {
        selector: "CallExpression[callee.name='Boolean']",
        message: 'Use `!!value` instead. (rulint)'
      },
      {
        selector: "CallExpression[callee.name='isFinite']",
        message: 'Use `Number.isFinite()` instead. (rulint)'
      },
      {
        selector: "CallExpression[callee.name='isNaN']",
        message: 'Use `Number.isNaN()` instead. (rulint)'
      },
      {
        selector: "CallExpression[callee.name='parseInt']",
        message: 'Use `Number.parseInt()` instead. (rulint)'
      },
      {
        selector: "CallExpression[callee.name='parseFloat'], CallExpression[callee.object.name='Number'][callee.property.name='parseFloat']",
        message: 'Use `Number()` instead. (rulint)'
      },
      {
        selector: "CallExpression[callee.property.name='toString']",
        message: 'Use `String()` instead. (rulint)'
      },
      {
        selector: "CallExpression[callee.property.name='forEach']",
        message: 'Use `for...of` instead. (rulint)'
      },
      {
        selector: "CallExpression[callee.property.name='join'][callee.object.callee.property.name='split']",
        message: 'Use `.replaceAll()` instead. (rulint)'
      },
      {
        selector: "CallExpression[callee.property.name='then']",
        message: 'Use `await` instead. (rulint)'
      },
      {
        selector: "CallExpression[callee.property.name='catch']",
        message: 'Use `try/catch` instead. (rulint)'
      },
      {
        selector: "CallExpression[callee.property.name='finally']",
        message: 'Use `try/finally` instead. (rulint)'
      },
      {
        selector: 'SwitchStatement',
        message: 'Use `if/else` instead. (rulint)'
      },
      {
        selector: 'ForInStatement',
        message: 'Use `for...of` instead. (rulint)'
      },
      {
        selector: 'EmptyStatement',
        message: 'Empty statements are unnecessary. (rulint)'
      },
      {
        selector: 'DebuggerStatement',
        message: 'Debugger statements cannot be included in the production. (rulint)'
      },
      {
        selector: 'LabeledStatement',
        message: 'Labeled statements reduce code readability. (rulint)'
      },
      {
        selector: 'SequenceExpression',
        message: 'Sequence expressions reduce code readability. (rulint)'
      },
      {
        selector: 'WithStatement',
        message: 'With statements are not considered safe. (rulint)'
      }
    ],
    'no-useless-call': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-concat': 'error',
    'no-useless-rename': 'error',
    'no-useless-return': 'error',
    'object-shorthand': 'error',
    'one-var': ['error', 'never'],
    'prefer-arrow-callback': 'error',
    'prefer-template': 'error',
    eqeqeq: 'error'
  }
};

export const ts_rules: { configs: ESLintConfig['rules']; custom: ESLintConfig['rules'] } = {
  configs: {
    ...(Object.assign({}, ...TSESLint.configs.strictTypeChecked.map((item) => item.rules ?? {})) as ESLintConfig['rules']),
    ...(Object.assign({}, ...TSESLint.configs.stylisticTypeChecked.map((item) => item.rules ?? {})) as ESLintConfig['rules'])
  },

  custom: {
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/consistent-type-exports': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/explicit-member-accessibility': 'error',
    '@typescript-eslint/prefer-readonly': 'error',
    '@typescript-eslint/strict-boolean-expressions': 'error'
  }
};

export const RulintOptionsDefault: RulintOptions = {
  enabled: true,

  ignores: ['**/dist'],

  js: {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.mtsx', '**/*.cts', '**/*.ctsx', '**/*.js', '**/*.jsx', '**/*.mjs', '**/*.mjsx', '**/*.cjs', '**/*.cjsx'],
    languageOptions: {},
    plugins: {},

    rules: {
      ...js_rules.configs,
      ...js_rules.custom
    }
  },

  ts: {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.mtsx', '**/*.cts', '**/*.ctsx'],
    languageOptions: {
      parser: TSESLint.parser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': TSESLint.plugin
    },

    rules: {
      ...ts_rules.configs,
      ...ts_rules.custom
    }
  }
};

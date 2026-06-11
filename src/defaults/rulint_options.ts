import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslint_plugin_prefer_arrow_functions from 'eslint-plugin-prefer-arrow-functions';
import eslint_plugin_zod from 'eslint-plugin-zod';

import type { ESLintConfig } from '../types/eslint_config';
import type { RulintOptions } from '../types/rulint_options';

type Rules = {
  configs: ESLintConfig['rules'];
  custom: ESLintConfig['rules'];
};

export const js_rules: Rules = {
  configs: {
    ...eslint.configs.recommended.rules,

    ...(Object.assign(
      {},
      ...tseslint.configs.strictTypeChecked.map((item) =>
        Object.fromEntries(
          Object.entries(item.rules ?? {})
            .filter(([key]) => !key.startsWith('@typescript-eslint'))
            .map(([key]) => [key, 'error'])
        )
      )
    ) as ESLintConfig['rules']),

    ...(Object.assign(
      {},
      ...tseslint.configs.stylisticTypeChecked.map((item) =>
        Object.fromEntries(
          Object.entries(item.rules ?? {})
            .filter(([key]) => !key.startsWith('@typescript-eslint'))
            .map(([key]) => [key, 'error'])
        )
      )
    ) as ESLintConfig['rules']),

    ...tseslint.configs.eslintRecommended.rules,

    ...eslint_plugin_zod.configs.recommended.rules
  },

  custom: {
    'arrow-body-style': 'error',
    curly: 'error',
    eqeqeq: 'error',
    'no-duplicate-imports': 'error',
    'no-eval': 'error',
    'no-new-func': 'error',
    'no-new-wrappers': 'error',
    'no-object-constructor': 'error',
    'no-restricted-imports': [
      'error',
      {
        patterns: ['node:*'],
        paths: [{ name: 'fs', message: "Use 'fs/promises' instead." }]
      }
    ],
    'no-restricted-syntax': [
      'error',
      {
        selector: "CallExpression[callee.name='Boolean']",
        message: 'Use `!!value` instead.'
      },
      {
        selector: "CallExpression[callee.name='isFinite']",
        message: 'Use `Number.isFinite()` instead.'
      },
      {
        selector: "CallExpression[callee.name='isNaN']",
        message: 'Use `Number.isNaN()` instead.'
      },
      {
        selector: "CallExpression[callee.name='parseInt']",
        message: 'Use `Number.parseInt()` instead.'
      },
      {
        selector: "CallExpression[callee.name='parseFloat'], CallExpression[callee.object.name='Number'][callee.property.name='parseFloat']",
        message: 'Use `Number()` instead.'
      },
      {
        selector: "CallExpression[callee.property.name='toString']:matches([arguments.length=0])",
        message: 'Use `String()` instead.'
      },
      {
        selector: "CallExpression[callee.property.name='forEach']",
        message: 'Use `for...of` instead.'
      },
      {
        selector: "CallExpression[callee.property.name='join'][callee.object.callee.property.name='split']",
        message: 'Use `.replaceAll()` instead.'
      },
      {
        selector: "CallExpression[callee.property.name='then']",
        message: 'Use `await` instead.'
      },
      {
        selector: "CallExpression[callee.property.name='catch']",
        message: 'Use `try/catch` instead.'
      },
      {
        selector: "CallExpression[callee.property.name='finally']",
        message: 'Use `try/finally` instead.'
      },
      {
        selector: 'SwitchStatement',
        message: 'Use `if/else` instead.'
      },
      {
        selector: 'ForInStatement',
        message: 'Use `for...of` instead.'
      },
      {
        selector: 'EmptyStatement',
        message: 'Empty statements are unnecessary.'
      },
      {
        selector: 'DebuggerStatement',
        message: 'Debugger statements cannot be included in the production.'
      },
      {
        selector: 'LabeledStatement',
        message: 'Labeled statements reduce code readability.'
      },
      {
        selector: 'SequenceExpression',
        message: 'Sequence expressions reduce code readability.'
      },
      {
        selector: 'WithStatement',
        message: 'With statements are not considered safe.'
      }
    ],
    'no-useless-call': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-concat': 'error',
    'no-useless-rename': 'error',
    'no-useless-return': 'error',
    'object-shorthand': 'error',
    'one-var': ['error', 'never'],
    'prefer-arrow-functions/prefer-arrow-functions': 'error',
    'prefer-template': 'error'
  }
};

export const ts_rules: Rules = {
  configs: {
    ...(Object.assign({}, ...tseslint.configs.strictTypeChecked.map((item) => item.rules ?? {})) as ESLintConfig['rules']),
    ...(Object.assign({}, ...tseslint.configs.stylisticTypeChecked.map((item) => item.rules ?? {})) as ESLintConfig['rules'])
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
    plugins: {
      'prefer-arrow-functions': eslint_plugin_prefer_arrow_functions,
      zod: eslint_plugin_zod
    },
    rules: {
      ...js_rules.configs,
      ...js_rules.custom
    }
  },

  ts: {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.mtsx', '**/*.cts', '**/*.ctsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin
    },
    rules: {
      ...ts_rules.configs,
      ...ts_rules.custom
    }
  }
};

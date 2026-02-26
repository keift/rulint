import EslintPluginZod from 'eslint-plugin-zod';
import merge from 'lodash.merge';

import { RulintOptionsDefault } from '../defaults/RulintOptions.default';

import type { ESLintConfig } from '../types/ESLintConfig.type';
import type { RulintOptions } from '../types/RulintOptions.type';

export const rulint = (options: RulintOptions = RulintOptionsDefault): ESLintConfig[] => {
  options = merge({}, RulintOptionsDefault, options);

  if (options.append?.['no-restricted-imports'] && typeof options.js?.rules?.['no-restricted-imports'] === 'object') options.js.rules['no-restricted-imports'] = [...options.js.rules['no-restricted-imports'], ...options.append['no-restricted-imports']];
  if (options.append?.['no-restricted-syntax'] && typeof options.js?.rules?.['no-restricted-syntax'] === 'object') options.js.rules['no-restricted-syntax'] = [...options.js.rules['no-restricted-syntax'], ...options.append['no-restricted-syntax']];

  if (options.enabled === true) {
    return [
      { ignores: options.ignores },

      EslintPluginZod.configs.recommended,

      {
        files: options.js?.files,
        languageOptions: options.js?.languageOptions,
        plugins: options.js?.plugins,
        rules: options.js?.rules
      },

      {
        files: options.ts?.files,
        languageOptions: options.ts?.languageOptions,
        plugins: options.ts?.plugins,
        rules: options.ts?.rules
      },

      ...(options.configs ?? [])
    ];
  } else return [{ ignores: options.ignores }, ...(options.configs ?? [])];
};

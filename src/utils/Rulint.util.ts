import merge from 'lodash.merge';

import { PulintOptionsDefault } from '../defaults/PulintOptions.default';

import type { ESLintConfig } from '../types/ESLintConfig.type';
import type { PulintOptions } from '../types/PulintOptions.type';

export const pulint = (options: PulintOptions = PulintOptionsDefault): ESLintConfig[] => {
  options = merge({}, PulintOptionsDefault, options);

  if (options.append?.['no-restricted-imports'] && typeof options.js?.rules?.['no-restricted-imports'] === 'object') options.js.rules['no-restricted-imports'] = [...options.js.rules['no-restricted-imports'], ...options.append['no-restricted-imports']];
  if (options.append?.['no-restricted-syntax'] && typeof options.js?.rules?.['no-restricted-syntax'] === 'object') options.js.rules['no-restricted-syntax'] = [...options.js.rules['no-restricted-syntax'], ...options.append['no-restricted-syntax']];

  return [
    { ignores: options.ignores },

    {
      files: options.js?.files,
      languageOptions: options.js?.languageOptions,
      plugins: options.js?.plugins,
      rules: options.disabled === true ? {} : options.js?.rules
    },

    {
      files: options.ts?.files,
      languageOptions: options.ts?.languageOptions,
      plugins: options.ts?.plugins,
      rules: options.disabled === true ? {} : options.ts?.rules
    },

    ...(options.config && options.config.length !== 0 ? options.config : [])
  ];
};

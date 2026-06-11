/* eslint-disable @typescript-eslint/naming-convention */

import type { ESLintConfig } from './eslint_config';

export type RulintOptions = {
  enabled?: boolean;

  ignores?: ESLintConfig['ignores'];

  append?: {
    'no-restricted-imports'?: object[];
    'no-restricted-syntax'?: {
      selector: string;
      message: string;
    }[];
  };

  js?: ESLintConfig;
  ts?: ESLintConfig;

  configs?: ESLintConfig[];
};

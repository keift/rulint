import type { ESLintConfig } from './ESLintConfig.type';

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

  js?: {
    files?: ESLintConfig['files'];
    languageOptions?: ESLintConfig['languageOptions'];
    plugins?: ESLintConfig['plugins'];

    rules?: ESLintConfig['rules'];
  };

  ts?: {
    files?: ESLintConfig['files'];
    languageOptions?: ESLintConfig['languageOptions'];
    plugins?: ESLintConfig['plugins'];

    rules?: ESLintConfig['rules'];
  };

  configs?: ESLintConfig[];
};

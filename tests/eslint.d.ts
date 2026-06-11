/* eslint-disable @typescript-eslint/naming-convention */

declare module 'eslint/use-at-your-own-risk' {
  import type { Rule } from 'eslint';

  export const builtinRules: Map<string, Rule.RuleModule>;
}

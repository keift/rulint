import TSESlint from 'typescript-eslint';
import { builtinRules } from 'eslint/use-at-your-own-risk';
import ESLintPluginZod from 'eslint-plugin-zod';
import json2md from 'json2md';
import fs from 'fs/promises';
import path from 'path';

import { RulintOptionsDefault } from '../src/defaults/rulint_options';

type Plugin = {
  rules: Record<string, { meta: { docs: { description: string } } }>;
};

const zod_rule_descriptions = Object.entries((ESLintPluginZod as unknown as Plugin).rules)
  .filter(([, value]) => value.meta.docs.description)
  .map(([name, rule]) => {
    const description = rule.meta.docs.description.endsWith('.') ? rule.meta.docs.description : `${rule.meta.docs.description}.`;

    return { name, description };
  });

const tseslint_rule_descriptions = Object.entries((TSESlint.plugin as unknown as Plugin).rules)
  .filter(([, value]) => value.meta.docs.description)
  .map(([name, rule]) => {
    const description = rule.meta.docs.description.endsWith('.') ? rule.meta.docs.description : `${rule.meta.docs.description}.`;

    return { name, description };
  });

const eslint_rule_descriptions = ([...builtinRules.entries()] as [string, Plugin['rules'][string]][])
  .filter(([, value]) => value.meta.docs.description)
  .map(([name, rule]) => {
    const description = rule.meta.docs.description.endsWith('.') ? rule.meta.docs.description : `${rule.meta.docs.description}.`;

    return { name, description };
  });

const zod_rules = Object.entries(ESLintPluginZod.configs.recommended.rules as Record<string, string | string[]>)
  .filter(([name, config]) => name.startsWith('zod') && (Array.isArray(config) ? config[0] === 'error' : config === 'error'))
  .map(([name]) => [`[@${name}](https://github.com/marcalexiei/eslint-zod/blob/main/plugins/eslint-plugin-zod/docs/rules/${name.replaceAll('zod/', '')}.md)`, zod_rule_descriptions.find((rule) => rule.name === name.replaceAll('zod/', ''))?.description ?? 'None.'])
  .sort((first, second) => (first[0] < second[0] ? -1 : first[0] > second[0] ? 1 : 0));

const ts_rules = Object.entries(RulintOptionsDefault.ts?.rules as Record<string, string | string[]>)
  .filter(([name, config]) => name.startsWith('@typescript-eslint') && (Array.isArray(config) ? config[0] === 'error' : config === 'error'))
  .map(([name]) => [`[${name}](https://typescript-eslint.io/rules/${name.replaceAll('@typescript-eslint/', '')})`, tseslint_rule_descriptions.find((rule) => rule.name === name.replaceAll('@typescript-eslint/', ''))?.description ?? 'None.'])
  .sort((first, second) => (first[0] < second[0] ? -1 : first[0] > second[0] ? 1 : 0));

const js_rules = Object.entries(RulintOptionsDefault.js?.rules as Record<string, string | string[]>)
  .filter(([, config]) => (Array.isArray(config) ? config[0] === 'error' : config === 'error'))
  .map(([name]) => [`[${name}](https://eslint.org/docs/latest/rules/${name})`, eslint_rule_descriptions.find((rule) => rule.name === name)?.description ?? 'None.'])
  .sort((first, second) => (first[0] < second[0] ? -1 : first[0] > second[0] ? 1 : 0));

const rules = [...zod_rules, ...ts_rules, ...js_rules];

const table = json2md([
  {
    table: {
      headers: ['Rule', 'Description'],
      rows: rules
    }
  }
]);

const Readme = await fs.readFile(path.join('./', 'README.md'), 'utf-8');

await fs.writeFile(
  path.join('./', 'README.md'),
  Readme.replace(
    /<!-- START: rules-table -->[\s\S]*?<!-- END: rules-table -->/g,
    `<!-- START: rules-table -->

_Rulint adds **${String(rules.length)}** rules to your workspace._

${table.trim()}

<!-- END: rules-table -->`
  )
);

console.log('✅ Success');

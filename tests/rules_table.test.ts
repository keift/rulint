import { builtinRules } from 'eslint/use-at-your-own-risk';
import json2md from 'json2md';
import prettier from 'prettier';
import fs from 'fs/promises';
import path from 'path';

import { RulintOptionsDefault } from '../src/defaults/rulint_options';

type Plugin = {
  rules: Record<string, { meta: { docs: { description: string } } }>;
};

const eslint_rule_metas = ([...builtinRules.entries()] as [string, Plugin['rules'][string]][]).map(([name, rule]) => {
  const description = rule.meta.docs.description.endsWith('.') ? rule.meta.docs.description : `${rule.meta.docs.description}.`;

  return { name, description };
});

const tseslint_rule_metas = Object.entries((RulintOptionsDefault.ts?.plugins?.['@typescript-eslint'] as unknown as Plugin).rules).map(([name, rule]) => {
  const description = rule.meta.docs.description.endsWith('.') ? rule.meta.docs.description : `${rule.meta.docs.description}.`;

  return { name, description };
});

const zod_rule_metas = Object.entries((RulintOptionsDefault.js?.plugins?.zod as unknown as Plugin).rules).map(([name, rule]) => {
  const description = rule.meta.docs.description.endsWith('.') ? rule.meta.docs.description : `${rule.meta.docs.description}.`;

  return { name, description };
});

const eslint_rule_rows = Object.entries(RulintOptionsDefault.js?.rules as Record<string, string | string[]>)
  .filter(([name, config]) => !name.includes('/') && (Array.isArray(config) ? config[0] === 'error' : config === 'error'))
  .map(([name]) => [`[${name}](https://eslint.org/docs/latest/rules/${name})`, eslint_rule_metas.find((rule) => rule.name === name)?.description ?? 'None.'])
  .sort((first, second) => (first[0] < second[0] ? -1 : first[0] > second[0] ? 1 : 0));

const tseslint_rule_rows = Object.entries(RulintOptionsDefault.ts?.rules as Record<string, string | string[]>)
  .filter(([name, config]) => name.startsWith('@typescript-eslint') && (Array.isArray(config) ? config[0] === 'error' : config === 'error'))
  .map(([name]) => [`[${name}](https://typescript-eslint.io/rules/${name.replaceAll('@typescript-eslint/', '')})`, tseslint_rule_metas.find((rule) => rule.name === name.replaceAll('@typescript-eslint/', ''))?.description ?? 'None.'])
  .sort((first, second) => (first[0] < second[0] ? -1 : first[0] > second[0] ? 1 : 0));

const zod_rule_rows = Object.entries(RulintOptionsDefault.js?.rules as Record<string, string | string[]>)
  .filter(([name, config]) => name.startsWith('zod') && (Array.isArray(config) ? config[0] === 'error' : config === 'error'))
  .map(([name]) => [`[${name}](https://github.com/marcalexiei/eslint-zod/blob/main/plugins/eslint-plugin-zod/docs/rules/${name.replaceAll('zod/', '')}.md)`, zod_rule_metas.find((rule) => rule.name === name.replaceAll('zod/', ''))?.description ?? 'None.'])
  .sort((first, second) => (first[0] < second[0] ? -1 : first[0] > second[0] ? 1 : 0));

const rule_rows = [...eslint_rule_rows, ...tseslint_rule_rows, ...zod_rule_rows];

const table = json2md([
  {
    table: {
      headers: ['Rule', 'Description'],
      rows: rule_rows
    }
  }
]);

const readme_file = await fs.readFile(path.join('./', 'README.md'), 'utf-8');

await fs.writeFile(
  path.join('./', 'README.md'),
  await prettier.format(
    readme_file.replace(
      /<!-- START: rules-table -->[\s\S]*?<!-- END: rules-table -->/g,

      `<!-- START: rules-table -->

_Rulint adds **${String(rule_rows.length)}** rules to your workspace._

${table.trim()}

<!-- END: rules-table -->`
    ),
    { parser: 'markdown', ...(await prettier.resolveConfig('./.prettierrc.json')) }
  )
);

console.log('✅ Success');

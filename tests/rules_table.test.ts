import TSESlintPlugin from '@typescript-eslint/eslint-plugin';
import json2md from 'json2md';
import fs from 'fs/promises';
import path from 'path';

import { RulintOptionsDefault } from '../src/defaults/rulint_options';

const tseslint_rule_descriptions = Object.entries(TSESlintPlugin.rules)
  .filter(([, value]) => value.meta.docs.description)
  .map(([name, rule]) => ({ name, description: rule.meta.docs.description }));

const eslint_rule_descriptions = Object.values(((await (await fetch('https://raw.github.com/eslint/eslint/main/docs/src/_data/rules.json')).json()) as { types: { problem: { name: string; description: string }[]; suggestion: { name: string; description: string }[]; layout: { name: string; description: string }[] } }).types).flat();

const ts_rules = Object.entries(RulintOptionsDefault.ts?.rules as Record<string, string | string[]>)
  .filter(([name, config]) => name.startsWith('@typescript-eslint') && (Array.isArray(config) ? config[0] === 'error' : config === 'error'))
  .map(([name]) => {
    return [`[${name}](https://typescript-eslint.io/rules/${name.replaceAll('@typescript-eslint/', '')})`, `${tseslint_rule_descriptions.find((rule) => rule.name === name.replaceAll('@typescript-eslint/', ''))?.description ?? 'None'}.`];
  })
  .sort((first, second) => (first[0] < second[0] ? -1 : first[0] > second[0] ? 1 : 0));

const js_rules = Object.entries(RulintOptionsDefault.js?.rules as Record<string, string | string[]>)
  .filter(([, config]) => (Array.isArray(config) ? config[0] === 'error' : config === 'error'))
  .map(([name]) => {
    return [`[${name}](https://eslint.org/docs/latest/rules/${name})`, `${eslint_rule_descriptions.find((rule) => rule.name === name)?.description ?? 'None'}.`];
  })
  .sort((first, second) => (first[0] < second[0] ? -1 : first[0] > second[0] ? 1 : 0));

const table = json2md([
  {
    table: {
      headers: ['Rule', 'Description'],
      rows: [...ts_rules, ...js_rules]
    }
  }
]);

const Readme = await fs.readFile(path.join('./', 'README.md'), 'utf-8');

await fs.writeFile(
  path.join('./', 'README.md'),
  Readme.replace(
    /<!-- START: rules-table -->[\s\S]*?<!-- END: rules-table -->/g,
    `<!-- START: rules-table -->

${table.trim()}

<!-- END: rules-table -->`
  )
);

console.log('✅ Success');

import { ts_rules, js_rules } from '../src/defaults/rulint_options';

const ignored_rules = ['@typescript-eslint/consistent-type-definitions'];

const config_rules_keys = Object.keys({ ...ts_rules.configs, ...js_rules.configs });
const custom_rules_keys = Object.keys({ ...ts_rules.custom, ...js_rules.custom });

const common_rules = config_rules_keys.filter((rule) => custom_rules_keys.includes(rule) && !ignored_rules.includes(rule));

if (common_rules.length !== 0) throw Error(`Duplicate rules found: ${common_rules.join(', ')}`);

console.log('✅ Success');

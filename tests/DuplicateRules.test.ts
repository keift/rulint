import { js_rules, ts_rules } from '../src/defaults/RulintOptions.default';

const ignored_rules = ['@typescript-eslint/consistent-type-definitions'];

const config_rules_keys = Object.keys({ ...js_rules.configs, ...ts_rules.configs });
const custom_rules_keys = Object.keys({ ...js_rules.custom, ...ts_rules.custom });

const common_rules = config_rules_keys.filter((rule) => custom_rules_keys.includes(rule) && !ignored_rules.includes(rule));

if (common_rules.length !== 0) throw Error(`Duplicate rules found: ${common_rules.join(', ')}`);

console.log('✅ Success');

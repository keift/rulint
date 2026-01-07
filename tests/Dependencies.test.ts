import Package from '../package.json';

if (Package.dependencies['@eslint/js'] !== 'latest') throw new Error('❌ Error: @eslint/js');
if (Package.dependencies['@types/node'] !== 'latest') throw new Error('❌ Error: @types/node');
if (Package.dependencies.eslint !== 'latest') throw new Error('❌ Error: eslint');
if (Package.dependencies.jiti !== 'latest') throw new Error('❌ Error: jiti');
if (Package.dependencies.typescript !== 'latest') throw new Error('❌ Error: typescript');
if (Package.dependencies['typescript-eslint'] !== 'latest') throw new Error('❌ Error: typescript-eslint');

if (Package.devDependencies.prettier !== 'latest') throw new Error('❌ Error: prettier');
if (Package.devDependencies.tsup !== 'latest') throw new Error('❌ Error: tsup');

console.log('✅ Success');

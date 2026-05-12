import Package from '../package.json';

const dependencies = {
  '@eslint/js': 'latest',
  '@types/node': 'latest',
  eslint: 'latest',
  'eslint-plugin-zod': 'latest',
  jiti: 'latest',
  typescript: 'latest',
  'typescript-eslint': 'latest'
};

const dev_dependencies = {
  prettier: 'latest',
  tsdown: 'latest',
  unrun: 'latest'
};

for (const [_dependency, version] of Object.entries(dependencies)) {
  const dependency = _dependency as keyof typeof dependencies;

  if (Package.dependencies[dependency] !== version) throw new Error(`❌ Error: ${dependency}`);
}

for (const [_dependency, version] of Object.entries(dev_dependencies)) {
  const dependency = _dependency as keyof typeof dev_dependencies;

  if (Package.devDependencies[dependency] !== version) throw new Error(`❌ Error: ${dependency}`);
}

console.log('✅ Success');

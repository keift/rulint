import { defineConfig } from 'tsdown';

export default defineConfig({
  format: ['esm', 'cjs'],
  entry: {
    index: './src/main.ts',
    types: './src/exports/types.ts'
  }
});

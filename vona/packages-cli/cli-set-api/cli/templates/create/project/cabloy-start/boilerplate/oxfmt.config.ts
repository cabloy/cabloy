import { oxcFormatConfig } from '@cabloy/lint';
import { defineConfig } from 'oxfmt';

export default defineConfig(
  oxcFormatConfig({
    ignorePatterns: [
      '*.min.js',
      '*.code-snippets',
      '**/dist/**',
      '**/static/**',
      '**/.rollup.cache/**',
      '**/.metadata/index.ts',
      '.vona',
      '.assets',
      'coverage',
      'docker-compose',
      'scripts',
      'zovaRest',
      'assets',
    ],
  }),
);

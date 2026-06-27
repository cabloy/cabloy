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
      'assets',
      'vite.config.ts.timestamp-*',
      'quasar.config.ts.temporary.*',
      'dist-releases',
      'dist-mock',
      'src-capacitor',
      'src-cordova',
      '.zova',
      '.nx',
      '.quasar',
      'packages-cli/cli-set-front/cli/templates',
      '**/.vitepress/cache',
    ],
  }),
);

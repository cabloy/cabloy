import { oxcFormatConfig } from '@cabloy/lint';
import { defineConfig } from 'oxfmt';

export default defineConfig(
  oxcFormatConfig({
    ignorePatterns: [
      // root original
      '**/.claude',
      '**/.vscode',
      'CHANGELOG.md',
      // file type patterns (from vona & zova)
      '*.min.js',
      '*.code-snippets',
      // glob patterns (from vona & zova, already work from root)
      '**/dist/**',
      '**/static/**',
      '**/.rollup.cache/**',
      '**/.metadata/index.ts',
      '**/.vitepress/cache',
      '**/vite.config.ts.timestamp-*',
      '**/quasar.config.ts.temporary.*',
      // common directory patterns (from vona & zova, converted to **/)
      '**/.vona',
      '**/.assets',
      '**/.app',
      '**/.zova-rest',
      '**/.zova',
      '**/.nx',
      '**/.quasar',
      '**/coverage',
      '**/docker-compose',
      '**/assets',
      '**/dist-releases',
      '**/dist-mock',
      '**/src-capacitor',
      '**/src-cordova',
      // vona-specific
      '**/zovaRest',
      'vona/packages-cli/cli-set-api/cli/templates',
      // zova-specific
      'zova/packages-cli/cli-set-front/cli/templates',
    ],
  }),
);

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
      'vona/.vona',
      'vona/coverage',
      'vona/docker-compose',
      'vona/zovaRest',
      'assets',
      'zova/vite.config.ts.timestamp-*',
      'zova/dist-releases',
      'zova/dist-mock',
      'zova/src-capacitor',
      'zova/src-cordova',
      'zova/.zova',
    ],
  }),
);

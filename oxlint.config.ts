import { oxcLintConfigVue } from '@cabloy/lint';
import { defineConfig } from 'oxlint';

import { resolveOxlintPlugins } from './scripts/oxlintPlugins.ts';

const config = defineConfig(
  oxcLintConfigVue({
    ignorePatterns: [
      // root original
      '**/.claude',
      '**/.vscode',
      // Preserve retained evidence bytes and hashes.
      'repo-specs/**/evidence/**',
      // glob patterns (from vona & zova, already work from root)
      '**/node_modules',
      '**/dist',
      '**/package-lock.json',
      '**/yarn.lock',
      '**/pnpm-lock.yaml',
      '**/bun.lockb',
      '**/output',
      '**/coverage',
      '**/temp',
      '**/.temp',
      '**/tmp',
      '**/.tmp',
      '**/.history',
      '**/.vitepress/cache',
      '**/.nuxt',
      '**/.next',
      '**/.svelte-kit',
      '**/.vercel',
      '**/.changeset',
      '**/.idea',
      '**/.cache',
      '**/.output',
      '**/.vite-inspect',
      '**/.yarn',
      '**/vite.config.*.timestamp-*',
      '**/CHANGELOG*.md',
      '**/*.min.*',
      '**/LICENSE*',
      '**/__snapshots__',
      '**/auto-import?(s).d.ts',
      '**/components.d.ts',
      '**/*.md',
      '**/*.d.ts',
      '**/node_modules/**',
      '**/dist/**',
      '**/static/**',
      '**/.rollup.cache/**',
      '**/.metadata/index.ts',
      '**/postcss.config.cjs',
      // common directory patterns (from vona & zova, converted to **/)
      '**/.vona',
      '**/.vona-test-*',
      '**/.app-test-*',
      '**/.assets',
      '**/.zova',
      '**/docker-compose',
      '**/assets',
      '**/dist-releases',
      '**/dist-mock',
      '**/src-capacitor',
      '**/src-cordova',
      '**/package.json',
      // vona-specific
      'vona/packages-cli/cli-set-api/cli/templates',
      // zova-specific
      'zova/packages-cli/cli-set-front/cli/templates',
    ],
  }),
);

export default resolveOxlintPlugins(config);

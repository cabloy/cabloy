import { oxcLintConfig } from '@cabloy/lint';
import { defineConfig } from 'oxlint';

export default defineConfig(
  oxcLintConfig({
    ignorePatterns: ['vona', 'zova', '.claude', '.vscode'],
  }),
);

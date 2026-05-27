import { oxcLintConfigVue } from '@cabloy/lint';
import { defineConfig } from 'oxlint';

export default defineConfig(
  oxcLintConfigVue({
    ignorePatterns: ['.claude', '.vscode'],
  }),
);

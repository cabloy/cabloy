import { oxcFormatConfig } from '@cabloy/lint';
import { defineConfig } from 'oxfmt';

export default defineConfig(
  oxcFormatConfig({
    ignorePatterns: ['vona', 'zova', '.claude', '.vscode', 'CHANGELOG.md'],
  }),
);

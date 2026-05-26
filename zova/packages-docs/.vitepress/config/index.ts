import { defineConfig } from 'vitepress';

import { en } from './en.js';
import { shared } from './shared.js';
import { zh } from './zh.js';

export default defineConfig({
  ...shared,
  locales: {
    root: { label: 'English', ...en },
    zh: { label: '简体中文', ...zh },
  },
});

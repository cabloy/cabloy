import antfu from '@antfu/eslint-config';
import globals from 'globals';

import { rules } from '../common/rules.js';
import { rulesVue } from '../common/rulesVue.js';

const globalsMy = {
  ...globals.browser,
  ...globals.jest,
  ga: 'readonly', // Google Analytics
  cordova: 'readonly',
  __statics: 'readonly',
  __QUASAR_SSR__: 'readonly',
  __QUASAR_SSR_SERVER__: 'readonly',
  __QUASAR_SSR_CLIENT__: 'readonly',
  __QUASAR_SSR_PWA__: 'readonly',
  process: 'readonly',
  Capacitor: 'readonly',
  chrome: 'readonly',
};

export default function eslintConfig(config, ...args) {
  config = Object.assign(
    {
      stylistic: {
        indent: 2,
        quotes: 'single',
        semi: true,
        jsx: true,
      },
      typescript: true,
      vue: true,
      gitignore: false,
    },
    config,
  );
  return antfu(
    config,
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules,
      languageOptions: {
        parserOptions: {
          emitDecoratorMetadata: true,
          experimentalDecorators: true,
        },
        globals: globalsMy,
      },
    },
    {
      files: ['**/*.vue'],
      rules: Object.assign({}, rules, rulesVue),
      languageOptions: {
        globals: globalsMy,
      },
    },
    ...args,
  );
}

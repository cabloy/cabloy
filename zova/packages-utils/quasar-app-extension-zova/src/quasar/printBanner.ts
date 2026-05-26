import type { IndexAPI } from '@quasar/app-vite';

import chalk from 'chalk';

import type { ConfigContext, QuasarConf } from './types.js';

export function printBanner(_context: ConfigContext, flavor: string, delay: boolean) {
  return async function printBanner(_conf: QuasarConf, api: IndexAPI) {
    const mode = api.ctx.prod ? 'production' : 'development';
    const appMode = api.ctx.modeName;
    // log
    if (delay) {
      setTimeout(() => {
        _print(mode, appMode);
      }, 3000);
    } else {
      _print(mode, appMode);
    }
  };

  function _print(mode: string, appMode: string) {
    // eslint-disable-next-line
    console.log(chalk.yellow('\n============ Zova Meta ============'));
    // eslint-disable-next-line
    console.log(`vite mode ......... ${chalk.cyan(mode)}`);
    // eslint-disable-next-line
    console.log(`app mode .......... ${chalk.cyan(appMode)}`);
    // eslint-disable-next-line
    console.log(`flavor ............ ${chalk.cyan(flavor)}`);
    // eslint-disable-next-line
    console.log('\n');
  }
}

import type { IMonkeyAppStarted } from 'vona';

import chalk from 'chalk';
import { BeanSimple } from 'vona';

import { __ThisModule__ } from './.metadata/this.ts';

export class Monkey extends BeanSimple implements IMonkeyAppStarted {
  async appStarted() {
    const scope = this.app.scope(__ThisModule__);
    scope.election.obtain(
      'hmr',
      async () => {
        await scope.service.watch.start();
        // log
        const message = `[hmr] ready: ${process.pid}`;
        // eslint-disable-next-line
        console.log(chalk.cyan(message));
      },
      async () => {
        if (await scope.service.watch.stop()) {
          // log
          const message = `[hmr] stop: ${process.pid}`;
          // eslint-disable-next-line
          console.log(chalk.cyan(message));
        }
      },
    );
  }
}

import type { IModule } from '@cabloy/module-info';
import type { IMonkeyAppClosed, IMonkeyModule } from 'vona';

import { BeanSimple } from 'vona';

import { __ThisModule__ } from './.metadata/this.ts';

export class Monkey extends BeanSimple implements IMonkeyModule, IMonkeyAppClosed {
  _intervalAlive: any = null;

  async moduleLoading(_module: IModule) {}
  async moduleLoaded(module: IModule) {
    if (module.info.relativeName !== __ThisModule__) return;
    const scope = this.app.scope(__ThisModule__);
    const aliveTimeout = scope.config.alive.timeout;
    // interval
    this._intervalAlive = setInterval(async () => {
      await this.app.bean.worker.setAlive();
    }, aliveTimeout);
    // alive
    await this.app.bean.worker.setAlive();
  }

  async configLoaded(_module: IModule, _config: any) {}

  async appClosed() {
    await this.bean.worker.delAlive();
    if (this._intervalAlive) {
      clearInterval(this._intervalAlive);
    }
    this._intervalAlive = null;
  }
}

import type { IMonkeyAppClose, IMonkeyAppClosed, IMonkeyAppStart, IMonkeyAppStarted } from 'vona';

import { BeanSimple } from 'vona';

import { __ThisModule__ } from './.metadata/this.ts';

export class Monkey
  extends BeanSimple
  implements IMonkeyAppStart, IMonkeyAppStarted, IMonkeyAppClose, IMonkeyAppClosed
{
  async appStart() {
    this.app.scope(__ThisModule__).service.metrics.init();
  }

  async appStarted() {
    await this.app.scope(__ThisModule__).service.metricsRuntime.start();
  }

  async appClose() {
    await this.app.scope(__ThisModule__).service.metricsRuntime.stop();
    await this.app.scope(__ThisModule__).service.metrics.close(true);
  }

  async appClosed() {
    await this.app.scope(__ThisModule__).service.metrics.close(false);
  }
}

import type { IMonkeyAppClose, IMonkeyAppClosed, IMonkeyAppStart } from 'vona';

import { BeanSimple } from 'vona';

import { __ThisModule__ } from './.metadata/this.ts';

export class Monkey
  extends BeanSimple
  implements IMonkeyAppStart, IMonkeyAppClose, IMonkeyAppClosed
{
  async appStart() {
    this.app.scope(__ThisModule__).service.telemetry.init();
  }

  async appClose() {
    await this.app.scope(__ThisModule__).service.telemetry.close(true);
  }

  async appClosed() {
    await this.app.scope(__ThisModule__).service.telemetry.close(false);
  }
}

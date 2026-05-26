import type { IMonkeyAppClose, IMonkeyAppClosed } from 'vona';

import { BeanSimple } from 'vona';

import { __ThisModule__ } from './.metadata/this.ts';

export class Monkey extends BeanSimple implements IMonkeyAppClose, IMonkeyAppClosed {
  async appClose() {
    const scopeSelf = this.app.scope(__ThisModule__);
    await scopeSelf.service.queue.clearWorkers();
  }

  async appClosed() {
    const scopeSelf = this.app.scope(__ThisModule__);
    await scopeSelf.service.queue.clearQueues();
  }
}

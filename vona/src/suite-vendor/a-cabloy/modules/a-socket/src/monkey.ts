import type { IMonkeyAppClose, IMonkeyAppReady } from 'vona';

import { BeanSimple } from 'vona';

import { __ThisModule__ } from './.metadata/this.ts';

export class Monkey extends BeanSimple implements IMonkeyAppReady, IMonkeyAppClose {
  async appReady() {
    await this.app.scope(__ThisModule__).service.socket.appReady();
  }

  async appClose() {
    await this.app.scope(__ThisModule__).service.socket.appClose();
  }
}

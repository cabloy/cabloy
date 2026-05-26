import type { IMonkeyAppReady, IMonkeyAppStart } from 'vona';

import { BeanSimple } from 'vona';

import { __ThisModule__ } from './.metadata/this.ts';

export class Monkey extends BeanSimple implements IMonkeyAppStart, IMonkeyAppReady {
  async appStart() {
    await this.app.scope(__ThisModule__).service.startup.appStart();
  }

  async appReady() {
    await this.app.scope(__ThisModule__).service.startup.appReady();
  }
}

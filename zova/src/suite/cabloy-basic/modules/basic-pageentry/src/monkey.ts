import type { IMonkeyAppInitialize } from 'zova';

import { BeanSimple } from 'zova';

export class Monkey extends BeanSimple implements IMonkeyAppInitialize {
  async appInitialize() {
    if (process.env.CLIENT) {
      await this.bean._getBean('basic-pageentry.bean.draftCoordinator', true);
    }
  }
}

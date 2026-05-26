import type { IModuleMain } from 'vona';

import { BeanSimple } from 'vona';

export class Main extends BeanSimple implements IModuleMain {
  async moduleLoading() {
    if (!this.app.config.onions) this.app.config.onions = {} as any;
  }

  async moduleLoaded() {}
  async configLoaded(_config: any) {}
}

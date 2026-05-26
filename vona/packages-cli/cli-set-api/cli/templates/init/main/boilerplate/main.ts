import type { IModuleMain } from 'vona';

import { BeanSimple } from 'vona';

export class Main extends BeanSimple implements IModuleMain {
  async moduleLoading() {}
  async moduleLoaded() {}
  async configLoaded(_config: any) {}
}

import type { IModuleMainSys } from 'zova';

import { BeanSimple } from 'zova';

export class MainSys extends BeanSimple implements IModuleMainSys {
  async moduleLoading() {}
  async moduleLoaded() {}
  async configLoaded(_config: any) {}
}

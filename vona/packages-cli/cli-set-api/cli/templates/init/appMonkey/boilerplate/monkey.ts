import type { IModule } from '@cabloy/module-info';
import type { IMonkeyModule, IMonkeySystem } from 'vona';

import { BeanSimple } from 'vona';

export class AppMonkey extends BeanSimple implements IMonkeyModule, IMonkeySystem {
  async moduleLoading(_module: IModule) {}
  async moduleLoaded(_module: IModule) {}
  async configLoaded(_module: IModule, _config: any) {}
  async appStart() {}
  async appReady() {}
  async appStarted() {}
  async appClose() {}
  async appClosed() {}
}

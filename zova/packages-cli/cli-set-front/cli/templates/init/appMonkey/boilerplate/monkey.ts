import type { IModule } from '@cabloy/module-info';
import type { IMonkeyAppClose, IMonkeyAppInitialize, IMonkeyAppInitialized, IMonkeyAppReady, IMonkeyModule } from 'zova';

import { BeanSimple } from 'zova';

export class AppMonkey extends BeanSimple implements IMonkeyModule, IMonkeyAppInitialize, IMonkeyAppInitialized, IMonkeyAppReady, IMonkeyAppClose {
  async moduleLoading(_module: IModule) {}
  async moduleLoaded(_module: IModule) {}
  async appInitialize() {}
  async appInitialized() {}
  async appReady() {}
  async appClose() {}
}

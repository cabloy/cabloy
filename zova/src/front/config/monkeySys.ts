import type { IModule } from '@cabloy/module-info';
import type {
  IMonkeyModuleSys,
  IMonkeySysClose,
  IMonkeySysInitialize,
  IMonkeySysInitialized,
  IMonkeySysReady,
} from 'zova';

import { BeanSimple } from 'zova';

export class SysMonkey
  extends BeanSimple
  implements
    IMonkeyModuleSys,
    IMonkeySysInitialize,
    IMonkeySysInitialized,
    IMonkeySysReady,
    IMonkeySysClose
{
  async moduleLoading(_module: IModule) {}
  async moduleLoaded(_module: IModule) {}
  async configLoaded(_module: IModule, _config: any) {}
  async sysInitialize() {}
  async sysInitialized() {}
  async sysReady() {}
  async sysClose() {}
}

import type { IModule } from '@cabloy/module-info';
import type { IMonkeyModuleSys, IMonkeySysContextInitialize, ZovaContext } from 'zova';

import { BeanSimple } from 'zova';

import type { SysSsrState } from './bean/sys.ssrState.js';

import { CtxSSR } from './lib/ssr.js';

export class MonkeySys extends BeanSimple implements IMonkeyModuleSys, IMonkeySysContextInitialize {
  private _moduleSelf: IModule;
  private _sysSsrState: SysSsrState;

  constructor(moduleSelf: IModule) {
    super();
    this._moduleSelf = moduleSelf;
  }

  async getSysSsrState() {
    if (!this._sysSsrState) {
      this._sysSsrState = (await this.bean._getBean('a-ssr.sys.ssrState', false)) as SysSsrState;
    }
    return this._sysSsrState;
  }

  async moduleLoading(module: IModule) {
    if (this._moduleSelf === module) return;
    await this.getSysSsrState();
  }

  async moduleLoaded(_module: IModule) {}
  async configLoaded(_module: IModule, _config) {}

  sysContextInitialize(ctx: ZovaContext): void {
    ctx.meta.$ssr = ctx.bean._newBeanSimple(CtxSSR, false);
    ctx.meta.$ssr.initialize();
  }
}

import type { IModule } from '@cabloy/module-info';
import type {
  BeanBase,
  BeanContainer,
  IMonkeyAppInitialize,
  IMonkeyBeanInit,
  IMonkeyModule,
} from 'zova';

import { BeanSimple } from 'zova';

import type { ModelPassport } from './model/passport.js';

export class Monkey
  extends BeanSimple
  implements IMonkeyAppInitialize, IMonkeyModule, IMonkeyBeanInit
{
  private _moduleSelf: IModule;
  private $$modelPassport: ModelPassport;

  constructor(moduleSelf: IModule) {
    super();
    this._moduleSelf = moduleSelf;
  }

  private async getModelPassport() {
    if (!this.$$modelPassport) {
      this.$$modelPassport = await this.bean._getBean('home-passport.model.passport', true);
    }
    return this.$$modelPassport;
  }

  async appInitialize() {
    const modelPassport = await this.getModelPassport();
    await modelPassport.appInitialize();
  }

  async moduleLoading(_module: IModule) {}
  async moduleLoaded(module: IModule) {
    // self
    if (this._moduleSelf === module) {
      await this.getModelPassport();
    }
  }

  async beanInit(bean: BeanContainer, beanInstance: BeanBase) {
    const self = this;
    bean.defineProperty(beanInstance, '$passport', {
      enumerable: false,
      configurable: true,
      get() {
        return self.$$modelPassport;
      },
    });
  }
}

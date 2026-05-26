import type { IModule } from '@cabloy/module-info';
import type { BeanBase, BeanContainer, IMonkeyAppInitialize, IMonkeyBeanInit } from 'zova';

import { useQueryClient } from '@tanstack/vue-query';
import { markRaw } from 'vue';
import { BeanSimple } from 'zova';

import { ServiceStorage } from './service/storage.js';

export class Monkey extends BeanSimple implements IMonkeyAppInitialize, IMonkeyBeanInit {
  private _moduleSelf: IModule;
  private _storage: ServiceStorage;

  constructor(moduleSelf: IModule) {
    super();
    this._moduleSelf = moduleSelf;
  }

  private async getStorage() {
    if (!this._storage) {
      this._storage = await this.bean._newBean(ServiceStorage, false);
    }
    return this._storage;
  }

  async appInitialize() {
    const storage = await this.getStorage();
    await storage.appInitialize();
  }

  async moduleLoading(_module: IModule) {}
  async moduleLoaded(module: IModule) {
    // self
    if (this._moduleSelf === module) {
      const storage = await this.getStorage();
      await storage.moduleLoaded();
    }
  }

  async beanInit(bean: BeanContainer, beanInstance: BeanBase) {
    bean.defineProperty(beanInstance, '$queryClient', {
      enumerable: false,
      configurable: true,
      get() {
        return markRaw(useQueryClient());
      },
    });
  }
}

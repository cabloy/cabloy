import type { IModule } from '@cabloy/module-info';
import type { BeanBase, BeanContainer, IMonkeyBeanInit, IMonkeyModule } from 'zova';

import { BeanSimple } from 'zova';

import type { ServiceAppModal } from './service/appModal.js';

export class Monkey extends BeanSimple implements IMonkeyModule, IMonkeyBeanInit {
  private _moduleSelf: IModule;
  private _serviceAppModal: ServiceAppModal;

  constructor(moduleSelf: IModule) {
    super();
    this._moduleSelf = moduleSelf;
  }

  async moduleLoading(_module: IModule) {}
  async moduleLoaded(module: IModule) {
    if (this._moduleSelf === module) {
      await this._loadServiceAppModal();
    }
  }

  async beanInit(bean: BeanContainer, beanInstance: BeanBase) {
    const self = this;
    bean.defineProperty(beanInstance, '$appModal', {
      enumerable: false,
      configurable: true,
      get() {
        return self._serviceAppModal;
      },
    });
  }

  private async _loadServiceAppModal() {
    this._serviceAppModal = await this.app.bean._getBean('basic-app.service.appModal', true);
  }
}

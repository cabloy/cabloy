import type { IModule } from '@cabloy/module-info';
import type {
  BeanBase,
  BeanContainer,
  IBeanScopeRecord,
  IMonkeyBeanInit,
  IMonkeyModule,
} from 'zova';

import { appResource, BeanSimple, cast } from 'zova';

import type { ScopeModule } from './.metadata/this.js';

import { __ThisModule__ } from './.metadata/this.js';

export class Monkey extends BeanSimple implements IMonkeyModule, IMonkeyBeanInit {
  private _moduleSelf: IModule;
  private _defaultModuleApi: keyof IBeanScopeRecord;

  constructor(moduleSelf: IModule) {
    super();
    this._moduleSelf = moduleSelf;
  }

  async moduleLoading(_module: IModule) {}
  async moduleLoaded(module: IModule) {
    // load apis
    const promises: Promise<any>[] = [];
    promises.push(this._loadApis(module, 'api'));
    promises.push(this._loadApis(module, 'apiSchema'));
    await Promise.all(promises);
    // self
    if (this._moduleSelf === module) {
      const scopeSelf: ScopeModule = await this.bean.getScope(__ThisModule__);
      this._defaultModuleApi = scopeSelf.config.defaultModuleApi;
      await this.app.meta.module.use(this._defaultModuleApi);
    }
  }

  async beanInit(bean: BeanContainer, beanInstance: BeanBase) {
    const self = this;
    for (const sceneName of ['api', 'apiSchema']) {
      bean.defineProperty(beanInstance, `$${sceneName}`, {
        enumerable: false,
        configurable: true,
        get() {
          return cast(self.app.bean.scope(self._defaultModuleApi))[sceneName];
        },
      });
    }
  }

  private async _loadApis(module: IModule, sceneName: 'api' | 'apiSchema') {
    const onions = appResource.scenes[sceneName]?.[module.info.relativeName];
    if (!onions) return;
    const scope = this.bean.scope(module.info.relativeName as any) as any;
    const beanFullNames = Object.keys(onions);
    const promises: Promise<any>[] = [];
    for (const beanFullName of beanFullNames) {
      promises.push(this.bean._getBean(beanFullName as any, true));
    }
    const values = await Promise.all(promises);
    for (let index = 0; index < beanFullNames.length; index++) {
      const beanFullName = beanFullNames[index];
      const beanOptions = onions[beanFullName];
      scope[sceneName][beanOptions.name] = values[index];
    }
  }
}

import type { IMonkeySysInitialize } from 'zova';

import { BeanSimple } from 'zova';

export class MonkeySys extends BeanSimple implements IMonkeySysInitialize {
  async sysInitialize() {
    const modulesMeta = this.sys.meta.module.getModulesMeta();
    if (!modulesMeta) {
      throw new Error('module registry has been disposed');
    }
    let beansPreload: string[] = [];
    for (const moduleName in modulesMeta.modules) {
      const module = modulesMeta.modules[moduleName];
      if (!module.info.onionsMeta?.beansPreload) continue;
      beansPreload = beansPreload.concat(module.info.onionsMeta?.beansPreload);
    }
    const promises: Promise<any>[] = beansPreload.map(item => {
      return this.sys.bean._getBean(item as any, false);
    });
    await Promise.all(promises);
  }
}

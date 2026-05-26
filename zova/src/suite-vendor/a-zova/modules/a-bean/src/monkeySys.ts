import type { IMonkeySysInitialize } from 'zova';

import { BeanSimple } from 'zova';

export class MonkeySys extends BeanSimple implements IMonkeySysInitialize {
  async sysInitialize() {
    let beansPreload: string[] = [];
    for (const moduleName in this.sys.meta.module.modulesMeta.modules) {
      const module = this.sys.meta.module.modulesMeta.modules[moduleName];
      if (!module.info.onionsMeta?.beansPreload) continue;
      beansPreload = beansPreload.concat(module.info.onionsMeta?.beansPreload);
    }
    const promises: Promise<any>[] = beansPreload.map(item => {
      return this.sys.bean._getBean(item as any, false);
    });
    await Promise.all(promises);
  }
}

import type { IMonkeyAppClose } from 'vona';

import { BeanSimple } from 'vona';

export class Monkey extends BeanSimple implements IMonkeyAppClose {
  async appClose() {
    const sceneNameLike = '.ssrSite.';
    const recordBeanInstances = this.app.meta.hmr.recordBeanInstances;
    if (!recordBeanInstances) return;
    for (const beanFullName of Object.keys(recordBeanInstances)) {
      if (!beanFullName.includes(sceneNameLike)) continue;
      const beanInstances = recordBeanInstances[beanFullName];
      if (!beanInstances) continue;
      recordBeanInstances[beanFullName] = [];
      for (const { beanInstanceKey } of beanInstances) {
        await this.bean._removeBean(beanInstanceKey);
      }
    }
  }
}

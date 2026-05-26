import type { IBeanSceneRecord } from 'vona';

import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

@Bean()
export class BeanHmr extends BeanBase {
  public async reloadBean(beanFullName: string) {
    return await this.scope.service.hmr.reloadBean(beanFullName);
  }

  public async reloadBeansOfScene(sceneName: keyof IBeanSceneRecord) {
    const sceneNameLike = `.${sceneName}.`;
    const recordBeanInstances = this.app.meta.hmr.recordBeanInstances;
    if (!recordBeanInstances) return;
    for (const beanFullName of Object.keys(recordBeanInstances)) {
      if (!beanFullName.includes(sceneNameLike)) continue;
      await this.reloadBean(beanFullName);
    }
  }
}

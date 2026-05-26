import type { IDecoratorBeanOptionsBase } from 'vona';
import type { IHmrReload } from 'vona-module-a-hmr';

import { BeanBase } from 'vona';
import { Hmr } from 'vona-module-a-hmrbase';
// import { clearAllCacheModelsClear, clearCacheModelCacheInstance } from '../lib/const.ts';

@Hmr()
export class HmrModel extends BeanBase implements IHmrReload {
  async reload(_beanOptions: IDecoratorBeanOptionsBase) {
    // more deps: dto/model
    this.app.bean.worker.reload();
    // clearAllCacheModelsClear(this.app);
    // await clearCacheModelCacheInstance(this.app, beanOptions.beanFullName);
  }
}

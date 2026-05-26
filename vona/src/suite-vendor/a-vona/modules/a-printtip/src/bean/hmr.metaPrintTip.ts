import type { IDecoratorBeanOptionsBase } from 'vona';
import type { IHmrReload } from 'vona-module-a-hmr';

import { BeanBase } from 'vona';
import { Hmr } from 'vona-module-a-hmrbase';

@Hmr()
export class HmrMetaPrintTip extends BeanBase implements IHmrReload {
  async reload(_beanOptions: IDecoratorBeanOptionsBase) {
    await this.bean.instance.reloadWorker('');
  }
}

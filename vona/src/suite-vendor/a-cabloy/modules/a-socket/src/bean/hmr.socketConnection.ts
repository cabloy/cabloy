import type { IDecoratorBeanOptionsBase } from 'vona';
import type { IHmrReload } from 'vona-module-a-hmr';

import { BeanBase } from 'vona';
import { Hmr } from 'vona-module-a-hmrbase';

import { clearAllCacheSocketConnections } from '../lib/const.ts';

@Hmr()
export class HmrSocketConnection extends BeanBase implements IHmrReload {
  async reload(_beanOptions: IDecoratorBeanOptionsBase) {
    clearAllCacheSocketConnections(this.app);
  }
}

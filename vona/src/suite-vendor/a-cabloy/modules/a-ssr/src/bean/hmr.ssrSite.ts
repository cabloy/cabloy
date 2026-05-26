import type { IDecoratorBeanOptionsBase } from 'vona';
import type { IHmrReload } from 'vona-module-a-hmr';

import { BeanBase } from 'vona';
import { Hmr } from 'vona-module-a-hmrbase';

import { clearAllCacheSites } from '../lib/const.ts';

@Hmr()
export class HmrSsrSite extends BeanBase implements IHmrReload {
  async reload(_beanOptions: IDecoratorBeanOptionsBase) {
    clearAllCacheSites(this.app);
  }
}

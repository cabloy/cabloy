import type { IDecoratorBeanOptionsBase } from 'vona';
import type { IHmrReload } from 'vona-module-a-hmr';

import { BeanBase } from 'vona';
import { Hmr } from 'vona-module-a-hmrbase';

import { clearCacheComposeMiddlewareSystems } from '../lib/const.ts';

@Hmr()
export class HmrMiddlewareSystem extends BeanBase implements IHmrReload {
  async reload(_beanOptions: IDecoratorBeanOptionsBase) {
    clearCacheComposeMiddlewareSystems(this.app);
  }
}

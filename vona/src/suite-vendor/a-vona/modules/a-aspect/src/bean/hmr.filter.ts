import type { IDecoratorBeanOptionsBase } from 'vona';
import type { IHmrReload } from 'vona-module-a-hmr';

import { BeanBase } from 'vona';
import { Hmr } from 'vona-module-a-hmrbase';

import { SymbolCacheComposeFilters } from '../lib/const.ts';

@Hmr()
export class HmrFilter extends BeanBase implements IHmrReload {
  async reload(_beanOptions: IDecoratorBeanOptionsBase) {
    delete this.app.meta[SymbolCacheComposeFilters];
  }
}

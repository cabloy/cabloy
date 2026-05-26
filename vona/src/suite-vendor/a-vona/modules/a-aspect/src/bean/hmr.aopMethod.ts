import type { IDecoratorBeanOptionsBase } from 'vona';
import type { IHmrReload } from 'vona-module-a-hmr';

import { BeanBase, SymbolCacheAopChains, SymbolCacheAopChainsKey } from 'vona';
import { Hmr } from 'vona-module-a-hmrbase';

@Hmr()
export class HmrAopMethod extends BeanBase implements IHmrReload {
  async reload(_beanOptions: IDecoratorBeanOptionsBase) {
    delete this.app[SymbolCacheAopChains];
    delete this.app[SymbolCacheAopChainsKey];
  }
}

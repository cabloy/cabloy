import type { BeanBase, BeanContainer } from 'zova';

import { __ThisModule__ } from '../.metadata/this.js';

export function definePropertyScopeBase(bean: BeanContainer, beanInstance: BeanBase) {
  // $scopeBase
  bean.defineProperty(beanInstance, '$scopeBase', {
    enumerable: false,
    configurable: true,
    get() {
      return bean.scope(__ThisModule__);
    },
  });
}

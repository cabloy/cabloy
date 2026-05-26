import type { BeanBase, BeanContainer, IMonkeyBeanInit } from 'zova';

import { BeanSimple } from 'zova';

import { definePropertyScopeBase } from './lib/utils.js';

export class MonkeySys extends BeanSimple implements IMonkeyBeanInit {
  async beanInit(bean: BeanContainer, beanInstance: BeanBase) {
    definePropertyScopeBase(bean, beanInstance);
  }
}

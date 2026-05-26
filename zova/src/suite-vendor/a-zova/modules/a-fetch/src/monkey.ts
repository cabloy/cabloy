import type { BeanBase, BeanContainer, IMonkeyAppInitialize, IMonkeyBeanInit } from 'zova';

import { BeanSimple } from 'zova';

import { BeanFetch } from './bean/bean.fetch.js';

export class Monkey extends BeanSimple implements IMonkeyAppInitialize, IMonkeyBeanInit {
  async appInitialize() {
    // $fetch: should in appInitialize, because should init many interceptors
    this.app.meta.$fetch = await this.bean._getBean(BeanFetch, false);
  }

  async beanInit(bean: BeanContainer, beanInstance: BeanBase) {
    const self = this;
    // $fetch
    bean.defineProperty(beanInstance, '$fetch', {
      enumerable: false,
      configurable: true,
      get() {
        return self.app.meta.$fetch;
      },
    });
  }
}

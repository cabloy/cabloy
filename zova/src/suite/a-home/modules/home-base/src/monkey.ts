import type {
  BeanBase,
  BeanContainer,
  IMonkeyAppClose,
  IMonkeyAppInitialize,
  IMonkeyBeanInit,
} from 'zova';

import { BeanSimple } from 'zova';

import { definePropertyScopeBase } from './lib/utils.js';
import { ServiceRouterGuards } from './service/routerGuards.js';
import { ServiceSsr } from './service/ssr.js';

export class Monkey
  extends BeanSimple
  implements IMonkeyAppInitialize, IMonkeyAppClose, IMonkeyBeanInit
{
  serviceRouterGuards: ServiceRouterGuards;
  serviceSsr: ServiceSsr;

  async appInitialize() {
    // router
    this.serviceRouterGuards = await this.bean._newBean(ServiceRouterGuards, false);
    // ssr
    this.serviceSsr = await this.bean._newBean(ServiceSsr, false);
    await this.serviceSsr.initialize();
  }

  appClose(): void {
    if (this.serviceRouterGuards) {
      this.serviceRouterGuards.dispose();
    }
  }

  async beanInit(bean: BeanContainer, beanInstance: BeanBase) {
    definePropertyScopeBase(bean, beanInstance);
  }
}

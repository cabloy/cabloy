import type { IInstanceRecord } from '../../types/config/instance.ts';
import type { ContextBase } from '../../types/context/contextBase.ts';
import type { VonaContext } from '../../types/context/index.ts';
import type { MetadataKey } from './metadata.ts';

import { cast } from '../../types/utils/cast.ts';
import { BeanContainer } from '../bean/beanContainer.ts';
import { appResource } from './resource.ts';

const BEAN = Symbol.for('Context#__bean');
const INNERACCESS = Symbol.for('Context#__inneraccess');
const CTXCALLER = Symbol.for('Context#__ctxcaller');
const ONIONSDYNAMIC = Symbol.for('Context#__onionsdynamic');

export const contextBase: ContextBase = {
  get bean(): BeanContainer {
    const self = cast(this);
    if (!self[BEAN]) {
      self[BEAN] = BeanContainer.create(self.app, self);
    }
    return self[BEAN];
  },
  get locale() {
    const self = cast(this);
    return self.__getLocale();
  },
  set locale(value) {
    const self = cast(this);
    self.__setLocale(value);
  },
  get tz() {
    const self = cast(this);
    return self.__getTz();
  },
  set tz(value) {
    const self = cast(this);
    self.__setTz(value);
  },
  get instanceName(): keyof IInstanceRecord | undefined | null {
    const self = cast(this);
    return self.__getInstanceName();
  },
  set instanceName(value: keyof IInstanceRecord | undefined | null) {
    const self = cast(this);
    self.__setInstanceName(value);
  },
  get config() {
    const self = cast(this);
    const serviceInstance = cast(self.app.bean._getBean('a-instance.service.instance' as never));
    return serviceInstance.getConfig(self.instanceName) || self.app.config;
  },
  get innerAccess() {
    return this[INNERACCESS];
  },
  set innerAccess(value) {
    this[INNERACCESS] = value;
  },
  get ctxCaller() {
    return this[CTXCALLER];
  },
  set ctxCaller(value) {
    this[CTXCALLER] = value;
  },

  getController() {
    const self = cast(this);
    return self.route?.controller;
  },

  getControllerPrototype(): object | undefined {
    const self = cast<VonaContext>(this);
    const controller = self.getController();
    if (!controller) return undefined;
    return controller.prototype;
  },

  getControllerBean<T = any>(): T | undefined {
    const self = cast<VonaContext>(this);
    const beanFullName = self.getControllerBeanFullName();
    if (!beanFullName) return;
    return self.app.bean._getBean(beanFullName as any);
  },

  getControllerBeanFullName(): string | undefined {
    const self = cast<VonaContext>(this);
    const controller = self.getController();
    if (!controller) return undefined;
    const beanOptions = appResource.getBean(controller);
    return beanOptions?.beanFullName;
  },

  getHandler() {
    const self = cast(this);
    return self.route?.actionDescriptor?.value;
  },

  getHandlerName(): MetadataKey | undefined {
    const self = cast(this);
    return self.route?.action;
  },

  get onionsDynamic(): any | undefined {
    return this[ONIONSDYNAMIC];
  },

  set onionsDynamic(value: any | undefined) {
    this[ONIONSDYNAMIC] = value;
  },

  get acceptJSON(): boolean {
    const self = cast<VonaContext>(this);
    if (self.path.endsWith('.json')) return true;
    if (self.response.type && self.response.type.includes('json')) return true;
    if (
      self.request.headers['content-type']?.includes('application/json') &&
      self.accepts('json') === 'json'
    ) {
      return true;
    }
    if (self.accepts('html', 'text', 'json') === 'json') return true;
    return false;
  },

  redirect(url: string, status?: 301 | 302): void {
    const self = cast<VonaContext>(this);
    // checkOrigin
    if (!url.startsWith('/')) {
      const origin = cast(self.app.bean).security.checkOrigin(url, self.host);
      if (!origin) self.app.throw(403);
    }
    // throw
    status = status ?? 302;
    self.app.throw(status, url);
  },
};

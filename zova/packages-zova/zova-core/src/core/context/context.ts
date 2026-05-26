import type { ComponentInternalInstance } from 'vue';

import { markRaw, nextTick } from 'vue';

import type { ZovaApplication } from '../app/application.ts';

import { BeanContainer } from '../../bean/beanContainer.ts';
import { cast } from '../../types/utils/cast.ts';
import { sys } from '../sys/sys.ts';
import { CtxMeta } from './meta.ts';
import { CtxUtil } from './util.ts';

export class ZovaContext {
  instance: ComponentInternalInstance;
  app: ZovaApplication;
  bean: BeanContainer;
  util: CtxUtil;
  meta: CtxMeta;
  disposed: boolean;
  // config: ContextConfig;

  constructor(instance: ComponentInternalInstance) {
    markRaw(this);
    instance.zova = this;
    this.instance = instance;
    this.app = instance.appContext.app.zova;
    this.bean = BeanContainer.create(sys, this.app, this);
    this.util = this.bean._newBeanSimple(CtxUtil, false);
    this.meta = this.bean._newBeanSimple(CtxMeta, false);
    this.meta.initialize();
    this._zovaHostProvidersInit();
  }

  /** @internal */
  public dispose() {
    if (this.disposed) return;
    this.meta.dispose();
    cast(this.instance).zova = null;
    cast(this).instance = null;
    cast(this).app = null;
    cast(this).bean = null;
    cast(this).meta = null;
    this.disposed = true;
  }

  private _zovaHostProvidersInit() {
    let zovaHostProviders = cast(this.instance).zovaHostProviders;
    if (!zovaHostProviders) {
      if (this.instance.parent?.type.name === 'AsyncComponentWrapper') {
        zovaHostProviders = cast(this.instance.parent).zovaHostProviders;
      }
    }
    this._zovaHostProvidersUpdate_inner(zovaHostProviders);
  }

  protected _zovaHostProvidersUpdate(zovaHostProviders?: any) {
    if (process.env.SERVER) throw new Error('should not update zovaHostProviders in server');
    nextTick(() => {
      this._zovaHostProvidersUpdate_inner(zovaHostProviders);
    });
  }

  private _zovaHostProvidersUpdate_inner(zovaHostProviders?: any) {
    if (!this.bean || !zovaHostProviders) return;
    for (const key in zovaHostProviders) {
      const beanInstance = this.bean._getBeanSyncOnly(key);
      if (beanInstance !== zovaHostProviders[key]) {
        this.bean._setBean(key, zovaHostProviders[key]);
      }
    }
  }
}

declare module 'vue' {
  export interface ComponentInternalInstance {
    zova: ZovaContext;
  }
}

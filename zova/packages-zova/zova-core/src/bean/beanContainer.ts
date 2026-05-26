import { compose } from '@cabloy/compose';
import { isClass, isNilOrEmptyString } from '@cabloy/utils';
import {
  inject as composableInject,
  provide as composableProvide,
  markRaw,
  reactive,
  shallowReactive,
} from 'vue';

import type { ZovaApplication, ZovaContext, ZovaSys } from '../core/index.ts';
import type { MetadataKey } from '../core/sys/metadata.ts';
import type {
  Constructable,
  ContainerType,
  IDecoratorBeanOptionsBase,
  IDecoratorUseOptions,
  IDecoratorUseOptionsBase,
} from '../decorator/index.js';
import type { IInjectRecord } from '../types/interface/inject.ts';
import type {
  IBeanRecord,
  IBeanScopeRecord,
  IControllerData,
  TypeBeanScopeRecordKeys,
} from './type.ts';

import { appMetadata } from '../core/sys/metadata.ts';
import { appResource, SymbolDecoratorProxyDisable } from '../core/sys/resource.ts';
import { __prepareInjectSelectorInfo } from '../decorator/index.ts';
import { cast } from '../types/utils/cast.ts';
import { useComputed } from '../vueExtra/computed.ts';
import { BeanAopBase } from './beanAopBase.ts';
import { BeanBase } from './beanBase.ts';
import { SymbolBeanFullName, SymbolBeanInstanceKey, SymbolInited } from './beanBaseSimple.ts';
import { BeanSimple } from './beanSimple.ts';

const SymbolBeanContainerParent = Symbol('SymbolBeanContainerParent');
const SymbolProxyMagic = Symbol('SymbolProxyMagic');
const SymbolProxyAopMethod = Symbol('SymbolProxyAopMethod');
const SymbolCacheAopChains = Symbol('SymbolCacheAopChains');
const SymbolCacheAopChainsKey = Symbol('SymbolCacheAopChainsKey');
const SymbolGetBeanSelectorInnerPromises = Symbol('SymbolGetBeanSelectorInnerPromises');
export const SymbolBeanContainerInstances = Symbol('SymbolBeanContainerInstances');

export class BeanContainer {
  private sys: ZovaSys;
  private app: ZovaApplication;
  private ctx: ZovaContext;

  // fullName / uuid / propName
  private [SymbolBeanContainerInstances]: Record<MetadataKey, unknown> = shallowReactive({});

  private [SymbolGetBeanSelectorInnerPromises]: Record<string, Promise<any> | undefined> = {};

  static create(sys: ZovaSys, app: ZovaApplication, ctx: ZovaContext | null) {
    const beanContainer = new BeanContainer(sys, app, ctx);
    const proxy = new Proxy(beanContainer, {
      get(obj, prop) {
        if (typeof prop === 'symbol') return obj[prop];
        if (obj[prop]) return obj[prop];
        return obj._getBeanSyncOnly(prop);
      },
    });
    return markRaw(proxy);
  }

  protected constructor(sys: ZovaSys, app: ZovaApplication, ctx: ZovaContext | null) {
    this.sys = sys;
    this.app = app;
    this.ctx = ctx as any;
  }

  /** @internal */
  public dispose() {
    const beanInstances = this[SymbolBeanContainerInstances];
    for (const prop in beanInstances) {
      if (prop.startsWith('$$')) continue;
      const beanInstance = cast(beanInstances[prop]);
      if (beanInstance && !(beanInstance instanceof BeanAopBase) && beanInstance.__dispose__) {
        if (this.containerType === 'sys') {
          this.sys.meta.module._monkeyModuleSync(
            false,
            'beanDispose',
            undefined,
            this,
            beanInstance,
          );
          beanInstance.__dispose__();
          this.sys.meta.module._monkeyModuleSync(
            false,
            'beanDisposed',
            undefined,
            this,
            beanInstance,
          );
        } else {
          this.app.meta.module._monkeyModuleSync(
            false,
            'beanDispose',
            undefined,
            this,
            beanInstance,
          );
          this.runWithInstanceScopeOrAppContext(() => {
            beanInstance.__dispose__();
          });
          this.app.meta.module._monkeyModuleSync(
            false,
            'beanDisposed',
            undefined,
            this,
            beanInstance,
          );
        }
      }
    }
    this[SymbolBeanContainerInstances] = shallowReactive({});
    this[SymbolBeanContainerParent] = undefined;
    this[SymbolGetBeanSelectorInnerPromises] = {};
  }

  get containerType(): ContainerType {
    if (!this.ctx) return 'sys';
    if (!this.app || this.ctx.bean === this.app.bean) return 'app';
    return 'ctx';
  }

  get parent(): BeanContainer | null {
    if (this[SymbolBeanContainerParent] === undefined) {
      this[SymbolBeanContainerParent] = this._getParent();
    }
    return this[SymbolBeanContainerParent];
  }

  private _getParent(): BeanContainer | null {
    if (this.containerType === 'sys') return null;
    let parent = this.ctx?.instance?.parent;
    while (parent) {
      const beanContainerParent = parent.zova?.bean;
      if (beanContainerParent) return beanContainerParent;
      parent = parent.parent;
    }
    return this.sys.bean;
  }

  runWithInstanceScopeOrAppContext(fn, tracking?: boolean) {
    if (this.containerType === 'sys') return fn();
    if (this.ctx) {
      return this.ctx.util.instanceScope(fn, tracking);
    } else {
      return this.app.vue.runWithContext(fn);
    }
  }

  provide<K extends keyof IInjectRecord>(injectKey: K, value: IInjectRecord[K]) {
    return this.ctx.util.instanceScope(() => {
      return composableProvide(injectKey, value as any);
    });
  }

  inject<K extends keyof IInjectRecord>(injectKey: K): IInjectRecord[K];
  inject<K extends keyof IInjectRecord>(
    injectKey: K,
    defaultValue: IInjectRecord[K],
    treatDefaultAsFactory?: false,
  ): IInjectRecord[K];
  inject<K extends keyof IInjectRecord>(
    injectKey: K,
    defaultValue: IInjectRecord[K] | (() => IInjectRecord[K]),
    treatDefaultAsFactory?: true,
  ): IInjectRecord[K];
  inject(injectKey, defaultValue?, treatDefaultAsFactory?) {
    return this.ctx.util.instanceScope(() => {
      return composableInject(injectKey, defaultValue, treatDefaultAsFactory);
    });
  }

  defineProperty<T>(obj: T, prop: string, attributes: PropertyDescriptor & ThisType<any>): T {
    // eslint-disable-next-line
    const self = this;
    const attrs = { ...attributes };
    if (attributes.get) {
      attrs.get = function () {
        const innerKey = `__innerKey_${prop}`;
        if (!obj[innerKey]) {
          self.runWithInstanceScopeOrAppContext(() => {
            __setPropertyValue(obj as any, innerKey, attributes.get!(), true);
          });
        }
        return obj[innerKey];
      };
    }
    return Object.defineProperty(obj, prop, attrs);
  }

  /** get specific module's scope */
  scope<K extends TypeBeanScopeRecordKeys>(moduleScope: K): IBeanScopeRecord[K];
  // scope<T>(moduleScope: string): T;
  scope<T>(moduleScope: string): T {
    // ctx->app
    if (this.containerType === 'ctx') {
      return this.app.bean.scope(moduleScope as never);
    }
    // sys/app
    return this._getBeanSyncOnly(`${moduleScope}.scope.module`);
  }

  async getScope<K extends TypeBeanScopeRecordKeys>(moduleScope: K): Promise<IBeanScopeRecord[K]>;
  // async getScope<T>(moduleScope: string): Promise<T>;
  async getScope<T>(moduleScope: string): Promise<T> {
    // ctx->app
    if (this.containerType === 'ctx') {
      return await this.app.bean.getScope(moduleScope as never);
    }
    // module: load
    await this._useModule(moduleScope);
    return this.scope(moduleScope as never);
  }

  _setBean<T>(key: string, instance: T) {
    this[SymbolBeanContainerInstances][key] = instance;
  }

  _getBeanSync<K extends keyof IBeanRecord>(
    beanFullName: K,
    markReactive?: boolean,
    forceLoad?: boolean,
  ): IBeanRecord[K] | undefined;
  _getBeanSync<T>(key: string, markReactive?: boolean, forceLoad?: boolean): T | undefined;
  _getBeanSync<T>(key: string, markReactive?: boolean, forceLoad?: boolean): T | undefined {
    const beanInstance: any = this[SymbolBeanContainerInstances][key];
    if (beanInstance === undefined) {
      // bean not loaded, so async load to raise the next call
      if (forceLoad !== false) {
        this._getBean(key as any, markReactive);
      }
      return undefined;
    }
    if (beanInstance && beanInstance[SymbolInited] && !beanInstance[SymbolInited].state) {
      return undefined;
    }
    return beanInstance as T;
  }

  _getBeanSyncOnly<T>(key: MetadataKey): T {
    return this[SymbolBeanContainerInstances][key] as T;
  }

  async _getBean<T>(A: Constructable<T>, markReactive?: boolean, ...args): Promise<T>;
  async _getBean<K extends keyof IBeanRecord>(
    beanFullName: K,
    markReactive?: boolean,
    ...args
  ): Promise<IBeanRecord[K]>;
  // async _getBean<T>(beanFullName: string, markReactive?: boolean, ...args): Promise<T>;
  async _getBean<T>(
    beanFullName: Constructable<T> | string,
    markReactive?: boolean,
    ...args
  ): Promise<T> {
    return await this._getBeanSelectorInner(true, null, beanFullName, markReactive, false, ...args);
  }

  async _getBeanSelector<T>(
    A: Constructable<T>,
    markReactive?: boolean,
    selector?: string,
    ...args
  ): Promise<T>;
  async _getBeanSelector<K extends keyof IBeanRecord>(
    beanFullName: K,
    markReactive?: boolean,
    selector?: string,
    ...args
  ): Promise<IBeanRecord[K]>;
  // async _getBeanSelector<T>(beanFullName: string, markReactive?: boolean, selector?: string): Promise<T>;
  async _getBeanSelector<T>(
    beanFullName: Constructable<T> | string,
    markReactive?: boolean,
    selector?: string,
    ...args
  ): Promise<T> {
    return await this._getBeanSelectorInner(
      true,
      null,
      beanFullName,
      markReactive,
      true,
      selector,
      ...args,
    );
  }

  _getBeanSelectorInnerSync<T>(
    beanFullName: Constructable<T> | string | undefined,
    selector?: string,
  ): T {
    // fullName
    const fullName = this._getBeanFullNameByComposableOrClassSync(beanFullName);
    if (!fullName) {
      // not found
      return null!;
    }
    const key = __getSelectorKey(fullName, true, selector);
    return this[SymbolBeanContainerInstances][key] as T;
  }

  async _getBeanSelectorInner<T>(
    newBeanForce: boolean,
    recordProp: MetadataKey | null,
    beanFullName: Constructable<T> | string | undefined,
    markReactive?: boolean,
    withSelector?: boolean,
    ...args
  ): Promise<T> {
    // fullName
    const fullName = await this._getBeanFullNameByComposableOrClass(beanFullName);
    if (!fullName) {
      // not found
      return null!;
    }
    const key = __getSelectorKey(fullName, withSelector, args[0]);
    if (this[SymbolBeanContainerInstances][key] === undefined && newBeanForce) {
      if (!this[SymbolGetBeanSelectorInnerPromises][key]) {
        this[SymbolGetBeanSelectorInnerPromises][key] = this._getBeanSelectorInnerPromise(
          recordProp,
          fullName,
          markReactive,
          withSelector,
          ...args,
        );
      }
      await this[SymbolGetBeanSelectorInnerPromises][key];
    }
    if (this[SymbolBeanContainerInstances][key] && this[SymbolGetBeanSelectorInnerPromises][key]) {
      // maybe instance exists, while promise not await complete
      await this[SymbolGetBeanSelectorInnerPromises][key];
      this[SymbolGetBeanSelectorInnerPromises][key] = undefined;
    }
    return this[SymbolBeanContainerInstances][key] as T;
  }

  private async _getBeanSelectorInnerPromise<T>(
    recordProp: MetadataKey | null,
    fullName: Constructable<T> | string | undefined,
    markReactive?: boolean,
    withSelector?: boolean,
    ...args
  ): Promise<T> {
    return await this._newBeanInner(
      true,
      recordProp,
      null,
      fullName,
      markReactive,
      withSelector,
      ...args,
    );
  }

  _newBeanSimple<T>(A: Constructable<T>, markReactive: boolean, ...args): T {
    // prepare
    const beanInstance = this._prepareBeanInstanceSimple(A, A, args, markReactive);
    // init
    if (!(beanInstance instanceof BeanAopBase) && beanInstance.__init__) {
      beanInstance.__init__(...args);
    }
    // ok
    return beanInstance;
  }

  async _newBean<T>(A: Constructable<T>, markReactive?: boolean, ...args): Promise<T>;
  async _newBean<K extends keyof IBeanRecord>(
    beanFullName: K,
    markReactive?: boolean,
    ...args
  ): Promise<IBeanRecord[K]>;
  // async _newBean<T>(beanFullName: string, markReactive?: boolean, ...args): Promise<T>;
  async _newBean<T>(
    beanFullName: Constructable<T> | string,
    markReactive?: boolean,
    ...args
  ): Promise<T> {
    return await this._newBeanInner(false, null, null, beanFullName, markReactive, false, ...args);
  }

  async _newBeanSelector<T>(
    A: Constructable<T>,
    markReactive?: boolean,
    selector?: string,
    ...args
  ): Promise<T>;
  async _newBeanSelector<K extends keyof IBeanRecord>(
    beanFullName: K,
    markReactive?: boolean,
    selector?: string,
    ...args
  ): Promise<IBeanRecord[K]>;
  // async _newBeanSelector<T>(beanFullName: string, markReactive?: boolean, selector?: string, ...args): Promise<T>;
  async _newBeanSelector<T>(
    beanFullName: Constructable<T> | string,
    markReactive?: boolean,
    selector?: string,
    ...args
  ): Promise<T> {
    return await this._newBean(beanFullName as any, markReactive, selector, ...args);
  }

  /** @internal */
  public async _newBeanInner<T>(
    record: boolean,
    recordProp: MetadataKey | null,
    controllerData: any,
    beanFullName: Constructable<T> | string | undefined,
    markReactive?: boolean,
    withSelector?: boolean,
    ...args
  ): Promise<T> {
    // bean options
    const beanOptions = await this._getBeanOptionsForce(beanFullName);
    if (!beanOptions) {
      // class
      if (typeof beanFullName === 'function' && isClass(beanFullName)) {
        return await this._createBeanInstance<T>(
          record,
          recordProp,
          controllerData,
          undefined,
          beanFullName,
          args,
          false,
          markReactive,
          withSelector,
        );
      }
      // throw new Error(`bean not found: ${beanFullName}`);
      return null!;
    }
    // beanFullName
    return await this._createBeanInstance<T>(
      record,
      recordProp,
      controllerData,
      beanOptions.beanFullName,
      beanOptions.beanClass as Constructable<T>,
      args,
      cast(beanOptions.scene) === 'aop',
      // default is true: same as inject prop
      markReactive ?? beanOptions.markReactive ?? true,
      withSelector,
    );
  }

  private _getBeanFullNameByComposableOrClassSync(beanFullName: any) {
    // bean options
    const beanOptions = this._getBeanOptionsForceSync(beanFullName);
    if (!beanOptions) {
      // not found
      return undefined;
    }
    return beanOptions.beanFullName;
  }

  private async _getBeanFullNameByComposableOrClass(beanFullName: any) {
    // check beanFullName: for app controller/render
    if (!beanFullName) {
      // not found
      return undefined;
    }
    // bean options
    const beanOptions = await this._getBeanOptionsForce(beanFullName);
    if (!beanOptions) {
      // not found
      return undefined;
    }
    return beanOptions.beanFullName;
  }

  private _getBeanOptionsForceSync(beanFullName: any) {
    return appResource.getBean(beanFullName);
  }

  private async _getBeanOptionsForce(beanFullName: any) {
    // class
    if (typeof beanFullName === 'function' && isClass(beanFullName)) {
      return appResource.getBean(beanFullName);
    }
    // module: name
    const parts = beanFullName.split('.');
    // module: load
    await this._useModule(parts[0]);
    // get
    return appResource.getBean(beanFullName);
  }

  private async _createBeanInstance<T>(
    record: boolean,
    recordProp: MetadataKey | null,
    controllerData: IControllerData,
    beanFullName: string | undefined,
    beanClass: Constructable<T> | undefined,
    args: any[],
    aop: boolean | undefined,
    markReactive: boolean | undefined,
    withSelector?: boolean,
  ): Promise<T> {
    // prepare
    const beanInstance = await this._prepareBeanInstance(
      beanFullName,
      beanClass,
      args,
      markReactive,
      aop,
    );
    // special for controller
    if (controllerData) {
      beanInstance.__initControllerData(controllerData);
    }
    // record
    if (record) {
      // fullName
      const fullName = await this._getBeanFullNameByComposableOrClass(beanFullName);
      if (fullName) {
        const key = __getSelectorKey(fullName, withSelector, args[0]);
        __setPropertyValue(beanInstance, SymbolBeanInstanceKey, key, false);
        this[SymbolBeanContainerInstances][key] = beanInstance;
      }
      // always record for app/ctx bean
      if (recordProp) {
        this.__recordProp(recordProp, fullName, beanInstance, true);
      }
    }
    // init
    await this._initBeanInstance(beanFullName, beanInstance, args);
    // ok
    return beanInstance;
  }

  private async _prepareBeanInstance(beanFullName, beanClass, args, markReactive, aop) {
    // prepare
    let beanInstance = this._prepareBeanInstanceCommon(beanFullName, beanClass, args, markReactive);
    // aop: proxy
    const beanInstanceProxy = await this._patchBeanInstance(
      beanFullName || beanClass,
      beanInstance,
      aop,
    );
    if (beanInstanceProxy) {
      // reactive
      if (markReactive) {
        beanInstance = reactive(beanInstanceProxy);
      } else {
        beanInstance = markRaw(beanInstanceProxy);
      }
    }
    // ok
    return beanInstance;
  }

  private _prepareBeanInstanceSimple(beanFullName, beanClass, args, markReactive) {
    // prepare
    let beanInstance = this._prepareBeanInstanceCommon(beanFullName, beanClass, args, markReactive);
    // aop: proxy
    const beanInstanceProxy = this._patchBeanInstanceSimple(
      beanFullName || beanClass,
      beanInstance,
    );
    if (beanInstanceProxy) {
      // reactive
      if (markReactive) {
        beanInstance = reactive(beanInstanceProxy);
      } else {
        beanInstance = markRaw(beanInstanceProxy);
      }
    }
    // ok
    return beanInstance;
  }

  private _prepareBeanInstanceCommon(beanFullName, BeanClass, args, markReactive) {
    // create: always passed in args
    let beanInstance = new BeanClass(...args);
    // if (BeanClass.prototype.__init__) {
    //   beanInstance = new BeanClass();
    // } else {
    //   beanInstance = new BeanClass(...args);
    // }

    // app/ctx
    if (beanInstance instanceof BeanSimple) {
      // sys
      (<any>beanInstance).sys = this.sys;
      // app
      Object.defineProperty(beanInstance, 'app', {
        enumerable: false,
        configurable: true,
        get: () => {
          return this.ctx?.app;
        },
      });
      // ctx: always set even if is null, so as to prevent magic method __get__ take effect.
      (<any>beanInstance).ctx = this.ctx;
    }
    // beanFullName
    if (typeof beanFullName === 'string') {
      __setPropertyValue(beanInstance, SymbolBeanFullName, beanFullName, false);
    }
    // reactive
    if (markReactive) {
      beanInstance = reactive(beanInstance);
    } else {
      beanInstance = markRaw(beanInstance);
    }
    // ok
    return beanInstance;
  }

  private async _initBeanInstance(beanFullName, beanInstance, args) {
    // // inject vue elements
    // this.runWithInstanceScopeOrAppContext(() => {
    //   this._injectVueElements(beanInstance, beanFullName);
    // });
    // inject
    await this._injectBeanInstance(beanInstance, beanFullName);
    // init
    if (this.containerType === 'sys') {
      await this.sys.meta.module._monkeyModule(true, 'beanInit', undefined, this, beanInstance);
    } else {
      await this.app?.meta.module._monkeyModule(true, 'beanInit', undefined, this, beanInstance);
    }
    if (!(beanInstance instanceof BeanAopBase) && beanInstance.__init__) {
      await this.runWithInstanceScopeOrAppContext(async () => {
        await beanInstance.__init__(...args);
      });
    }
    if (this.containerType === 'sys') {
      await this.sys.meta.module._monkeyModule(true, 'beanInited', undefined, this, beanInstance);
    } else {
      await this.app?.meta.module._monkeyModule(true, 'beanInited', undefined, this, beanInstance);
    }
    if (beanInstance[SymbolInited]) {
      beanInstance[SymbolInited].touch();
    }
    // ok
    return beanInstance;
  }

  // private _injectVueElements(beanInstance, beanFullName) {
  //   const beanOptions = appResource.getBean(beanFullName);
  //   if (!beanOptions) return;
  //   const vues = appMetadata.getMetadata(SymbolDecoratorVueElements, beanOptions.beanClass.prototype);
  //   if (!vues) return;
  //   for (const prop in vues) {
  //     const vueElements = vues[prop];
  //     for (let index = 0; index < vueElements.length; index++) {
  //       this._injectVueElement(beanInstance, beanFullName, prop, vueElements[index], index);
  //     }
  //   }
  // }

  // private _injectVueElement(beanInstance, beanFullName, prop: string, vueElement: IDecoratorVueElement, index: number) {
  //   const decoratorHandler = vueDecorators[vueElement.type];
  //   if (decoratorHandler) {
  //     decoratorHandler.call(this, beanInstance, beanFullName, prop, vueElement, index);
  //   }
  // }

  private async _injectBeanInstance(beanInstance, beanFullName) {
    const beanOptions = appResource.getBean(beanFullName);
    if (!beanOptions) return;
    const uses = appResource.getUses(beanOptions.beanClass.prototype);
    if (!uses) return;
    for (const key in uses) {
      const useOptions = uses[key];
      // beanClass
      let targetBeanFullName = useOptions.beanFullName;
      if (!targetBeanFullName && useOptions.beanClass) {
        targetBeanFullName = appResource.getBeanFullName(useOptions.beanClass);
      }
      // 0. host/skipSelf
      if (useOptions.injectionScope && ['host', 'skipSelf'].includes(useOptions.injectionScope)) {
        const selectorInfo = __prepareInjectSelectorInfo(beanInstance, useOptions);
        const useOptions2 = selectorInfo.withSelector
          ? Object.assign({}, useOptions, { selector: selectorInfo.args[0] })
          : useOptions;
        const targetBeanInstance = useComputed(() => {
          return this._getBeanFromHostInner(
            false,
            useOptions.prop,
            targetBeanFullName,
            useOptions2 as IDecoratorUseOptions,
          );
        });
        __setPropertyValue(beanInstance, key, targetBeanInstance, true);
        continue;
      }
      // others
      const targetBeanInstance = await this._injectBeanInstanceProp(
        beanInstance,
        targetBeanFullName,
        useOptions,
      );
      __setPropertyValue(beanInstance, key, targetBeanInstance, true);
    }
  }

  private async _injectBeanInstanceProp(
    beanInstance,
    targetBeanFullName: string | undefined,
    useOptions: IDecoratorUseOptionsBase,
  ) {
    // 1. use name
    if (useOptions.name) {
      return this[SymbolBeanContainerInstances][useOptions.name];
    }
    // 2. use prop
    if (!targetBeanFullName) {
      return this[SymbolBeanContainerInstances][useOptions.prop];
    }
    // 3. targetBeanFullName
    let targetOptions:
      | Pick<IDecoratorBeanOptionsBase, 'containerScope' | 'markReactive' | 'scene'>
      | undefined;
    if (targetBeanFullName) {
      targetOptions = await this._getBeanOptionsForce(targetBeanFullName);
      if (!targetOptions) {
        throw new Error(`not found bean class: ${targetBeanFullName}`);
      }
    }
    // options: injectionScope
    let injectionScope = useOptions.injectionScope ?? targetOptions!.containerScope ?? 'ctx';
    // patch
    if (targetOptions?.scene === 'scope' && !this.app) {
      injectionScope = 'sys';
    }
    // options: markReactive: default is true
    const markReactive = useOptions.markReactive ?? targetOptions!.markReactive ?? true;
    // options: selectorInfo
    const selectorInfo = __prepareInjectSelectorInfo(beanInstance, useOptions);
    // recordProp
    // const recordProp = useOptions.name || useOptions.prop;
    const recordProp = useOptions.prop;
    // targetInstance
    let targetInstance;
    if (injectionScope === 'sys') {
      targetInstance = await this.sys.bean._getBeanSelectorInner(
        true,
        null,
        targetBeanFullName,
        markReactive,
        selectorInfo.withSelector,
        ...selectorInfo.args,
      );
      await this._injectBeanInstanceProp_appBean(recordProp, targetBeanFullName, targetInstance);
    } else if (injectionScope === 'app') {
      targetInstance = await this.app.bean._getBeanSelectorInner(
        true,
        null,
        targetBeanFullName,
        markReactive,
        selectorInfo.withSelector,
        ...selectorInfo.args,
      );
      await this._injectBeanInstanceProp_appBean(recordProp, targetBeanFullName, targetInstance);
    } else if (injectionScope === 'ctx') {
      targetInstance = await this._getBeanSelectorInner(
        true,
        recordProp,
        targetBeanFullName,
        markReactive,
        selectorInfo.withSelector,
        ...selectorInfo.args,
      );
    } else if (injectionScope === 'new') {
      // not record prop
      targetInstance = await this._newBeanInner(
        false,
        null,
        null,
        targetBeanFullName,
        markReactive,
        selectorInfo.withSelector,
        ...selectorInfo.args,
      );
    }
    return targetInstance;
  }

  public _getBeanFromHost<T = unknown>(useOptions: IDecoratorUseOptions): T;
  public _getBeanFromHost<K extends keyof IBeanRecord>(
    beanFullName: K,
    useOptions?: IDecoratorUseOptions,
  ): IBeanRecord[K] | undefined;
  public _getBeanFromHost(
    beanFullName?: string | IDecoratorUseOptions,
    useOptions?: IDecoratorUseOptions,
  ) {
    if (typeof beanFullName !== 'string') {
      useOptions = beanFullName;
      beanFullName = undefined;
    }
    if (!useOptions) {
      useOptions = {};
    }
    return this._getBeanFromHostInner(false, undefined, beanFullName, useOptions);
  }

  public _getBeanFromHostInner(
    record: boolean,
    recordProp: MetadataKey | undefined,
    targetBeanFullName: string | undefined,
    useOptions: IDecoratorUseOptions,
  ) {
    let beanContainerParent;
    if (!useOptions.injectionScope || useOptions.injectionScope === 'host') {
      //eslint-disable-next-line
      beanContainerParent = this;
    } else if (useOptions.injectionScope === 'skipSelf') {
      beanContainerParent = this.parent;
    }
    while (true) {
      if (!beanContainerParent) return null;
      const beanInstance = this._getBeanFromHostInner2(
        recordProp,
        beanContainerParent,
        targetBeanFullName,
        useOptions,
      );
      // null is valid value
      if (beanInstance !== undefined) {
        // record prop
        if (record) {
          this.__recordProp(recordProp, undefined, beanInstance, false);
        }
        return beanInstance;
      }
      beanContainerParent = beanContainerParent.parent;
    }
  }

  private _getBeanFromHostInner2(
    recordProp: MetadataKey | undefined,
    beanContainerParent: BeanContainer,
    targetBeanFullName: string | undefined,
    useOptions: IDecoratorUseOptions,
  ) {
    // 1. use name
    if (useOptions.name) {
      return beanContainerParent[SymbolBeanContainerInstances][useOptions.name];
    }
    // 2. use prop
    if (!targetBeanFullName) {
      return beanContainerParent[SymbolBeanContainerInstances][recordProp!];
    }
    // 3. targetBeanFullName
    return beanContainerParent._getBeanSelectorInnerSync(targetBeanFullName, useOptions.selector);
  }

  private async _injectBeanInstanceProp_appBean(recordProp, _targetBeanFullName, targetInstance) {
    if (targetInstance === undefined) return;
    // only when ctx bean
    if (!this.ctx) return;
    // record prop
    this.__recordProp(recordProp, undefined, targetInstance, false);
    // force init
    if (targetInstance) {
      await targetInstance[SymbolInited].wait();
    }
  }

  private async _patchBeanInstance(beanFullNameOrBeanClass, beanInstance, aop) {
    if (!beanFullNameOrBeanClass) return undefined;
    // not aop on aop
    if (aop) return undefined;
    // aop chains
    const _aopChains = await this._prepareAopChains(beanFullNameOrBeanClass, beanInstance);
    // no aop
    if (_aopChains.length === 0) return undefined;
    // aop
    return this._newBeanProxy(beanFullNameOrBeanClass, beanInstance);
  }

  private _patchBeanInstanceSimple(beanFullNameOrBeanClass, beanInstance) {
    if (!beanFullNameOrBeanClass) return undefined;
    // aop chains
    const _aopChains = this._prepareAopChainsSimple(beanFullNameOrBeanClass, beanInstance);
    // no aop
    if (_aopChains.length === 0) return undefined;
    // aop
    return this._newBeanProxy(beanFullNameOrBeanClass, beanInstance);
  }

  private _newBeanProxy(beanFullName, beanInstance) {
    // eslint-disable-next-line
    const self = this;
    const proxy = new Proxy(beanInstance, {
      get(target, prop, receiver) {
        if (typeof prop === 'symbol') {
          return Reflect.get(target, prop, receiver);
        }
        if (__isInnerMethod(prop)) {
          if (prop === '__v_isShallow' && target.__v_isShallow_patch) {
            return Reflect.get(target, '__v_isShallow_patch', receiver);
          }
          return Reflect.get(target, prop, receiver);
        }
        // descriptorInfo
        const descriptorInfo = __getPropertyDescriptor(target, prop);
        if (!__checkAopOfDescriptorInfo(descriptorInfo)) return Reflect.get(target, prop, receiver);
        const methodType = __methodTypeOfDescriptor(descriptorInfo);
        // get prop
        if (!methodType) {
          if (__isLifeCycleMethod(prop)) return Reflect.get(target, prop, receiver);
          const methodName = `__get_${prop}__`;
          const methodNameMagic = '__get__';
          const _aopChainsProp = self._getAopChainsProp(
            beanFullName,
            methodName,
            methodNameMagic,
            'get',
            prop,
          );
          if (!_aopChainsProp) return Reflect.get(target, prop, receiver);
          // aop
          return _aopChainsProp([receiver, undefined], ([receiver, _]) => {
            if (!descriptorInfo && target.__get__) {
              return Reflect.apply(target.__get__, receiver, [prop, target]);
            } else {
              return Reflect.get(target, prop, receiver);
            }
          });
        }
        // method
        return self._getInstanceMethodProxy(beanFullName, target, prop, receiver);
      },
      set(target, prop, value, receiver) {
        if (typeof prop === 'symbol') {
          Reflect.set(target, prop, value, receiver);
          return true;
        }
        if (__isInnerMethod(prop)) {
          Reflect.set(target, prop, value, receiver);
          return true;
        }
        // descriptorInfo
        const descriptorInfo = __getPropertyDescriptor(target, prop);
        if (!__checkAopOfDescriptorInfo(descriptorInfo)) {
          Reflect.set(target, prop, value, receiver);
          return true;
        }
        const methodName = `__set_${prop}__`;
        const methodNameMagic = '__set__';
        const _aopChainsProp = self._getAopChainsProp(
          beanFullName,
          methodName,
          methodNameMagic,
          'set',
          prop,
        );
        if (!_aopChainsProp) {
          Reflect.set(target, prop, value, receiver);
          return true;
        }
        // aop
        return _aopChainsProp([receiver, value], ([receiver, value]) => {
          if (!descriptorInfo && target.__set__) {
            const res = Reflect.apply(target.__set__, receiver, [prop, value, target]);
            if (res === undefined) throw new Error('__set__ must return true/false');
            if (!res) {
              Reflect.set(target, prop, value, receiver);
            }
          } else {
            Reflect.set(target, prop, value, receiver);
          }
          // ok: prop be set
          return true;
        });
      },
    });
    return proxy;
  }

  private _getInstanceMethodProxy(beanFullName, target, prop, receiver) {
    // not aop magic methods
    if (__isInnerMethod(prop)) {
      return Reflect.get(target, prop, receiver);
    }
    // aop chains
    const methodNameMagic = '__method__';
    const _aopChainsProp = this._getAopChainsProp(
      beanFullName,
      prop,
      methodNameMagic,
      'method',
      prop,
    );
    if (!_aopChainsProp) return Reflect.get(target, prop, receiver);
    // proxy
    const methodProxyKey = `__aopproxy_method_${prop}__`;
    if (target[methodProxyKey]) return target[methodProxyKey];
    const methodProxy = new Proxy(target[prop], {
      apply(target, thisArg, args) {
        // aop
        return _aopChainsProp([thisArg, args], ([thisArg, args]) => {
          return Reflect.apply(target, thisArg, args);
        });
      },
    });
    __setPropertyValue(target, methodProxyKey, methodProxy, false);
    return methodProxy;
  }

  private async _prepareAopChains(beanFullNameOrBeanClass, beanInstance) {
    if (!beanFullNameOrBeanClass) return [];
    // beanFullName maybe class
    const beanOptions = appResource.getBean(beanFullNameOrBeanClass);
    const cacheKey = beanOptions?.beanFullName || beanFullNameOrBeanClass;
    // ProxyDisable
    const proxyDisable = beanOptions?.beanClass
      ? appMetadata.getMetadata<boolean>(SymbolDecoratorProxyDisable, beanOptions?.beanClass)
      : false;
    // host
    const host = this._aopCacheHost();
    if (!host[SymbolCacheAopChains]) host[SymbolCacheAopChains] = {};
    if (host[SymbolCacheAopChains][cacheKey]) return host[SymbolCacheAopChains][cacheKey];
    // chains
    let chains: (MetadataKey | BeanBase)[] = [];
    // aop
    if (!proxyDisable && beanOptions && cast(beanOptions.scene) !== 'aop') {
      const beanAop = (await this.sys.bean._getBean('a-bean.service.aop' as never, false)) as any;
      const aops = await beanAop.findAopsMatched(beanOptions.beanFullName);
      if (aops) {
        // load aops
        const aopInstances: BeanBase[] = [];
        for (const aop of aops) {
          // singleton
          aopInstances.push(await this.sys.bean._getBean(aop.beanFullName, true));
        }
        chains = chains.concat(aopInstances);
      }
    }
    // aop method
    if (!proxyDisable && beanOptions) {
      const beanAop = (await this.sys.bean._getBean('a-bean.service.aop' as never, false)) as any;
      const aopMethods = await beanAop.findAopMethodsMatched(beanOptions?.beanFullName);
      if (aopMethods) {
        chains.push([SymbolProxyAopMethod, aopMethods] as any);
      }
    }
    // magic self
    if (__hasMagicMethod(beanInstance)) {
      chains.push(SymbolProxyMagic);
    }
    // hold
    host[SymbolCacheAopChains][cacheKey] = chains;
    return chains;
  }

  private _prepareAopChainsSimple(beanFullNameOrBeanClass, beanInstance) {
    if (!beanFullNameOrBeanClass) return [];
    // beanFullName maybe class
    const beanOptions = appResource.getBean(beanFullNameOrBeanClass);
    const cacheKey = beanOptions?.beanFullName || beanFullNameOrBeanClass;
    const host = this._aopCacheHost();
    if (!host[SymbolCacheAopChains]) host[SymbolCacheAopChains] = {};
    if (host[SymbolCacheAopChains][cacheKey]) return host[SymbolCacheAopChains][cacheKey];
    // chains
    const chains: MetadataKey[] = [];
    // magic self
    if (__hasMagicMethod(beanInstance)) {
      chains.push(SymbolProxyMagic);
    }
    // hold
    host[SymbolCacheAopChains][cacheKey] = chains;
    return chains;
  }

  private _getAopChains(beanFullName) {
    // beanFullName maybe class
    const beanOptions = appResource.getBean(beanFullName);
    const cacheKey = beanOptions?.beanFullName || beanFullName;
    const host = this._aopCacheHost();
    return host[SymbolCacheAopChains]?.[cacheKey] || [];
  }

  private _aopCacheHost() {
    return this.sys;
  }

  private _getAopChainsProp(
    beanFullName,
    methodName,
    methodNameMagic,
    methodType: 'get' | 'set' | 'method',
    prop: string,
  ) {
    const chainsKey = `__aopChains_${methodName}__`;
    const beanOptions = appResource.getBean(beanFullName);
    const cacheKey = beanOptions?.beanFullName || beanFullName;
    const host = this._aopCacheHost();
    if (!host[SymbolCacheAopChainsKey]) host[SymbolCacheAopChainsKey] = {};
    if (!host[SymbolCacheAopChainsKey][cacheKey]) host[SymbolCacheAopChainsKey][cacheKey] = {};
    if (host[SymbolCacheAopChainsKey][cacheKey][chainsKey] !== undefined)
      return host[SymbolCacheAopChainsKey][cacheKey][chainsKey];
    const _aopChains = this._getAopChains(beanFullName);
    const chains: [MetadataKey, string][] = [];
    for (const aopKey of _aopChains) {
      if (aopKey === SymbolProxyMagic) {
        if (!__isLifeCycleMethod(methodName)) {
          chains.push([aopKey, methodName]);
        }
      } else if (Array.isArray(aopKey) && aopKey[0] === SymbolProxyAopMethod) {
        this._getAopChainsProp_aopMethods(chains, aopKey, aopKey[1], methodType, prop);
      } else {
        const aop: BeanAopBase = aopKey;
        if (aop[methodName]) {
          let fn;
          if (methodType === 'get') {
            fn = function ([receiver, _], next) {
              return aop[methodName](_patchAopNext([receiver, _], next), receiver);
            };
          } else if (methodType === 'set') {
            fn = function ([receiver, value], next) {
              return aop[methodName](value, _patchAopNext([receiver, value], next), receiver);
            };
          } else if (methodType === 'method') {
            fn = function ([receiver, args], next) {
              return aop[methodName](args, _patchAopNext([receiver, args], next), receiver);
            };
          }
          chains.push([aopKey, fn]);
        }
        if (methodNameMagic && aop[methodNameMagic]) {
          if (!__isLifeCycleMethod(methodName)) {
            let fn;
            if (methodType === 'get') {
              fn = function ([receiver, _], next) {
                return aop[methodNameMagic](prop, _patchAopNext([receiver, _], next), receiver);
              };
            } else if (methodType === 'set') {
              fn = function ([receiver, value], next) {
                return aop[methodNameMagic](
                  prop,
                  value,
                  _patchAopNext([receiver, value], next),
                  receiver,
                );
              };
            } else if (methodType === 'method') {
              fn = function ([receiver, args], next) {
                return aop[methodNameMagic](
                  prop,
                  args,
                  _patchAopNext([receiver, args], next),
                  receiver,
                );
              };
            }
            chains.push([aopKey, fn]);
          }
        }
      }
    }
    let result;
    if (chains.length === 0) {
      result = null;
    } else {
      result = __composeForProp(chains);
    }
    host[SymbolCacheAopChainsKey][cacheKey][chainsKey] = result;
    return result;
  }

  private _getAopChainsProp_aopMethods(chains, aopKey, aopMethodsAll, methodType, prop: string) {
    const aopMethods = aopMethodsAll[prop];
    if (!aopMethods) return;
    for (const aopMethod of aopMethods) {
      let fn;
      if (methodType === 'get') {
        fn = function ([receiver, _], next) {
          if (!aopMethod.beanInstance.get)
            throw new Error(`get property accessor not exists: ${aopMethod.onionName}`);
          return aopMethod.beanInstance.get(
            aopMethod.options,
            _patchAopNext([receiver, _], next),
            receiver,
            prop,
          );
        };
      } else if (methodType === 'set') {
        fn = function ([receiver, value], next) {
          if (!aopMethod.beanInstance.set)
            throw new Error(`set property accessor not exists: ${aopMethod.onionName}`);
          return aopMethod.beanInstance.set(
            aopMethod.options,
            value,
            _patchAopNext([receiver, value], next),
            receiver,
            prop,
          );
        };
      } else if (methodType === 'method') {
        fn = function ([receiver, args], next) {
          if (!aopMethod.beanInstance.execute)
            throw new Error(`execute method not exists: ${aopMethod.onionName}`);
          return aopMethod.beanInstance.execute(
            aopMethod.options,
            args,
            _patchAopNext([receiver, args], next),
            receiver,
            prop,
          );
        };
      }
      chains.push([aopKey, fn]);
    }
  }

  private __recordProp(
    recordProp,
    fullName: string | undefined,
    beanInstance,
    throwError: boolean,
  ) {
    if (this[SymbolBeanContainerInstances][recordProp] !== undefined && throwError) {
      throw new Error(`prop exsits: ${recordProp.toString()}, ${fullName}`);
    }
    if (this[SymbolBeanContainerInstances][recordProp] === undefined) {
      this[SymbolBeanContainerInstances][recordProp] = beanInstance;
    }
  }

  private async _useModule(moduleName: string) {
    if (this.containerType === 'sys') {
      await this.sys.meta.module.use(moduleName);
    } else {
      await this.app.meta.module.use(moduleName);
    }
  }
}

function __composeForPropAdapter(_context, chain) {
  const [aopKey, fn] = chain;
  // SymbolProxyMagic
  if (aopKey === SymbolProxyMagic) return;
  // chain
  return {
    receiver: undefined,
    fn,
  };
}

function __composeForProp(chains) {
  return compose(chains, __composeForPropAdapter);
}

function _patchAopNext([receiver, context], next) {
  return (...args) => {
    context = args.length === 0 ? context : args[0];
    return next([receiver, context]);
  };
}

function __checkAopOfDescriptorInfo(descriptorInfo) {
  if (!descriptorInfo) return true;
  return !descriptorInfo.dynamic && !descriptorInfo.ofBeanBase;
}

function __getPropertyDescriptor(obj, prop) {
  // dynamic
  const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
  if (descriptor) return { descriptor, dynamic: true };
  // static
  return __getPropertyDescriptorStatic(obj, prop);
}

function __getPropertyDescriptorStatic(obj, prop) {
  let proto = Object.getPrototypeOf(obj);
  let ofBeanBase = false;
  while (proto) {
    if (proto.constructor.name === BeanBase.name) {
      ofBeanBase = true;
    }
    const descriptor = Object.getOwnPropertyDescriptor(proto, prop);
    if (descriptor) return { descriptor, dynamic: false, ofBeanBase };
    proto = Object.getPrototypeOf(proto);
  }
  return null;
}

function __setPropertyValue(obj: {}, prop: MetadataKey, value: any, patch: boolean) {
  if (value && typeof value === 'object' && patch) {
    value.__v_isShallow_patch = true;
  }
  Object.defineProperty(obj, prop, {
    enumerable: false,
    configurable: true,
    get() {
      return value;
    },
  });
  if (value && typeof value === 'object' && patch) {
    delete value.__v_isShallow_patch;
  }
}

function __hasMagicMethod(instance) {
  return !!instance.__get__ || !!instance.__set__;
}

function __isInnerMethod(prop) {
  return [
    '__get__',
    '__set__',
    // '__init__',
    // '__dispose__',
    'then',
    '__v_skip',
    '__v_isReactive',
    '__v_isReadonly',
    '__v_isShallow',
    '__v_raw',
    '__v_isRef',
    '__v_isVNode',
    '__v_cache',
    '__v_isShallow_patch',
  ].includes(prop);
}

function __isLifeCycleMethod(prop) {
  return ['__init__', '__dispose__'].includes(prop);
}

function __methodTypeOfDescriptor(descriptorInfo) {
  if (!descriptorInfo) return null;
  const { descriptor, dynamic } = descriptorInfo;
  if (dynamic) return null;
  if (descriptor.get) return null;
  const methodType = descriptor.value?.constructor?.name;
  if (['Function', 'AsyncFunction'].includes(methodType)) {
    return methodType;
  }
  return null;
}

// same as _getBean if selector is undefined/null/'', as as to get the same bean instance
//   not use !selector which maybe is 0
function __getSelectorKey(beanFullName: string, withSelector?: boolean, selector?: any) {
  if (!withSelector) return beanFullName;
  const isSelectorValid = !isNilOrEmptyString(selector);
  return !isSelectorValid ? beanFullName : `${beanFullName}#${selector}`;
}

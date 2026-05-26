import { isClass, isNilOrEmptyString } from '@cabloy/utils';

import type { VonaContext } from '../../types/index.ts';
import type { VonaApplication } from '../core/application.ts';
import type { MetadataKey } from '../core/metadata.ts';
import type { Constructable, ContainerType, IDecoratorUseOptionsBase } from '../decorator/index.ts';
import type {
  IBeanRecord,
  IBeanRecordGlobal,
  IBeanScopeRecord,
  TypeBeanScopeRecordKeys,
} from './type.ts';

import { cast } from '../../types/index.ts';
import { appMetadata } from '../core/metadata.ts';
import { appResource, SymbolDecoratorProxyDisable } from '../core/resource.ts';
import { __prepareInjectSelectorInfo } from '../decorator/index.ts';
import { compose } from '../utils/util.ts';
import { BeanAopBase } from './beanAopBase.ts';
import { BeanBase } from './beanBase.ts';
import { SymbolBeanFullName, SymbolBeanInstanceKey } from './beanBaseSimple.ts';
import { BeanSimple } from './beanSimple.ts';

const SymbolProxyMagic = Symbol('SymbolProxyMagic');
const SymbolProxyAopMethod = Symbol('SymbolProxyAopMethod');
export const SymbolCacheAopChains = Symbol('SymbolCacheAopChains');
export const SymbolCacheAopChainsKey = Symbol('SymbolCacheAopChainsKey');
export const SymbolBeanContainerInstances = Symbol('SymbolBeanContainerInstances');
export const SymbolBeanInstancePropsLazy = Symbol('SymbolBeanInstancePropsLazy');
// const BeanInstanceScope = Symbol('BeanInstance#Scope');

export interface BeanContainer extends IBeanRecordGlobal {}

export class BeanContainer {
  private app: VonaApplication;
  private ctx?: VonaContext;

  private [SymbolBeanContainerInstances]: Record<string, unknown> = {};

  static create(app: VonaApplication, ctx: VonaContext | undefined) {
    const beanContainer = new BeanContainer(app, ctx);
    return new Proxy(beanContainer, {
      get(obj, prop) {
        if (typeof prop === 'symbol') return obj[prop];
        if (obj[prop]) return obj[prop];
        return obj._getBean(prop as any);
      },
    });
  }

  protected constructor(app: VonaApplication, ctx: VonaContext | undefined) {
    this.app = app;
    this.ctx = ctx;
  }

  /** @internal */
  public async dispose() {
    const beanInstances = this[SymbolBeanContainerInstances];
    for (const prop in beanInstances) {
      const beanInstance = cast(beanInstances[prop]);
      if (beanInstance && !(beanInstance instanceof BeanAopBase) && beanInstance.__dispose__) {
        await beanInstance.__dispose__();
      }
    }
    this[SymbolBeanContainerInstances] = {};
  }

  public async _removeBean(beanInstance: BeanSimple): Promise<void>;
  public async _removeBean(beanInstanceKey: string): Promise<void>;
  public async _removeBean(beanInstanceKeyLike: BeanSimple | string): Promise<void> {
    const beanInstanceKey =
      typeof beanInstanceKeyLike === 'string'
        ? beanInstanceKeyLike
        : beanInstanceKeyLike[SymbolBeanInstanceKey];
    if (!beanInstanceKey) return;
    const beanInstance = this[SymbolBeanContainerInstances][beanInstanceKey] as any;
    if (beanInstance) {
      if (!(beanInstance instanceof BeanAopBase) && beanInstance.__dispose__) {
        await beanInstance.__dispose__();
      }
    }
    // maybe null
    delete this[SymbolBeanContainerInstances][beanInstanceKey];
  }

  get containerType(): ContainerType {
    if (!this.ctx) return 'app';
    return 'ctx';
  }

  /** get specific module's scope */
  scope<K extends TypeBeanScopeRecordKeys>(moduleScope: K): IBeanScopeRecord[K];
  // scope<T>(moduleScope: string): T;
  scope<T>(moduleScope: string): T {
    return this._getBean(`${moduleScope}.scope.module` as any);
  }

  _getBean<T>(A: Constructable<T>, ...args): T;
  _getBean<K extends keyof IBeanRecord>(beanFullName: K, ...args): IBeanRecord[K];
  // _getBean<T>(beanFullName: string, ...args): T;
  _getBean<T>(beanFullName: Constructable<T> | string, ...args): T {
    return this._getBeanSelectorInner(beanFullName as any, false, ...args);
  }

  _getBeanSelector<T>(A: Constructable<T>, selector?: string, ...args): T;
  _getBeanSelector<K extends keyof IBeanRecord>(
    beanFullName: K,
    selector?: string,
    ...args
  ): IBeanRecord[K];
  // _getBeanSelector<T>(beanFullName: string, selector?: string, ...args): T;
  _getBeanSelector<T>(beanFullName: Constructable<T> | string, selector?: string, ...args): T {
    return this._getBeanSelectorInner(beanFullName, true, selector, ...args);
  }

  _getBeanSelectorInner<T>(
    beanFullName: Constructable<T> | string,
    withSelector?: boolean,
    ...args
  ): T {
    // bean options
    const beanOptions = appResource.getBean(beanFullName as any);
    if (!beanOptions) {
      // not found
      return null!;
    }
    const fullName = beanOptions.beanFullName;
    const key = __getSelectorKey(fullName, withSelector, args[0]);
    if (this[SymbolBeanContainerInstances][key] === undefined) {
      this._newBeanInner(true, fullName, withSelector, ...args);
    }
    return this[SymbolBeanContainerInstances][key] as T;
  }

  _newBean<T>(A: Constructable<T>, ...args): T;
  _newBean<K extends keyof IBeanRecord>(beanFullName: K, ...args): IBeanRecord[K];
  // _newBean<T>(beanFullName: string, ...args): T;
  _newBean<T>(beanFullName: Constructable<T> | string, ...args): T {
    return this._newBeanInner(false, beanFullName, false, ...args);
  }

  _newBeanSelector<T>(A: Constructable<T>, selector?: string, ...args): T;
  _newBeanSelector<K extends keyof IBeanRecord>(
    beanFullName: K,
    selector?: string,
    ...args
  ): IBeanRecord[K];
  // _newBeanSelector<T>(beanFullName: string, selector?: string, ...args): T;
  _newBeanSelector<T>(beanFullName: Constructable<T> | string, selector?: string, ...args): T {
    return this._newBean(beanFullName as any, selector, ...args);
  }

  /** @internal */
  public _newBeanInner<T>(
    record: boolean,
    beanFullName: Constructable<T> | string,
    withSelector?: boolean,
    ...args
  ): T {
    // bean options
    const beanOptions = appResource.getBean(beanFullName as any);
    if (!beanOptions) {
      // class
      if (typeof beanFullName === 'function' && isClass(beanFullName)) {
        return this._createBeanInstance<T>(
          record,
          undefined,
          beanFullName,
          args,
          false,
          withSelector,
        );
      }
      // throw new Error(`bean not found: ${beanFullName}`);
      return null!;
    }
    // instance
    return this._createBeanInstance<T>(
      record,
      beanOptions.beanFullName,
      beanOptions.beanClass as Constructable<T>,
      args,
      cast(beanOptions.scene) === 'aop',
      withSelector,
    );
  }

  private _createBeanInstance<T>(
    record: boolean,
    beanFullName: string | undefined,
    beanClass: Constructable<T> | undefined,
    args: any[],
    aop: boolean | undefined,
    withSelector?: boolean,
  ) {
    // prepare
    const beanInstance = this._prepareBeanInstance(beanFullName, beanClass, args, aop);
    // record
    if (record) {
      // fullName
      const fullName = appResource.getBeanFullName(beanFullName);
      if (fullName) {
        const key = __getSelectorKey(fullName, withSelector, args[0]);
        __setPropertyValue(beanInstance, SymbolBeanInstanceKey, key);
        this[SymbolBeanContainerInstances][key] = beanInstance;
        this.containerType === 'app' &&
          this.app.meta.hmr.addBeanInstance(fullName, key, args, withSelector);
      }
    }
    // init
    this._initBeanInstance(beanFullName, beanInstance, args);
    // ok
    return beanInstance;
  }

  private _prepareBeanInstance(beanFullName, BeanClass, args, aop) {
    // create: always passed in args
    const beanInstance = new BeanClass(...args);
    // if (BeanClass.prototype.__init__) {
    //   beanInstance = new BeanClass();
    // } else {
    //   beanInstance = new BeanClass(...args);
    // }
    // app/ctx
    if (beanInstance instanceof BeanSimple) {
      (beanInstance as any).app = this.app;
      if (this.ctx) {
        __setPropertyValue(beanInstance, 'ctx', this.ctx);
      }
    }
    // beanFullName
    if (typeof beanFullName === 'string') {
      __setPropertyValue(beanInstance, SymbolBeanFullName, beanFullName);
    }
    // aop: proxy
    return this._patchBeanInstance(beanFullName || BeanClass, beanInstance, aop);
  }

  private _initBeanInstance(beanFullName, beanInstance, args) {
    // inject
    this._injectBeanInstance(beanInstance, beanFullName);
    // init
    if (!(beanInstance instanceof BeanAopBase) && beanInstance.__init__) {
      beanInstance.__init__(...args);
    }
    // ok
    return beanInstance;
  }

  private _injectBeanInstance(beanInstance, beanFullName) {
    const beanOptions = appResource.getBean(beanFullName);
    if (!beanOptions) return;
    const uses = appResource.getUses(beanOptions.beanClass.prototype);
    if (!uses) return;
    for (const key in uses) {
      const useOptions = uses[key];
      this._injectBeanInstancePropLazy(
        beanInstance,
        useOptions.prop,
        useOptions.beanFullName,
        useOptions,
      );
    }
  }

  private _injectBeanInstancePropLazy(beanInstance, prop, targetBeanFullName, useOptions) {
    const self = this;
    Object.defineProperty(beanInstance, prop, {
      enumerable: true,
      configurable: true,
      get() {
        if (!beanInstance[SymbolBeanInstancePropsLazy])
          beanInstance[SymbolBeanInstancePropsLazy] = {};
        if (!beanInstance[SymbolBeanInstancePropsLazy][prop]) {
          beanInstance[SymbolBeanInstancePropsLazy][prop] = self._injectBeanInstanceProp(
            beanInstance,
            targetBeanFullName,
            useOptions,
          );
          self.containerType === 'app' &&
            self.app.meta.hmr.addBeanInstanceProp(beanInstance, prop, targetBeanFullName);
        }
        return beanInstance[SymbolBeanInstancePropsLazy][prop];
      },
    });
  }

  private _injectBeanInstanceProp(
    beanInstance,
    targetBeanFullName: string,
    useOptions: IDecoratorUseOptionsBase,
  ) {
    // injectionScope
    const injectionScope = useOptions.injectionScope ?? 'app';
    // options: selectorInfo
    const selectorInfo = __prepareInjectSelectorInfo(beanInstance, useOptions);
    // targetInstance
    let targetInstance;
    // selector maybe empty string
    if (injectionScope === 'app') {
      targetInstance = this.app.bean._getBeanSelectorInner(
        targetBeanFullName,
        selectorInfo.withSelector,
        ...selectorInfo.args,
      );
    } else if (injectionScope === 'ctx') {
      targetInstance = this._getBeanSelectorInner(
        targetBeanFullName,
        selectorInfo.withSelector,
        ...selectorInfo.args,
      );
    } else if (injectionScope === 'new') {
      targetInstance = this._newBeanInner(
        false,
        targetBeanFullName,
        selectorInfo.withSelector,
        ...selectorInfo.args,
      );
    }
    return targetInstance;
  }

  // private _injectBeanInstanceScope(beanInstance, beanFullName) {
  //   if (typeof beanFullName !== 'string' || beanFullName.indexOf('.scope.module') > -1) return;
  //   Object.defineProperty(beanInstance, 'scope', {
  //     enumerable: false,
  //     configurable: true,
  //     get() {
  //       if (!this[BeanInstanceScope]) {
  //         this[BeanInstanceScope] = this.bean._getBean(`${this[SymbolModuleBelong]}.scope.module`);
  //       }
  //       return this[BeanInstanceScope];
  //     },
  //   });
  // }

  private _patchBeanInstance(beanFullNameOrBeanClass, beanInstance, aop) {
    if (!beanFullNameOrBeanClass) return beanInstance;
    // not aop on aop
    if (aop) return beanInstance;
    // aop chains
    const _aopChains = this._prepareAopChains(beanFullNameOrBeanClass, beanInstance);
    // no aop
    if (_aopChains.length === 0) return beanInstance;
    // aop
    return this._newBeanProxy(beanFullNameOrBeanClass, beanInstance);
  }

  private _newBeanProxy(beanFullName, beanInstance) {
    const self = this;
    return new Proxy(beanInstance, {
      get(target, prop, receiver) {
        if (typeof prop === 'symbol') {
          return Reflect.get(target, prop, receiver);
        }
        if (__isInnerMethod(prop)) {
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
            beanInstance,
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
        return self._getInstanceMethodProxy(beanFullName, beanInstance, target, prop, receiver);
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
          beanInstance,
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
  }

  private _getInstanceMethodProxy(beanFullName, beanInstance, target, prop, receiver) {
    // not aop magic methods
    if (__isInnerMethod(prop)) {
      return Reflect.get(target, prop, receiver);
    }
    // aop chains
    const methodNameMagic = '__method__';
    const _aopChainsProp = this._getAopChainsProp(
      beanFullName,
      beanInstance,
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
    __setPropertyValue(target, methodProxyKey, methodProxy);
    return methodProxy;
  }

  private _prepareAopChains(beanFullNameOrBeanClass, beanInstance) {
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
    let chains: MetadataKey[] = [];
    // aop
    if (!proxyDisable && beanOptions && cast(beanOptions.scene) !== 'aop') {
      const beanAop = this.app.bean._getBean('a-aspectutils.service.aop' as never) as any;
      const aops = beanAop.findAopsMatched(beanOptions.beanFullName);
      if (aops) {
        chains = chains.concat(aops);
      }
    }
    // aop method
    if (!proxyDisable && beanOptions) {
      const beanAop = this.app.bean._getBean('a-aspectutils.service.aop' as never) as any;
      if (beanAop.hasAopMethods(beanOptions?.beanFullName)) {
        chains.push(SymbolProxyAopMethod);
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

  private _aopCacheHost() {
    if (!this.app) throw new Error('Perhaps missing await');
    return this.app;
  }

  private _getAopChainsProp(
    beanFullName,
    beanInstance,
    methodName,
    methodNameMagic,
    methodType: 'get' | 'set' | 'method',
    prop: string,
  ) {
    const self = this;
    const chainsKey = `__aopChains_${methodName}__`;
    const beanOptions = appResource.getBean(beanFullName);
    const cacheKey = beanOptions?.beanFullName || beanFullName;
    const host = this._aopCacheHost();
    if (!host[SymbolCacheAopChainsKey]) host[SymbolCacheAopChainsKey] = {};
    if (!host[SymbolCacheAopChainsKey][cacheKey]) host[SymbolCacheAopChainsKey][cacheKey] = {};
    if (host[SymbolCacheAopChainsKey][cacheKey][chainsKey] !== undefined)
      return host[SymbolCacheAopChainsKey][cacheKey][chainsKey];
    const _aopChains = this._prepareAopChains(beanFullName, beanInstance);
    const chains: [MetadataKey, string][] = [];
    for (const aopKey of _aopChains) {
      if (aopKey === SymbolProxyMagic) {
        if (!__isLifeCycleMethod(methodName)) {
          chains.push([aopKey, methodName]);
        }
      } else if (aopKey === SymbolProxyAopMethod) {
        this._getAopChainsProp_aopMethods(chains, aopKey, beanFullName, methodType, prop);
      } else {
        // singleton
        const aopOuter: BeanAopBase = self.app.bean._getBean(aopKey as string as any);
        if (aopOuter[methodName]) {
          let fn;
          if (methodType === 'get') {
            fn = function ([receiver, _], next) {
              const aop: BeanAopBase = self.app.bean._getBean(aopKey as string as any);
              return aop[methodName](_patchAopNext([receiver, _], next), receiver);
            };
          } else if (methodType === 'set') {
            fn = function ([receiver, value], next) {
              const aop: BeanAopBase = self.app.bean._getBean(aopKey as string as any);
              return aop[methodName](value, _patchAopNext([receiver, value], next), receiver);
            };
          } else if (methodType === 'method') {
            fn = function ([receiver, args], next) {
              const aop: BeanAopBase = self.app.bean._getBean(aopKey as string as any);
              return aop[methodName](args, _patchAopNext([receiver, args], next), receiver);
            };
          }
          chains.push([aopKey, fn]);
        }
        if (methodNameMagic && aopOuter[methodNameMagic]) {
          if (!__isLifeCycleMethod(methodName)) {
            let fn;
            if (methodType === 'get') {
              fn = function ([receiver, _], next) {
                const aop: BeanAopBase = self.app.bean._getBean(aopKey as string as any);
                return aop[methodNameMagic](prop, _patchAopNext([receiver, _], next), receiver);
              };
            } else if (methodType === 'set') {
              fn = function ([receiver, value], next) {
                const aop: BeanAopBase = self.app.bean._getBean(aopKey as string as any);
                return aop[methodNameMagic](
                  prop,
                  value,
                  _patchAopNext([receiver, value], next),
                  receiver,
                );
              };
            } else if (methodType === 'method') {
              fn = function ([receiver, args], next) {
                const aop: BeanAopBase = self.app.bean._getBean(aopKey as string as any);
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

  private _getAopChainsProp_aopMethods(chains, aopKey, beanFullName, methodType, prop: string) {
    const self = this;
    const beanAop = this.app.bean._getBean('a-aspectutils.service.aop' as never) as any;
    const aopMethods = beanAop.findAopMethodsMatched(beanFullName, prop);
    for (const aopMethod of aopMethods) {
      let fn;
      if (methodType === 'get') {
        fn = function ([receiver, _], next) {
          const beanInstance = self.app.bean._getBean<any>(aopMethod.beanFullName);
          if (!beanInstance.get)
            throw new Error(`get property accessor not exists: ${aopMethod.onionName}`);
          return beanInstance.get(
            aopMethod.options,
            _patchAopNext([receiver, _], next),
            receiver,
            prop,
          );
        };
      } else if (methodType === 'set') {
        fn = function ([receiver, value], next) {
          const beanInstance = self.app.bean._getBean<any>(aopMethod.beanFullName);
          if (!beanInstance.set)
            throw new Error(`set property accessor not exists: ${aopMethod.onionName}`);
          return beanInstance.set(
            aopMethod.options,
            value,
            _patchAopNext([receiver, value], next),
            receiver,
            prop,
          );
        };
      } else if (methodType === 'method') {
        fn = function ([receiver, args], next) {
          const beanInstance = self.app.bean._getBean<any>(aopMethod.beanFullName);
          if (!beanInstance.execute)
            throw new Error(`execute method not exists: ${aopMethod.onionName}`);
          return beanInstance.execute(
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

function __setPropertyValue(obj, prop, value) {
  Object.defineProperty(obj, prop, {
    enumerable: false,
    configurable: true,
    get() {
      return value;
    },
  });
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
    '__v_isShallow',
    '__v_isReadonly',
    '__v_raw',
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

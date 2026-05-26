import type { ISwapDepsItem } from '@cabloy/deps';
import type { IModule, OnionSceneMeta } from '@cabloy/module-info';
import type { Next, VonaContext } from 'vona';
import type { IEventRecord } from 'vona-module-a-event';
import type { IMetaNameRecord } from 'vona-module-a-meta';
import type { ContextRouteBase } from 'vona-module-a-web';

import { swapDeps } from '@cabloy/deps';
import { getOnionScenesMeta } from '@cabloy/module-info';
import { isRegExp } from 'node:util/types';
import {
  appMetadata,
  appResource,
  BeanBase,
  cast,
  compose,
  deepExtend,
  ProxyDisable,
  SymbolDecoratorGlobal,
} from 'vona';
import { Service } from 'vona-module-a-bean';

import type {
  IOnionExecuteCustom,
  IOnionOptionsDeps,
  IOnionOptionsEnable,
  IOnionOptionsMatch,
  IOnionSlice,
  TypeOnionOptionsMatchRule,
  TypeOnionsNormal,
} from '../types/onion.ts';

import { SymbolUseOnionLocal } from '../types/onion.ts';

const SymbolOnionsEnabled = Symbol('SymbolOnionsEnabled');
const SymbolOnionsEnabledWrapped = Symbol('SymbolOnionsEnabledWrapped');

@ProxyDisable()
@Service()
export class ServiceOnion<ONIONRECORD> extends BeanBase {
  sceneName: string;
  sceneMeta: OnionSceneMeta;
  onionsNormal: TypeOnionsNormal<ONIONRECORD>;
  onionsGlobal: IOnionSlice<ONIONRECORD, keyof ONIONRECORD>[];

  private [SymbolOnionsEnabled]: Record<string, IOnionSlice<ONIONRECORD, keyof ONIONRECORD>[]> = {};
  private [SymbolOnionsEnabledWrapped]: Record<string, Function[]> = {};

  private _cacheOnionsGlobal: Function[] | undefined;
  private _cacheOnionsHandler: Record<string, Function[]> = {};

  protected __init__(sceneName: string) {
    this.sceneName = sceneName;
    this.sceneMeta = getOnionScenesMeta(this.app.meta.modules)[this.sceneName];
    this.load();
  }

  load() {
    this._loadOnions();
    this._swapOnions(this.onionsGlobal);
    this[SymbolOnionsEnabled] = {};
    this[SymbolOnionsEnabledWrapped] = {};
    this.clearCache();
  }

  clearCache() {
    this._cacheOnionsGlobal = undefined;
    this._cacheOnionsHandler = {};
  }

  compose(
    route: ContextRouteBase | undefined,
    fnStart?: Function | Function[],
    fnMid?: Function | Function[],
    fnEnd?: Function | Function[],
    executeCustom?: IOnionExecuteCustom,
  ) {
    // compose
    const onions = this._composeOnionsHandler(route, fnStart, fnMid, fnEnd, executeCustom);
    // invoke
    return compose(onions);
  }

  getOnionsEnabled(selector?: string | boolean, matchThis?: any, ...matchArgs: any[]) {
    const onions = this.onionsGlobal.filter(onionSlice => {
      const onionOptions = onionSlice.beanOptions.options as IOnionOptionsEnable &
        IOnionOptionsMatch<TypeOnionOptionsMatchRule<string>>;
      return this.bean.onion.checkOnionOptionsEnabled(
        onionOptions,
        selector,
        matchThis,
        ...matchArgs,
      );
    }) as unknown as IOnionSlice<ONIONRECORD, keyof ONIONRECORD>[];
    this.$loggerChild('onion').verbose(() => {
      const selector2 = typeof selector === 'string' ? selector : '';
      const message = `getOnionsEnabled#${this.sceneName}${selector2 ? `#${selector2}` : ''} ${JSON.stringify(onions)}`;
      return message;
    });
    return onions;
  }

  getOnionsEnabledCached(_selector?: string | boolean, matchThis?: any, ...matchArgs: any[]) {
    const selector = typeof _selector === 'string' ? _selector : '';
    if (!this[SymbolOnionsEnabled][selector]) {
      this[SymbolOnionsEnabled][selector] = this.getOnionsEnabled(
        _selector,
        matchThis,
        ...matchArgs,
      );
    }
    return this[SymbolOnionsEnabled][selector];
  }

  getOnionsEnabledOfMeta(
    useCache: boolean,
    beanName: keyof IMetaNameRecord,
    selector?: string | boolean,
    matchThis?: any,
    ...matchArgs: any[]
  ) {
    const method = useCache ? 'getOnionsEnabledCached' : 'getOnionsEnabled';
    return this[method](selector, matchThis, ...matchArgs).filter(
      item => item.beanOptions.name === beanName,
    );
  }

  getOnionSliceEnabled<T extends keyof ONIONRECORD>(
    useCache: boolean,
    onionName: T,
    selector?: string | boolean,
    matchThis?: any,
    ...matchArgs: any[]
  ) {
    const method = useCache ? 'getOnionsEnabledCached' : 'getOnionsEnabled';
    return this[method](selector, matchThis, ...matchArgs).find(item => item.name === onionName);
  }

  getOnionSlice<T extends keyof ONIONRECORD>(onionName: T): IOnionSlice<ONIONRECORD, T> {
    return this.onionsNormal[onionName];
  }

  getOnionsEnabledWrapped(
    wrapFn: Function,
    selector?: string | boolean,
    matchThis?: any,
    ...matchArgs: any[]
  ) {
    const onions = this.getOnionsEnabled(selector, matchThis, ...matchArgs);
    return onions.map(item => {
      return wrapFn(item);
    });
  }

  getOnionsEnabledWrappedCached(
    wrapFn: Function,
    _selector?: string | boolean,
    matchThis?: any,
    ...matchArgs: any[]
  ) {
    const selector = typeof _selector === 'string' ? _selector : '';
    if (!this[SymbolOnionsEnabledWrapped][selector]) {
      this[SymbolOnionsEnabledWrapped][selector] = this.getOnionsEnabledWrapped(
        wrapFn,
        _selector,
        matchThis,
        ...matchArgs,
      );
    }
    return this[SymbolOnionsEnabledWrapped][selector];
  }

  public get composedOnionsGlobal() {
    return this._composeOnionsGlobal();
  }

  private _composeOnionsGlobal(executeCustom?: IOnionExecuteCustom) {
    if (!this._cacheOnionsGlobal) {
      const onions: Function[] = [];
      for (const item of this.onionsGlobal) {
        onions.push(this._wrapOnion(item, executeCustom));
      }
      this._cacheOnionsGlobal = onions;
    }
    return this._cacheOnionsGlobal;
  }

  private _composeOnionsHandler(
    route: ContextRouteBase | undefined,
    fnStart?: Function | Function[],
    fnMid?: Function | Function[],
    fnEnd?: Function | Function[],
    executeCustom?: IOnionExecuteCustom,
  ) {
    const beanFullName = route?.controllerBeanFullName;
    const handlerName = route?.action;
    const key = beanFullName ? `${beanFullName}:${handlerName}` : '';
    if (!this._cacheOnionsHandler[key]) {
      let onions: Function[] = [];
      if (fnStart) onions = onions.concat(fnStart);
      // onions: global
      onions = onions.concat(this._composeOnionsGlobal(executeCustom));
      if (fnMid) onions = onions.concat(fnMid);
      // onions: handler
      const onionsLocal = this._collectOnionsHandler(route);
      for (const item of onionsLocal) {
        onions.push(this._wrapOnion(item, executeCustom));
      }
      if (fnEnd) onions = onions.concat(fnEnd);
      this._cacheOnionsHandler[key] = onions;
    }
    return this._cacheOnionsHandler[key];
  }

  public _collectOnionsHandler(route: ContextRouteBase | undefined) {
    if (!route?.controller) return [];
    // onionsLocal: controller
    const controllerOnionsLocal = appMetadata.getMetadata<Record<string, string[]>>(
      SymbolUseOnionLocal,
      route.controller,
    )?.[this.sceneName] as string[];
    // onionsLocal: action
    const onionsLocal: IOnionSlice<ONIONRECORD, keyof ONIONRECORD>[] = [];
    const actionOnionsLocal = appMetadata.getMetadata<Record<string, string[]>>(
      SymbolUseOnionLocal,
      route.controller.prototype,
      route.action,
    )?.[this.sceneName] as string[];
    const onionsLocalAll: string[] = [];
    if (actionOnionsLocal) {
      actionOnionsLocal.forEach(item => {
        if (!onionsLocalAll.includes(item)) onionsLocalAll.push(item);
      });
    }
    if (controllerOnionsLocal) {
      controllerOnionsLocal.forEach(item => {
        if (!onionsLocalAll.includes(item)) onionsLocalAll.push(item);
      });
    }
    for (const onionName of onionsLocalAll) {
      const item = this.onionsNormal[onionName];
      if (!item) throw new Error(`${this.sceneName} not found: ${onionName}`);
      onionsLocal.push(item);
    }
    return onionsLocal;
  }

  getOnionOptions<T extends keyof ONIONRECORD>(onionName: T): ONIONRECORD[T] | undefined {
    return this.getOnionSlice(onionName).beanOptions.options as ONIONRECORD[T] | undefined;
  }

  getOnionOptionsDynamic<T extends keyof ONIONRECORD>(
    onionName: T,
    optionsCustom?: Partial<ONIONRECORD[T]>,
  ): ONIONRECORD[T] {
    const item = this.getOnionSlice(onionName);
    return this.combineOnionOptions(item, optionsCustom);
  }

  combineOnionOptions<T extends keyof ONIONRECORD>(
    item: IOnionSlice<ONIONRECORD, T>,
    optionsCustom?: Partial<ONIONRECORD[T]>,
  ): ONIONRECORD[T] {
    const ctx = this.ctx as VonaContext | undefined;
    // optionsPrimitive
    const optionsPrimitive = item.beanOptions.optionsPrimitive;
    // options: meta/config
    const optionsMetaAndConfig = item.beanOptions.options;
    // options: instance config
    const optionsInstanceConfig = ctx?.instance
      ? ctx?.config.onions[item.beanOptions.scene]?.[item.name]
      : undefined;
    // options: route
    //    not use route options for argument pipe
    let optionsRoute;
    if (!cast(item).argumentPipe && this.sceneMeta.optionsRoute) {
      const route = ctx?.route?.route;
      optionsRoute = route?.meta?.[item.beanOptions.beanFullName];
    }
    // options: argument pipe
    const optionsArgumentPipe = this.sceneMeta.optionsArgumentPipe
      ? cast(item).argumentPipe?.options
      : undefined;
    // options: dynamic
    let optionsDynamic;
    if (this.sceneMeta.optionsDynamic) {
      optionsDynamic = ctx?.onionsDynamic?.[item.beanOptions.scene]?.[item.name];
    }
    // final options
    let options;
    if (optionsPrimitive) {
      options =
        optionsCustom ??
        optionsDynamic ??
        optionsArgumentPipe ??
        optionsRoute ??
        optionsInstanceConfig ??
        optionsMetaAndConfig;
    } else {
      options = deepExtend(
        {},
        optionsMetaAndConfig,
        optionsInstanceConfig,
        optionsRoute,
        optionsArgumentPipe,
        optionsDynamic,
        optionsCustom,
      );
    }
    // ok
    return options;
  }

  private _swapOnions(onions: IOnionSlice<ONIONRECORD, keyof ONIONRECORD>[]) {
    swapDeps(onions as ISwapDepsItem[], {
      name: 'name',
      dependencies: item => {
        const onionOptions = cast<IOnionSlice<ONIONRECORD, keyof ONIONRECORD>>(item).beanOptions
          .options as IOnionOptionsDeps<string>;
        return onionOptions.dependencies as any;
      },
      dependents: item => {
        const onionOptions = cast<IOnionSlice<ONIONRECORD, keyof ONIONRECORD>>(item).beanOptions
          .options as IOnionOptionsDeps<string>;
        return onionOptions.dependents as any;
      },
    });
  }

  private _loadOnions() {
    const onionsAll = this._loadOnionsAll();
    this.onionsNormal = {} as TypeOnionsNormal<ONIONRECORD>;
    this.onionsGlobal = [];
    // load
    for (const item of onionsAll) {
      // normal
      this.onionsNormal[item.name] = item;
      // global
      if (
        !this.sceneMeta.hasLocal ||
        appMetadata.getMetadata<boolean>(SymbolDecoratorGlobal, item.beanOptions.beanClass)
      ) {
        this.onionsGlobal.push(item);
      }
    }
  }

  private _loadOnionsAll() {
    const onionsAll: IOnionSlice<ONIONRECORD, keyof ONIONRECORD>[] = [];
    for (const module of this.app.meta.modulesArray) {
      this._loadOnionsAll_fromMetadata(onionsAll, module);
    }
    return onionsAll;
  }

  private _loadOnionsAll_fromMetadata(
    onionsAll: IOnionSlice<ONIONRECORD, keyof ONIONRECORD>[],
    module: IModule,
  ) {
    const onions = appResource.scenes[this.sceneName]?.[module.info.relativeName];
    if (!onions) return;
    for (const key in onions) {
      const beanOptions = onions[key];
      const name = key.replace(`.${this.sceneName}.`, ':') as keyof ONIONRECORD;
      // push
      onionsAll.push({
        name,
        beanOptions: beanOptions as any,
      });
    }
  }

  /** internal */
  public _wrapOnion<T extends keyof ONIONRECORD>(
    item: IOnionSlice<ONIONRECORD, T>,
    executeCustom?: IOnionExecuteCustom,
  ) {
    const sceneName = this.sceneName;
    const fn = (data: any, next: Next) => {
      // optionsPrimitive
      const optionsPrimitive = item.beanOptions.optionsPrimitive;
      // options
      const options = this.combineOnionOptions(item);
      // enable match ignore
      if (
        !optionsPrimitive &&
        !this.bean.onion.checkOnionOptionsEnabled(options as any, this._getRoutePathForMatch())
      ) {
        return next(data);
      }
      // execute
      const beanFullName = item.beanOptions.beanFullName;
      const beanInstance = this.app.bean._getBean(beanFullName as any);
      if (!beanInstance) {
        throw new Error(`${sceneName} bean not found: ${beanFullName}`);
      }
      if (executeCustom) {
        return executeCustom(beanInstance, data, options, next);
      }
      return cast(beanInstance).execute(options, next);
    };
    fn._name = item.name;
    return fn;
  }

  // todo: maybe use routePathRaw directly
  private _getRoutePathForMatch() {
    const routePathRaw: string | RegExp | undefined = this.ctx?.route?.routePathRaw;
    if (!routePathRaw || isRegExp(routePathRaw)) return;
    return routePathRaw;
  }

  public inspect(selector?: string | boolean, matchThis?: any, ...matchArgs: any[]) {
    const onionSlices = this.getOnionsEnabled(selector, matchThis, ...matchArgs);
    const onionNames = onionSlices.map(item => item.name);
    this.$logger.silly(JSON.stringify(onionSlices, null, 2));
    this.$logger.silly(JSON.stringify(onionNames, null, 2));
  }

  public inspectEventListener(eventName: keyof IEventRecord) {
    const onionSlices = this.getOnionsEnabled(eventName);
    const onionNames = onionSlices.map(item => item.name);
    this.$logger.silly(JSON.stringify(onionSlices, null, 2));
    this.$logger.silly(JSON.stringify(onionNames, null, 2));
  }

  public inspectMeta(
    metaName: keyof IMetaNameRecord,
    selector?: string | boolean,
    matchThis?: any,
    ...matchArgs: any[]
  ) {
    const onionSlices = this.getOnionsEnabled(selector, matchThis, ...matchArgs);
    const onionSlices2: IOnionSlice[] = [];
    for (const item of onionSlices) {
      if (item.beanOptions.name === metaName) {
        onionSlices2.push(item);
      }
    }
    const onionNames = onionSlices
      .map(item => item.name)
      .filter(item => item.toString().endsWith(`:${metaName}`));
    this.$logger.silly(JSON.stringify(onionSlices2, null, 2));
    this.$logger.silly(JSON.stringify(onionNames, null, 2));
  }
}

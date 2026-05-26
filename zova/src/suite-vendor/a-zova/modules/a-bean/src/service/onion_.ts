import type { ISwapDepsItem } from '@cabloy/deps';
import type { OnionSceneMeta } from '@cabloy/module-info';
import type { Next } from 'zova';

import { compose as _compose } from '@cabloy/compose';
import { swapDeps } from '@cabloy/deps';
import { getOnionScenesMeta } from '@cabloy/module-info';
import { appResource, BeanSimple, cast, deepExtend, ProxyDisable } from 'zova';

import type {
  IOnionExecuteCustom,
  IOnionItem,
  IOnionOptionsDeps,
  IOnionOptionsEnable,
  IOnionOptionsMatch,
  IOnionSlice,
  TypeOnionOptionsMatchRule,
} from '../types/onion.js';

import { SysOnion } from '../bean/sys.onion.js';
import { Service } from '../lib/bean.js';

// const SymbolOnionsEnabled = Symbol('SymbolOnionsEnabled');
// const SymbolOnionsEnabledWrapped = Symbol('SymbolOnionsEnabledWrapped');

@ProxyDisable()
@Service()
export class ServiceOnion<OPTIONS, ONIONNAME extends string> extends BeanSimple {
  protected sysOnion: SysOnion;
  sceneName: string;
  sceneMeta: OnionSceneMeta;

  onionsAll: IOnionItem<OPTIONS, ONIONNAME>[];

  // private [SymbolOnionsEnabled]: Record<string, IOnionSlice<OPTIONS, ONIONNAME>[]> = {};
  // private [SymbolOnionsEnabledWrapped]: Record<string, Function[]> = {};

  protected __init__(sceneName: string, sysOnion: SysOnion) {
    if (process.env.DEV && this.bean.containerType !== 'sys') {
      throw new Error('should in sys container');
    }
    this.sysOnion = sysOnion;
    this.sceneName = sceneName;
    this.sceneMeta = getOnionScenesMeta(this.sys.meta.module.modulesMeta.modules)[this.sceneName];
    if (this.sceneMeta.optionsPackage) {
      this._initOnionsAll();
      this._swapOnions(this.onionsAll);
    }
  }

  private _initOnionsAll() {
    this.onionsAll = [];
    for (const moduleName in this.sys.meta.module.modulesMeta.modules) {
      const module = this.sys.meta.module.modulesMeta.modules[moduleName];
      const nodeItems = module.info.onionsMeta?.onionsConfig?.[this.sceneName];
      if (!nodeItems) continue;
      for (const itemName in nodeItems) {
        let itemOptions = nodeItems[itemName];
        // extend config
        const onionName = `${moduleName}:${itemName}`;
        const optionsConfig = this.sys.config.onions[this.sceneName]?.[onionName];
        if (optionsConfig) {
          itemOptions = deepExtend({}, itemOptions, optionsConfig);
        }
        this.onionsAll.push({
          name: onionName,
          options: itemOptions,
        } as any);
      }
    }
  }

  private _swapOnions(onions: IOnionItem<OPTIONS, ONIONNAME>[]) {
    swapDeps(onions as ISwapDepsItem[], {
      name: 'name',
      dependencies: item => {
        const onionOptions = cast<IOnionItem<OPTIONS, ONIONNAME>>(item)
          .options as IOnionOptionsDeps<string>;
        return onionOptions.dependencies as any;
      },
      dependents: item => {
        const onionOptions = cast<IOnionItem<OPTIONS, ONIONNAME>>(item)
          .options as IOnionOptionsDeps<string>;
        return onionOptions.dependents as any;
      },
    });
  }

  // getOnionsEnabled(selector?: string) {
  //   if (!selector) selector = '';
  //   if (!this[SymbolOnionsEnabled][selector]) {
  //     this[SymbolOnionsEnabled][selector] = this.onionsGlobal.filter(onionSlice => {
  //       const onionOptions = onionSlice.beanOptions.options as IOnionOptionsEnable & IOnionOptionsMatch<string>;
  //       return this.sysOnion.checkOnionOptionsEnabled(onionOptions, selector);
  //     }) as unknown as IOnionSlice<OPTIONS, ONIONNAME>[];
  //   }
  //   return this[SymbolOnionsEnabled][selector];
  // }

  // getOnionsEnabledOfMeta(beanName: string, selector?: string) {
  //   return this.getOnionsEnabled(selector).filter(item => item.beanOptions.name === beanName);
  // }

  // getOnionsEnabledWrapped(wrapFn: Function, selector?: string) {
  //   if (!selector) selector = '';
  //   if (!this[SymbolOnionsEnabledWrapped][selector]) {
  //     const onions = this.getOnionsEnabled(selector);
  //     this[SymbolOnionsEnabledWrapped][selector] = onions.map(item => {
  //       return wrapFn(item);
  //     });
  //   }
  //   return this[SymbolOnionsEnabledWrapped][selector];
  // }

  // getOnionSlice(onionName: ONIONNAME): IOnionSlice<OPTIONS, ONIONNAME> {
  //   return this.onionsNormal[onionName];
  // }

  // getOnionOptions<OPTIONS>(onionName: ONIONNAME): OPTIONS | undefined {
  //   return this.getOnionSlice(onionName).beanOptions.options as OPTIONS | undefined;
  // }

  async loadOnionsFromPackage(
    selector?: string | boolean,
    matchThis?: any,
    ...matchArgs: any[]
  ): Promise<IOnionSlice<OPTIONS, ONIONNAME>[]> {
    // onionItems
    const onionItems = this.getOnionsEnabled(this.onionsAll, selector, matchThis, ...matchArgs);
    // loadOnions
    return await this.loadOnions(onionItems, selector, matchThis, ...matchArgs);
  }

  async loadOnions<T>(
    onionItems: IOnionItem<OPTIONS, ONIONNAME> | IOnionItem<OPTIONS, ONIONNAME>[],
    selector?: string | boolean,
    matchThis?: any,
    ...matchArgs: any[]
  ): Promise<IOnionSlice<OPTIONS, ONIONNAME, T>[]> {
    if (!Array.isArray(onionItems)) onionItems = [onionItems];
    if (onionItems.length === 0) return [];
    // load modules
    const moduleNames = onionItems.map(item => item.name.split(':')[0]);
    await this._loadModules(moduleNames);
    // onion slices
    const onionSlices: IOnionSlice<OPTIONS, ONIONNAME, T>[] = [];
    for (const item of onionItems) {
      const beanFullName = item.name.replace(':', `.${this.sceneName}.`);
      const beanOptions = appResource.getBean(beanFullName);
      if (!beanOptions) throw new Error(`behavior not found: ${beanFullName}`);
      // options
      let options;
      if (beanOptions.optionsPrimitive) {
        options = item.options !== undefined ? item.options : beanOptions.options;
      } else {
        options =
          item.options !== undefined
            ? deepExtend({}, beanOptions.options, item.options)
            : beanOptions.options;
      }
      // ok
      onionSlices.push({ name: item.name, options, beanFullName });
    }
    // optionsPackage
    if (this.sceneMeta.optionsPackage) return onionSlices;
    // swap
    this._swapOnions(onionSlices);
    // filter
    return this.getOnionsEnabled(onionSlices, selector, matchThis, ...matchArgs);
  }

  getOnionsEnabled<T>(
    onions: IOnionItem<OPTIONS, ONIONNAME>[],
    selector?: string | boolean,
    matchThis?: any,
    ...matchArgs: any[]
  ): IOnionSlice<OPTIONS, ONIONNAME, T>[] {
    if (!onions) return [];
    return onions.filter(onionItem => {
      const onionOptions = onionItem.options as IOnionOptionsEnable &
        IOnionOptionsMatch<TypeOnionOptionsMatchRule<string>>;
      return this.sysOnion.checkOnionOptionsEnabled(
        onionOptions,
        selector,
        matchThis,
        ...matchArgs,
      );
    }) as unknown as IOnionSlice<OPTIONS, ONIONNAME, T>[];
  }

  compose(
    onions: IOnionSlice<OPTIONS, ONIONNAME>[],
    executeCustom: IOnionExecuteCustom<OPTIONS, ONIONNAME>,
  ) {
    // fns
    const fns: Function[] = [];
    for (const item of onions) {
      fns.push(this._wrapOnion(item, executeCustom));
    }
    // compose
    return _compose(fns);
  }

  async _loadModules(moduleNames: string[]) {
    // load modules
    moduleNames = Array.from(new Set(moduleNames)).filter(item => !this.sys.meta.module.get(item));
    await this.sys.meta.module.loadModules(moduleNames);
  }

  /** internal */
  public _wrapOnion(
    item: IOnionSlice<OPTIONS, ONIONNAME>,
    executeCustom: IOnionExecuteCustom<OPTIONS, ONIONNAME>,
  ) {
    const fn = (data: any, next: Next) => {
      return executeCustom(item, data, next);
    };
    fn._name = item.name;
    return fn;
  }
}

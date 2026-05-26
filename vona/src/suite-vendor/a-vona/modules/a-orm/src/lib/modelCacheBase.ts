import type { BeanSummerCacheBase, IDecoratorSummerCacheOptions } from 'vona-module-a-summer';

import { BeanBase, deepExtend } from 'vona';

import type { BeanModelCache } from '../bean/bean.model/bean.model_cache.ts';
import type { TypeModelCacheType } from '../types/model.ts';
import type { ITableRecord } from '../types/onion/table.ts';

import { getCacheModelCacheInstances } from './const.ts';

const SymbolCacheOptions = Symbol('SymbolCacheOptions');
const SymbolCacheEnabled = Symbol('SymbolCacheEnabled');

export class ModelCacheBase extends BeanBase {
  private [SymbolCacheOptions]: IDecoratorSummerCacheOptions | false;
  protected _model: BeanModelCache;
  private _cacheType: TypeModelCacheType;

  protected __init__(model: BeanModelCache, cacheType: TypeModelCacheType) {
    this._model = model;
    this._cacheType = cacheType;
  }

  private get scopeOrm() {
    return this.$scope.orm;
  }

  public getInstance(table: keyof ITableRecord): BeanSummerCacheBase {
    if (this.options === false) throw new Error('cache disabled');
    const beanFullName = this._model.$beanFullName;
    const cacheName = this.getName(table);
    const cacheModelCacheInstances = getCacheModelCacheInstances(this.app);
    if (!cacheModelCacheInstances[beanFullName]) cacheModelCacheInstances[beanFullName] = {};
    if (!cacheModelCacheInstances[beanFullName][cacheName]) {
      cacheModelCacheInstances[beanFullName][cacheName] = this.app.bean.summer.cache<any, any>(
        cacheName,
        this.options,
      );
    }
    return cacheModelCacheInstances[beanFullName][cacheName];
  }

  public getName(table: keyof ITableRecord) {
    const clientNameReal = this.$scope.orm.service.database.prepareClientNameReal(
      this._model.db.clientName,
    );
    return `${this._model.$beanFullName}:${clientNameReal}:${table}:${this._cacheType}`;
  }

  public get options() {
    if (this[SymbolCacheOptions] === undefined) {
      this[SymbolCacheOptions] = this._getCacheOptionsInner();
    }
    return this[SymbolCacheOptions];
  }

  public get enabled() {
    if (this[SymbolCacheEnabled] === undefined) {
      this[SymbolCacheEnabled] = this._getCacheEnabledInner();
    }
    return this[SymbolCacheEnabled];
  }

  private _getCacheEnabledInner() {
    if (this.options === false) return false;
    // enable
    if (!this.bean.onion.checkOnionOptionsEnabled(this.options)) return false;
    // default
    return true;
  }

  private _getCacheOptionsInner() {
    if (this._model.options.cache?.[this._cacheType] === false) return false;
    // options
    let _cacheOptions = (this._model.options.cache?.[this._cacheType] ??
      {}) as IDecoratorSummerCacheOptions;
    // preset
    let configPreset;
    let preset = _cacheOptions.preset;
    if (!preset && !_cacheOptions.mode) preset = this.scopeOrm.config.summer.presetDefault;
    if (preset) {
      configPreset = this.scopeOrm.config.summer.preset[preset];
    }
    // extend
    _cacheOptions = deepExtend(
      {
        enable: this.scopeOrm.config.summer.enable,
        meta: this.scopeOrm.config.summer.meta,
        mem: {
          disableInstance: this._model.disableInstance,
        },
        redis: {
          disableInstance: this._model.disableInstance,
          client: this.scopeOrm.config.summer.redis.client,
        },
      },
      configPreset,
      _cacheOptions,
      { preset: undefined },
    );
    // ok
    return _cacheOptions;
  }
}

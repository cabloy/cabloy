import type { Query, QueryKey } from '@tanstack/vue-query';

import { experimental_createQueryPersister } from '@tanstack/query-persist-client-core';
import localforage from 'localforage';
import { SymbolBeanFullName } from 'zova';

import type { QueryMetaPersister } from '../../types/index.js';

import { CookieWrapper } from '../../common/cookieWrapper.js';
import { resolveMaxAgeTime } from '../../types/index.js';
import { BeanModelLast } from './bean.model.last.js';

export class BeanModelPersister extends BeanModelLast {
  private _persisterLoad_inner<T>(
    storage: Storage,
    storageKey: string,
    storedData: any,
    query: Query,
    options: QueryMetaPersister,
  ): T | undefined {
    if (!storedData) return undefined;
    const persistedQuery = options.deserialize
      ? options.deserialize(storedData as string, options.deserializeDefault!)
      : options.deserializeDefault!(storedData as string);

    if (persistedQuery.state.dataUpdatedAt) {
      const queryAge = Date.now() - persistedQuery.state.dataUpdatedAt;
      const expired = queryAge > (resolveMaxAgeTime(options.maxAge, query) ?? Infinity);
      const busted = persistedQuery.buster !== options.buster;
      if (expired || busted) {
        storage.removeItem(storageKey);
      } else {
        // Set proper updatedAt, since resolving in the first pass overrides those values
        query.setState({
          dataUpdatedAt: persistedQuery.state.dataUpdatedAt,
          errorUpdatedAt: persistedQuery.state.errorUpdatedAt,
        });
        return persistedQuery.state.data as T;
      }
    } else {
      storage.removeItem(storageKey);
    }
  }

  $persisterLoad<T>(queryKey: QueryKey): Promise<T | undefined> | T | undefined {
    const query = this.self.$queryFind({ queryKey });
    if (!query) return undefined;
    const options = this._adjustPersisterOptions(query.meta?.persister);
    if (!options) return undefined;
    const storage = this._getPersisterStorage(options, query);
    if (!storage) return undefined;
    const storageKey = this._getPersisterStorageKey(options, query);
    try {
      const storedData = storage.getItem(storageKey);
      if (options.sync) {
        return this._persisterLoad_inner(storage as any, storageKey, storedData, query, options);
      } else {
        return (storedData as Promise<T>).then(storedData => {
          return this._persisterLoad_inner(storage as any, storageKey, storedData, query, options);
        });
      }
    } catch (err) {
      if (process.env.DEV) {
        console.error(err);
        console.warn(
          'Encountered an error attempting to restore query cache from persisted location.',
        );
      }
      storage.removeItem(storageKey);
    }
  }

  $persisterSave(queryKey: QueryKey) {
    const query = this.self.$queryFind({ queryKey });
    if (!query) return;
    const options = this._adjustPersisterOptions(query.meta?.persister);
    if (!options) return;
    const storage = this._getPersisterStorage(options, query);
    if (!storage) return;
    const storageKey = this._getPersisterStorageKey(options, query);
    const params = {
      state: query.state,
      queryKey: query.queryKey,
      queryHash: query.queryHash,
      buster: options.buster,
    };
    const data = options.serialize
      ? options.serialize(params, options.serializeDefault!)
      : options.serializeDefault!(params);
    if (options.sync === true) {
      storage.setItem(storageKey, data);
    } else {
      // Persist if we have storage defined, we use timeout to get proper state to be persisted
      setTimeout(() => {
        storage.setItem(storageKey, data);
      }, 0);
    }
  }

  $persisterRemove(queryKey: QueryKey) {
    const query = this.self.$queryFind({ queryKey });
    if (!query) return;
    const options = this._adjustPersisterOptions(query.meta?.persister);
    if (!options) return;
    const storage = this._getPersisterStorage(options, query);
    if (!storage) return;
    const storageKey = this._getPersisterStorageKey(options, query);
    if (options.sync === true) {
      storage.removeItem(storageKey);
    } else {
      // Persist if we have storage defined, we use timeout to get proper state to be persisted
      setTimeout(() => {
        storage.removeItem(storageKey);
      }, 0);
    }
  }

  protected _createPersister(options?: QueryMetaPersister | boolean): any {
    options = this._adjustPersisterOptions(options);
    if (!options) return undefined;
    return experimental_createQueryPersister({
      storage: this._getPersisterStorage(options) as any,
      maxAge: options.maxAge as number,
      refetchOnRestore: options.refetchOnRestore,
      prefix: options.prefix,
      buster: options.buster,
    }).persisterFn;
  }

  protected _adjustPersisterOptions(options?: QueryMetaPersister | boolean) {
    if (options === false) return undefined;
    if (options === undefined || options === true) {
      options = {};
    } else {
      options = { ...options };
    }
    options.storage = options.storage ?? (options.sync ? 'local' : 'db');
    options.maxAge = options.maxAge ?? this.scopeSelf.config.persister.maxAge[options.storage];
    options.refetchOnRestore =
      options.refetchOnRestore ?? this.scopeSelf.config.persister.refetchOnRestore;
    options.prefix = options.prefix ?? this._getPersisterPrefix();
    options.buster = options.buster ?? this._getPersisterBuster();
    options.serializeDefault = options.serializeDefault ?? JSON.stringify;
    options.deserializeDefault = options.deserializeDefault ?? JSON.parse;
    return options;
  }

  protected _getPersisterStorageKey(options: QueryMetaPersister, query: Query) {
    if (options.storageKeySimplify) return String(query.queryKey[query.queryKey.length - 1]);
    return `${options.prefix}-${query.queryHash}`;
  }

  protected _getPersisterStorage(options?: QueryMetaPersister | boolean, query?: Query) {
    options = this._adjustPersisterOptions(options);
    if (!options) return undefined;
    // cookie
    if (options.storage === 'cookie')
      return this.bean._newBeanSimple(CookieWrapper, false, options, query);
    // check server
    if (process.env.SERVER) return undefined;
    // local
    if (options.storage === 'local') return localStorage;
    // db
    if (options.storage === 'db') return localforage;
  }

  protected _getPersisterPrefix() {
    return `${this.sys.env.APP_NAME}-query`;
  }

  protected _getPersisterBuster() {
    return this.sys.env.APP_VERSION;
  }

  protected _forceQueryKeyPrefix(queryKey?: QueryKey): QueryKey {
    if (!queryKey) queryKey = [];
    if (!this._prefixIsBeanFullName(queryKey[0])) {
      const prefixes = [this[SymbolBeanFullName]];
      if (this.$onionOptions?.enableSelector) {
        prefixes.push(this.selector);
      }
      queryKey = prefixes.concat(queryKey as any);
    }
    return queryKey;
  }

  private _prefixIsBeanFullName(prefix?: any) {
    return prefix === this[SymbolBeanFullName];
    // return (prefix && typeof prefix === 'string' && prefix.split('.').length === 3);
  }
}

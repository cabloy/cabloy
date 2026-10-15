import type { Query, QueryKey } from '@tanstack/vue-query';

import { CancelledError, notifyManager } from '@tanstack/query-core';
import { experimental_createQueryPersister } from '@tanstack/query-persist-client-core';
import { hashKey } from '@tanstack/vue-query';
import localforage from 'localforage';
import { SymbolBeanFullName } from 'zova';

import type { ModelPersistenceToken } from '../../lib/modelPersistence.js';
import type { QueryMetaPersister } from '../../types/index.js';

import { CookieWrapper } from '../../common/cookieWrapper.js';
import { getModelPersistenceStorageKey } from '../../lib/modelPersistence.js';
import { getPersistenceQueue } from '../../lib/persistenceQueue.js';
import { createQueryPersister } from '../../lib/queryPersister.js';
import { resolveMaxAgeTime } from '../../types/index.js';
import { BeanModelLast } from './bean.model.last.js';

export class BeanModelPersister extends BeanModelLast {
  private _persisterRestoreErrors = new Set<string>();

  $persisterError(queryKey: QueryKey): boolean {
    const query = this.self.$queryFind({ queryKey });
    const options = this._adjustPersisterOptions(query?.meta?.persister);
    return (
      !!options &&
      this._persisterRestoreErrors.has(this._getPersisterStorageKey(options, query, queryKey))
    );
  }

  private _persisterLoad_inner<T>(
    storedData: any,
    query: Query,
    options: QueryMetaPersister,
  ): { data?: T; remove: boolean; timestamps?: { dataUpdatedAt: number; errorUpdatedAt: number } } {
    if (!storedData) return { remove: false };
    const persistedQuery = options.deserialize
      ? options.deserialize(storedData as string, options.deserializeDefault!)
      : options.deserializeDefault!(storedData as string);
    if (persistedQuery.state.dataUpdatedAt) {
      const queryAge = Date.now() - persistedQuery.state.dataUpdatedAt;
      const expired = queryAge > (resolveMaxAgeTime(options.maxAge, query) ?? Infinity);
      const busted = persistedQuery.buster !== options.buster;
      if (!expired && !busted) {
        return {
          data: persistedQuery.state.data as T,
          remove: false,
          timestamps: {
            dataUpdatedAt: persistedQuery.state.dataUpdatedAt,
            errorUpdatedAt: persistedQuery.state.errorUpdatedAt,
          },
        };
      }
    }
    return { remove: true };
  }

  $persisterLoad<T>(queryKey: QueryKey): Promise<T | undefined> | T | undefined {
    const ctx = this.ctx;
    if (ctx?.disposed) return undefined;
    const persistence = this.$modelPersistence;
    const query = this.self.$queryFind({ queryKey });
    if (!query) return undefined;
    const options = this._adjustPersisterOptions(query.meta?.persister);
    if (!options) return undefined;
    const storage = this._getPersisterStorage(options, query);
    if (!storage) return undefined;
    const token = persistence.capture();
    if (options.storage === 'db') persistence.touch(query);
    const storageKey = this._getPersisterStorageKey(options, query, undefined, token);
    this._persisterRestoreErrors.delete(storageKey);
    const queue = getPersistenceQueue(storage);
    const generation = queue.generation(storageKey);
    const current = () =>
      !ctx?.disposed &&
      generation === queue.generation(storageKey) &&
      (options.storage !== 'db' || persistence.current(token));
    if (!options.sync) {
      return queue
        .enqueue(async () => {
          if (!current()) return undefined;
          const storedData = await storage.getItem(storageKey);
          if (!current()) return undefined;
          try {
            const result = this._persisterLoad_inner<T>(storedData, query, options);
            if (!current()) return undefined;
            if (result.timestamps) query.setState(result.timestamps);
            if (result.remove) await storage.removeItem(storageKey);
            return current() ? result.data : undefined;
          } catch {
            if (!current()) return undefined;
            this._persisterRestoreErrors.add(storageKey);
            await storage.removeItem(storageKey);
            this._reportPersisterError('restore');
            return undefined;
          }
        })
        .catch(() => {
          if (current()) {
            this._persisterRestoreErrors.add(storageKey);
            this._reportPersisterError('restore');
          }
          return undefined;
        });
    }
    try {
      const result = this._persisterLoad_inner<T>(storage.getItem(storageKey), query, options);
      if (result.timestamps) query.setState(result.timestamps);
      if (result.remove) storage.removeItem(storageKey);
      return result.data;
    } catch {
      this._persisterRestoreErrors.add(storageKey);
      this._reportPersisterError('restore');
      try {
        storage.removeItem(storageKey);
      } catch {
        this._reportPersisterError('remove');
      }
    }
  }

  $persisterGeneration(queryKey: QueryKey): string {
    const query = this.self.$queryFind({ queryKey });
    const options = this._adjustPersisterOptions(query?.meta?.persister);
    if (!options) return '';
    const storage = this._getPersisterStorage(options, query);
    if (!storage) return '';
    const storageKey = this._getPersisterStorageKey(options, query, queryKey);
    return `${options.storage === 'db' ? this.$modelPersistence.epoch : ''}:${storageKey}:${getPersistenceQueue(storage).generation(storageKey)}`;
  }

  $persisterSave(queryKey: QueryKey): Promise<void> {
    const query = this.self.$queryFind({ queryKey });
    if (!query) return Promise.resolve();
    const options = this._adjustPersisterOptions(query.meta?.persister);
    if (!options) return Promise.resolve();
    return this._persisterSave(query, options);
  }

  $persisterSaveTo(queryKey: QueryKey, storageTarget: 'cookie' | 'local', value?: unknown) {
    const query = this.self.$queryFind({ queryKey });
    if (!query) {
      if (process.env.DEV)
        console.warn('Cannot save persisted query because it was not found', queryKey);
      return;
    }
    const persister =
      query.meta?.persister && typeof query.meta.persister === 'object' ? query.meta.persister : {};
    const options = this._adjustPersisterOptions({
      ...persister,
      storage: storageTarget,
      sync: true,
      serializeDefault: (obj?: Query) =>
        storageTarget === 'cookie'
          ? String(obj?.state?.data ?? '')
          : JSON.stringify(obj?.state?.data),
    });
    if (options) this._persisterSave(query, options, value);
  }

  private _serializePersister(query: Query, options: QueryMetaPersister, value?: unknown): string {
    const params = {
      state: value === undefined ? query.state : { ...query.state, data: value },
      queryKey: query.queryKey,
      queryHash: query.queryHash,
      buster: options.buster,
    };
    return options.serialize
      ? options.serialize(params, options.serializeDefault!)
      : options.serializeDefault!(params);
  }

  private _persisterSave(
    query: Query,
    options: QueryMetaPersister,
    value?: unknown,
  ): Promise<void> {
    const storage = this._getPersisterStorage(options, query);
    if (!storage) return Promise.resolve();
    if (options.storage === 'db') this.$modelPersistence.touch(query);
    const storageKey = this._getPersisterStorageKey(options, query);
    const queue = getPersistenceQueue(storage);
    queue.invalidate(storageKey);
    let data: string;
    try {
      data = this._serializePersister(query, options, value);
    } catch (error) {
      return this._handlePersisterOperation(
        queue.enqueue(() => {
          throw error;
        }),
        'save',
      );
    }
    if (options.sync === true && options.storage !== 'db') {
      try {
        storage.setItem(storageKey, data);
        return Promise.resolve();
      } catch (error) {
        return this._handlePersisterOperation(Promise.reject(error), 'save');
      }
    }
    // Accepted explicit writes keep their captured physical identity. The shared
    // queue orders them before a later remove or full-store clear.
    return this._handlePersisterOperation(
      queue.enqueue(async () => {
        await storage.setItem(storageKey, data);
      }),
      'save',
    );
  }

  $persisterRemove(queryKey: QueryKey, persister?: QueryMetaPersister): Promise<void> {
    const query = this.self.$queryFind({ queryKey });
    if (!query && !persister) return Promise.resolve();
    const options = this._adjustPersisterOptions(persister ?? query?.meta?.persister);
    if (!options) return Promise.resolve();
    const storage = this._getPersisterStorage(options, query);
    if (!storage) return Promise.resolve();
    if (options.storage === 'db') this.$modelPersistence.touch(query);
    const storageKey = this._getPersisterStorageKey(options, query, queryKey);
    const queue = getPersistenceQueue(storage);
    queue.invalidate(storageKey);
    if (options.sync === true && options.storage !== 'db') {
      try {
        storage.removeItem(storageKey);
        return Promise.resolve();
      } catch (error) {
        return this._handlePersisterOperation(Promise.reject(error), 'remove');
      }
    }
    return this._handlePersisterOperation(
      queue.enqueue(async () => {
        await storage.removeItem(storageKey);
      }),
      'remove',
    );
  }

  async $persisterFlush(): Promise<void> {
    if (process.env.SERVER) return;
    await getPersistenceQueue(localforage).flush();
  }

  private _handlePersisterOperation<T>(operation: Promise<T>, action: string): Promise<T> {
    operation.catch(() => this._reportPersisterError(action));
    return operation;
  }

  private _reportPersisterError(action: string) {
    if (process.env.DEV)
      console.warn(`Encountered an error attempting to ${action} persisted query cache.`);
  }

  protected _createPersister(options?: QueryMetaPersister | boolean): any {
    options = this._adjustPersisterOptions(options);
    if (!options) return undefined;
    if (options.storage === 'db') return this._createDbPersister(options);
    const storage = this._getPersisterStorage(options);
    const persisterOptions = options;
    return createQueryPersister((queryFn, context, query) => {
      const queue = storage ? getPersistenceQueue(storage) : undefined;
      const storageKey = `${persisterOptions.prefix}-${query.queryHash}`;
      const generation = queue?.generation(storageKey);
      const current = () => generation === queue?.generation(storageKey);
      const orderedStorage =
        storage && queue && !persisterOptions.sync
          ? {
              getItem: (key: string) =>
                queue.enqueue(() => (current() ? storage.getItem(key) : undefined)),
              setItem: (key: string, data: string) =>
                this._handlePersisterOperation(
                  queue.enqueue(async () => {
                    if (current()) await storage.setItem(key, data);
                  }),
                  'save',
                ),
              removeItem: (key: string) =>
                this._handlePersisterOperation(
                  queue.enqueue(async () => {
                    if (current()) await storage.removeItem(key);
                  }),
                  'remove',
                ),
            }
          : storage;
      return experimental_createQueryPersister({
        storage: orderedStorage as any,
        maxAge: persisterOptions.maxAge as number,
        refetchOnRestore: persisterOptions.refetchOnRestore,
        prefix: persisterOptions.prefix,
        buster: persisterOptions.buster,
      }).persisterFn(queryFn, context, query);
    });
  }

  private _createDbPersister(options: QueryMetaPersister) {
    const ctx = this.ctx;
    const persistence = this.$modelPersistence;
    // Do not use the upstream persister here: its deferred timestamp/refetch/save
    // callbacks can run after a scope transition or owner disposal.
    return async (queryFn, context, query: Query) => {
      if (ctx?.disposed) throw new CancelledError({ silent: true, revert: false });
      persistence.touch(query);
      const token = persistence.capture();
      const storage = this._getPersisterStorage(options, query);
      const queue = storage && getPersistenceQueue(storage);
      const storageKey = this._getPersisterStorageKey(options, query, undefined, token);
      const generation = queue?.generation(storageKey);
      const current = () =>
        !ctx?.disposed &&
        persistence.current(token) &&
        generation === queue?.generation(storageKey);
      const assertCurrent = () => {
        if (!current()) throw new CancelledError({ silent: true, revert: false });
      };
      const bypass =
        (query.state.fetchMeta as { bypassPersister?: boolean } | null)?.bypassPersister === true;
      if (!bypass && storage && queue && query.state.data === undefined) {
        this._persisterRestoreErrors.delete(storageKey);
        const restored = await queue
          .enqueue(async () => {
            if (!current()) return undefined;
            try {
              const storedData = await storage.getItem(storageKey);
              if (!current()) return undefined;
              const result = this._persisterLoad_inner(storedData, query, options);
              if (!current()) return undefined;
              if (result.remove) await storage.removeItem(storageKey);
              return current() ? result : undefined;
            } catch {
              if (current()) {
                this._persisterRestoreErrors.add(storageKey);
                await storage.removeItem(storageKey);
                this._reportPersisterError('restore');
              }
              return undefined;
            }
          })
          .catch(() => {
            if (current()) {
              this._persisterRestoreErrors.add(storageKey);
              this._reportPersisterError('restore');
            }
            return undefined;
          });
        assertCurrent();
        if (restored?.data !== undefined) {
          notifyManager.schedule(() => {
            if (!current()) return;
            if (restored.timestamps) query.setState(restored.timestamps);
            if (
              options.refetchOnRestore === 'always' ||
              (options.refetchOnRestore === true && query.isStale())
            ) {
              void query.fetch().catch(() => undefined);
            }
          });
          return restored.data;
        }
      }
      assertCurrent();
      let result;
      try {
        result = await queryFn(context);
      } catch (error) {
        assertCurrent();
        throw error;
      }
      assertCurrent();
      if (!bypass && storage && queue) {
        notifyManager.schedule(() => {
          if (!current()) return;
          let data: string;
          try {
            data = this._serializePersister(query, options, result);
          } catch (error) {
            this._handlePersisterOperation(
              queue.enqueue(() => {
                throw error;
              }),
              'save',
            );
            return;
          }
          this._handlePersisterOperation(
            queue.enqueue(async () => {
              if (current()) await storage.setItem(storageKey, data);
            }),
            'save',
          );
        });
      }
      return result;
    };
  }

  protected _adjustPersisterOptions(options?: QueryMetaPersister | boolean) {
    if (options === false) return undefined;
    options = options === undefined || options === true ? {} : { ...options };
    options.storage = options.storage ?? (options.sync ? 'local' : 'db');
    // DB storage is always asynchronous, including custom explicitly synced options.
    if (options.storage === 'db') options.sync = false;
    options.maxAge = options.maxAge ?? this.scopeSelf.config.persister.maxAge[options.storage];
    options.refetchOnRestore =
      options.refetchOnRestore ?? this.scopeSelf.config.persister.refetchOnRestore;
    options.prefix = options.prefix ?? this._getPersisterPrefix();
    options.buster = options.buster ?? this._getPersisterBuster();
    options.serializeDefault = options.serializeDefault ?? JSON.stringify;
    options.deserializeDefault = options.deserializeDefault ?? JSON.parse;
    return options;
  }

  protected _getPersisterStorageKey(
    options: QueryMetaPersister,
    query?: Query,
    queryKey?: QueryKey,
    token?: ModelPersistenceToken,
  ) {
    const key = query?.queryKey ?? this._forceQueryKeyPrefix(queryKey);
    const logicalKey = options.storageKeySimplify
      ? String(key[key.length - 1])
      : `${options.prefix}-${query?.queryHash ?? hashKey(key)}`;
    return options.storage === 'db'
      ? getModelPersistenceStorageKey(
          this.sys.env.APP_NAME ?? '',
          (token ?? this.$modelPersistence.capture()).scope,
          logicalKey,
        )
      : logicalKey;
  }

  protected _getPersisterStorage(options?: QueryMetaPersister | boolean, query?: Query) {
    options = this._adjustPersisterOptions(options);
    if (!options) return undefined;
    if (options.storage === 'cookie')
      return this.bean._newBeanSimple(CookieWrapper, false, options, query);
    if (process.env.SERVER) return undefined;
    if (options.storage === 'local') return localStorage;
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
      if (this.$onionOptions?.enableSelector) prefixes.push(this.selector);
      queryKey = prefixes.concat(queryKey as any);
    }
    return queryKey;
  }

  private _prefixIsBeanFullName(prefix?: any) {
    return prefix === this[SymbolBeanFullName];
  }
}

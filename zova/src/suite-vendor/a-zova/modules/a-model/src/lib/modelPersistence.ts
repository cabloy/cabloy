import type { Query, QueryClient, QueryOptions } from '@tanstack/query-core';

import { notifyManager } from '@tanstack/query-core';
import { markRaw, shallowRef } from 'vue';

export type ModelPersistenceScope = readonly [string | null, string | null, string | null];
export interface ModelPersistenceValues {
  instanceId?: string | number | null;
  siteId?: string | number | null;
  userId?: string | number | null;
}
export interface ModelPersistenceToken {
  readonly scope: ModelPersistenceScope;
  readonly epoch: number;
}

const normalize = (value: string | number | null | undefined) =>
  value == null ? null : String(value);

export function getModelPersistenceStorageKey(
  appName: string,
  scope: ModelPersistenceScope,
  logicalKey: string,
): string {
  return JSON.stringify(['zova-model-db', 1, appName, scope, logicalKey]);
}

export function isModelPersistenceDb(options?: unknown): boolean {
  if (options === false) return false;
  const persister =
    options && typeof options === 'object' ? (options as { storage?: string; sync?: boolean }) : {};
  return (persister.storage ?? (persister.sync ? 'local' : 'db')) === 'db';
}

function emptyQueryState() {
  return {
    data: undefined,
    dataUpdateCount: 0,
    dataUpdatedAt: 0,
    error: null,
    errorUpdateCount: 0,
    errorUpdatedAt: 0,
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchMeta: null,
    isInvalidated: false,
    status: 'pending' as const,
    fetchStatus: 'idle' as const,
  };
}

/** App-owned identity; independent of the module providing the current Passport. */
export class ModelPersistenceContext {
  private _epoch = 0;
  private _version = shallowRef(0);
  private _scope: ModelPersistenceScope;
  private _registered = false;
  private _hydrated = new Set<Query>();
  private _listeners = new Set<(token: ModelPersistenceToken) => void>();

  constructor(
    private _queryClient: QueryClient,
    siteId?: string | number | null,
  ) {
    // IoC owners can be reactive; do not let Vue unwrap this class's private refs
    // or proxy TanStack Query instances retained for hydration adoption.
    markRaw(this);
    this._scope = Object.freeze([null, normalize(siteId), null]);
  }

  get epoch(): number {
    void this._version.value;
    return this._epoch;
  }

  capture(): ModelPersistenceToken {
    return Object.freeze({ scope: this._scope, epoch: this.epoch });
  }

  current(token: ModelPersistenceToken): boolean {
    return token.epoch === this.epoch && token.scope === this._scope;
  }

  markHydrated(queries: Query[]) {
    if (!this._registered) {
      for (const query of queries) this._hydrated.add(query);
    }
  }

  touch(query?: Query): void {
    // A transferred Query that has since participated in DB work belongs to the
    // actual invocation scope, not the one-time hydration adoption baseline.
    if (query) this._hydrated.delete(query);
  }

  subscribe(listener: (token: ModelPersistenceToken) => void): () => void {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  update(
    values: ModelPersistenceValues,
    options: { initial?: boolean; refetchActive?: boolean } = {},
  ): void {
    const scope: ModelPersistenceScope = Object.freeze([
      normalize(values.instanceId),
      normalize(values.siteId),
      normalize(values.userId),
    ]);
    const adopt = !this._registered && options.initial === true;
    this._registered = true;
    if (scope.every((value, index) => value === this._scope[index])) {
      this._hydrated.clear();
      return;
    }
    const affected = this._queryClient
      .getQueryCache()
      .getAll()
      .filter(
        query =>
          isModelPersistenceDb(query.meta?.persister) && !(adopt && this._hydrated.has(query)),
      );
    this._scope = scope;
    this._hydrated.clear();
    this._invalidate(affected);
    // Outgoing relogin/logout still resets immediately, but must not refetch
    // protected queries after their authentication has been removed.
    if (options.refetchActive === false) return;
    const token = this.capture();
    // The identity owner installs authentication before publishing this transition.
    // Defer refetch until all synchronous reset/listener work has finished.
    void Promise.resolve().then(() => {
      if (this.current(token)) {
        return this._queryClient.refetchQueries({
          type: 'active',
          predicate: query => affected.includes(query),
        });
      }
    });
  }

  clear(): void {
    this._hydrated.clear();
    this._invalidate(this._queryClient.getQueryCache().getAll());
  }

  private _invalidate(queries: Query[]): void {
    this._epoch++;
    // Cancel every retryer before resetting any query. Silent + non-reverting avoids
    // the old fetch's asynchronous cancellation handler publishing an error/reset.
    for (const query of queries) void query.cancel({ silent: true, revert: false });
    notifyManager.batch(() => {
      for (const query of queries) {
        query.setOptions({
          ...query.options,
          initialData: undefined,
          initialDataUpdatedAt: undefined,
        });
        for (const observer of query.observers) {
          observer.setOptions({
            ...observer.options,
            initialData: undefined,
            initialDataUpdatedAt: undefined,
            placeholderData: undefined,
          });
        }
        query.setState(emptyQueryState());
      }
    });
    this._version.value++;
    const token = this.capture();
    for (const listener of this._listeners) listener(token);
  }

  /** Keep later observer option reapplication from reinstalling an old identity. */
  guardOptions<T extends QueryOptions>(options: T): T {
    if (!isModelPersistenceDb(options.meta?.persister)) return options;
    const token = this.capture();
    const initialData = options.initialData;
    const initialDataUpdatedAt = options.initialDataUpdatedAt;
    const placeholderData = (options as T & { placeholderData?: unknown }).placeholderData;
    return {
      ...options,
      initialData: () =>
        this.current(token)
          ? typeof initialData === 'function'
            ? initialData()
            : initialData
          : undefined,
      initialDataUpdatedAt: () =>
        this.current(token)
          ? typeof initialDataUpdatedAt === 'function'
            ? initialDataUpdatedAt()
            : initialDataUpdatedAt
          : undefined,
      placeholderData: (...args: unknown[]) =>
        this.current(token)
          ? typeof placeholderData === 'function'
            ? placeholderData(...args)
            : placeholderData
          : undefined,
    };
  }
}

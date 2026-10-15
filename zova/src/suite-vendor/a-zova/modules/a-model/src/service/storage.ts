import type { Query, VueQueryPluginOptions } from '@tanstack/vue-query';

import { dehydrate, hydrate, QueryCache, QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import { BeanBase, deepExtend } from 'zova';
import { Service } from 'zova-module-a-bean';

import type { ModelPersistenceToken, ModelPersistenceValues } from '../lib/modelPersistence.js';

import { ModelPersistenceContext } from '../lib/modelPersistence.js';

@Service()
export class ServiceStorage extends BeanBase {
  private _queryClient: QueryClient;
  private _persistence: ModelPersistenceContext;

  get epoch() {
    return this._persistence.epoch;
  }

  capture() {
    return this._persistence.capture();
  }

  current(token: ModelPersistenceToken) {
    return this._persistence.current(token);
  }

  update(values: ModelPersistenceValues, options?: { initial?: boolean; refetchActive?: boolean }) {
    this._persistence.update(values, options);
  }

  subscribe(listener: (token: ModelPersistenceToken) => void) {
    return this._persistence.subscribe(listener);
  }

  clear() {
    this._persistence.clear();
  }

  touch(query?: Query) {
    this._persistence.touch(query);
  }

  guardOptions<T extends Parameters<ModelPersistenceContext['guardOptions']>[0]>(options: T): T {
    return this._persistence.guardOptions(options);
  }

  async moduleLoaded() {
    // options
    const options = deepExtend({}, this.scope.config.queryClientConfig.defaultOptions);
    if (process.env.SERVER) {
      options.queries ??= {};
      options.queries.gcTime = Infinity;
    }
    // queryCache
    const queryCache = new QueryCache();
    // queryClient
    const queryClient = (this._queryClient = new QueryClient({
      defaultOptions: options,
      queryCache,
    }));
    this._persistence = new ModelPersistenceContext(queryClient, this.sys.env.SITE_ID);
    // use plugin
    const vueQueryPluginOptions: VueQueryPluginOptions = { queryClient };
    this.app.vue.use(VueQueryPlugin, vueQueryPluginOptions);
  }

  async appInitialize() {
    // onRendered
    if (process.env.SERVER) {
      this.ctx.meta.$ssr.context.onRendered((err?: Error) => {
        if (!err) {
          this.ctx.meta.$ssr.stateDefer.query = dehydrate(this._queryClient, {
            shouldDehydrateMutation: () => {
              return false;
            },
          });
        }
        this._queryClient?.clear();
      });
    }
    // client
    if (process.env.CLIENT && this.ctx.meta.$ssr.isRuntimeSsrPreHydration) {
      const state = this.ctx.meta.$ssr.stateDefer.query;
      hydrate(this._queryClient, state);
      this._persistence.markHydrated(
        (state?.queries ?? []).flatMap(item => {
          const query = this._queryClient.getQueryCache().get(item.queryHash);
          return query ? [query] : [];
        }),
      );
    }
  }
}

import type { VueQueryPluginOptions } from '@tanstack/vue-query';

import { dehydrate, hydrate, QueryCache, QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import { BeanBase, deepExtend } from 'zova';
import { Service } from 'zova-module-a-bean';

@Service()
export class ServiceStorage extends BeanBase {
  private _queryClient: QueryClient;

  async moduleLoaded() {
    // options
    let options = this.scope.config.queryClientConfig.defaultOptions;
    if (process.env.SERVER) {
      options = deepExtend({}, options, {
        queries: { gcTime: Infinity },
      });
    }
    // queryCache
    const queryCache = new QueryCache();
    // queryClient
    const queryClient = (this._queryClient = new QueryClient({
      defaultOptions: options,
      queryCache,
    }));
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
        this._queryClient.clear();
      });
    }
    // client
    if (process.env.CLIENT && this.ctx.meta.$ssr.isRuntimeSsrPreHydration) {
      hydrate(this._queryClient, this.ctx.meta.$ssr.stateDefer.query);
    }
  }
}

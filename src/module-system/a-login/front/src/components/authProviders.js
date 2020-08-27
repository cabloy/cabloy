export default {
  meta: {
    global: false,
  },
  methods: {
    async onAction({ ctx, action, item }) {
      if (action.name === 'loadAuthProviders') {
        return await this.loadAuthProviders(ctx, item);
      }
    },
    async loadAuthProviders(ctx, { state }) {
      // providers
      let providers = await this.$api.post('/a/login/auth/list');
      if (providers.length === 0) return providers;
      // check
      providers = await this.__checkAuthProviders({ ctx, providers, state });
      return providers.filter(item => !!item);
    },
    async __checkAuthProviders({ ctx, providers, state }) {
      const promises = [];
      for (const provider of providers) {
        if (provider) {
          promises.push(this.__checkAuthProvider({ ctx, provider, state }));
        }
      }
      return await Promise.all(promises);
    },
    async __checkAuthProvider({ ctx, provider, state }) {
      // load module
      const module = await this.$meta.module.use(provider.module);
      // checkIfDisable
      if (!provider.meta.component) return null;
      if (state === 'associate' && provider.meta.disableAssociate) return null;
      const component = module.options.components[provider.meta.component];
      const disable = await this.__checkAuthProviderDisable({ ctx, component, provider, state });
      if (disable) return null;
      return { provider, component };
    },
    async __checkAuthProviderDisable({ ctx, component, provider, state }) {
      if (!component.meta) return false; // default is false
      if (typeof component.meta.disable !== 'function') return component.meta.disable;
      return await this.$meta.util.wrapPromise(component.meta.disable({ ctx, state, provider }));
    },
  },

};


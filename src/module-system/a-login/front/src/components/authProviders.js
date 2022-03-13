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
      const meta = provider.meta;
      if (!meta.render) return null;
      // load module
      const module = await this.$meta.module.use(meta.render.module);
      // checkIfDisable
      if (state === 'migrate' && !meta.inline) return null;
      if (state === 'associate' && meta.disableAssociate) return null;
      const component = module.options.components[meta.name];
      const disable = await this.__checkAuthProviderDisable({ ctx, component, provider, state });
      if (disable) return null;
      return { provider, component };
    },
    async __checkAuthProviderDisable({ ctx, component, provider, state }) {
      if (!component.meta) return false; // default is false
      if (typeof component.meta.disable !== 'function') return component.meta.disable;
      // loop scenes
      const scenes = {};
      for (const providerScene in provider.scenes) {
        const disable = await this.$meta.util.wrapPromise(
          component.meta.disable({ ctx, state, provider, providerScene })
        );
        if (!disable) {
          scenes[providerScene] = provider.scenes[providerScene];
        }
      }
      provider.scenes = scenes;
      if (Object.keys(scenes).length === 0) return true;
      return false;
    },
  },
};

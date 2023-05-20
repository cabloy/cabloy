export default {
  state() {
    return {};
  },
  actions: {
    async loadAuthProviders({ ctx, state }) {
      // providers
      let providers = await ctx.$api.post('/a/login/auth/list');
      if (providers.length === 0) return providers;
      // check
      providers = await this.__checkAuthProviders({ ctx, providers, state });
      return providers.filter(item => !!item);
    },
    _getMetaScene(item, sceneName) {
      const meta = item.meta;
      if (meta.scene) {
        const scene = item.metaScenes && item.metaScenes[sceneName];
        return (scene && scene.meta) || meta;
      }
      return meta;
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
      provider.renderComponents = {};
      for (const sceneName of Object.keys(provider.scenes)) {
        const component = await this.__checkAuthProviderComponent({ ctx, provider, state, sceneName });
        if (component) {
          provider.renderComponents[sceneName] = component;
        } else {
          // delete scenes
          delete provider.scenes[sceneName];
        }
      }
      if (Object.keys(provider.renderComponents).length === 0) return null;
      return provider;
    },
    async __checkAuthProviderComponent({ ctx, provider, state, sceneName }) {
      const metaScene = this._getMetaScene(provider, sceneName);
      if (!metaScene.render) return null;
      if (ctx.$meta.config.base.jwt && metaScene.mode === 'redirect') return null;
      // load module
      const module = await ctx.$meta.module.use(metaScene.render.module);
      // checkIfDisable
      if (state === 'migrate' && !metaScene.inline) return null;
      if (state === 'associate' && metaScene.disableAssociate) return null;
      const component = module.options.components[metaScene.render.name];
      const disable = await this.__checkAuthProviderDisable({ ctx, component, provider, state, sceneName });
      if (disable) return null;
      return component;
    },
    async __checkAuthProviderDisable({ ctx, component, provider, state, sceneName }) {
      const options = {
        propsData: {
          ctxCaller: ctx,
          state,
          provider,
          providerModule: provider.module,
          providerName: provider.providerName,
          providerScene: provider.meta.scene ? sceneName : null,
        },
      };
      const componentInstance = ctx.$meta.util.createComponentInstance(component, options);
      return await componentInstance.disable();
    },
  },
};

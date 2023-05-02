const _authProvidersLocales = {};

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Base {
    authProviders() {
      if (!_authProvidersLocales[ctx.locale]) {
        _authProvidersLocales[ctx.locale] = this._prepareAuthProviders();
      }
      return _authProvidersLocales[ctx.locale];
    }

    _prepareAuthProviders() {
      const authProviders = {};
      for (const module of ctx.app.meta.modulesArray) {
        const relativeName = module.info.relativeName;
        let metaAuth = module.main.meta && module.main.meta.auth;
        if (!metaAuth) continue;
        if (typeof metaAuth === 'function') {
          metaAuth = metaAuth(ctx.app);
        }
        if (!metaAuth.providers) continue;
        // loop
        for (const providerName in metaAuth.providers) {
          const _authProvider = metaAuth.providers[providerName];
          const providerFullName = `${relativeName}:${providerName}`;
          if (!_authProvider.meta.title) {
            throw new Error(`should specify the title of auth provider: ${providerFullName}`);
          }
          const authProvider = ctx.bean.util.extend({}, _authProvider);
          this._prepareAuthProvider(relativeName, providerName, authProvider);
          authProviders[providerFullName] = authProvider;
        }
      }
      return authProviders;
    }

    _prepareAuthProvider(relativeName, providerName, authProvider) {
      const meta = authProvider.meta;
      meta.titleLocale = ctx.text(meta.title);
      // meta
      this._prepareAuthProvider_meta(relativeName, meta);
      // scenes
      const scenes = authProvider.scenes;
      if (scenes) {
        for (const sceneName in scenes) {
          const scene = scenes[sceneName];
          this._prepareAuthProvider_meta(relativeName, scene.meta);
          scene.meta = this._prepareAuthProvider_mergeMetaScene(scene.meta, meta);
        }
      }
    }

    _prepareAuthProvider_mergeMetaScene(metaScene, metaConfig) {
      const _meta = {};
      for (const key of ['mode', 'inner', 'inline', 'disableAssociate', 'render', 'validator']) {
        if (metaConfig[key] !== undefined) {
          _meta[key] = metaConfig[key];
        }
      }
      return ctx.bean.util.extend({}, _meta, metaScene);
    }

    _prepareAuthProvider_meta(relativeName, meta) {
      if (typeof meta.bean === 'string') {
        meta.bean = { module: relativeName, name: meta.bean };
      }
      if (typeof meta.render === 'string') {
        meta.render = { module: relativeName, name: meta.render };
      }
      if (typeof meta.validator === 'string') {
        meta.validator = { module: relativeName, validator: meta.validator };
      }
    }
  }
  return Base;
};

const extend = require('extend2');
const util = require('./util.js');

const CTXCONFIG = Symbol.for('Context#__config');
const CACHEMEMORY = Symbol.for('APP#__CACHEMEMORY');

module.exports = function(loader, modules) {

  // all configs
  loader.app.meta.configs = {};

  // load configs
  loadConfigs();

  // patch service
  patchCreateContext();

  function patchCreateContext() {
    const createContext = loader.app.createContext;
    loader.app.createContext = (...args) => {
      const context = createContext.call(loader.app, ...args);

      // maybe /favicon.ico
      if (context.module) {
        Object.defineProperty(context, 'config', {
          enumerable: false,
          get() {
            // check cache
            if (context[CTXCONFIG]) return context[CTXCONFIG];
            // get
            let useCache;
            let _configs = getCacheMemory(context, 'a-instance').instanceConfigs;
            _configs = _configs ? _configs.value : null;
            if (!_configs) {
              _configs = loader.app.meta.configs;
              useCache = false;
            } else {
              useCache = true;
            }
            const _config = _configs[context.module.info.relativeName];
            _config.module = function(moduleName) {
              return _configs[moduleName];
            };
            if (useCache) {
              context[CTXCONFIG] = _config;
            }
            return _config;
          },
        });
      }

      return context;
    };
  }

  function loadConfigs() {
    Object.keys(modules).forEach(key => {
      const module = modules[key];
      const ebConfig = loader.app.meta.configs[module.info.relativeName] = {};

      // module config
      if (module.main.config) {
        const config = module.main.config(loader.appInfo);
        util.monkeyModule(loader.app.meta.modulesMonkey, 'configLoaded', { module, config });
        extend(true, ebConfig, config);
      }

      // application config
      if (loader.config.modules && loader.config.modules[module.info.relativeName]) { extend(true, ebConfig, loader.config.modules[module.info.relativeName]); }
    });
  }

  function getCacheMemory(ctx, moduleName) {
    return loader.app.geto(CACHEMEMORY).geto(ctx.subdomain).geto(moduleName);
  }

};

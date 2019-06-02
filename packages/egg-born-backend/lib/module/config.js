const extend = require('extend2');

const CTXCONFIG = Symbol.for('Context#__config');

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
            let _configs;
            let useCache;
            if (context.cache && context.cache.mem) {
              _configs = context.cache.mem.get('instanceConfigs');
            }
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
      if (module.main.config) extend(true, ebConfig, module.main.config(loader.appInfo));

      // application config
      if (loader.config.modules && loader.config.modules[module.info.relativeName]) { extend(true, ebConfig, loader.config.modules[module.info.relativeName]); }
    });
  }

};

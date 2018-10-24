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
            if (!context[CTXCONFIG]) {
              const _config = loader.app.meta.configs[context.module.info.relativeName];
              _config.module = function(moduleName) {
                return loader.app.meta.configs[moduleName];
              };
              context[CTXCONFIG] = _config;
            }
            return context[CTXCONFIG];
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

const extend = require('extend2');

module.exports = function(loader, modules) {

  // all configs
  const ebConfigs = loader.app.meta.configs = {};

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
        context.config = ebConfigs[context.module.info.relativeName];
      }

      return context;
    };
  }

  function loadConfigs() {
    Object.keys(modules).forEach(key => {

      const module = modules[key];
      const ebConfig = ebConfigs[module.info.relativeName] = {};

      // module config
      if (module.main.config) extend(true, ebConfig, module.main.config(loader.appInfo));

      // application config
      if (loader.config.modules && loader.config.modules[module.info.relativeName]) { extend(true, ebConfig, loader.config.modules[module.info.relativeName]); }

    });
  }

};

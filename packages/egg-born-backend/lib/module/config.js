const extend = require('extend2');
const util = require('./util.js');

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
      const info = util.getModuleInfo(context);
      if (info) {
        context.config = ebConfigs[info.fullName];
      }

      return context;
    };
  }

  function loadConfigs() {
    Object.keys(modules).forEach(key => {

      const module = modules[key];
      const ebConfig = ebConfigs[module.info.fullName] = {};

      // module config
      if (module.main.config) extend(true, ebConfig, module.main.config(loader.appInfo));

      // application config
      if (loader.config.modules && loader.config.modules[module.info.relativeName]) { extend(true, ebConfig, loader.config.modules[module.info.relativeName]); }

    });
  }

};

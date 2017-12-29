const extend = require('extend2');

module.exports = function(loader, modules) {

  // all constants
  const ebConstants = loader.app.meta.constants = {};

  // load constants
  loadConstants();

  // patch service
  patchCreateContext();

  function patchCreateContext() {
    const createContext = loader.app.createContext;
    loader.app.createContext = (...args) => {
      const context = createContext.call(loader.app, ...args);

      // maybe /favicon.ico
      if (context.module) {
        // constant
        context.constant = ebConstants[context.module.info.relativeName];
      }

      return context;
    };

  }

  function loadConstants() {
    Object.keys(modules).forEach(key => {

      const module = modules[key];
      const ebConstant = ebConstants[module.info.relativeName] = {};

      // module constants
      if (module.main.constants) extend(true, ebConstant, module.main.constants);

    });
  }

};

const extend = require('extend2');
const util = require('./util.js');

module.exports = function(loader, modules) {

  // all constants
  const ebConstants = loader.app.constants = {};

  // load constants
  loadConstants();

  // patch service
  patchCreateContext();

  function patchCreateContext() {
    const createContext = loader.app.createContext;
    loader.app.createContext = (...args) => {
      const context = createContext.call(loader.app, ...args);

      // maybe /favicon.ico
      const info = util.getModuleInfo(context);
      if (info) {
        // constant
        context.constant = ebConstants[info.fullName];
      }

      return context;
    };

  }

  function loadConstants() {
    Object.keys(modules).forEach(key => {

      const module = modules[key];
      const ebConstant = ebConstants[module.info.fullName] = {};

      // module constants
      if (module.main.constants) extend(true, ebConstant, module.main.constants);

    });
  }

};

const extend = require('extend2');
const assetErrors = require('./asset/errors.js');
const errorClassFn = require('../base/error.js');
const util = require('./util.js');
const ERROR = Symbol('Context#__error');

module.exports = function(loader, modules) {

  // all errors
  const ebErrors = {};

  // load errors
  loadErrors();

  // patch service
  patchCreateContext();

  function patchCreateContext() {
    const createContext = loader.app.createContext;
    loader.app.createContext = (...args) => {
      const context = createContext.call(loader.app, ...args);

      // maybe /favicon.ico
      if (context.module) {

        // error
        context[ERROR] = new (errorClassFn(ebErrors))(context);

        // methods
        [ 'success', 'fail', 'throw', 'parseFail', 'parseSuccess', 'parseCode' ].forEach(key => {
          context[key] = function(...args) {
            return context[ERROR][key](context.module.info.relativeName, ...args);
          };
          context[key].module = function(module, ...args) {
            return context[ERROR][key](module, ...args);
          };
        });

        // createError
        context.createError = function(data) {
          return util.createError(data);
        };

      }

      return context;
    };

  }

  function loadErrors() {
    Object.keys(modules).forEach(key => {

      const module = modules[key];
      const ebError = ebErrors[module.info.relativeName] = {};

      // module errors
      if (module.main.errors) extend(true, ebError, module.main.errors);

      // asset errors
      extend(true, ebError, assetErrors);

    });
  }

};

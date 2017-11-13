const extend = require('extend2');
const util = require('./util.js');
const assetErrors = require('./asset/errors.js');

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
      const info = util.getModuleInfo(context);
      if (info) {
        // data,code/message,args
        context.success = function(data, code, ...args) {

          const body = this.parseSuccess(code, ...args);

          this.response.status = 200;
          this.response.type = 'application/json';
          this.response.body = { code: 0, message: body.message, data };
        };
        // code/message,args
        context.fail = function(code, ...args) {

          const body = this.parseFail(code, ...args);

          this.response.status = 200;
          this.response.type = 'application/json';
          this.response.body = body;
        };
        // code/message,args
        context.throw = function(code, ...args) {
          const body = this.parseFail(code, ...args);
          const err = new Error();
          err.code = body.code;
          err.message = body.message;
          if (body.code < 500) err.status = body.code;
          throw err;
        };
        // code/message,args
        context.parseFail = function(code, ...args) {
          if (typeof code === 'object') return code;
          return parseCode(this, info, 1, code, ...args);
        };
        // code/message,args
        context.parseSuccess = function(code, ...args) {
          return parseCode(this, info, 0, code, ...args);
        };

      }

      return context;
    };

    //
    function parseCode(context, mouduleInfo, codeDefault, code, ...args) {
      const ebError = ebErrors[mouduleInfo.fullName];
      let message = null;

      if (typeof code === 'string') {
        message = context.text(code, ...args);
        code = codeDefault;
      } else if (code) {
        message = context.text(ebError[code], ...args);
      }

      if (!message) {
        message = context.text(ebError[codeDefault]);
      }

      return { code, message };
    }
  }

  function loadErrors() {
    Object.keys(modules).forEach(key => {

      const module = modules[key];
      const ebError = ebErrors[module.info.fullName] = {};

      // module errors
      if (module.main.errors) extend(true, ebError, module.main.errors);

      // asset errors
      extend(true, ebError, assetErrors);

    });
  }

};

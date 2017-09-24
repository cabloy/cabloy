/*
* @Author: zhennann
* @Date:   2017-09-24 21:37:17
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-24 22:53:04
*/

/*
* @Author: zhennann
* @Date:   2017-09-21 11:38:06
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-21 11:40:46
*/

const extend = require('extend2');
const util = require('./util.js');

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
        // data,code,args
        context.success = function(data, code, ...args) {

          const body = parseCode(this, info, 0, code, ...args);

          this.response.status = 200;
          this.response.type = 'application/json';
          this.response.body = { code: 0, message: body.message, data };
        };
        // code,args
        context.fail = function(code, ...args) {

          const body = parseCode(this, info, 1, code, ...args);

          this.response.status = 200;
          this.response.type = 'application/json';
          this.response.body = body;
        };
      }

      return context;
    };

    function parseCode(context, mouduleInfo, codeDefault, code, ...args) {
      const ebError = ebErrors[mouduleInfo.fullName];
      let message = null;
      if (code) {
        message = context.text(ebError[code], ...args);
      }

      if (!message) {
        code = codeDefault;
        message = context.text(ebError[code]);
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

      // application error
      if (loader.config.errors) { extend(true, ebError, loader.config.errors); }

    });
  }

};

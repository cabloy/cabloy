/*
* @Author: zhennann
* @Date:   2017-09-21 11:38:06
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-21 11:40:46
*/

const extend = require('extend2');
const moduleUtil = require('./module-util.js');

module.exports = function(loader, modules) {

  // all configs
  const ebConfigs = {};

  // load configs
  loadConfigs();

  // patch service
  patchCreateContext();

  function patchCreateContext() {
    const createContext = loader.app.createContext;
    loader.app.createContext = (...args) => {
      const context = createContext.call(loader.app, ...args);

      // maybe /favicon.ico
      const info = moduleUtil.parseInfo(moduleUtil.parseName(context.request.url));
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
      if (loader.config.module && loader.config.module[module.info.relativeName]) { extend(true, ebConfig, loader.config.module[module.info.relativeName]); }

    });
  }

};

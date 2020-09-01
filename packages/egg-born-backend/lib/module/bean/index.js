const beanFn = require('./bean.js');

module.exports = function(loader) {

  // use modulesArray
  const ebModulesArray = loader.app.meta.modulesArray;

  // all
  loader.app.meta.aops = {};
  loader.app.meta.beans = {};
  loader.app.bean = beanFn(loader.app, null);

  // load beans
  loadBeans();

  // load aops
  loadAops();

  // patch context
  patchCreateContext();

  function patchCreateContext() {
    const createContext = loader.app.createContext;
    loader.app.createContext = (...args) => {
      const context = createContext.call(loader.app, ...args);

      // maybe /favicon.ico
      if (context.module) {
        // bean
        context.bean = beanFn(loader.app, context);
      }

      return context;
    };

  }

  function loadBeans() {
    for (const key in ebModulesArray) {
      const module = ebModulesArray[key];
      const beans = module.main.beans;
      if (!beans) continue;
      for (const beanName in beans) {
        loader.app.bean._register(module.info.relativeName, beanName, beans[beanName]);
      }
    }
  }

  function loadAops() {
    for (const key in ebModulesArray) {
      const module = ebModulesArray[key];
      const aops = module.main.aops;
      if (!aops) continue;
      for (const aopName in aops) {
        loader.app.bean._registerAop(module.info.relativeName, aopName, aops[aopName]);
      }
    }
  }

};

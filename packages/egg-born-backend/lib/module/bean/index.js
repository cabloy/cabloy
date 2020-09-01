const beanFn = require('./bean.js');

module.exports = function(loader) {

  // use modulesArray
  const ebModulesArray = loader.app.meta.modulesArray;

  // all constants
  loader.app.meta.beans = {};
  loader.app.bean = beanFn(loader.app, null);

  // load beans
  loadBeans();

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

};

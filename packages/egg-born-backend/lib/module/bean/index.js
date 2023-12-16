const beanContainerFn = require('./beanContainer.js');

function loadBeanContainer(loader) {
  loader.app.bean = beanContainerFn(loader.app, null);
}

function loadBeans(loader) {
  // use modulesArray
  const ebModulesArray = loader.app.meta.modulesArray;

  // all
  loader.app.meta.aops = {};
  loader.app.meta.beans = {};

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

      // not check context.module
      // bean
      context.bean = beanContainerFn(loader.app, context);

      return context;
    };
  }

  function loadBeans() {
    for (const key in ebModulesArray) {
      const module = ebModulesArray[key];
      const beans = module.main.beans;
      if (!beans) continue;
      for (const beanName in beans) {
        const moduleName = module.info.relativeName;
        const beanClass = beans[beanName];
        if (beanName.indexOf('atom.') === 0 && beanClass.mode === 'app') {
          throw new Error(`atom bean's mode must be ctx: ${moduleName}:${beanName}`);
        }
        loader.app.bean._register(moduleName, beanName, beanClass);
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
}

module.exports = {
  loadBeanContainer,
  loadBeans,
};

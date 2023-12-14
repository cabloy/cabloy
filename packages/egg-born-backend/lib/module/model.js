const ModelClass = require('../base/model.js');

module.exports = function (loader, modules) {
  // load models
  loadModels();

  // patch model
  patchCreateContext();

  function patchCreateContext() {
    const createContext = loader.app.createContext;
    loader.app.createContext = (...args) => {
      const context = createContext.call(loader.app, ...args);

      // maybe /favicon.ico
      if (context.module) {
        context.model = createModelContainer(context, context.module.info.relativeName);
      }

      return context;
    };
  }

  function createModelContainer(context, relativeName) {
    // base
    const modelContainer = new ModelClass({ table: null });
    // should set modelContainer.ctx;
    modelContainer.ctx = context;
    // remove app/config/service
    modelContainer.app = undefined;
    modelContainer.config = undefined;
    modelContainer.service = undefined;
    // module
    modelContainer.__ebCacheModule = new Map();
    modelContainer.module = function (moduleName) {
      let _modelContainer = modelContainer.__ebCacheModule.get(moduleName);
      if (!_modelContainer) {
        _modelContainer = createModelContainer(context, moduleName);
        modelContainer.__ebCacheModule.set(moduleName, _modelContainer);
      }
      return _modelContainer;
    };
    // proxy
    return new Proxy(modelContainer, {
      get(obj, prop) {
        // base
        if (obj[prop]) return obj[prop];
        const beanName = `model.${prop}`;
        // model
        return context.bean._getBean(relativeName, beanName);
      },
    });
  }

  function loadModels() {
    for (const key in modules) {
      const module = modules[key];
      const models = module.main.models;
      if (!models) continue;
      for (const modelName in models) {
        const beanName = `model.${modelName}`;
        const bean = {
          mode: 'app',
          bean: models[modelName],
        };
        loader.app.bean._register(module.info.relativeName, beanName, bean);
      }
    }
  }
};

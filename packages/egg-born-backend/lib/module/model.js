const ModelClass = require('../base/model.js');

module.exports = function(loader, modules) {

  // model classes
  const ebModelClasses = {};

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
    let modelContainer;
    const ebModelClass = ebModelClasses[relativeName];
    if (ebModelClass) {
      modelContainer = new (ModelClass(loader.app))(context, { table: null });
      modelContainer.__ebCache = new Map();
      Object.keys(ebModelClass).forEach(key => {
        defineProperty(modelContainer, context, key, ebModelClass[key]);
      });
      // other module's models
      modelContainer.__ebCacheModule = new Map();
      modelContainer.module = function(moduleName) {
        let _modelContainer = modelContainer.__ebCacheModule.get(moduleName);
        if (!_modelContainer) {
          _modelContainer = createModelContainer(context, moduleName);
          modelContainer.__ebCacheModule.set(moduleName, _modelContainer);
        }
        return _modelContainer;
      };
    }
    return modelContainer;
  }

  function defineProperty(modelContainer, context, key, value) {
    Object.defineProperty(modelContainer, key, {
      get() {
        let instance = modelContainer.__ebCache.get(key);
        if (!instance) {
          if (typeof value === 'function') {
            instance = new value(context);
          } else {
            instance = new (ModelClass(loader.app))(context, value);
          }
          modelContainer.__ebCache.set(key, instance);
        }
        return instance;
      },
    });
  }

  function loadModels() {
    Object.keys(modules).forEach(key => {

      const module = modules[key];
      const ebModelClass = ebModelClasses[module.info.relativeName] = {};

      // models
      const models = module.main.models;
      if (models) {
        for (const key in models) {
          const model = models[key];
          if (typeof model === 'function') {
            ebModelClass[key] = model(loader.app);
          } else {
            ebModelClass[key] = model;
          }
        }
      }
    });
  }

};

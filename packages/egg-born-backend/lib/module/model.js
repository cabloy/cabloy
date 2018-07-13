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
        const ebModelClass = ebModelClasses[context.module.info.relativeName];
        if (ebModelClass) {
          context.model = new (ModelClass(loader.app))(context, { table: null });
          context.model.__ebCache = new Map();
          Object.keys(ebModelClass).forEach(key => {
            defineProperty(context, key, ebModelClass[key]);
          });
        }
      }

      return context;
    };
  }

  function defineProperty(context, key, value) {
    Object.defineProperty(context.model, key, {
      get() {
        let instance = context.model.__ebCache.get(key);
        if (!instance) {
          if (typeof value === 'function') {
            instance = new value(context);
          } else {
            instance = new (ModelClass(loader.app))(context, value);
          }
          context.model.__ebCache.set(key, instance);
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

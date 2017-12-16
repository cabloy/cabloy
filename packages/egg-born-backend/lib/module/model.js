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
      const info = context.moduleInfo;
      if (info) {
        const ebModelClass = ebModelClasses[info.fullName];
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
          instance = new value(context);
          context.model.__ebCache.set(key, instance);
        }
        return instance;
      },
    });
  }

  function loadModels() {
    Object.keys(modules).forEach(key => {

      const module = modules[key];
      const ebModelClass = ebModelClasses[module.info.fullName] = {};

      // models
      const models = module.main.models;
      if (models) {
        for (const key in models) {
          ebModelClass[key] = models[key](loader.app);
        }
      }
    });
  }

};

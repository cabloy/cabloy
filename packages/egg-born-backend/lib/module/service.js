const is = require('is-type-of');

module.exports = function(loader, modules) {

  // service classes
  const ebServiceClasses = {};

  // load services
  loadServices();

  // patch service
  patchCreateContext();

  function patchCreateContext() {
    const createContext = loader.app.createContext;
    loader.app.createContext = (...args) => {
      const context = createContext.call(loader.app, ...args);

      // maybe /favicon.ico
      if (context.module) {
        const ebServiceClass = ebServiceClasses[context.module.info.relativeName];
        if (ebServiceClass) {
          context.service.__ebCache = new Map();
          Object.keys(ebServiceClass).forEach(key => {
            defineProperty(context, key, ebServiceClass[key]);
          });
        }
      }

      return context;
    };
  }

  function defineProperty(context, key, value) {
    Object.defineProperty(context.service, key, {
      get() {
        let instance = context.service.__ebCache.get(key);
        if (!instance) {
          instance = new value(context);
          context.service.__ebCache.set(key, instance);
        }
        return instance;
      },
    });
  }

  function loadServices() {
    Object.keys(modules).forEach(key => {

      const module = modules[key];
      const ebServiceClass = ebServiceClasses[module.info.relativeName] = {};

      // services
      const services = module.main.services;
      if (services) {
        for (const key in services) {
        // const item = loadService(module.info, key, services[key]);
        // ebServiceClass[key] = item.exports;
        // service only used in local controller
          ebServiceClass[key] = services[key](loader.app);
        }
      }
    });
  }

  // eslint-disable-next-line
  function loadService(info, key, service) {

    const item = parseService(info, key, service);

    const target = loader.app.serviceClasses;

    // item { properties: [ 'a', 'b', 'c'], exports }
    // => target.a.b.c = exports
    item.properties.reduce((target, property, index) => {
      let obj;
      const properties = item.properties.slice(0, index + 1).join('.');
      if (index === item.properties.length - 1) {
        if (property in target) {
          if (!loader.options.override) throw new Error(`can't overwrite property '${properties}' from ${target[property][loader.FileLoader.FULLPATH]} by ${item.pathName}`);
        }
        obj = item.exports;
        if (obj && !is.primitive(obj)) {
          obj[loader.FileLoader.FULLPATH] = item.pathName;
          obj[loader.FileLoader.EXPORTS] = true;
        }
      } else {
        obj = target[property] || {};
      }
      target[property] = obj;
      return obj;
    }, target);

    return item;
  }

  function parseService(info, key, service) {
    const properties = [ info.pid, info.name, key ];
    const pathName = [ 'service', ...properties ].join('.');
    const exports = service(loader.app);

    // set properties of class
    if (is.class(exports)) {
      exports.prototype.pathName = pathName;
    }

    return { pathName, properties, exports };
  }

};

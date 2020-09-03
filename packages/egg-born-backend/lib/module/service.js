const SERVICEPROXY = Symbol('CTX#__SERVICEPROXY');

module.exports = function(loader, modules) {

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
        Object.defineProperty(context, 'service', {
          get() {
            let service = context[SERVICEPROXY];
            if (!service) {
              service = context[SERVICEPROXY] = new Proxy({}, {
                get(obj, prop) {
                  const beanName = `service.${prop}`;
                  return context.bean._getBean(context.module.info.relativeName, beanName);
                },
              });
            }
            return service;
          },
        });
      }

      return context;
    };
  }

  function loadServices() {
    for (const key in modules) {
      const module = modules[key];
      const services = module.main.services;
      if (!services) continue;
      for (const serviceName in services) {
        const beanName = `service.${serviceName}`;
        const bean = {
          mode: 'app',
          bean: services[serviceName],
        };
        loader.app.bean._register(module.info.relativeName, beanName, bean);
      }
    }
  }

};

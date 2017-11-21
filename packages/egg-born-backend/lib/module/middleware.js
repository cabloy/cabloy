module.exports = function(loader, modules) {

  // all middlewares 
  const ebMiddlewares = {};

  // load middlewares
  loadMiddlewares();

  Object.keys(ebMiddlewares).forEach(key => {
    loader.app.middlewares[key] = ebMiddlewares[key].middleware;
  });

  function loadMiddlewares() {
    Object.keys(modules).forEach(key => {
      const module = modules[key];
      // module middlewares
      if (module.main.middlewares) {
        Object.keys(module.main.middlewares).forEach(middlewareKey => {
          const middleware = module.main.middlewares[middlewareKey];
          const middlewareConfig = loader.app.meta.configs[module.info.fullName].middlewares[middlewareKey];
          ebMiddlewares[middlewareKey] = {
            config: middlewareConfig,
            middleware: wrapMiddleware(middleware, middlewareConfig),
            key: middlewareKey,
          };
        });
      }
    });
  }

  function wrapMiddleware(middleware, middlewareConfig) {
    return function() {
      return middleware(middlewareConfig, loader.app);
    };
  }

};

const extend = require('extend2');
const pathMatching = require('egg-path-matching');

module.exports = function(loader, modules) {

  // all middlewares
  const ebMiddlewares = {};

  // load middlewares
  loadMiddlewares();

  Object.keys(ebMiddlewares).forEach(key => {
    loader.app.middlewares[key] = ebMiddlewares[key].middleware;
  });

  function loadMiddlewares() {
    const globals = [];

    // load
    Object.keys(modules).forEach(key => {
      const module = modules[key];
      // module middlewares
      if (module.main.middlewares) {
        Object.keys(module.main.middlewares).forEach(middlewareKey => {
          const middleware = module.main.middlewares[middlewareKey];
          const config = loader.app.meta.configs[module.info.fullName];
          const middlewareConfig = config.middlewares ? config.middlewares[middlewareKey] : null;
          const ops = extend(true, {}, middlewareConfig, loader.app.config.mws[middlewareKey]);
          ebMiddlewares[middlewareKey] = {
            config: ops,
            middleware: wrapMiddleware(middleware, ops),
            key: middlewareKey,
          };
          if (ops.global) globals.push(middlewareKey);
        });
      }
    });

    // global order
    const globalsClone = globals.slice(0);
    globalsClone.forEach(key => {
      const item = ebMiddlewares[key];
      let deps = item.config.dependencies || [];
      if (typeof deps === 'string') deps = deps.split(',');
      deps.forEach(dep => swap(globals, dep, key));
    });

    // global load
    globals.forEach(key => {
      const item = ebMiddlewares[key];
      let mw = item.middleware();
      mw._name = key;
      // middlewares support options.enable, options.ignore and options.match
      mw = wrapMiddleware2(mw, item.config);
      if (mw) {
        loader.app.use(mw);
      }
    });

  }

  function swap(arr, a, b) {
    const indexA = arr.indexOf(a);
    const indexB = arr.indexOf(b);
    if (indexA === -1 || indexB === -1 || indexA < indexB) return;
    arr.splice(indexB, 0, arr.splice(indexA, 1)[0]);
  }

  function wrapMiddleware(middleware, middlewareConfig) {
    return function() {
      return middleware(middlewareConfig, loader.app);
    };
  }

  function wrapMiddleware2(mw, options) {
  // support options.enable
    if (options.enable === false) return null;

    // support options.match and options.ignore
    if (!options.match && !options.ignore) return mw;
    const match = pathMatching(options);

    const fn = (ctx, next) => {
      if (!match(ctx)) return next();
      return mw(ctx, next);
    };
    fn._name = mw._name + 'middlewareWrapper';
    return fn;
  }

};

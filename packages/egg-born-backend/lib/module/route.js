const is = require('is-type-of');
const co = require('co');
const extend = require('extend2');
const pathMatching = require('egg-path-matching');
const loadMiddlewares = require('./middleware.js');
const MWSTATUS = Symbol('Context#__wmstatus');

module.exports = function(loader, modules) {

  // load middlewares
  const [ ebMiddlewares, ebMiddlewaresGlobal ] = loadMiddlewares(loader, modules);

  // load routes
  loadRoutes();

  // patch router
  patchRouter();

  function patchRouter() {
    if (!loader.app.router.unRegister) {
      loader.app.router.unRegister = function(name) {
        const index = this.stack.findIndex(layer => layer.name && layer.name === name);
        if (index > -1) this.stack.splice(index, 1);
      };
    }
  }

  function loadRoutes() {
    // load routes
    Object.keys(modules).forEach(key => {

      const module = modules[key];

      // routes and controllers
      const routes = module.main.routes;
      if (routes) {
        routes.forEach(route => {
        // args
          const args = [];
          // path
          args.push(`/api/${module.info.url}/${route.path}`);

          // middlewares: start
          const fnStart = (ctx, next) => {
            ctx[MWSTATUS] = {};
            return next();
          };
          fnStart._name = 'start';
          args.push(fnStart);

          // middlewares: globals
          ebMiddlewaresGlobal.forEach(key => {
            const item = ebMiddlewares[key];
            args.push(wrapMiddleware(item, route, loader));
          });

          // middlewares: route
          if (route.middlewares) {
            let middlewares = route.middlewares;
            if (is.string(middlewares)) middlewares = middlewares.split(',');
            middlewares.forEach(key => {
              if (is.string(key)) {
                const item = ebMiddlewares[key];
                if (item) {
                  args.push(wrapMiddleware(item, route, loader));
                } else {
                  args.push(wrapMiddlewareApp(key, route, loader));
                }
              } else {
                args.push(key);
              }
            });
          }

          // controller
          const Controller = route.controller(loader.app);

          // _route
          const _route = {
            pid: module.info.pid,
            module: module.info.name,
            controller: Controller.name.replace(/Controller$/g, ''),
            action: route.action || route.path.substr(route.path.lastIndexOf('/') + 1),
          };

          // middleware controller
          args.push(methodToMiddleware(Controller, _route));

          // load
          loader.app.router[route.method].apply(loader.app.router, args);
        });
      }

    });
  }

};

function wrapMiddlewareApp(key, route, loader) {
  const middleware = loader.app.middlewares[key];
  const optionsRoute = route.meta ? route.meta[key] : null;
  const options = optionsRoute ? extend(true, {}, loader.app.config.mws[key], optionsRoute) : loader.app.config.mws[key];
  const mw = middleware(options, loader.app);
  mw._name = key;
  return mw;
}

function wrapMiddleware(item, route, loader) {
  const optionsRoute = route.meta ? route.meta[item.key] : null;
  const options = optionsRoute ? extend(true, {}, item.options, optionsRoute) : item.options;
  const mw = item.middleware(options, loader.app);
  mw._name = item.key;
  return wrapMiddleware2(mw, options);
}

function wrapMiddleware2(mw, options) {
  const fn = (ctx, next) => {
    // enable match ignore dependencies
    if (options.enable === false || !middlewareMatch(ctx, options) || !middlewareDeps(ctx, options)) {
      ctx[MWSTATUS][mw._name] = false;
      return next();
    }
    // run
    return mw(ctx, next);
  };
  fn._name = mw._name + 'middlewareWrapper';
  return fn;
}

function middlewareMatch(ctx, options) {
  if (!options.match && !options.ignore) {
    return true;
  }
  const match = pathMatching(options);
  return match(ctx);
}

function middlewareDeps(ctx, options) {
  let deps = options.dependencies || [];
  if (typeof deps === 'string') deps = deps.split(',');
  return deps.every(key => ctx[MWSTATUS][key] !== false);
}

function methodToMiddleware(Controller, _route) {
  return function classControllerMiddleware(...args) {
    this.route = _route;
    const controller = new Controller(this);
    if (!this.app.config.controller || !this.app.config.controller.supportParams) {
      args = [ this ];
    }
    return callController(controller[_route.action], args, controller);
  };
}

async function callController(fn, args, ctx) {
  args = args || [];
  if (!is.function(fn)) return;
  if (is.generatorFunction(fn)) fn = co.wrap(fn);
  return ctx ? fn.call(ctx, ...args) : fn(...args);
}

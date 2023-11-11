const is = require('is-type-of');
const extend = require('@zhennann/extend');
const pathMatching = require('egg-path-matching');
const loadMiddlewares = require('./middleware.js');
const MWSTATUS = Symbol('Context#__wmstatus');

module.exports = function (loader, modules) {
  // load middlewares
  const [ebMiddlewaresNormal, ebMiddlewaresGlobal] = loadMiddlewares(loader, modules);

  // patch router
  patchRouter();

  // load routes
  loadRoutes();

  function patchRouter() {
    loader.app.meta.router = {
      register(info, route) {
        // args
        const args = [];
        // name
        if (route.name) args.push(route.name);
        // path
        args.push(
          typeof route.path === 'string' ? loader.app.meta.util.combineFetchPath(info, route.path) : route.path
        );

        // constroller
        let controllerBeanFullName;
        let _route;
        if (route.controller) {
          if (is.function(route.controller)) {
            throw new Error(`Controller should be bean: ${info.relativeName}.${route.controller(loader.app).name}`);
          }
          if (typeof route.controller === 'string') {
            controllerBeanFullName = `${info.relativeName}.controller.${route.controller}`;
          } else {
            controllerBeanFullName = `${route.controller.module || info.relativeName}.controller.${
              route.controller.name
            }`;
          }
          // _route
          _route = {
            pid: info.pid,
            module: info.name,
            controller: route.controller,
            action: route.action || route.path.substr(route.path.lastIndexOf('/') + 1),
          };
        }

        // middlewares: start
        const fnStart = async (ctx, next) => {
          // status
          ctx[MWSTATUS] = {};
          // route
          ctx.route = _route;
          // dynamic options
          ctx.meta.middlewares = {};
          // getMiddlewareOptions
          ctx.meta.getMiddlewareOptions = function (middlewareName) {
            const item = ebMiddlewaresNormal[middlewareName];
            // config options
            const config = ctx.config.module(item.module);
            const optionsConfig = config.middlewares ? config.middlewares[item.name] : null;
            // route options
            const optionsRoute = route.meta ? route.meta[item.name] : null;
            // dynamic options
            const optionsDynamic = ctx.meta.middlewares[item.name];
            // final options
            const options = extend(true, {}, optionsConfig, optionsRoute, optionsDynamic);
            // ok
            return options;
          };
          // next
          await next();
          // invoke callbackes: handle secondly
          await ctx.tailDone();
        };
        fnStart._name = 'start';
        args.push(fnStart);

        // middlewares: globals
        ebMiddlewaresGlobal.forEach(item => {
          args.push(wrapMiddleware(item));
        });

        // middlewares: tailDone
        const fnTailDone = async (ctx, next) => {
          // next
          await next();
          // invoke callbackes: handle firstly
          await ctx.tailDone();
        };
        fnStart._name = 'tailDone';
        args.push(fnTailDone);

        // middlewares: route
        if (route.middlewares) {
          let middlewares = route.middlewares;
          if (is.string(middlewares)) middlewares = middlewares.split(',');
          middlewares.forEach(key => {
            if (is.string(key)) {
              const item = ebMiddlewaresNormal[key];
              if (item) {
                args.push(wrapMiddleware(item));
              } else {
                args.push(wrapMiddlewareApp(key, route, loader));
              }
            } else {
              args.push(key);
            }
          });
        }

        // controller
        if (route.controller) {
          // middleware controller
          args.push(methodToMiddleware(controllerBeanFullName, _route));
        }

        // load
        loader.app.router[route.method].apply(loader.app.router, args);
      },
      unRegister(name) {
        const index = loader.app.router.stack.findIndex(layer => layer.name && layer.name === name);
        if (index > -1) loader.app.router.stack.splice(index, 1);
      },
      findByPath(moduleName, arg) {
        const path = loader.app.meta.util.combineFetchPath(moduleName, arg);
        return loader.app.router.stack.find(layer => layer.path === path);
      },
    };
  }

  function loadRoutes() {
    // load routes
    Object.keys(modules).forEach(key => {
      const module = modules[key];

      // routes and controllers
      const routes = module.main.routes;
      if (routes) {
        routes.forEach(route => {
          loader.app.meta.router.register(module.info, route);
        });
      }
    });
  }
};

function wrapMiddlewareApp(key, route, loader) {
  try {
    const middleware = loader.app.middlewares[key];
    const optionsRoute = route.meta ? route.meta[key] : null;
    const mw = middleware(optionsRoute, loader.app);
    mw._name = key;
    return mw;
  } catch (err) {
    console.log(`\nmiddleware error: ${key}\n`);
    throw err;
  }
}

function wrapMiddleware(item) {
  const fn = (ctx, next) => {
    // options
    const options = ctx.meta.getMiddlewareOptions(item.name);
    // enable match ignore dependencies
    if (options.enable === false || !middlewareMatch(ctx, options) || !middlewareDeps(ctx, options)) {
      ctx[MWSTATUS][item.name] = false;
      return next();
    }
    // bean
    const bean = item.bean;
    // execute
    const beanFullName = `${bean.module}.middleware.${bean.name}`;
    const beanInstance = ctx.bean._getBean(beanFullName);
    if (!beanInstance) {
      throw new Error(`middleware bean not found: ${beanFullName}`);
    }
    return beanInstance.execute(options, next);
  };
  fn._name = item.name;
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

function methodToMiddleware(controllerBeanFullName, _route) {
  return function classControllerMiddleware(...args) {
    const controller = this.bean._getBean(controllerBeanFullName);
    if (!controller) {
      throw new Error(`controller not found: ${controllerBeanFullName}`);
    }
    if (!controller[_route.action]) {
      throw new Error(`controller action not found: ${controllerBeanFullName}.${_route.action}`);
    }
    return controller[_route.action](...args);
  };
}

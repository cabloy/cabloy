const is = require('is-type-of');
const co = require('co');

module.exports = function(loader, modules) {

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

        // middlewares
        if (route.middlewares) {
          let middlewares = route.middlewares;
          if (is.string(middlewares)) middlewares = middlewares.split(',');
          middlewares.forEach(key => {
            if (is.promise(key)) args.push(key);
            else if (is.string(key)) args.push(loader.app.middlewares[key](loader.app.config.middlewares[key]));
          });
        }

        // action
        if (!route.action) route.action = route.path.substr(route.path.lastIndexOf('/') + 1);
        args.push(methodToMiddleware(route.controller(loader.app), route.action));

        // load
        loader.app[route.method].apply(loader.app, args);
      });
    }

  });

};

function methodToMiddleware(Controller, key) {
  return function classControllerMiddleware(...args) {
    const controller = new Controller(this);
    if (!this.app.config.controller || !this.app.config.controller.supportParams) {
      args = [ this ];
    }
    return callController(controller[key], args, controller);
  };
}

async function callController(fn, args, ctx) {
  args = args || [];
  if (!is.function(fn)) return;
  if (is.generatorFunction(fn)) fn = co.wrap(fn);
  return ctx ? fn.call(ctx, ...args) : fn(...args);
}

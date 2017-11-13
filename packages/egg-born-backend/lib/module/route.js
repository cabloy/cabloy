const is = require('is-type-of');

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
        // transaction
        if (route.transaction === true) {
          args.push(loader.app.middlewares.transaction());
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
  return function* classControllerMiddleware(...args) {
    const controller = new Controller(this);
    if (!this.app.config.controller || !this.app.config.controller.supportParams) {
      args = [ this ];
    }
    return yield callController(controller[key], controller, args);
  };
}

function* callController(func, ctx, args) {
  const r = func.call(ctx, ...args);
  if (is.generator(r) || is.promise(r)) {
    return yield r;
  }
  return r;
}

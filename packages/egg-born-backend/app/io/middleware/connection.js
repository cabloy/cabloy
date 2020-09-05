const compose = require('koa-compose');

module.exports = app => {

  function loadMiddlewares() {
    const _middlewares = [];

    // all middlewares
    const ebMiddlewaresAll = app.meta.middlewares;
    for (const item of ebMiddlewaresAll) {
      if (item.options.type !== 'socketio.connection') continue;
      _middlewares.push(wrapMiddleware(item));
    }
    return compose(_middlewares);
  }

  let _middlewares = null;

  return async (ctx, next) => {
    if (!_middlewares) {
      _middlewares = loadMiddlewares();
    }
    await _middlewares(ctx, next);
  };
};

function wrapMiddleware(item) {
  const fn = (ctx, next) => {
    // enable match ignore dependencies
    if (item.options.enable === false) {
      return next();
    }
    // run
    const bean = ctx.bean._getBean(item.module, `middleware.${item.name}`);
    return bean.execute(item.options, next);
  };
  fn._name = item.name;
  return fn;
}

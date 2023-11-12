const compose = require('koa-compose');

module.exports = app => {
  function loadMiddlewares() {
    const _middlewares = [];

    // all middlewares
    const ebMiddlewares = app.meta.middlewaresSocketIoConnection;
    for (const item of ebMiddlewares) {
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
    // bean
    const bean = item.bean;
    // execute
    const beanFullName = `${bean.module}.middleware.io.${bean.name}`;
    const beanInstance = ctx.bean._getBean(beanFullName);
    if (!beanInstance) {
      throw new Error(`socketio middleware bean not found: ${beanFullName}`);
    }
    return beanInstance.execute(item.options, next);
  };
  fn._name = item.name;
  return fn;
}

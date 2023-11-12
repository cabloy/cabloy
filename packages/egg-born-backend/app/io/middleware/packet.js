const compose = require('koa-compose');

module.exports = app => {
  function loadMiddlewares() {
    const _middlewares = [];

    // all middlewares
    const ebMiddlewares = app.meta.middlewaresSocketIoPacket;
    for (const item of ebMiddlewares) {
      _middlewares.push(wrapMiddleware(item));
    }
    return compose(_middlewares);
  }

  let _middlewares = null;

  return async (context, next) => {
    if (!_middlewares) {
      _middlewares = loadMiddlewares();
    }
    await _middlewares(context, next);
  };
};

function wrapMiddleware(item) {
  const fn = (context, next) => {
    // enable match ignore dependencies
    if (item.options.enable === false) {
      return next();
    }
    // run
    const beanFullName = `${item.bean.module}.middleware.io.${item.bean.name}`;
    const bean = context.ctx.bean._getBean(beanFullName);
    if (!bean) throw new Error(`socketio middleware not found: ${beanFullName}`);
    return bean.execute(item.options, context.packet, next);
  };
  fn._name = item.name;
  return fn;
}

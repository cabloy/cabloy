const compose = require('koa-compose');

module.exports = app => {

  function loadMiddlewares() {
    const _middlewares = [];
    app.meta.lookupMiddlewares(function({ options, middleware, key }) {
      if (options.type === 'socketio.packet') {
        const mw = middleware(options, app);
        mw._name = key;
        _middlewares.push(mw);
      }
    });
    return compose(_middlewares);
  }

  let _middlewares = null;
  console.log('------packet middleware init:');

  return async (ctx, next) => {
    if (!_middlewares) {
      _middlewares = loadMiddlewares();
    }
    await _middlewares(ctx, next);
  };
};

const compose = require('koa-compose');

module.exports = app => {

  function loadMiddlewares() {
    const connectionMiddlewares = [];
    app.meta.lookupMiddlewares(function({ options, middleware, key }) {
      if (options.type === 'socketio.connection') {
        const mw = middleware(options, app);
        mw._name = key;
        connectionMiddlewares.push(mw);
      }
    });
    return compose(connectionMiddlewares);
  }

  let connectionMiddlewares = null;

  return async (ctx, next) => {
    if (!connectionMiddlewares) {
      connectionMiddlewares = loadMiddlewares();
    }
    await connectionMiddlewares(ctx, next);
  };

};

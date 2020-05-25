const IOFn = require('./adapter/io.js');
module.exports = (options, app) => {
  return async (ctx, next) => {
    const io = new (IOFn(ctx))();
    // cache clientId/socketId for disconnect
    const clientId = io.clientId;
    const socketId = ctx.socket.id;
    await next();
    // execute when disconnect
    await io.unsubscribeWhenDisconnect({ clientId, socketId });
  };
};

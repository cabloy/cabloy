const IOFn = require('./adapter/io.js');
module.exports = (options, app) => {
  return async (ctx, next) => {
    const io = new (IOFn(ctx))();
    // cache userId/socketId for disconnect
    const user = ctx.session.passport.user.op;
    if (user.anonymous) return ctx.throw(403);
    const iid = user.iid;
    const socketId = ctx.socket.id;
    io._registerSocket(socketId, ctx.socket);

    if (app.meta.isTest || app.meta.isLocal) app.logger.info(`socket io connected: user:${user.id}, socket:${socketId}`);
    await next();
    if (app.meta.isTest || app.meta.isLocal) app.logger.info(`socket io disconnected: user:${user.id}, socket:${socketId}`);

    // execute when disconnect
    io._unRegisterSocket(socketId);
    await io.unsubscribeWhenDisconnect({ iid, user, socketId });
  };
};

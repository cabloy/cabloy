module.exports = ctx => {
  const app = ctx.app;
  class Middleware {
    async execute(options, next) {
      // cache userId/socketId for disconnect
      const user = ctx.state.user && ctx.state.user.op;
      if (!user || user.anonymous) return ctx.throw(403);
      const iid = user.iid;
      const socketId = ctx.socket.id;
      ctx.bean.io._registerSocket(socketId, ctx.socket);

      ctx.socket.conn.on('heartbeat', () => {
        console.log('----heartbeat:');
      });
      // next
      await this._next({ next, user, socketId });

      // execute when disconnect
      ctx.bean.io._unRegisterSocket(socketId);
      await ctx.bean.io.unsubscribeWhenDisconnect({ iid, user, socketId });
    }

    async _next({ next, user, socketId }) {
      if (app.meta.isTest || app.meta.isLocal) {
        app.logger.info(`socket io connected: user:${user.id}, socket:${socketId}`);
      }
      // next
      await next();
      if (app.meta.isTest || app.meta.isLocal) {
        app.logger.info(`socket io disconnected: user:${user.id}, socket:${socketId}`);
      }
    }
  }
  return Middleware;
};

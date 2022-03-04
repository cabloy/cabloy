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

      const onHeartBeat = this._onHeartBeat.bind(this);
      ctx.socket.conn.on('heartbeat', onHeartBeat);
      // next
      await this._next({ next, user, socketId });
      ctx.socket.conn.off('heartbeat', onHeartBeat);

      // execute when disconnect
      ctx.bean.io._unRegisterSocket(socketId);
      await ctx.bean.io.unsubscribeWhenDisconnect({ iid, user, socketId });
    }

    async _onHeartBeat() {
      const user = ctx.state.user;
      const online = await ctx.bean.userOnline.heartBeat({ user: user.agent || user.op });
      if (!online) {
        ctx.socket.close();
      }
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

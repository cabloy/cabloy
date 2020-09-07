const SOCKETSONLINE = Symbol.for('APP#__SOCKETSONLINE');
module.exports = ctx => {
  class Broadcast {

    async execute(context) {
      const data = context.data;
      if (ctx.app.meta.workerId === data.workerId) {
        const socketsOnline = ctx.app.geto(SOCKETSONLINE);
        const socket = socketsOnline[data.socketId];
        if (socket) {
          socket.emit('message', {
            path: data.path,
            message: data.message,
          });
        }
      }
    }

  }

  return Broadcast;
};
